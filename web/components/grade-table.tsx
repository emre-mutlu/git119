import { StudentRow, Assignment } from '@/lib/types';
import { ArrowUpDown, ArrowUp, ArrowDown, MessageSquare } from 'lucide-react';

interface GradeTableProps {
  students: StudentRow[];
  assignments: Assignment[];
  onScoreChange: (studentId: string, assignmentId: string, value: string) => void;
  onCalculateTarget?: (student: StudentRow, position: { x: number; y: number }) => void;
  onSort?: (key: string) => void;
  sortConfig?: { key: string; direction: 'asc' | 'desc' } | null;
  onFeedbackClick?: (student: StudentRow, position: { x: number; y: number }) => void;
}

export default function GradeTable({ students, assignments, onScoreChange, onCalculateTarget, onSort, sortConfig, onFeedbackClick }: GradeTableProps) {
  
  const renderSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) return <ArrowUpDown size={14} className="opacity-30" />;
    return sortConfig.direction === 'asc' ? <ArrowUp size={14} className="text-blue-500" /> : <ArrowDown size={14} className="text-blue-500" />;
  };

  return (
    <div className="border dark:border-gray-700 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-gray-900">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
              <th 
                className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition select-none"
                onClick={() => onSort?.('student_no')}
              >
                <div className="flex items-center gap-2">No {renderSortIcon('student_no')}</div>
              </th>
              <th 
                className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition select-none"
                onClick={() => onSort?.('full_name')}
              >
                <div className="flex items-center gap-2">Ad Soyad {renderSortIcon('full_name')}</div>
              </th>
              
              {assignments.map(a => (
                <th key={a.id} className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center min-w-[100px]">
                  <div className="truncate w-32 mx-auto" title={a.name}>{a.name}</div>
                  <span className="text-[10px] text-blue-500 dark:text-blue-400 block mt-1 font-bold">%{Math.round(a.weight * 100)}</span>
                </th>
              ))}

              <th 
                className="p-4 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-center bg-blue-50/50 dark:bg-blue-900/20 w-24 border-l border-blue-100 dark:border-blue-900/30 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/40 transition select-none"
                onClick={() => onSort?.('average')}
              >
                <div className="flex items-center justify-center gap-2">ORT {renderSortIcon('average')}</div>
              </th>
              <th className="p-4 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-center bg-blue-50/50 dark:bg-blue-900/20 w-20">HARF</th>
              <th className="p-4 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-center w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
                <td className="p-4 text-sm text-gray-500 dark:text-gray-400 font-mono">{student.student_no}</td>
                <td className="p-4 text-sm font-medium text-gray-900 dark:text-gray-100">{student.full_name}</td>
                
                {assignments.map((assign) => (
                  <td key={assign.id} className="p-2 text-center">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={student.scores[assign.id] ?? 0}
                      onChange={(e) => onScoreChange(student.id, assign.id, e.target.value)}
                      className="w-16 p-2 text-sm text-center border-0 rounded-md bg-transparent focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none transition group-hover:bg-white/50 dark:group-hover:bg-gray-800/50 dark:text-gray-200 font-medium"
                    />
                  </td>
                ))}

                <td className="p-4 text-sm text-center font-bold text-gray-900 dark:text-white bg-blue-50/30 dark:bg-blue-900/10 border-l border-blue-100 dark:border-blue-900/30">
                  {student.average}
                </td>
                <td className="p-4 text-center">
                  <button 
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      onCalculateTarget?.(student, { x: rect.left, y: rect.top + rect.height / 2 });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-110 active:scale-95 shadow-sm ${
                    student.letter_grade === 'FF' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50' : 
                    student.letter_grade === 'AA' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50' :
                    'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50'
                  }`}>
                    {student.letter_grade}
                  </button>
                </td>
                <td className="p-2 text-center">
                  <button 
                    onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        onFeedbackClick?.(student, { x: rect.left, y: rect.top + rect.height / 2 });
                    }}
                    className={`p-2 rounded-lg transition-all ${
                        student.feedback 
                            ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400' 
                            : 'text-gray-300 hover:text-gray-500 dark:text-gray-600 dark:hover:text-gray-400'
                    }`}
                    title={student.feedback ? "Notu Düzenle" : "Not Ekle"}
                  >
                    <MessageSquare size={16} className={student.feedback ? "fill-current" : ""} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}