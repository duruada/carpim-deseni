/**
 * Oyun listesi. Menü buradan üretiliyor; yeni oyun eklemek için buraya bir
 * satır ve bir bileşen yeterli.
 *
 * `lever` alanı hangi öğrenme kasını çalıştırdığını söylüyor. Hepsi soru-cevap
 * olmasın diye bilerek çeşitlendirildi: alıştırmayı Adam Asmaca yapıyor,
 * buradakiler keşfettiriyor, sezdiriyor ve uygulatıyor.
 */
export const GAMES = [
  {
    key: 'multiples',
    title: 'Katlar',
    blurb: 'Bir sayı seç, katları yansın. Desenleri kendin bul.',
    lever: 'keşif',
    color: '#2C5F8A',
  },
  {
    key: 'table',
    title: 'Çarpım Tablosu',
    blurb: 'Bir kutuya dokun, dikdörtgeni say. Çarpma böyle görünür.',
    lever: 'sezgi',
    color: '#2F7D55',
  },
  {
    key: 'numberline',
    title: 'Sayı Doğrusu',
    blurb: 'Zıpla zıpla ilerle. Çarpma tekrarlı zıplamaktır.',
    lever: 'sezgi',
    color: '#7F5AB6',
  },
  {
    key: 'market',
    title: 'Market',
    blurb: 'Bütçen var, alışverişe çık. Hesabı sen tut.',
    lever: 'uygulama',
    color: '#B3402F',
  },
  {
    key: 'mirror',
    title: 'Ayna Çizim',
    blurb: 'Sen çiz, ayna tamamlasın. Simetri böyle bir şey.',
    lever: 'üretim',
    color: '#A5731A',
  },
];
