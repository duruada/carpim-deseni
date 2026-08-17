/**
 * Desen seçilince altta çıkan metinler.
 *
 * Hepsi bilerek SORU. Cevabı yazmıyoruz: deseni fark etmenin kendisi
 * ödül, cevabı okumak o ödülü elinden alıyor.
 */
const SINGLE = {
  2: 'Yanan sayılar hangi rakamlarla bitiyor?',
  3: 'Desen sütunlar boyunca nasıl kayıyor?',
  4: '2 ile karşılaştır. Hangi sayılar bu kez yanmadı?',
  5: 'Kaç sütun yandı? Son rakamları ne?',
  6: 'Şimdi 2 ve 3 ile karşılaştır. Bir şey dikkatini çekiyor mu?',
  7: 'Bu desen ötekilerden daha dağınık duruyor. Sence neden?',
  8: '4 ile karşılaştır. Yanan sayıların kaçta kaçı kaldı?',
  9: 'Yanan bir sayının rakamlarını topla. Sonra bir başkasını dene.',
  10: 'Tek bir sütun. Neden sadece bir tane?',
};

/** İki veya üç çarpan seçiliyken. */
const MULTI = [
  'Mor hücreler iki desende birden yanıyor. En küçüğü hangisi?',
  'Mor sayılar seçtiğin çarpanların ortak katları. Aralarındaki fark ne kadar?',
  'Mor hücreler eşit aralıklarla mı yerleşmiş?',
];

export function promptFor(selected) {
  if (selected.length === 0) return 'Yukarıdan bir sayı seç, katları yansın.';
  if (selected.length === 1) return SINGLE[selected[0]] ?? '';
  return MULTI[Math.min(selected.length - 2, MULTI.length - 1)];
}

/** Tablo ekranında hücreye dokununca. */
export function areaPrompt(a, b) {
  if (a === b) return `${a} × ${a} bir kare oluşturuyor. Fark ettin mi?`;
  return `Boyalı dikdörtgeni say: ${a} sıra, her sırada ${b} kutu.`;
}
