import { getAllWeeksMeta } from '@/lib/markdown';
import WeeksIndexClient from '@/components/WeeksIndexClient';

export const metadata = {
  title: 'Haftalık Ders Akışı | GİT 119',
  description: 'GİT 119 dersinin haftalık programı, ders notları ve ödevleri.',
};

export default function WeeksIndexPage() {
  const weeksData = getAllWeeksMeta();

  return <WeeksIndexClient weeksData={weeksData} />;
}