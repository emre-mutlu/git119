'use client';

export default function ColorfulHr() {
  return (
    <hr
      className="my-8 border-0 w-full"
      style={{
        height: '1px',
        opacity: 0.95,
        backgroundImage:
          'linear-gradient(90deg, rgb(var(--color-primary)), rgb(var(--color-accent)), rgb(var(--color-neon)))',
      }}
    />
  );
}
