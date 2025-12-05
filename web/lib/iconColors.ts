// Shared icon colors - generated once on first import
export const iconColorPalette = [
  '#5C03BC', // mor
  '#E536AB', // pembe
  '#39FF14', // neon yeşil
  '#FC3903', // turuncu
  '#0091FF', // okyanus
  '#28D77D', // zümrüt
  '#95609F', // lavanta
];

// Generate random colors once and export them
function generateRandomColors(): string[] {
  const shuffled = [...iconColorPalette].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 4);
}

// These colors are generated once when the module is first imported
// and will remain the same throughout the session
export const sharedIconColors = generateRandomColors();

// Map colors to specific items for consistency
export const iconColorMap = {
  home: sharedIconColors[0],
  syllabus: sharedIconColors[1],
  haftalar: sharedIconColors[2],
  kaynaklar: sharedIconColors[3],
};
