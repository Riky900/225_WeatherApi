# 225_WeatherApi

Aplikasi web sederhana (Express + HTML) untuk mencari lokasi lewat **MapTiler Geocoding API**.
Browser memanggil backend `/api/lokasi`, lalu backend memanggil MapTiler memakai API key dari `.env`.

Data yang ditampilkan:

- Lokasi (input)
- Negara
- Provinsi
- Kecamatan
- Longitude
- Latitude

Posisi hasil juga digambar sebagai pin pada kisi peta dunia.

## Cara menjalankan

1. Buat API key gratis di https://cloud.maptiler.com/account/keys/
2. Salin `.env.example` menjadi `.env`, lalu isi `MAPTILER_API_KEY`.
3. Install dan jalankan:

```
npm install
npm start
```

4. Buka http://localhost:3000

## Endpoint

```
GET /api/lokasi?q=Kasihan, Bantul
```

Contoh respons (dipersingkat):

```json
{
  "query": "Kasihan, Bantul",
  "hasil": [
    {
      "lokasi": "...",
      "negara": "Indonesia",
      "provinsi": "...",
      "kecamatan": "...",
      "longitude": 110.33,
      "latitude": -7.83
    }
  ]
}
```

## Screenshot hasil

![Hasil di browser](screenshots/browser.png)

![Hasil di Postman](screenshots/postman.png)

## Catatan

Kolom kecamatan diambil dari level administrasi di bawah kabupaten/kota pada respons MapTiler
(`municipal_district`, `municipality`, `county`, `locality`). Nama levelnya bisa berbeda antar lokasi.
