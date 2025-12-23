'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { BookOpen, Upload, ChevronRight, Trash2, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { importGraderCSV } from '@/lib/csv-importer';
import CreateCourseModal from '@/components/create-course-modal';
import AdminGuard from '@/components/AdminGuard';
import { Course } from '@/lib/types';

// Extend Course type for local usage with student count
interface CourseWithCount extends Course {
  studentCount: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [courses, setCourses] = useState<CourseWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    const { data, error } = await supabase
      .from('courses')
      .select('*, enrollments(count)')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      const formatted: CourseWithCount[] = data.map((c: any) => ({
        id: c.id,
        code: c.code,
        name: c.name,
        semester: c.semester,
        studentCount: c.enrollments?.[0]?.count || 0
      }));
      setCourses(formatted);
    }
    setLoading(false);
  }

  async function handleCreateCourse(courseData: { code: string; name: string; semester: string }) {
    const { data, error } = await supabase
        .from('courses')
        .insert(courseData)
        .select()
        .single();
    
    if (error) {
        alert("Ders oluşturulamadı: " + error.message);
    } else {
        // Yeni dersi listeye ekle ve oraya git
        setCourses([ { ...data, studentCount: 0 }, ...courses ]);
        router.push(`/course?id=${data.id}`);
    }
  }

  async function deleteCourse(e: React.MouseEvent, courseId: string) {
    e.stopPropagation();
    if (!confirm("Bu dersi ve tüm notlarını silmek istediğinize emin misiniz?")) return;

    const { error } = await supabase.from('courses').delete().eq('id', courseId);
    if (!error) {
      setCourses(courses.filter(c => c.id !== courseId));
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      let code = "GİT 119";
      let name = "Dijital Tasarıma Giriş ve Yapay Zeka"; 
      let semester = "2025-GUZ";

      const nameParts = file.name.split('-');
      if (nameParts.length > 0) {
        const rawCode = nameParts[0].trim();
        if (rawCode.includes('.')) {
          const [baseCode, section] = rawCode.split('.');
          code = baseCode.toUpperCase();
          name = `${name} - Şube ${section}`;
        }
      }

      const courseInfo = { code, name, semester };
      await importGraderCSV(file, supabase, courseInfo);
      fetchCourses();
    } catch (err: any) {
      alert("Hata: " + err.message);
    } finally {
      e.target.value = '';
      setUploading(false);
    }
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-8 pb-8 pt-24">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Academia<span className="text-blue-600">OS</span></h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">Akademik Not Yönetim Sistemi</p>
          </div>
          
          <div className="relative flex items-center gap-4">
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all font-bold flex items-center gap-2"
            >
              <Plus size={20} />
              Ders Oluştur
            </button>

            <button 
              onClick={() => router.push('/student')}
              className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm transition-all font-bold"
            >
              Öğrenci Girişi
            </button>

            <div className="relative">
              <input 
                type="file" 
                accept=".csv" 
                onChange={handleFileUpload} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={uploading}
              />
              <button className={`flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all ${uploading ? 'opacity-50' : ''}`}>
                {uploading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div> : <Upload size={20} />}
                <span className="font-bold">{uploading ? 'Yükleniyor...' : 'CSV Yükle'}</span>
              </button>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p>Dersler hazırlanıyor...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-gray-900 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
            <BookOpen className="mx-auto h-16 w-16 text-gray-200 dark:text-gray-700 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Henüz bir ders eklemediniz</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-xs mx-auto">Başlamak için sağ üstteki butonu kullanarak bir CSV dosyası yükleyin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div 
                key={course.id} 
                onClick={() => router.push(`/course?id=${course.id}`)}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:border-blue-500/30 transition-all cursor-pointer group relative overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-black rounded-lg tracking-wider">
                      {course.semester}
                    </div>
                    <button 
                      onClick={(e) => deleteCourse(e, course.id)}
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 leading-tight">
                    {course.code} {course.name.includes("Şube") ? `(Şube ${course.name.split('Şube')[1].trim()})` : "(Şube 1)"}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-6">
                    Dijital Tasarıma Giriş ve Yapay Zeka
                  </p>

                  <div className="flex items-center gap-4 text-sm font-bold text-gray-400 dark:text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      {course.studentCount} Öğrenci
                    </div>
                  </div>
                </div>
                
                <div className="px-8 py-4 bg-gray-50 dark:bg-gray-800/30 border-t border-gray-50 dark:border-gray-800 flex justify-between items-center group-hover:bg-blue-600 transition-all">
                  <span className="text-sm font-bold text-gray-500 dark:text-gray-400 group-hover:text-white transition-colors">Notları Yönet</span>
                  <ChevronRight size={18} className="text-gray-300 group-hover:text-white transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}

        <CreateCourseModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)} 
          onCreate={handleCreateCourse} 
        />
      </div>
    </AdminGuard>
  );
}