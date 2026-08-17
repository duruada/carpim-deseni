export const colors = {
  paper: '#F4EFE4',
  card: '#FFFDF8',
  ink: '#2F2A24',
  inkSoft: '#7A7065',
  line: '#DED4C2',
  cell: '#FFFDF8',

  /** Seçilen çarpanların renkleri. En fazla üç çarpan seçilebiliyor. */
  factor: ['#2C5F8A', '#B3402F', '#2F7D55'],
  /** Aynı rengin açık tonu, hücre zemini için. */
  factorSoft: ['#DCE8F1', '#F7E3DF', '#E0EDE5'],
  /** Seçilen çarpanların hepsine bölünen sayılar. */
  shared: '#7F5AB6',
  sharedSoft: '#EAE2F5',
};

/**
 * Ekranın kısa kenarına göre ölçek. Tabletlerde her şey orantılı kalsın.
 */
export function createScale(width, height) {
  const short = Math.min(width, height);
  const factor = Math.max(0.85, Math.min(short / 400, 1.75));
  return (size) => Math.round(size * factor);
}

export const tabular = { fontVariant: ['tabular-nums'] };
