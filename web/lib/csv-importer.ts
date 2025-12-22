import { createClient } from '@supabase/supabase-js';
import Papa from 'papaparse';
import { v5 as uuidv5 } from 'uuid'; 

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

            // Enrollment (Upsert kullanarak duplicate hatasını önle)
            await supabase
              .from('enrollments')
              .upsert(
                { course_id: courseId, student_id: student.id },
                { onConflict: 'course_id,student_id', ignoreDuplicates: true }
              );

            // Notlar
            const scoresToInsert = [];
            for (const col of assignmentCols) {
              let val = parseFloat(row[col]);
              if (isNaN(val)) val = 0; // "-" veya boşsa 0

              scoresToInsert.push({
                assignment_id: assignmentMap[col],
                student_id: student.id,
                value: val
              });
            }

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
