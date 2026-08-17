# Ada'nın Matematik Oyunları

Beş küçük oyun. iPad ve Android tablette çalışır; Expo (React Native) ile
yazıldı.

[Adam Asmaca](../Adam%20Asmaca) alıştırma yapıyor: soruyor, doğru/yanlış
diyor, zorlandığı çarpımları takip ediyor. **Buradaki oyunların hiçbiri soru
sormuyor.** Amaç çocuğun deseni kendi fark etmesi, çünkü matematiği sevdiren
şey doğru cevabı kendi bulduğu bir sebeple bulduğunu anlaması.

Oyunlar bilerek farklı kasları çalıştırıyor:

| Oyun | Kas | Ne yapıyor |
| --- | --- | --- |
| **Katlar** | keşif | Yüzler tablosunda bir sayının katları yanıyor |
| **Çarpım Tablosu** | sezgi | Dikdörtgeni boyuyor: çarpma bir alandır |
| **Sayı Doğrusu** | sezgi | Zıplayarak ilerliyor: çarpma tekrarlı toplamadır |
| **Market** | uygulama | Bütçeyle alışveriş, hesabı çocuk tutuyor |
| **Ayna Çizim** | üretim | Simetri çizimi — sınav değil, sanat |

## Oyunlar

### Katlar

Yüzler tablosu (1–100), üstünde 2–10 arası çarpan seçicileri. Desenler
kendiliğinden ortaya çıkıyor: **9** köşegen yapıyor ve yanan sayıların
rakamları toplanınca hep 9 çıkıyor; **5** iki sütun; **10** tek sütun;
**7** dağınık — sürprizi bu.

Üç çarpan birden seçilebiliyor, ortak katlar mor yanıyor. Hücreye dokununca
o sayının bütün çarpan çiftleri çıkıyor (`36 = 1×36 2×18 3×12 4×9 6×6`).
Asallarda tek çift kalıyor ve "başka yolu yok!" yazıyor — çocuk asalları
böyle kendi keşfediyor.

### Çarpım Tablosu

Bir kutuya dokununca `(1,1)`'den oraya kadar dikdörtgen boyanıyor. **Boyalı
kutu sayısı çarpımın kendisi**: `6×7` için 42 kutu sayılabiliyor. Ayna hücre
(`7×6`) de işaretleniyor, yer değiştirme özelliği görünür oluyor.

### Sayı Doğrusu

Adım boyu seçiliyor, her "Zıpla" bir yay çiziyor. `5 zıplama × 7 = 35`
kendiliğinden oluşuyor. Doğru hep 0–100 olduğu için sonucun 100'e göre
nerede durduğu da görünüyor; sayı hissi bunu ezberle gelmiyor.

### Market

60 ₺ bütçe, altı ürün. Ada sepeti kendi dolduruyor ama **toplamı uygulama
söylemiyor** — kasaya giderken tutarı kendisi hesaplıyor. Bütçeyi aşarsa
"neyi çıkarırsın?" diye soruyor. Buradaki motivasyon matematik değil yetki:
kendi kararını veriyor, sonucunu görüyor.

### Ayna Çizim

Bir yarıya çiziyor, ayna öbür yarıyı tamamlıyor. İki ya da dört eksen, altı
renk. Doğru cevap yok; çıkan şey güzel oluyor ve simetri sezgisi bedavaya
geliyor.

## Bilerek yapılmayanlar

Puan, madalya, seri (streak) ve **süre sayacı yok.** Dışsal ödül motivasyonu
matematikten ödüle kaydırıyor; süre baskısı da matematik kaygısının bilinen
tetikleyicisi. Hız ölçümü gereken yerde ([Adam Asmaca](../Adam%20Asmaca))
sayaç ekranda görünmüyor ve soru zaman aşımına uğramıyor.

Katlar ekranındaki metinler hep **soru**, hiçbiri cevap vermiyor. Deseni
fark etmenin kendisi ödül; cevabı okumak o ödülü elinden alıyor.

## Çalıştırma

```bash
npm install     # ilk seferde
npm start
```

QR kod çıkar, tablete **Expo Go** kurup okutmak yeterli.

## Kurulum dosyası üretme

Etiket atmak yeterli; iki akış birden çalışıp aynı Release'e dosya ekler.

```bash
git tag v1.1.0
git push origin v1.1.0
```

| Akış | Çıktı |
| --- | --- |
| [release.yml](.github/workflows/release.yml) | Android `.apk` — doğrudan kurulur |
| [ios-ipa.yml](.github/workflows/ios-ipa.yml) | İmzasız `.ipa` — SideStore/AltStore ile kurulur |

İkisi de GitHub'ın ücretsiz runner'ında çalışır: ne Mac, ne Expo hesabı, ne
Apple Developer üyeliği gerekiyor.

## Dosya düzeni

| Dosya | İçerik |
| --- | --- |
| [App.js](App.js) | Menü ve gezinme |
| [src/games.js](src/games.js) | Oyun listesi — yeni oyun buraya bir satır |
| [src/components/MenuScreen.js](src/components/MenuScreen.js) | Oyun kartları |
| [src/components/MultiplesScreen.js](src/components/MultiplesScreen.js) | Katlar |
| [src/components/TableScreen.js](src/components/TableScreen.js) | Çarpım tablosu |
| [src/components/NumberLineScreen.js](src/components/NumberLineScreen.js) | Sayı doğrusu |
| [src/components/MarketScreen.js](src/components/MarketScreen.js) | Market |
| [src/components/MirrorScreen.js](src/components/MirrorScreen.js) | Ayna çizim |
| [src/theme.js](src/theme.js) | Renkler ve ölçekleme |

> Depo adı hâlâ `carpim-deseni` — uygulama tek oyunken konmuştu. Uygulama
> kimliği (`com.aren.carpimdeseni`) de öyle. İkisini değiştirmek mümkün ama
> uygulama kimliği değişirse cihazda **yeni bir uygulama** olarak kurulur.
