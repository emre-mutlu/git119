'use client';

import { useEffect, useState } from 'react';

const colors = ['#95609f', '#b847a3', '#0091ff']; // lavender, midnight violet, ocean blue

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
