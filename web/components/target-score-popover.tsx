'use client';

import { useEffect, useRef } from 'react';
import { StudentRow, Assignment } from '@/lib/types';
import { GRADE_SCALE, calculateRequiredScore } from '@/lib/calculator';

interface TargetScorePopoverProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentRow | null;
  assignments: Assignment[];
  onSelectScore: (assignmentId: string, score: number) => void;
  position: { x: number; y: number } | null;
}

export default function TargetScorePopover({ 
  isOpen, 
  onClose, 
  student, 
  assignments, 
  onSelectScore, 
  position 
}: TargetScorePopoverProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !student || !position) return null;

  const finalAssignment = assignments.find(a => a.category === 'Final');
  
  if (!finalAssignment) return null;

  const currentWeightedTotal = assignments
    .filter(a => a.category !== 'Final')
    .reduce((sum, a) => sum + (student.scores[a.id] || 0) * a.weight, 0);

  return (
    <div 
      ref={ref}
      style={{ 
        position: 'fixed', 
        top: position.y, 
        left: position.x,
        transform: 'translate(-100%, -50%)', 
        marginLeft: '-10px' 
      }}
      className="z-50 w-80 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
    >
      <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 border-b dark:border-gray-800 flex justify-between items-center">
        <span className="text-xs font-bold text-gray-500 dark:text-gray-400">HARF NOTU</span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-[10px] text-gray-400 uppercase tracking-tight font-bold">Mevcut:</span>
          <span className="text-sm font-black text-gray-900 dark:text-white">{currentWeightedTotal.toFixed(1)}</span>
        </div>
      </div>
      
      <div className="p-2 grid grid-cols-4 gap-1">
        {Object.entries(GRADE_SCALE)
          .sort(([, a], [, b]) => b - a)
          .map(([letter, limit]) => {
            const required = calculateRequiredScore(limit, currentWeightedTotal, finalAssignment);
            const isImpossible = required !== null && required > 100;
            const isAlreadyDone = required !== null && required <= 0;
            const isDisabled = isImpossible || isAlreadyDone;

            return (
              <button
                key={letter}
                disabled={isDisabled}
                onClick={() => {
                   if (required !== null) onSelectScore(finalAssignment.id, required);
                }}
                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${
                  isDisabled 
                    ? 'opacity-30 cursor-default' 
                    : 'hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 cursor-pointer active:scale-90 group'
                }`}
              >
                <span className={`text-sm font-black ${
                  isDisabled ? 'text-gray-400' : 'text-gray-900 dark:text-white group-hover:text-white'
                }`}>{letter}</span>
                
                <div className="mt-1">
                  {isImpossible ? (
                    <span className="text-[10px] text-red-500 font-bold">X</span>
                  ) : isAlreadyDone ? (
                    <span className="text-[10px] text-green-500 font-bold">✓</span>
                  ) : (
                    <span className={`text-[11px] font-mono font-bold ${
                      isDisabled ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400 group-hover:text-blue-100'
                    }`}>{required}</span>
                  )}
                </div>
              </button>
            );
          })}
      </div>
    </div>
  );
}
