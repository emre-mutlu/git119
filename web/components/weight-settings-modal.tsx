'use client';

import { useState, useEffect } from 'react';
import { X, Save, Percent } from 'lucide-react';
import { Assignment } from '@/lib/types';

interface WeightSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignments: Assignment[];
  onSave: (updatedAssignments: Assignment[]) => void;
}

export default function WeightSettingsModal({ isOpen, onClose, assignments, onSave }: WeightSettingsModalProps) {
  const [categoryWeights, setCategoryWeights] = useState<Record<string, number>>({});
  
  // Kategorileri grupla
  const categories = Array.from(new Set(assignments.map(a => a.category)));
  
  useEffect(() => {
    // Mevcut ağırlıkları kategori bazında topla (İlk açılışta)
    const weights: Record<string, number> = {};
    categories.forEach(cat => {
      const catAssignments = assignments.filter(a => a.category === cat);
      const totalWeight = catAssignments.reduce((sum, a) => sum + (a.weight || 0), 0);
      weights[cat] = Math.round(totalWeight * 100);
    });
    setCategoryWeights(weights);
  }, [assignments, isOpen]);

  if (!isOpen) return null;

  const totalSum = Object.values(categoryWeights).reduce((a, b) => a + b, 0);

  const handleWeightChange = (changedCategory: string, value: string) => {
    let newValue = parseInt(value);
    if (isNaN(newValue)) newValue = 0;
    if (newValue > 100) newValue = 100;
    if (newValue < 0) newValue = 0;

    // 1. Değişen kategoriyi güncelle
    const newWeights = { ...categoryWeights, [changedCategory]: newValue };
    
    // 2. Diğer kategorileri bul
    const otherCategories = categories.filter(c => c !== changedCategory);
    if (otherCategories.length === 0) {
        setCategoryWeights(newWeights);
        return;
    }

    // 3. Kalan miktarı hesapla (100 - Yeni Değer)
    const remainingTotal = 100 - newValue;

    // 4. Diğer kategorilerin mevcut toplam ağırlığını bul
    const currentOthersTotal = otherCategories.reduce((sum, cat) => sum + categoryWeights[cat], 0);

    // 5. Kalan miktarı diğerlerine orantılı dağıt
    let distributedSum = 0;
    otherCategories.forEach((cat, index) => {
        // Eğer diğerlerinin toplamı 0 ise eşit dağıt, değilse orantılı dağıt
        let ratio = currentOthersTotal === 0 
            ? 1 / otherCategories.length 
            : categoryWeights[cat] / currentOthersTotal;
            
        let share = Math.round(remainingTotal * ratio);
        
        // Son elemana yuvarlama hatasını ekle/çıkar
        if (index === otherCategories.length - 1) {
            share = remainingTotal - distributedSum;
        }
        
        newWeights[cat] = share;
        distributedSum += share;
    });

    setCategoryWeights(newWeights);
  };

  const handleSave = () => {
    if (totalSum !== 100) {
      alert("Toplam ağırlık %100 olmalıdır! Şu an: %" + totalSum);
      return;
    }

    const updatedAssignments = assignments.map(a => {
      const catWeight = categoryWeights[a.category] / 100; // 0.40 gibi
      const catAssignments = assignments.filter(as => as.category === a.category);
      // Gruptaki her ödeve eşit paylaştır
      return {
        ...a,
        weight: catWeight / catAssignments.length
      };
    });

    onSave(updatedAssignments);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border dark:border-gray-800 overflow-hidden">
        <div className="px-6 py-4 border-b dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-2">
            <Percent size={20} className="text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Ağırlık Ayarları</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Kategori ağırlıklarını belirleyin. Sistem, kategori içindeki her bir ögeye ağırlığı otomatik olarak eşit dağıtacaktır.
          </p>

          <div className="space-y-4">
            {categories.map(cat => (
              <div key={cat} className="flex items-center justify-between gap-4">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 min-w-[100px]">
                  {cat === 'Homework' ? 'Ödevler' : cat === 'Final' ? 'Final' : cat === 'Midterm' ? 'Vize' : cat}
                </label>
                <div className="relative flex-1 max-w-[120px]">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={categoryWeights[cat]}
                    onChange={(e) => handleWeightChange(cat, e.target.value)}
                    className="w-full pl-3 pr-8 py-2 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-lg text-right font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
                </div>
              </div>
            ))}
          </div>

          <div className={`p-4 rounded-xl border flex justify-between items-center ${
            totalSum === 100 ? 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400'
          }`}>
            <span className="text-sm font-bold">Toplam Ağırlık</span>
            <span className="text-xl font-black">%{totalSum}</span>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t dark:border-gray-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
          >
            İptal
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition active:scale-95"
          >
            <Save size={18} />
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}
