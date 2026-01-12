'use client';

import { useEffect, useState, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, Save, LayoutDashboard, Settings, Download } from 'lucide-react';
import GradeTable from '@/components/grade-table';
import WeightSettingsModal from '@/components/weight-settings-modal';
import TargetScorePopover from '@/components/target-score-popover';
import FeedbackPopover from '@/components/feedback-popover';
import AdminGuard from '@/components/AdminGuard';
import { StudentRow, Assignment } from '@/lib/types';
import { calculateStudentGrade } from '@/lib/calculator';

function CourseDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedStudentForTarget, setSelectedStudentForTarget] = useState<StudentRow | null>(null);
  const [popoverPosition, setPopoverPosition] = useState<{ x: number; y: number } | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [lastEditedStudentId, setLastEditedStudentId] = useState<string | null>(null);
  
  // Feedback State
  const [selectedStudentForFeedback, setSelectedStudentForFeedback] = useState<StudentRow | null>(null);
  const [feedbackPosition, setFeedbackPosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  // Analiz Verilerini Hesapla (Anlık State'den)
  const stats = students.length > 0 ? {
    avg: (students.reduce((acc, s) => acc + s.average, 0) / students.length).toFixed(1),
    max: Math.max(...students.map(s => s.average)).toFixed(1),
    min: Math.min(...students.map(s => s.average)).toFixed(1),
    distribution: students.reduce((acc: any, s) => {
      acc[s.letter_grade] = (acc[s.letter_grade] || 0) + 1;
      return acc;
    }, {})
  } : null;

  async function fetchData() {
    setLoading(true);
    try {
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();
        
      if (courseError) throw new Error("Ders bulunamadı: " + courseError.message);
      setCourse(courseData);

      const { data: assignData, error: assignError } = await supabase
        .from('assignments')
        .select('*')
        .eq('course_id', id)
        .order('created_at');
        
      if (assignError) throw new Error("Ödevler yüklenemedi");
      const assignList = assignData || [];
      setAssignments(assignList);

      const { data: enrollmentData, error: enrollError } = await supabase
        .from('enrollments')
        .select('*') 
        .eq('course_id', id);

      if (enrollError) {
          console.error("Enroll Error:", enrollError);
          setStudents([]); 
          return;
      }
      
      if (!enrollmentData || enrollmentData.length === 0) {
          setStudents([]);
          return;
      }

      const studentIds = enrollmentData.map((e: any) => e.student_id);
      
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('*')
        .in('id', studentIds);

      if (studentsError) {
          console.error("Student Fetch Error:", studentsError);
      }

      const { data: scoresData } = await supabase
        .from('scores')
        .select('*')
        .in('student_id', studentIds)
        .in('assignment_id', assignList.map((a: any) => a.id));

      const formattedStudents = enrollmentData.map((enrollment: any) => {
        const studentInfo = studentsData?.find((s: any) => s.id === enrollment.student_id);

        if (!studentInfo) {
            return {
                id: enrollment.student_id,
                student_no: "???",
                full_name: "Silinmiş Öğrenci",
                email: "",
                scores: {},
                average: 0,
                letter_grade: "-",
                feedback: enrollment.feedback
            };
        }

        const scoresMap: Record<string, number> = {};
        (scoresData || []).filter((s: any) => s.student_id === studentInfo.id).forEach((s: any) => {
          scoresMap[s.assignment_id] = s.value;
        });

        const result = calculateStudentGrade(scoresMap, assignList);

        return {
          id: studentInfo.id,
          student_no: studentInfo.student_no,
          full_name: studentInfo.full_name,
          email: studentInfo.email,
          scores: scoresMap,
          average: result.total,
          letter_grade: result.letter,
          feedback: enrollment.feedback
        };
      });

      formattedStudents.sort((a: any, b: any) => a.student_no.localeCompare(b.student_no));
      setStudents(formattedStudents);

    } catch (err: any) {
      console.error("Genel Veri Hatası:", err);
      alert("Veri yüklenirken hata oluştu: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleScoreChange = (studentId: string, assignmentId: string, value: string) => {
    const numVal = parseFloat(value) || 0;
    setHasChanges(true);
    setLastEditedStudentId(studentId);

    setStudents(prev => prev.map(s => {
      if (studentId !== s.id) return s;
      const newScores = { ...s.scores, [assignmentId]: numVal };
      const result = calculateStudentGrade(newScores, assignments);
      return { ...s, scores: newScores, average: result.total, letter_grade: result.letter };
    }));
  };

  const handleWeightSave = async (updatedAssignments: Assignment[]) => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('assignments')
        .upsert(updatedAssignments.map(a => ({
          id: a.id,
          course_id: a.course_id,
          name: a.name,
          category: a.category,
          weight: a.weight
        })));

      if (error) throw error;
      
      setAssignments(updatedAssignments);
      
      const newStudents = students.map(s => {
        const result = calculateStudentGrade(s.scores, updatedAssignments);
        return { ...s, average: result.total, letter_grade: result.letter };
      });

      setStudents(newStudents);

      // Update enrollments with calculated averages
      const enrollmentUpdates = newStudents.map(s => ({
        course_id: id,
        student_id: s.id,
        average_score: s.average,
        letter_grade: s.letter_grade
      }));

      const { error: enrollError } = await supabase
        .from('enrollments')
        .upsert(enrollmentUpdates, { onConflict: 'course_id,student_id' });

      if (enrollError) throw enrollError;

      alert("Ağırlık ayarları başarıyla güncellendi.");
    } catch (err: any) {
      alert("Ayarlar kaydedilemedi: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFeedbackSave = async (feedback: string) => {
    if (!selectedStudentForFeedback) return;
    
    const oldFeedback = students.find(s => s.id === selectedStudentForFeedback.id)?.feedback;

    setStudents(prev => prev.map(s => 
        s.id === selectedStudentForFeedback.id ? { ...s, feedback } : s
    ));

    const { error } = await supabase
        .from('enrollments')
        .update({ feedback })
        .eq('course_id', id)
        .eq('student_id', selectedStudentForFeedback.id);

    if (error) {
        console.error("Feedback Save Error:", error);
        alert("Not kaydedilemedi: " + error.message);
        setStudents(prev => prev.map(s => 
            s.id === selectedStudentForFeedback.id ? { ...s, feedback: oldFeedback } : s
        ));
    }
  };

  const saveChanges = async () => {
    setIsSaving(true);
    try {
      const updates = [];
      for (const student of students) {
        for (const [assignId, val] of Object.entries(student.scores)) {
          updates.push({
            student_id: student.id,
            assignment_id: assignId,
            value: val
          });
        }
      }
      const { error } = await supabase.from('scores').upsert(updates, { onConflict: 'student_id,assignment_id' });
      if (error) throw error;

      // Update enrollments with calculated averages
      const enrollmentUpdates = students.map(s => ({
        course_id: id,
        student_id: s.id,
        average_score: s.average,
        letter_grade: s.letter_grade
      }));

      const { error: enrollError } = await supabase
        .from('enrollments')
        .upsert(enrollmentUpdates, { onConflict: 'course_id,student_id' });

      if (enrollError) throw enrollError;
      
      setHasChanges(false);
      alert("Başarıyla kaydedildi.");
    } catch (err: any) {
      alert("Hata: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportCSV = () => {
    if (students.length === 0) return;

    const headers = [
        "Öğrenci No",
        "Ad Soyad",
        "E-posta",
        ...assignments.map(a => `${a.name} (%${Math.round(a.weight * 100)})`),
        "Ortalama",
        "Harf Notu",
        "Hoca Notu"
    ];

    const rows = students.map(s => {
        const scores = assignments.map(a => s.scores[a.id] || 0);
        return [
            s.student_no,
            `"${s.full_name}"`, 
            s.email || "",
            ...scores,
            s.average,
            s.letter_grade,
            `"${s.feedback || ""}"`
        ].join(",");
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\n"); 
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${course.code}_Notlar_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedStudents = [...students].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const { key, direction } = sortConfig;
    let valA = (a as any)[key];
    let valB = (b as any)[key];

    if (key === 'average') {
        valA = Number(valA);
        valB = Number(valB);
    } else {
        valA = valA ? valA.toString().toLowerCase() : '';
        valB = valB ? valB.toString().toLowerCase() : '';
    }

    if (valA < valB) return direction === 'asc' ? -1 : 1;
    if (valA > valB) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  if (loading) return <div className="p-20 text-center text-gray-500">Yükleniyor...</div>;
  if (!course) return <div className="p-20 text-center">Ders bulunamadı.</div>;

  return (
    <AdminGuard>
      <div className="min-h-screen bg-white dark:bg-gray-950 pt-20">
        {/* Üst Menü */}
        <nav className="border-b dark:border-gray-800 bg-gray-50 dark:bg-gray-900 px-8 py-5 flex justify-between items-center sticky top-20 z-10 h-20">
          <div className="flex items-center gap-4 h-full">
            <button onClick={() => router.push('/portal')} className="p-2.5 hover:bg-gray-200 dark:hover:bg-gray-800 dark:text-gray-300 rounded-full transition flex items-center justify-center">
              <ChevronLeft size={22} />
            </button>
            <div className="flex flex-col justify-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{course.name}</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-bold tracking-wide mt-0.5">
                  {course.semester.replace('GUZ', 'GÜZ').replace('2025-GÜZ', '2025 GÜZ')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleExportCSV} className="p-2.5 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl transition flex items-center justify-center" title="Excel/CSV Olarak İndir">
              <Download size={20} />
            </button>
            <button onClick={() => setIsSettingsOpen(true)} className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition" title="Ders Ayarları">
              <Settings size={20} />
            </button>
            <button onClick={() => setShowAnalysis(!showAnalysis)} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-lg transition ${showAnalysis ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400' : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700'}`}>
              <LayoutDashboard size={16} />
              {showAnalysis ? 'Tabloya Dön' : 'Analiz'}
            </button>
            <button onClick={saveChanges} disabled={!hasChanges || isSaving} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition ${!hasChanges ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
              <Save size={16} />
              {isSaving ? 'Kaydediliyor...' : hasChanges ? 'Kaydet' : 'Kaydedildi'}
            </button>
          </div>
        </nav>

        {/* Ana İçerik */}
        <main className="px-6 h-[calc(100vh-160px)] overflow-hidden">
          {showAnalysis && stats ? (
            <div className="h-full flex flex-col gap-4 py-4 animate-in fade-in duration-200">
              {/* 1. ÖZET KARTLARI */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-shrink-0">
                <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border dark:border-gray-800 shadow-sm border-b-4 border-b-blue-500">
                  <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Sınıf Ortalaması</p>
                  <p className="text-3xl font-black text-blue-600 dark:text-blue-400">{stats.avg}</p>
                </div>
                <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border dark:border-gray-800 shadow-sm border-b-4 border-b-purple-500">
                  <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">En Yüksek / Düşük</p>
                  <p className="text-3xl font-black text-gray-900 dark:text-white">{stats.max} <span className="text-gray-300 text-xl font-normal">/</span> {stats.min}</p>
                </div>
                <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border dark:border-gray-800 shadow-sm border-b-4 border-b-emerald-500">
                  <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Öğrenci Sayısı</p>
                  <p className="text-3xl font-black text-gray-900 dark:text-white">{students.length}</p>
                </div>
                <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border dark:border-gray-800 shadow-sm border-b-4 border-b-orange-500">
                  <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Başarı Oranı</p>
                  <p className="text-3xl font-black text-green-600 dark:text-green-400">
                    %{Math.round((students.filter(s => s.letter_grade !== 'FF').length / students.length) * 100)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0 flex-1">
                {/* 2. HARF NOTU DAĞILIMI */}
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border dark:border-gray-800 shadow-sm flex flex-col min-h-0 overflow-hidden">
                  <div className="flex items-center gap-3 mb-6 flex-shrink-0">
                    <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Harf Notu Dağılımı</h3>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between overflow-hidden mb-4 pl-[1.125rem]">
                    {['AA', 'BA', 'BB', 'CB', 'CC', 'DC', 'DD', 'FF'].map(letter => {
                      const count = stats.distribution[letter] || 0;
                      const percent = students.length > 0 ? (count / students.length) * 100 : 0;
                      let barClass = 'from-gray-500 to-gray-400';
                      if (['AA', 'BA', 'BB'].includes(letter)) barClass = 'from-green-500 to-emerald-400';
                      else if (['CB', 'CC', 'DC'].includes(letter)) barClass = 'from-yellow-500 to-orange-400';
                      else if (['DD', 'FF'].includes(letter)) barClass = 'from-red-600 to-pink-600';

                      return (
                        <div key={letter} className="flex flex-col gap-0.5 group">
                          <div className="flex items-center gap-4 w-full">
                            <span className={`w-8 font-bold text-base ${letter === 'FF' ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'}`}>{letter}</span>
                            <div className="flex-1 h-3 bg-gray-50 dark:bg-gray-800/30 rounded-full overflow-hidden border border-gray-100 dark:border-gray-800/50 relative">
                                <div className={`h-full bg-gradient-to-r ${barClass} relative shadow-[0_0_10px_rgba(0,0,0,0.1)]`} style={{ width: `${percent}%` }}>
                                    <div className="absolute inset-0 bg-white/10"></div>
                                </div>
                            </div>
                            <span className="w-6 text-base font-bold text-gray-900 dark:text-white text-right">{count}</span>
                          </div>
                          <div className="pl-12">
                             <span className="text-[10px] font-bold text-gray-400 block text-left leading-none">
                                {Math.round(percent) > 0 ? `%${Math.round(percent)}` : ''}
                             </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-auto pt-4 border-t dark:border-gray-800 grid grid-cols-3 gap-4 flex-shrink-0 pl-[1.125rem]">
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Standart Sapma</p>
                        <p className="text-lg font-black text-gray-700 dark:text-gray-200">
                            {(() => {
                                const avg = parseFloat(stats.avg);
                                const squareDiffs = students.map(s => Math.pow(s.average - avg, 2));
                                const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / students.length;
                                return Math.sqrt(avgSquareDiff).toFixed(1);
                            })()}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">En Sık Not</p>
                        <p className="text-lg font-black text-blue-500">
                            {Object.entries(stats.distribution).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || "-"}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Geçme/Kalma</p>
                        <p className="text-lg font-black text-gray-700 dark:text-gray-200">
                            {students.filter(s => s.letter_grade !== 'FF').length} <span className="text-gray-400 font-normal">/</span> {students.filter(s => s.letter_grade === 'FF').length}
                        </p>
                    </div>
                  </div>
                </div>

                {/* 3. ÖDEV PERFORMANSI */}
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border dark:border-gray-800 shadow-sm flex flex-col min-h-0 overflow-hidden">
                  <div className="flex items-center gap-3 mb-6 flex-shrink-0">
                    <span className="w-1.5 h-6 bg-purple-500 rounded-full"></span>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Ödev Bazlı Başarı</h3>
                  </div>
                  <div className="flex-1 flex flex-col justify-between pl-[1.125rem] overflow-hidden">
                    {assignments.slice(0, 8).map((assign, idx) => {
                      const scores = students.map(s => s.scores[assign.id] || 0);
                      const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
                      const percent = (avg / (assign.max_score || 100)) * 100;
                      const gradients = ['from-purple-600 to-blue-500', 'from-blue-600 to-cyan-500', 'from-indigo-600 to-purple-500', 'from-violet-600 to-fuchsia-500', 'from-emerald-600 to-teal-500'];
                      const barGradient = gradients[idx % gradients.length];
                      
                      return (
                        <div key={assign.id} className="group flex flex-col gap-1">
                          <div className="flex justify-between items-end">
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-200 tracking-tight truncate max-w-[250px] group-hover:text-purple-400 transition-colors" title={assign.name}>{assign.name}</span>
                            <span className="text-sm font-black text-gray-900 dark:text-white">{avg.toFixed(1)}</span>
                          </div>
                          <div className="h-3 bg-gray-50 dark:bg-gray-800/30 rounded-full overflow-hidden border border-gray-100 dark:border-gray-800/50 backdrop-blur-sm relative">
                             <div className={`h-full bg-gradient-to-r ${barGradient} relative shadow-[0_0_10px_rgba(0,0,0,0.1)]`} style={{ width: `${percent}%` }}>
                              <div className="absolute inset-0 bg-white/10"></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {assignments.length > 8 && (
                        <div className="text-center pt-1">
                            <span className="text-[10px] text-gray-400 italic">...ve {assignments.length - 8} ödev daha</span>
                        </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 4. RİSKLİ ÖĞRENCİLER */}
              <div className="bg-white dark:bg-gray-900 rounded-xl border dark:border-gray-800 shadow-sm flex flex-col min-h-0 max-h-[32%] flex-shrink-0 mb-2 overflow-hidden">
                 <div className="p-4 border-b dark:border-gray-800 bg-red-50/30 dark:bg-red-900/10 flex-shrink-0 flex items-center gap-3">
                    <span className="w-1.5 h-6 bg-red-500 rounded-full"></span>
                    <h3 className="text-lg font-bold text-red-700 dark:text-red-400">Risk Grubu (FF/DD veya &lt;50)</h3>
                 </div>
                 <div className="overflow-y-auto custom-scrollbar flex-1">
                    <table className="w-full text-left border-separate border-spacing-0">
                        <thead className="bg-gray-50 dark:bg-gray-800 text-sm uppercase text-gray-500 font-bold sticky top-0 z-10">
                            <tr>
                                <th className="p-3 pl-8 border-b dark:border-gray-700">Öğrenci</th>
                                <th className="p-3 text-center border-b dark:border-gray-700">Ortalama</th>
                                <th className="p-3 text-center border-b dark:border-gray-700">Harf</th>
                                <th className="p-3 text-center border-b dark:border-gray-700">Eksik Ödev</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {students
                                .filter(s => s.average < 50 || ['FF', 'DD'].includes(s.letter_grade))
                                .sort((a, b) => a.average - b.average)
                                .map(student => {
                                    const missingCount = assignments.filter(a => !student.scores[a.id] || student.scores[a.id] === 0).length;
                                    return (
                                        <tr key={student.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors odd:bg-white dark:odd:bg-gray-900 even:bg-gray-50/50 dark:even:bg-gray-800/30">
                                            <td className="p-3 pl-8 text-base font-bold text-gray-900 dark:text-white">
                                                {student.full_name} <span className="text-gray-500 dark:text-gray-400 font-medium ml-2 text-sm">({student.student_no})</span>
                                            </td>
                                            <td className="p-3 text-center text-lg font-black text-gray-900 dark:text-white">{student.average}</td>
                                            <td className="p-3 text-center">
                                                <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm font-black">
                                                    {student.letter_grade}
                                                </span>
                                            </td>
                                            <td className="p-3 text-center text-gray-600 dark:text-gray-400 text-base">
                                                {missingCount > 0 ? <span className="text-red-500 dark:text-red-400 font-black">{missingCount} Ödev Eksik</span> : "-"}
                                            </td>
                                        </tr>
                                    );
                                })}
                            {students.filter(s => s.average < 50 || ['FF', 'DD'].includes(s.letter_grade)).length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-500 font-bold">
                                        Harika! Risk grubunda öğrenci bulunmuyor.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                 </div>
              </div>
            </div>
          ) : (
            <div className="h-full">
              <GradeTable 
                students={sortedStudents} 
                assignments={assignments} 
                onScoreChange={handleScoreChange} 
                onCalculateTarget={(s, pos) => {
                  setSelectedStudentForTarget(s);
                  setPopoverPosition(pos);
                }}
                onSort={handleSort}
                sortConfig={sortConfig}
                onFeedbackClick={(s, pos) => {
                    setSelectedStudentForFeedback(s);
                    setFeedbackPosition(pos);
                }}
                lastEditedStudentId={lastEditedStudentId}
              />
            </div>
          )}
        </main>

        <WeightSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} assignments={assignments} onSave={handleWeightSave} />

        <TargetScorePopover
          isOpen={!!selectedStudentForTarget}
          onClose={() => {
              setSelectedStudentForTarget(null);
              setPopoverPosition(null);
          }}
          student={selectedStudentForTarget}
          assignments={assignments}
          position={popoverPosition}
          onSelectScore={(assignId, val) => {
              if (selectedStudentForTarget) {
                  handleScoreChange(selectedStudentForTarget.id, assignId, val.toString());
              }
              setSelectedStudentForTarget(null);
              setPopoverPosition(null);
          }}
        />

        <FeedbackPopover
          isOpen={!!selectedStudentForFeedback}
          onClose={() => setSelectedStudentForFeedback(null)}
          studentName={selectedStudentForFeedback?.full_name || ''}
          initialFeedback={selectedStudentForFeedback?.feedback || ''}
          onSave={handleFeedbackSave}
          position={feedbackPosition}
        />
      </div>
    </AdminGuard>
  );
}

export default function CourseDetail() {
  return (
    <Suspense fallback={<div className="p-20 text-center">Yükleniyor...</div>}>
      <CourseDetailContent />
    </Suspense>
  );
}