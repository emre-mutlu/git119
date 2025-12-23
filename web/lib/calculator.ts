import { Assignment, Score } from './types';

export const GRADE_SCALE = {
  AA: 90, BA: 85, BB: 80, CB: 75,
  CC: 70, DC: 65, DD: 60, FD: 55, FF: 0
};

/**
 * Bir öğrencinin notlarını hesaplar.
 * @param scores Öğrencinin notları (assignment_id -> puan)
 * @param assignments Dersin tüm ödev tanımları
 */
export function calculateStudentGrade(
  scores: Record<string, number>,
  assignments: Assignment[]
): { total: number; letter: string } {
  
  let totalWeightedScore = 0;
  let totalWeight = 0;

  for (const assign of assignments) {
    const scoreVal = scores[assign.id] || 0;
    // Eğer ağırlık girilmemişse (CSV'den gelen veri 0), eşit ağırlık varsayılabilir veya
    // kullanıcı arayüzünde ayarlanana kadar 0 kabul edilir.
    // MVP için: Ağırlığı veritabanından alıyoruz.
    totalWeightedScore += scoreVal * assign.weight;
    totalWeight += assign.weight;
  }

  // Eğer toplam ağırlık 0 ise (henüz ayar yapılmadıysa), basit ortalama al (Fallback)
  let finalScore = 0;
  if (totalWeight === 0) {
    const validAssignments = assignments.filter(a => scores[a.id] !== undefined);
    if (validAssignments.length > 0) {
      const sum = validAssignments.reduce((acc, curr) => acc + (scores[curr.id] || 0), 0);
      finalScore = sum / validAssignments.length;
    }
  } else {
    // Normal ağırlıklı ortalama
    // Eğer ağırlıklar toplamı 1 değilse (örn: 0.4 + 0.4 = 0.8), 100 üzerinden normalize et.
    finalScore = (totalWeightedScore / totalWeight) * (totalWeight < 1 ? 1 : 1); 
  }

  // Yuvarlama
  finalScore = parseFloat(finalScore.toFixed(2));

  return {
    total: finalScore,
    letter: getLetterGrade(finalScore)
  };
}

export function getLetterGrade(score: number): string {
  // Puanları büyükten küçüğe sırala
  const sortedScale = Object.entries(GRADE_SCALE).sort(([, a], [, b]) => b - a);
  
  for (const [letter, limit] of sortedScale) {
    if (score >= limit) return letter;
  }
  return 'FF';
}

/**
 * Hedef not için gereken puanı hesaplar.
 * @param targetScore Hedeflenen toplam puan (Örn: AA için 90)
 * @param currentTotal Şu anki ağırlıklı toplam (Final hariç)
 * @param targetAssignment Hedeflenen ödev (Genelde Final)
 */
export function calculateRequiredScore(
  targetScore: number,
  currentWeightedTotal: number,
  targetAssignment: Assignment
): number | null {
  if (targetAssignment.weight === 0) return null;

  // Hedef = Mevcut + (Gereken * Ağırlık)
  // Gereken = (Hedef - Mevcut) / Ağırlık
  const required = (targetScore - currentWeightedTotal) / targetAssignment.weight;
  
  return Math.ceil(required);
}
