'use client';

import { useEffect, useState } from 'react';

// All colors used in the site except white
const colors = [
  '#5C03BC', // primary (purple)
  '#E536AB', // accent (pink)
  '#39FF14', // neon (green)
  '#FFFF00', // yellow
  '#fc3903', // blazing flame (orange)
  '#0091ff', // ocean blue
  '#28d77d', // emerald green
  '#95609f', // lavender (purple)
];

export default function ColorfulHr() {
  const [color, setColor] = useState(colors[0]);

  useEffect(() => {
    setColor(colors[Math.floor(Math.random() * colors.length)]);
  }, []);

  return (
    <hr 
      className="my-8 border-0 h-[1px] opacity-70" 
      style={{ backgroundColor: color }}
    />
  );
}
