/**
 * Oyun listesi. Menü buradan üretiliyor; yeni oyun eklemek için buraya bir
 * satır, bir ekran bileşeni ve GameIcon içine bir ikon yeterli.
 *
 * `lever` alanı hangi öğrenme kasını çalıştırdığını söylüyor. Hepsi soru-cevap
 * olmasın diye bilerek çeşitlendirildi: alıştırmayı Adam Asmaca yapıyor,
 * buradakiler keşfettiriyor, sezdiriyor, uygulatıyor ve ürettiriyor.
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
    key: 'fraction',
    title: 'Pizza Kesirleri',
    blurb: 'İki pizzayı dilimle. Ne zaman eşit olduklarını gör.',
    lever: 'keşif',
    color: '#B0562F',
  },
  {
    key: 'market',
    title: 'Market',
    blurb: 'Bütçen var, alışverişe çık. Hesabı sen tut.',
    lever: 'uygulama',
    color: '#B3402F',
  },
  {
    key: 'measure',
    title: 'Ölçüm Avı',
    blurb: 'Önce tahmin et, sonra cetvelle ölç. Aradaki farkı gör.',
    lever: 'tahmin',
    color: '#2C7A7A',
  },
  {
    key: 'dice',
    title: 'Zar Deneyi',
    blurb: 'İki zar at, at, at. Hangi toplam kazanır?',
    lever: 'olasılık',
    color: '#6B6F2F',
  },
  {
    key: 'mirror',
    title: 'Ayna Çizim',
    blurb: 'Sen çiz, ayna tamamlasın. Simetri böyle bir şey.',
    lever: 'üretim',
    color: '#A5731A',
  },
];
