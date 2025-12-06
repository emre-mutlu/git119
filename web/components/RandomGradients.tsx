'use client';

import { useEffect } from 'react';

export default function RandomGradients() {
  useEffect(() => {
    const gradientDirections = [
      'to top left',
      'to top right',
      'to bottom left',
      'to bottom right',
    ];

    // Apply random gradient direction to each mesh-heading element
    const meshHeadings = document.querySelectorAll('.mesh-heading');
    meshHeadings.forEach((heading) => {
      const randomDir = gradientDirections[Math.floor(Math.random() * gradientDirections.length)];
      (heading as HTMLElement).style.setProperty('--random-gradient-dir', randomDir);
    });

    // Apply random gradient direction to each prose h2 and h3 element
    const proseHeadings = document.querySelectorAll('.syllabus-prose > h2, .syllabus-prose > h3, .kaynaklar-prose > h2, .kaynaklar-prose > h3');
    proseHeadings.forEach((heading) => {
      const randomDir = gradientDirections[Math.floor(Math.random() * gradientDirections.length)];
      (heading as HTMLElement).style.setProperty('--random-gradient-dir', randomDir);
    });
  }, []);

  return null;
}
