'use client';

import { X, Target, CheckCircle2 } from 'lucide-react';
import { StudentRow, Assignment } from '@/lib/types';
import { GRADE_SCALE, calculateRequiredScore } from '@/lib/calculator';

interface TargetScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentRow | null;
  assignments: Assignment[];
}

export default function TargetScoreModal({ isOpen, onClose, student, assignments }: TargetScoreModalProps) {
  if (!isOpen || !student) return null;

  // Final ödevini bul
  const finalAssignment = assignments.find(a => a.category === 'Final');
  
  // Mevcut vize/ödev toplamını hesapla (Final hariç)
  const currentWeightedTotal = assignments
    .filter(a => a.category !== 'Final')
    .reduce((sum, a) => sum + (student.scores[a.id] || 0) * a.weight, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg border dark:border-gray-800 overflow-hidden">
        <div className="px-6 py-4 border-b dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-2">
            <Target size={20} className="text-blue-600" />
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Hedef Not Hesaplayıcı</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">{student.full_name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {!finalAssignment ? (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium">
              Bu ders için henüz bir "Final" kategorisi tanımlanmamış.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase mb-1">Mevcut Durum</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Vize ve Ödevlerden gelen puan: <span className="font-mono font-bold text-gray-900 dark:text-white">{currentWeightedTotal.toFixed(2)}</span>
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {Object.entries(GRADE_SCALE)
                  .sort(([, a], [, b]) => b - a)
                  .map(([letter, limit]) => {
                    const required = calculateRequiredScore(limit, currentWeightedTotal, finalAssignment);
                    const isImpossible = required !== null && required > 100;
                    const isAlreadyDone = required !== null && required <= 0;

                    return (
                      <div key={letter} className="flex items-center justify-between p-3 rounded-xl border dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-black ${
                            letter === 'AA' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                          }`}>
                            {letter}
                          </span>
                          <span className="text-sm font-bold text-gray-500 dark:text-gray-400">%{limit} barajı için</span>
                        </div>

                        <div className="text-right">
                          {isAlreadyDone ? (
                            <div className="flex items-center gap-1 text-green-600 font-bold text-sm">
                              <CheckCircle2 size={16} />
                              Garantilendi
                            </div>
                          ) : isImpossible ? (
                            <span className="text-red-500 text-xs font-bold italic">Mümkün değil</span>
                          ) : (
                            <div className="flex flex-col items-end">
                              <span className="text-lg font-black text-gray-900 dark:text-white leading-none">
                                {required}
                              </span>
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Gereken Final</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t dark:border-gray-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl font-bold text-sm hover:opacity-90 transition active:scale-95"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
