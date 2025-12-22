'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Save, X } from 'lucide-react';

interface FeedbackPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  initialFeedback: string;
  studentName: string;
  onSave: (feedback: string) => void;
  position: { x: number; y: number } | null;
}

export default function FeedbackPopover({ 
  isOpen, 
  onClose, 
  initialFeedback,
  studentName,
  onSave, 
  position 
}: FeedbackPopoverProps) {
  const [feedback, setFeedback] = useState(initialFeedback);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFeedback(initialFeedback || '');
  }, [initialFeedback, isOpen]);

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

  if (!isOpen || !position) return null;

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
        <div className="flex items-center gap-2">
            <MessageSquare size={14} className="text-blue-500" />
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Öğrenci Notu</span>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X size={14} />
        </button>
      </div>
      
      <div className="p-3">
        <p className="text-xs text-gray-400 mb-2 font-medium">
            {studentName} için notunuz:
        </p>
        <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Örn: Final projesindeki sunumun çok başarılıydı..."
            className="w-full h-32 p-3 text-sm bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none dark:text-white"
            autoFocus
        />
        <div className="flex justify-end mt-2">
            <button
                onClick={() => {
                    onSave(feedback);
                    onClose();
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition"
            >
                <Save size={14} />
                Kaydet
            </button>
        </div>
      </div>
    </div>
  );
}
