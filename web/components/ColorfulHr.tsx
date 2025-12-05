'use client';

const emerald = '#28d77d';

export default function ColorfulHr() {
  return (
    <hr
      className="my-8 border-0 w-full"
      style={{ backgroundColor: emerald, height: '0.5px', opacity: 0.8 }}
    />
  );
}
