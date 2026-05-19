# Jogja Pulang Malam — DIY Live Stream Update

Update ini berisi:

- `data/cctv.geojson` baru dari `cctv.jogjaprov.go.id` dengan 554 titik CCTV se-DIY dan `stream_url` live `.m3u8`.
- Popup CCTV sudah bisa menampilkan preview video live memakai `hls.js`, plus tombol **Buka stream** untuk membuka link live langsung.
- Layer RS/Klinik, kantor polisi/Polsek, SPBU, dan titik 24 jam diambil live dari OpenStreetMap Overpass dengan batas area satu Provinsi DIY.
- Icon marker diperkecil dan otomatis mengecil saat zoom jauh supaya tampilan awal tidak terlalu numpuk.
- Geocoder diperluas ke cakupan DIY, bukan hanya Kota Yogyakarta.

## Cara pakai

Upload seluruh isi folder ini ke repository GitHub Pages kamu, dengan struktur:

```text
index.html
css/styles.css
js/app.js
js/config.js
data/cctv.geojson
data/hospitals.geojson
data/police.geojson
data/spbu.geojson
data/stores24.geojson
data/places.json
```

Catatan: layer RS/Polsek/SPBU/titik 24 jam membutuhkan koneksi internet saat web dibuka karena datanya ditarik live dari Overpass. Jika Overpass sedang lambat, tunggu beberapa detik atau refresh halaman.
