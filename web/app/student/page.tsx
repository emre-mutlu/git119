'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, GraduationCap, MessageSquare, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { calculateStudentGrade } from '@/lib/calculator';
import { sendOTPEmail } from '@/lib/otp-service';

export default function StudentPortal() {
  const router = useRouter();
  const [studentNo, setStudentNo] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState<any>(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentNo.trim()) return;

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('student_no', studentNo.trim())
        .single();

      if (studentError || !student) {
        throw new Error('Öğrenci bulunamadı. Numaranızı kontrol edin.');
      }

      if (!student.email) {
        throw new Error('Sistemde kayıtlı e-postanız bulunmuyor.');
      }

      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiry = new Date(Date.now() + 10 * 60 * 1000).toISOString();

      const { error: updateError } = await supabase
        .from('students')
        .update({ otp_code: generatedOtp, otp_expiry: expiry })
        .eq('id', student.id);

      if (updateError) throw new Error('Onay kodu oluşturulamadı.');

      const sent = await sendOTPEmail(student.email, student.full_name, generatedOtp);
      
      // Google Script no-cors modunda true döner, e-postanın ulaşıp ulaşmadığını 
      // Gmail Gönderilenler klasöründen kontrol edebilirsiniz.
      setStep('verify');
      setSuccessMsg(`Onay kodu e-posta adresinize gönderildi.`);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) return;

    setLoading(true);
    setError('');

    try {
      const { data: student } = await supabase
        .from('students')
        .select('*')
        .eq('student_no', studentNo.trim())
        .single();

      if (!student || student.otp_code !== otp.trim()) {
        throw new Error('Geçersiz onay kodu.');
      }

      if (new Date() > new Date(student.otp_expiry)) {
        throw new Error('Onay kodunun süresi dolmuş.');
      }

      const { data: enrollments } = await supabase
        .from('enrollments')
        .select(`*, courses (id, code, name, semester)`)
        .eq('student_id', student.id);

      if (!enrollments || enrollments.length === 0) {
        throw new Error('Kayıtlı olduğunuz bir ders bulunamadı.');
      }

      const reportCard = [];
      for (const enrollment of enrollments) {
        const course = enrollment.courses;
        // @ts-ignore
        if (!course) continue;

        const { data: assignments } = await supabase
          .from('assignments')
          // @ts-ignore
          .select('*').eq('course_id', course.id);

        const { data: scores } = await supabase
          .from('scores')
          .select('*').eq('student_id', student.id)
          // @ts-ignore
          .in('assignment_id', assignments.map((a: any) => a.id));

        const scoresMap: Record<string, number> = {};
        (scores || []).forEach((s: any) => {
          scoresMap[s.assignment_id] = s.value;
        });

        // @ts-ignore
        const result = calculateStudentGrade(scoresMap, assignments || []);

        reportCard.push({
          course, assignments, scores: scoresMap,
          average: result.total, letter: result.letter,
          feedback: enrollment.feedback
        });
      }

      await supabase.from('students').update({ otp_code: null }).eq('id', student.id);
      setStudentData({ student, reportCard });
      setStep('request');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4 pt-20">
      <button 
        onClick={() => router.push('/')}
        className="fixed top-24 left-4 md:left-8 p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition z-50 bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-full"
      >
        <ChevronLeft size={24} />
      </button>

      <div className="w-full max-w-md py-12">
        {!studentData ? (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-4 text-blue-600 dark:text-blue-400">
                <GraduationCap size={32} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Öğrenci Not Portalı</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                {step === 'request' ? 'Numaranızı girin' : 'E-postanıza gelen kodu girin'}
              </p>
            </div>

            {step === 'request' ? (
              <form onSubmit={handleRequestOTP}>
                <input
                  type="text"
                  placeholder="Öğrenci Numarası"
                  value={studentNo}
                  onChange={(e) => setStudentNo(e.target.value)}
                  className="w-full px-5 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm text-lg outline-none focus:ring-2 focus:ring-blue-500 transition dark:text-white text-center"
                  autoFocus
                />
                
                <button 
                  type="submit"
                  disabled={loading || !studentNo}
                  className="w-full mt-4 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition shadow-lg flex items-center justify-center gap-2"
                >
                  {loading ? '...' : <><Mail size={18} /> Kod Gönder</>}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP}>
                <input
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-5 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm text-center text-3xl font-mono font-bold tracking-[0.2em] outline-none focus:ring-2 focus:ring-blue-500 transition dark:text-white"
                  maxLength={6}
                  autoFocus
                />
                
                <button 
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className="w-full mt-4 py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 disabled:opacity-50 transition shadow-lg"
                >
                  {loading ? '...' : 'Notları Gör'}
                </button>

                <button 
                  type="button"
                  onClick={() => setStep('request')}
                  className="w-full mt-4 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-white transition"
                >
                  Numarayı Değiştir
                </button>
              </form>
            )}

            <div className="mt-6 min-h-[60px]">
                {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-center font-medium animate-in slide-in-from-top-2">{error}</div>}
                {successMsg && <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl text-center font-medium animate-in slide-in-from-top-2">{successMsg}</div>}
            </div>
          </div>
        ) : (
          <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 text-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{studentData.student.full_name}</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{studentData.student.student_no}</p>
              <button onClick={() => setStudentData(null)} className="mt-4 text-xs text-blue-600 font-bold hover:underline">Oturumu Kapat</button>
            </div>

            {studentData.reportCard.map((item: any) => (
              <div key={item.course.id} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-6 border-b dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{item.course.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.course.semester}</p>
                  </div>
                  <div className={`px-3 py-1.5 rounded-lg text-sm font-black ${item.letter === 'AA' ? 'bg-green-100 text-green-600' : item.letter === 'FF' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>{item.letter}</div>
                </div>
                
                <div className="p-4 space-y-4">
                  {item.feedback && (
                    <div className="p-4 bg-blue-50/80 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
                        <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400">
                            <MessageSquare size={16} className="fill-current opacity-50" />
                            <span className="text-xs font-bold uppercase tracking-widest">Hoca Notu</span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed">"{item.feedback}"</p>
                    </div>
                  )}
                  <div className="space-y-3">
                    {/* @ts-ignore */}
                    {item.assignments.map((assign: any) => (
                      <div key={assign.id} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 dark:text-gray-400">{assign.name} <span className="text-xs text-gray-300 ml-1">(%{Math.round(assign.weight * 100)})</span></span>
                        <span className="font-mono font-bold text-gray-900 dark:text-white">{item.scores[assign.id] !== undefined ? item.scores[assign.id] : '-'}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-3 border-t dark:border-gray-800 flex justify-between items-center mt-2">
                    <span className="font-bold text-gray-900 dark:text-white">Ortalama</span>
                    <span className="font-mono font-black text-lg text-blue-600 dark:text-blue-400">{item.average}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
