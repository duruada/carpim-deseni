# Ada'nın Çarpım Deseni

Çarpım tablosunu **sınamak yerine keşfettiren** uygulama. iPad ve Android
tablette çalışır; Expo (React Native) ile yazıldı.

[Adam Asmaca](../Adam%20Asmaca) alıştırma yapıyor: soruyor, doğru/yanlış diyor.
Bu uygulama tam tersini yapıyor — hiç soru sormuyor. Amaç çocuğun deseni kendi
fark etmesi, çünkü matematiği sevdiren şey doğru cevabı **kendi bulduğu bir
sebeple** bulduğunu anlaması.

## İki ekran

### Katlar

Yüzler tablosu (1–100) ve üstünde 2'den 10'a kadar çarpan seçicileri. Bir sayı
seçilince katları yanıyor. Desenler kendiliğinden ortaya çıkıyor:

- **5** iki sütun yakıyor, hepsi 0 veya 5 ile bitiyor.
- **9** köşegen oluşturuyor. Yanan sayıların rakamları toplanınca hep 9 çıkıyor.
- **10** tek bir sütun.
- **7** dağınık duruyor — sürprizi bu.

Aynı anda üç çarpan seçilebiliyor. İki desende birden yanan hücreler mor
oluyor: ortak katlar, tanım okumadan görünür hale geliyor.

Bir de hücreye dokunulunca o sayının bütün çarpan çiftleri yazılıyor
(`36 = 1×36 2×18 3×12 4×9 6×6`). Asal sayılarda tek çift kalıyor ve
"başka yolu yok!" yazıyor — çocuk asalları böyle kendi keşfediyor.

### Tablo

10×10 çarpım tablosu. Bir kutuya dokununca `(1,1)`'den o kutuya kadarki
dikdörtgen boyanıyor. **Boyalı kutu sayısı çarpımın kendisi:** `6×7` için 42
kutu sayılabiliyor. Ayna hücre (`7×6`) da işaretleniyor, yer değiştirme
özelliği kendiliğinden görünüyor.

## Bilerek yapılmayanlar

Puan, madalya, seri (streak) ve **süre sayacı yok.** Bunlar kısa vadede
oyalıyor ama motivasyonu dışsallaştırıyor: çocuk matematiği değil ödülü
istemeye başlıyor. Süre baskısı da matematik kaygısının bilinen tetikleyicisi.

Desen seçilince altta çıkan metinler hep **soru**, hiçbiri cevap vermiyor.
Deseni fark etmenin kendisi ödül; cevabı okumak o ödülü elinden alıyor.

## Çalıştırma

```bash
npm install     # ilk seferde
npm start
```

QR kod çıkar. Tablete **Expo Go** kurup okutmak yeterli.

## Kurulum dosyası üretme

Etiket atmak yeterli; iki akış birden çalışıp aynı Release'e dosya ekler.

```bash
git tag v1.0.0
git push origin v1.0.0
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
| [App.js](App.js) | Sekmeler ve düzen |
| [src/components/MultiplesScreen.js](src/components/MultiplesScreen.js) | Yüzler tablosu, çarpan seçimi |
| [src/components/TableScreen.js](src/components/TableScreen.js) | Çarpım tablosu, alan modeli |
| [src/components/FactorChips.js](src/components/FactorChips.js) | Çarpan seçicileri |
| [src/prompts.js](src/prompts.js) | Desen soruları |
| [src/math.js](src/math.js) | Çarpan çiftleri |
| [src/theme.js](src/theme.js) | Renkler ve ölçekleme |
