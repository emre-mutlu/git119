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
      // 1. DERS BİLGİSİ
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();
        
      if (courseError) throw new Error("Ders bulunamadı: " + courseError.message);
      setCourse(courseData);

      // 2. ÖDEVLER
      const { data: assignData, error: assignError } = await supabase
        .from('assignments')
        .select('*')
        .eq('course_id', id)
        .order('created_at');
        
      if (assignError) throw new Error("Ödevler yüklenemedi");
      const assignList = assignData || [];
      setAssignments(assignList);

      // 3. KAYITLAR (ENROLLMENTS)
      // '*' ile çekiyoruz ki feedback sütunu yoksa bile hata vermesin.
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

      // 4. ÖĞRENCİLER
      // ID listesini alıp öğrencileri çekiyoruz
      const studentIds = enrollmentData.map((e: any) => e.student_id);
      
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('*')
        .in('id', studentIds);

      if (studentsError) {
          console.error("Student Fetch Error:", studentsError);
      }

      // 5. NOTLAR
      const { data: scoresData } = await supabase
        .from('scores')
        .select('*')
        .in('student_id', studentIds)
        .in('assignment_id', assignList.map((a: any) => a.id));

      // 6. VERİ BİRLEŞTİRME (Mapping)
      const formattedStudents = enrollmentData.map((enrollment: any) => {
        const studentInfo = studentsData?.find((s: any) => s.id === enrollment.student_id);

        // Eğer öğrenci bilgisi bulunamazsa, ID'yi göstererek hata ayıklamayı kolaylaştır
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

      // Varsayılan Sıralama: Numara
      formattedStudents.sort((a: any, b: any) => a.student_no.localeCompare(b.student_no));
      setStudents(formattedStudents);

    } catch (err: any) {
      console.error("Genel Veri Hatası:", err);
      alert("Veri yüklenirken hata oluştu: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  // Not Değişikliği (Merkezi Yönetim)
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

  // Ağırlık Ayarlarını Kaydet
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
      
      // Tüm öğrencilerin notlarını yeni ağırlıklara göre yeniden hesapla
      setStudents(prev => prev.map(s => {
        const result = calculateStudentGrade(s.scores, updatedAssignments);
        return { ...s, average: result.total, letter_grade: result.letter };
      }));

      alert("Ağırlık ayarları başarıyla güncellendi.");
    } catch (err: any) {
      alert("Ayarlar kaydedilemedi: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFeedbackSave = async (feedback: string) => {
    if (!selectedStudentForFeedback) return;
    
    // Sakla (Eski veri - hata durumunda geri dönmek için)
    const oldFeedback = students.find(s => s.id === selectedStudentForFeedback.id)?.feedback;

    // Optimistic Update (Arayüzde anında göster)
    setStudents(prev => prev.map(s => 
        s.id === selectedStudentForFeedback.id ? { ...s, feedback } : s
    ));

    // Veritabanına kaydet
    const { error } = await supabase
        .from('enrollments')
        .update({ feedback })
        .eq('course_id', id)
        .eq('student_id', selectedStudentForFeedback.id);

    if (error) {
        console.error("Feedback Save Error:", error);
        alert("Not kaydedilemedi: " + error.message);
        // Hata durumunda geri al
        setStudents(prev => prev.map(s => 
            s.id === selectedStudentForFeedback.id ? { ...s, feedback: oldFeedback } : s
        ));
    }
  };

  // Kaydetme İşlemi
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
      
      setHasChanges(false);
      alert("Başarıyla kaydedildi.");
    } catch (err: any) {
      alert("Hata: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // --- CSV Export Function ---
  const handleExportCSV = () => {
    if (students.length === 0) return;

    // 1. CSV Başlıkları
    const headers = [
        "Öğrenci No",
        "Ad Soyad",
        "E-posta",
        ...assignments.map(a => `${a.name} (%${Math.round(a.weight * 100)})`),
        "Ortalama",
        "Harf Notu",
        "Hoca Notu"
    ];

    // 2. Veri Satırları
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

    // 3. Dosyayı Oluştur
    const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\n"); 
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    // 4. İndirmeyi Tetikle
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${course.code}_Notlar_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  // ---------------------------

  // --- SORTING LOGIC ---
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

    // Sayısal karşılaştırma (average)
    if (key === 'average') {
        valA = Number(valA);
        valB = Number(valB);
    } else {
        // String karşılaştırma (isim, no)
        valA = valA ? valA.toString().toLowerCase() : '';
        valB = valB ? valB.toString().toLowerCase() : '';
    }

    if (valA < valB) return direction === 'asc' ? -1 : 1;
    if (valA > valB) return direction === 'asc' ? 1 : -1;
    return 0;
  });
  // ---------------------

  if (loading) return <div className="p-20 text-center text-gray-500">Yükleniyor...</div>;
  if (!course) return <div className="p-20 text-center">Ders bulunamadı.</div>;

  return (
    <AdminGuard>
      <div className="min-h-screen bg-white dark:bg-gray-950 pt-20">
        {/* Üst Menü */}
        <nav className="border-b dark:border-gray-800 bg-gray-50 dark:bg-gray-900 px-8 py-5 flex justify-between items-center sticky top-20 z-10">
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
            <button 
              onClick={handleExportCSV}
              className="p-2.5 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl transition flex items-center justify-center"
              title="Excel/CSV Olarak İndir"
            >
              <Download size={20} />
            </button>

            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition"
              title="Ders Ayarları"
            >
              <Settings size={20} />
            </button>

            <button 
              onClick={() => setShowAnalysis(!showAnalysis)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-lg transition ${ 
                showAnalysis ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400' : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700'
              }`}
            >
              <LayoutDashboard size={16} />
              {showAnalysis ? 'Tabloya Dön' : 'Analiz'}
            </button>
            
            <button 
              onClick={saveChanges}
              disabled={!hasChanges || isSaving}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition ${ 
                !hasChanges ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <Save size={16} />
              {isSaving ? 'Kaydediliyor...' : hasChanges ? 'Kaydet' : 'Kaydedildi'}
            </button>
          </div>
        </nav>

        {/* Ana İçerik */}
        <main className="p-8">
          {showAnalysis && stats ? (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-200 pb-10">
              {/* 1. ÖZET KARTLARI */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-900 p-5 rounded-xl border dark:border-gray-800 shadow-sm">
                  <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Sınıf Ortalaması</p>
                  <p className="text-3xl font-black text-blue-600 dark:text-blue-400">{stats.avg}</p>
                </div>
                <div className="bg-white dark:bg-gray-900 p-5 rounded-xl border dark:border-gray-800 shadow-sm">
                  <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">En Yüksek / Düşük</p>
                  <p className="text-3xl font-black text-gray-900 dark:text-white">{stats.max} <span className="text-gray-300 text-xl font-normal">/</span> {stats.min}</p>
                </div>
                <div className="bg-white dark:bg-gray-900 p-5 rounded-xl border dark:border-gray-800 shadow-sm">
                  <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Öğrenci Sayısı</p>
                  <p className="text-3xl font-black text-gray-900 dark:text-white">{students.length}</p>
                </div>
                <div className="bg-white dark:bg-gray-900 p-5 rounded-xl border dark:border-gray-800 shadow-sm">
                  <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Başarı Oranı</p>
                  <p className="text-3xl font-black text-green-600 dark:text-green-400">
                    %{Math.round((students.filter(s => s.letter_grade !== 'FF').length / students.length) * 100)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 2. HARF NOTU DAĞILIMI */}
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border dark:border-gray-800 shadow-sm flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                    Harf Notu Dağılımı
                  </h3>
                  <div className="space-y-4 flex-1">
                    {['AA', 'BA', 'BB', 'CB', 'CC', 'DC', 'DD', 'FF'].map(letter => {
                      const count = stats.distribution[letter] || 0;
                      const percent = students.length > 0 ? (count / students.length) * 100 : 0;
                      
                      // Renk Belirleme (Gradient)
                      let barClass = 'from-gray-500 to-gray-400';
                      if (['AA', 'BA', 'BB'].includes(letter)) barClass = 'from-green-500 to-emerald-400';
                      else if (['CB', 'CC', 'DC'].includes(letter)) barClass = 'from-yellow-500 to-orange-400';
                      else if (['DD', 'FF'].includes(letter)) barClass = 'from-red-600 to-pink-600';

                      return (
                        <div key={letter} className="flex items-center gap-4 group">
                          <span className={`w-10 font-bold font-rokkitt text-xl ${letter === 'FF' ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'}`}>{letter}</span>
                          
                          <div className="flex-1 h-5 bg-gray-100 dark:bg-gray-800/50 rounded-full overflow-hidden shadow-[inset_0_1px_3px_rgba(0,0,0,0.2)] border border-gray-200 dark:border-gray-700/50 relative">
                            <div 
                              className={`h-full bg-gradient-to-r ${barClass} transition-all duration-1000 ease-out relative shadow-[0_0_10px_rgba(0,0,0,0.2)]`}
                              style={{ width: `${percent}%` }}
                            >
                                <div className="absolute inset-0 bg-white/10"></div>
                            </div>
                          </div>
                          
                          <div className="w-20 text-right flex flex-col items-end leading-none">
                            <span className="text-lg font-mono font-bold text-gray-900 dark:text-white">{count}</span>
                            <span className="text-xs font-bold text-gray-400 mt-0.5">%{Math.round(percent)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. ÖDEV PERFORMANSI */}
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border dark:border-gray-800 shadow-sm flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                    Ödev Bazlı Başarı
                  </h3>
                  <div className="space-y-6 flex-1 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                    {assignments.map(assign => {
                      // Bu ödevin ortalamasını hesapla
                      const scores = students.map(s => s.scores[assign.id] || 0);
                      const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
                      const percent = (avg / (assign.max_score || 100)) * 100;
                      
                      return (
                        <div key={assign.id} className="group">
                          <div className="flex justify-between items-end mb-2">
                            <span className="text-sm font-rokkitt font-bold text-gray-700 dark:text-gray-200 tracking-wide truncate max-w-[250px] group-hover:text-purple-400 transition-colors" title={assign.name}>{assign.name}</span>
                            <span className="text-base font-mono font-bold text-gray-900 dark:text-white">{avg.toFixed(1)}</span>
                          </div>
                          
                          {/* Modern Glass Bar Track */}
                          <div className="h-4 bg-gray-100 dark:bg-gray-800/50 rounded-full overflow-hidden shadow-[inset_0_1px_3px_rgba(0,0,0,0.2)] border border-gray-200 dark:border-gray-700/50 backdrop-blur-sm relative">
                             {/* Gradient Progress Bar with Glow */}
                             <div 
                              className="h-full bg-gradient-to-r from-purple-600 to-blue-500 relative transition-all duration-1000 ease-out flex items-center justify-end pr-1 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                              style={{ width: `${percent}%` }}
                            >
                              {/* Shimmer Effect */}
                              <div className="absolute inset-0 bg-white/20 animate-[pulse_2s_infinite]"></div>
                              {/* Inner White Line for 3D effect */}
                              <div className="absolute top-[1px] bottom-[1px] left-0 right-0 bg-gradient-to-b from-white/20 to-transparent rounded-full pointer-events-none"></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 4. RİSKLİ ÖĞRENCİLER */}
              <div className="bg-white dark:bg-gray-900 rounded-xl border dark:border-gray-800 shadow-sm overflow-hidden">
                 <div className="p-6 border-b dark:border-gray-800 bg-red-50/30 dark:bg-red-900/10">
                    <h3 className="text-xl font-bold text-red-700 dark:text-red-400 flex items-center gap-2">
                        <span className="w-1 h-6 bg-red-500 rounded-full"></span>
                        Risk Grubu (FF/DD veya &lt;50)
                    </h3>
                 </div>
                 <div className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-800 text-sm uppercase text-gray-500 font-bold">
                                <tr>
                                    <th className="p-4">Öğrenci</th>
                                    <th className="p-4 text-center">Ortalama</th>
                                    <th className="p-4 text-center">Harf</th>
                                    <th className="p-4 text-center">Eksik Ödev</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {students
                                    .filter(s => s.average < 50 || ['FF', 'DD'].includes(s.letter_grade))
                                    .sort((a, b) => a.average - b.average)
                                    .map(student => {
                                        // Eksik (0 olan) ödev sayısı
                                        const missingCount = assignments.filter(a => !student.scores[a.id] || student.scores[a.id] === 0).length;
                                        return (
                                            <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                <td className="p-4 text-base font-bold text-gray-900 dark:text-white">
                                                    {student.full_name} <span className="text-gray-500 dark:text-gray-400 font-medium ml-2 text-sm">({student.student_no})</span>
                                                </td>
                                                <td className="p-4 text-center text-lg font-black text-gray-900 dark:text-white">{student.average}</td>
                                                <td className="p-4 text-center">
                                                    <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm font-black">
                                                        {student.letter_grade}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-center text-gray-600 dark:text-gray-400 text-base">
                                                    {missingCount > 0 ? <span className="text-red-500 dark:text-red-400 font-black">{missingCount} Ödev Eksik</span> : "-"}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                {students.filter(s => s.average < 50 || ['FF', 'DD'].includes(s.letter_grade)).length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-gray-500">
                                            Harika! Risk grubunda öğrenci bulunmuyor.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                 </div>
              </div>
            </div>
          ) : (
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
          )}
        </main>

        <WeightSettingsModal 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
          assignments={assignments} 
          onSave={handleWeightSave} 
        />

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
