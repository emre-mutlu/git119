'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function RandomGradients() {
  const pathname = usePathname();

  useEffect(() => {
    // Wait for DOM updates after navigation
    const timer = setTimeout(() => {
      const gradientDirections = [
        '135deg',  // top-left to bottom-right
        '225deg',  // top-right to bottom-left
        '45deg',   // bottom-left to top-right
        '315deg',  // bottom-right to top-left
      ];

      // Core 6 Colors in rgba format for random selection
      const colors = [
        { r: 255, g: 0, b: 0 },       // red
        { r: 0, g: 255, b: 0 },       // lime
        { r: 0, g: 0, b: 255 },       // blue
        { r: 0, g: 145, b: 255 },     // ocean
        { r: 92, g: 3, b: 188 },      // purple
        { r: 229, g: 54, b: 171 },    // pink
      ];

      const getRandomColor = (alpha: number) => {
        const color = colors[Math.floor(Math.random() * colors.length)];
        return `rgba(${color.r},${color.g},${color.b}, ${alpha})`;
      };

      // Apply random gradient direction and colors to each mesh-heading element
      const meshHeadings = document.querySelectorAll('.mesh-heading');
      meshHeadings.forEach((heading) => {
        const randomDir = gradientDirections[Math.floor(Math.random() * gradientDirections.length)];
        const colorA = getRandomColor(0.5 + Math.random() * 0.1); // 0.5-0.6
        const colorB = getRandomColor(0.3 + Math.random() * 0.2); // 0.3-0.5
        (heading as HTMLElement).style.setProperty('--random-gradient-dir', randomDir);
        (heading as HTMLElement).style.setProperty('--mesh-a', colorA);
        (heading as HTMLElement).style.setProperty('--mesh-b', colorB);
      });

      // Apply random gradient direction and colors to each prose h2 and h3 element
      const proseHeadings = document.querySelectorAll('.syllabus-prose > h2, .syllabus-prose > h3, .kaynaklar-prose > h2, .kaynaklar-prose > h3');
      proseHeadings.forEach((heading) => {
        const randomDir = gradientDirections[Math.floor(Math.random() * gradientDirections.length)];
        const colorA = getRandomColor(0.5 + Math.random() * 0.1); // 0.5-0.6
        const colorB = getRandomColor(0.3 + Math.random() * 0.2); // 0.3-0.5
        (heading as HTMLElement).style.setProperty('--random-gradient-dir', randomDir);
        (heading as HTMLElement).style.setProperty('--mesh-a', colorA);
        (heading as HTMLElement).style.setProperty('--mesh-b', colorB);
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
