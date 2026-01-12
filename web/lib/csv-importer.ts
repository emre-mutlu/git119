import { createClient } from '@supabase/supabase-js';
import Papa from 'papaparse';
import { v5 as uuidv5 } from 'uuid'; 
import { calculateStudentGrade } from './calculator';

// Not: UUID kütüphanesi ve Supabase client'ı projede kurulu olmalıdır.
// npm install papaparse uuid

const NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8'; // Standart DNS Namespace

export async function importGraderCSV(
  file: File, 
  supabase: any, // Supabase Client
  courseDetails: { code: string; name: string; semester: string }
) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const data = results.data as any[];
          if (data.length === 0) throw new Error("CSV dosyası boş.");

          // 1. Dersi Oluştur
          const { data: course, error: courseError } = await supabase
            .from('courses')
            .insert({
              code: courseDetails.code,
              name: courseDetails.name,
              semester: courseDetails.semester
            })
            .select()
            .single();
          
          if (courseError) throw courseError;
          const courseId = course.id;

          // 2. Ödev Sütunlarını Bul ve Oluştur
          const headers = results.meta.fields || [];
          const assignmentCols = headers.filter(h => h.startsWith("Ödev:"));
          const assignmentMap: Record<string, string> = {}; // "Ödev:1" -> "uuid"

          for (const col of assignmentCols) {
            const cleanName = col.replace("Ödev:", "").replace("(Gerçek)", "").trim();
            const category = cleanName.toLowerCase().includes("final") ? "Final" : "Homework";
            
            const { data: assign } = await supabase
              .from('assignments')
              .insert({
                course_id: courseId,
                name: cleanName,
                category: category
              })
              .select()
              .single();
            
            if (assign) assignmentMap[col] = assign.id;
          }

          // 3. Öğrencileri ve Notları Yükle
          for (const row of data) {
            const studentNo = row['ID numarası'];
            if (!studentNo) continue;

            const fullName = `${row['Adı']} ${row['Soyadı']}`;
            const email = row['E-posta adresi'];
            
            // Öğrenci ID (Deterministik UUID - Aynı no hep aynı ID olur)
            // Not: Web tarafında uuidv5 kullanımı için 'uuid' paketine ihtiyaç vardır.
            // Alternatif olarak Supabase'in random ID'si de kullanılabilir ama 
            // mükerrer kayıtları engellemek için student_no ile upsert yapmak daha iyidir.
            
            // Upsert Student
            const { data: student, error: studentError } = await supabase
              .from('students')
              .upsert({ 
                student_no: studentNo, 
                full_name: fullName, 
                email: email 
              }, { onConflict: 'student_no' })
              .select()
              .single();

            if (studentError) {
                console.error("Öğrenci hatası:", studentError);
                continue;
            }

            // Notlar
            const scoresToInsert = [];
            const scoresMap: Record<string, number> = {};

            for (const col of assignmentCols) {
              let val = parseFloat(row[col]);
              if (isNaN(val)) val = 0; // "-" veya boşsa 0

              const assignmentId = assignmentMap[col];
              scoresToInsert.push({
                assignment_id: assignmentId,
                student_id: student.id,
                value: val
              });
              scoresMap[assignmentId] = val;
            }

            // Calculate Grade
            // Dummy assignments array with weight 0 as they are just created with default 0 weight
            const dummyAssignments = Object.values(assignmentMap).map(id => ({
                id,
                course_id: courseId,
                name: '', // Not needed for calc
                category: 'Homework' as const,
                weight: 0,
                max_score: 100,
                created_at: ''
            }));

            const gradeResult = calculateStudentGrade(scoresMap, dummyAssignments);

            // Enrollment (Upsert with calculated grades)
            await supabase
              .from('enrollments')
              .upsert(
                {
                    course_id: courseId,
                    student_id: student.id,
                    average_score: gradeResult.total,
                    letter_grade: gradeResult.letter
                },
                { onConflict: 'course_id,student_id' }
              );

            if (scoresToInsert.length > 0) {
              await supabase.from('scores').insert(scoresToInsert);
            }
          }

          resolve({ success: true, courseId });

        } catch (e) {
          reject(e);
        }
      },
      error: (err) => reject(err)
    });
  });
}
