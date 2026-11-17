# Heritage Wiki

`strategy/` (Godot projesi) klasöründeki oyun verisinden üretilen, bağımlılıksız statik wiki sitesi.
**Oyun klasörü hiçbir zaman değiştirilmez**; bu araç onu yalnızca okur.

## Aç
`index.html` dosyasına çift tıkla — sunucu gerekmez (`file://` çalışır). Varsayılan dil İngilizce; sağ üstteki seçiciden Türkçe (ve diğer 8 dil) seçilir, seçim hatırlanır. `?lang=tr` ile zorlanabilir.

## İçerik güncelleme (oyun verisi değişince)
```
node tools/build-data.mjs            # varsayılan: ../strategy
node tools/build-data.mjs D:\yol\strategy
```
Üretilenler: `data/wiki-data.js` (+ `.json`), `assets/flags`, `assets/screens`, `assets/fonts`, `assets/icon.svg`.
Tablolar (birlikler, tesisler, anlaşmalar, 65 teknoloji, politikalar, olaylar, 238 ülke…) tamamen bu veriden gelir;
oyun metinlerinin çevirileri oyunun `data/lang/*.json` tablolarından alınır.
Yeni ekran görüntüsü eklemek için görüntüyü oyunun `screenshots/` klasörüne koyup betiği tekrar çalıştır,
sonra `js/content.js` içinde `W.shot("dosya.png", …)` ile sayfaya ekle.

## Yapı
```
index.html            kabuk (üst çubuk, kenar çubuğu, arama)
css/wiki.css          koyu tema (oyunun renkleri) + açık tema, ?embed=1 kompakt kip
js/app.js             dil, yönlendirme (#/sayfa/çapa), arama, ortak bileşenler
js/content.js         sayfa metinleri (TR/EN) ve veri tabloları
data/wiki-data.js     üretilen veri
tools/build-data.mjs  veri üretici
godot/wiki_launcher.gd  oyun içinden açmak için örnek
```

## Oyunun içine gömme
URL parametreleri: `?embed=1` (kompakt, oyun içi görünüm), `?lang=tr|en|zh_CN|ru|es|pt|de|fr|ja`, `?theme=dark|light`.
Derin bağlantı: `index.html?embed=1&lang=tr#/economy`, bir öğeye: `#/research/en_boiler`.

Üst pencereden kontrol (WebView / iframe): 
```js
frame.postMessage({type:"heritage-wiki-open", page:"military", anchor:"u_armored"}, "*");
frame.postMessage({type:"heritage-wiki-lang", lang:"en"}, "*");
// wiki → oyun:  {type:"heritage-wiki", page:"military"}
```

Godot 4'te yerleşik WebView yoktur, iki yol var:
1. **WebView eklentisi** (ör. godot_wry / gdcef): `Strategy-web` klasörünü projeye kopyala ve eklentinin WebView düğümüne
   `index.html?embed=1&lang=<oyun dili>` adresini ver.
2. **Sistem tarayıcısı** (eklenti gerektirmez): `godot/wiki_launcher.gd` wiki'yi `user://wiki` içine çıkarıp açar.

Dışa aktarırken klasörü dışa aktarma filtresine ekle: `*.html, *.js, *.css, *.json, *.png, *.svg, *.ttf`.
`.pck` içindeki dosyalara tarayıcı doğrudan erişemez; bu yüzden (2)'de ilk açılışta `user://` içine kopyalanır.

> Not: `godot/wiki_launcher.gd` ve eklenti yolları bu ortamda Godot içinde denenmedi; yalnızca site tarayıcıda test edildi.

## Dil kapsamı
Düzyazı anlatımlar Türkçe ve İngilizce yazıldı; diğer 7 dilde anlatımlar İngilizce görünür. Ad, açıklama ve tablo metinleri
ile ülke adları ise oyunun kendi çevirileriyle seçili dilde gösterilir. Başka bir dilde anlatım eklemek için `js/content.js`
içindeki `G("tr", "en")` nesnesine o dilin kodunu ekleyebilirsin (ör. `{tr:"…", en:"…", de:"…"}`).
