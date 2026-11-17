# Struktur Direktori — Traveling Salesperson Problem (TSP) Visualizer

```
chinese-postman/ (TSP Visualizer)
├── TECH_STACK.md           # Dokumentasi teknologi, dependensi, dan lokasi penggunaannya
├── public/                 # Aset statis yang disajikan apa adanya
└── src/
    ├── algorithms/         # Logika algoritma TSP dalam JavaScript murni (tanpa React/Leaflet)
    │   └── __tests__/      # Unit test algoritma (Vitest)
    ├── components/         # Komponen UI (hanya menampilkan data)
    │   ├── layout/         # Kerangka halaman: navbar, footer, wrapper
    │   ├── map/            # Tampilan peta Leaflet: node fakultas, rute bus kampus, editor titik interaktif
    │   ├── graph/          # Tampilan graf abstrak (mode non-peta)
    │   ├── stepper/        # Kontrol langkah (play/pause/next/prev), penjelasan, pseudocode, data panel
    │   └── ui/             # Elemen dasar antarmuka
    ├── pages/              # Halaman: LandingPage.jsx (/), VisualizerPage.jsx (/visualizer)
    ├── hooks/              # Custom hook: useStepPlayer.js, useGraphEditor.js
    ├── data/               # Data statis: graf contoh (Unsri Bukit Palembang) dan teks penjelasan
    ├── lib/                # Fungsi bantu umum (format angka, dll.)
    └── styles/             # CSS global, Leaflet CSS, dan Tailwind
```
