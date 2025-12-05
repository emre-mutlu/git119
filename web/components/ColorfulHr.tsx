'use client';

import { useEffect, useState } from 'react';

const colors = ['#5C03BC', '#E536AB', '#39FF14']; // primary, accent, neon

export default function ColorfulHr() {
  const [color, setColor] = useState(colors[0]);

  useEffect(() => {
    setColor(colors[Math.floor(Math.random() * colors.length)]);
  }, []);

  return (
    <hr 
      className="my-8 border-0 h-[1px]" 
      style={{ backgroundColor: color }}
    />
  );
}
