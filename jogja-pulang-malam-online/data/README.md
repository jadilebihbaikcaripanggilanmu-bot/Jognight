# Struktur data Jogja Pulang Malam

Semua file disimpan sebagai `GeoJSON` agar gampang dibaca Leaflet.

## 1) `zones.geojson`
Polygon kelurahan / zona analisis.

Properti minimal:
- `id`
- `name`
- `night_score` (0-100)
- `cctv_count`
- `hotspot_count`
- `hospital_count`
- `police_count`
- `darkspot_count`
- `incident_index`

## 2) `cctv.geojson`
Point CCTV.

Properti minimal:
- `id`
- `name`
- `source`
- `status`
- `address`
- `stream_url` (opsional)

## 3) `hotspots.geojson`
Point hotspot publik.

Properti minimal:
- `id`
- `name`
- `category`
- `address`

## 4) `hospitals.geojson`
Point RS / klinik / IGD.

Properti minimal:
- `id`
- `name`
- `type`
- `phone`
- `address`
- `emergency` (true/false)

## 5) `police.geojson`
Point polsek / pos polisi.

Properti minimal:
- `id`
- `name`
- `phone`
- `address`

## 6) `darkspots.geojson`
Point titik gelap / titik yang minim PJU / area risiko.

Properti minimal:
- `id`
- `name`
- `risk_level`
- `source`

## 7) `transit.geojson`
Point halte / simpul transit.

Properti minimal:
- `id`
- `name`
- `route_code`
- `address`

## 8) `routes.geojson`
Alternatif rute hasil precompute.

Properti minimal:
- `id`
- `name`
- `length_m`
- `cctv_coverage`
- `hospital_access`
- `police_access`
- `darkspot_exposure`
- `incident_exposure`
- `transit_access`

## Formula awal yang bisa dipakai

### Night score zona
`night_score = 100 * (0.25*cctv_norm + 0.10*hotspot_norm + 0.20*hospital_norm + 0.20*police_norm + 0.10*transit_norm - 0.20*darkspot_norm - 0.15*incident_norm)`

### Route cost
Semakin kecil semakin baik.

`route_cost = 0.35*length_km - 0.15*cctv_coverage - 0.10*hospital_access - 0.10*police_access + 0.20*darkspot_exposure + 0.20*incident_exposure - 0.10*transit_access`

## Langkah kerja yang aman
1. Batas kelurahan/zona
2. Titik CCTV
3. Titik rumah sakit / polisi / halte
4. Titik gelap / risiko
5. Overlay & scoring zona
6. Baru routing aman

## Saran teknis routing
Untuk MVP:
- pakai 3-5 alternatif rute dari API routing
- score setiap rute
- pilih skor terkecil

Untuk versi lanjut:
- bangun graph jalan sendiri
- pakai A* / Dijkstra dengan bobot aman
