/** Bir sayının bütün çarpan çiftleri: 12 -> [[1,12],[2,6],[3,4]] */
export function factorPairs(n) {
  const pairs = [];
  for (let a = 1; a * a <= n; a += 1) {
    if (n % a === 0) pairs.push([a, n / a]);
  }
  return pairs;
}

/**
 * Bir sayıyı çarpan çiftleriyle anlatan metin.
 * Asal sayılarda tek çift kalıyor; çocuk asalları böyle kendi keşfediyor,
 * biz "bu bir asal sayı" demeden.
 */
export function describeNumber(n) {
  if (n === 1) return '1 sadece kendisiyle çarpılabiliyor.';
  const pairs = factorPairs(n);
  const text = pairs.map(([a, b]) => `${a}×${b}`).join('  ');
  if (pairs.length === 1) {
    return `${n} = ${text}   ·   başka yolu yok!`;
  }
  return `${n} = ${text}`;
}
