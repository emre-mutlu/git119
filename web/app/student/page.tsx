'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Search, ChevronLeft, GraduationCap, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { calculateStudentGrade } from '@/lib/calculator';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function StudentPortal() {
  const router = useRouter();
  const [studentNo, setStudentNo] = useState('');
  const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentNo.trim()) return;

    setLoading(true);
    setError('');
    setStudentData(null);

    try {
      // 1. Öğrenciyi Bul
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('student_no', studentNo.trim())
        .single();

      if (studentError || !student) {
        throw new Error('Öğrenci bulunamadı. Numaranızı kontrol edin.');
      }

      // 2. Dersleri ve Notları Getir
      // Not: Supabase ilişkilerini kullanarak karmaşık bir sorgu yerine
      // adım adım gitmek MVP için daha güvenli ve kontrollü.
      
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select(`
          course_id,
          feedback,
          courses (id, code, name, semester)
        `)
        .eq('student_id', student.id);

      if (!enrollments || enrollments.length === 0) {
        throw new Error('Kayıtlı olduğunuz bir ders bulunamadı.');
      }

      const reportCard = [];

      for (const enrollment of enrollments) {
        const course = enrollment.courses;
        // @ts-ignore
        if (!course) continue;

        // Ödev Tanımlarını Çek
        // @ts-ignore
        const { data: assignments } = await supabase
          .from('assignments')
          // @ts-ignore
          .select('*')
          // @ts-ignore
          .eq('course_id', course.id);

        // Öğrencinin Notlarını Çek
        const { data: scores } = await supabase
          .from('scores')
          .select('*')
          .eq('student_id', student.id)
          // @ts-ignore
          .in('assignment_id', assignments.map((a: any) => a.id));

        // Hesaplama Yap
        const scoresMap: Record<string, number> = {};
        (scores || []).forEach((s: any) => {
          scoresMap[s.assignment_id] = s.value;
        });

        // @ts-ignore
        const result = calculateStudentGrade(scoresMap, assignments || []);

        reportCard.push({
          course,
          assignments,
          scores: scoresMap,
          average: result.total,
          letter: result.letter,
          feedback: enrollment.feedback // Hoca notu
        });
      }

      setStudentData({ student, reportCard });

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4">
      
      {/* Geri Dön Butonu */}
      <button 
        onClick={() => router.push('/')}
        className="absolute top-6 left-6 p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
      >
        <ChevronLeft size={24} />
      </button>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-4 text-blue-600 dark:text-blue-400">
            <GraduationCap size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Öğrenci Not Portalı</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Notlarını görüntülemek için okul numaranı gir.
          </p>
        </div>

        <form onSubmit={handleSearch} className="mb-8 relative">
          <input
            type="text"
            placeholder="Öğrenci Numaranız (Örn: 2024001)"
            value={studentNo}
            onChange={(e) => setStudentNo(e.target.value)}
            className="w-full px-5 py-4 pl-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition dark:text-white placeholder-gray-400"
            autoFocus
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          
          <button 
            type="submit"
            disabled={loading || !studentNo}
            className="absolute right-2 top-2 bottom-2 px-4 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? '...' : 'Sorgula'}
          </button>
        </form>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-center font-medium animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}

        {studentData && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 text-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{studentData.student.full_name}</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{studentData.student.student_no}</p>
            </div>

            {studentData.reportCard.map((item: any) => (
              <div key={item.course.id} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-6 border-b dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{item.course.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.course.semester}</p>
                  </div>
                  <div className={`px-3 py-1.5 rounded-lg text-sm font-black ${
                    item.letter === 'AA' ? 'bg-green-100 text-green-600' : 
                    item.letter === 'FF' ? 'bg-red-100 text-red-600' : 
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {item.letter}
                  </div>
                </div>
                
                <div className="p-4 space-y-3">
                  {/* @ts-ignore */}
                  {item.assignments.map((assign: any) => (
                    <div key={assign.id} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {assign.name} 
                        <span className="text-xs text-gray-300 ml-1">(%{Math.round(assign.weight * 100)})</span>
                      </span>
                      <span className="font-mono font-bold text-gray-900 dark:text-white">
                        {item.scores[assign.id] !== undefined ? item.scores[assign.id] : '-'}
                      </span>
                    </div>
                  ))}
                  
                  <div className="pt-3 border-t dark:border-gray-800 flex justify-between items-center mt-2">
                    <span className="font-bold text-gray-900 dark:text-white">Ortalama</span>
                    <span className="font-mono font-black text-lg text-blue-600 dark:text-blue-400">{item.average}</span>
                  </div>

                  {item.feedback && (
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
                        <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400">
                            <MessageSquare size={16} />
                            <span className="text-xs font-bold uppercase tracking-wide">Hoca Notu</span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                            "{item.feedback}"
                        </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
