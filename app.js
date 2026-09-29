require("dotenv").config();

const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

// Ambil tipe level dari item MapTiler (place_type atau prefix id)
const tipe = (c) => (c.place_type && c.place_type[0]) || (c.id || "").split(".")[0];

// Cari nama pada level tertentu, dicoba berurutan sesuai daftar tipe
function cari(feature, daftarTipe) {
    const semua = [feature, ...(feature.context || [])];
    for (const t of daftarTipe) {
        const hit = semua.find((c) => tipe(c) === t);
        if (hit) return hit.text || hit.place_name || "-";
    }
    return "-";
}

// GET /api/lokasi?q=Kasihan, Bantul
app.get("/api/lokasi", async (req, res) => {
    const kota = (req.query.q || "Bandung City").trim();
    const apiKey = process.env.MAPTILER_API_KEY;
    const baseUrl = process.env.MAPTILER_BASE_URL || "https://api.maptiler.com/geocoding";

    if (!apiKey) {
        return res.status(500).json({ message: "MAPTILER_API_KEY belum diisi di file .env" });
    }

    const url = `${baseUrl}/${encodeURIComponent(kota)}.json`;

    try {
        const response = await axios.get(url, {
            params: { key: apiKey, language: "id", limit: 5 },
        });
        const features = response.data.features || [];

        if (features.length === 0) {
            return res.status(404).json({ message: "Lokasi tidak ditemukan" });
        }

        const hasil = features.map((f) => ({
            lokasi: f.place_name || f.text,
            negara: cari(f, ["country"]),
            provinsi: cari(f, ["region"]),
            // Kecamatan: level di bawah kabupaten/kota, namanya beda tiap negara
            kecamatan: cari(f, ["municipal_district", "municipality", "joint_municipality", "county", "locality", "subregion"]),
            longitude: f.geometry.coordinates[0],
            latitude: f.geometry.coordinates[1],
            raw: f,
        }));

        res.json({ query: kota, hasil });
    } catch (error) {
        console.error(error.message);
        const status = error.response && [401, 403].includes(error.response.status) ? 401 : 500;
        res.status(status).json({
            message: status === 401 ? "API key MapTiler ditolak" : "Gagal mengambil data dari MapTiler",
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
