# ARCHITECTURE.md — Arsitektur & Aturan Struktur Kode RuteKampus UNSRI

Dokumen ini mendefinisikan arsitektur direktori, pembagian modul, dan aturan modularitas kode untuk proyek **Traveling Salesperson Problem (TSP) Visualizer (RuteKampus UNSRI)**.

---

## 1. Prinsip Utama: Anti-Bloat & Modularitas

Tujuan utama dari arsitektur ini adalah **mencegah kode menumpuk di 1 file monolitik** (*no monolithic component files*). Setiap file harus memiliki tanggung jawab tunggal (*Single Responsibility Principle*), mudah dibaca, dan tidak melebihi ~150–200 baris kode jika memungkinkan.

### Aturan Baku Modularitas:
1. **Pages Sebagai Orkestrator Tipis (`src/pages/`)**:
   Halaman (`LandingPage.jsx`, `CampusVisualizerPage.jsx`, `CustomGraphPage.jsx`) hanya bertindak sebagai orkestrator yang menghubungkan state, hooks, dan menyusun subkomponen fitur. Halaman **dilarang** menumpuk ratusan baris markup visual berulang, SVG masif, atau toolbar internal di satu file.
2. **Feature-Driven Architecture (`src/components/features/`)**:
   Setiap domain fitur memiliki foldernya sendiri. Komponen yang hanya digunakan dalam satu domain diletakkan di dalam folder fitur tersebut:
   - `features/landing/`: Komponen khusus beranda (`HeroSection`, `ModeSelectionSection`, `RealWorldSection`, `GraphTheorySection`).
   - `features/campus/`: Kontrol peta kampus (`CampusHeader`, `CampusToolbar`).
   - `features/custom-graph/`: Kontrol kanvas kustom (`CustomGraphHeader`, `CustomGraphToolbar`).
   - `features/stepper/`: Panel pemutaran algoritma (`StepControls`, `ExplanationPanel`, `PseudocodePanel`, `DataPanel`).
   - `features/map/`: Wrapper Leaflet interaktif (`LeafletMapView`).
   - `features/graph/`: Kanvas graf interaktif (`InteractiveGraphCanvas`, `AbstractGraphView`).
3. **Komponen Bersama Universal (`src/components/common/`)**:
   Komponen generik yang digunakan di banyak halaman (misal: `Navbar`, `Footer`, `Card`, `Badge`, `Button`) diletakkan di `src/components/common/`.
4. **Isolasi Algoritma Murni (`src/algorithms/`)**:
   Semua file di `src/algorithms/` adalah JavaScript murni (ES Modules). **Dilarang keras** mengimpor React, Leaflet, DOM API, atau styling di direktori ini.
5. **Separasi State & State-Machine (`src/hooks/`)**:
   Logika interaksi kompleks (seperti timer stepper visualisasi `useStepPlayer` atau mutasi graf `useGraphEditor`) wajib diisolasi di `src/hooks/`.

---

## 2. Struktur Direktori Proyek

```
src/
├── algorithms/                 # Logika matematika murni (Floyd-Warshall, Nearest Neighbor, 2-Opt)
│   ├── __tests__/              # Unit test otomatis algoritma (Vitest)
│   ├── distanceMatrix.js
│   ├── geo.js
│   ├── nearestNeighbor.js
│   ├── shortestPath.js
│   ├── solveTSP.js             # Single entrypoint algoritma TSP
│   └── twoOpt.js
│
├── components/
│   ├── common/                 # Komponen reusable multi-halaman
│   │   ├── Badge.jsx           # Pill & status badge (gaya Royal Navy / Amber)
│   │   ├── Card.jsx            # Frosted navy card container
│   │   ├── Footer.jsx          # Footer aplikasi selaras tema Hero
│   │   └── Navbar.jsx          # Navigasi utama dengan branding ruteKAMPUS
│   │
│   └── features/               # Komponen terbagi berdasarkan domain fitur
│       ├── landing/            # Bagian-bagian modular Halaman Beranda
│       │   ├── HeroSection.jsx           # Hero: langit, awan berarak marquee, responsive campus, CTA+text
│       │   ├── ModeSelectionSection.jsx  # Kartu pilihan Peta Kampus vs Graf Sendiri
│       │   ├── RealWorldSection.jsx      # Relevansi dunia nyata shuttle bus kampus
│       │   └── GraphTheorySection.jsx    # Landasan teori graf & siklus Hamilton
│       │
│       ├── campus/             # Komponen simulasi Peta Kampus Unsri
│       │   ├── CampusHeader.jsx          # Header informasi, stats, pemilih halte awal, izin edit
│       │   └── CampusToolbar.jsx         # Toolbar aksi edit (gedung, waypoint, sambung jalan, geser, hapus)
│       │
│       ├── custom-graph/       # Komponen simulasi Bikin Graf Sendiri
│       │   ├── CustomGraphHeader.jsx     # Header custom graph, preset segitiga/persegi/k5, simpul awal
│       │   └── CustomGraphToolbar.jsx    # Toolbar alat kanvas (tambah, sambung, drag, hapus)
│       │
│       ├── stepper/            # Panel kontrol & edukasi algoritma TSP
│       │   ├── StepControls.jsx          # Kontrol Play/Pause/Step/Speed
│       │   ├── ExplanationPanel.jsx      # Penjelasan konsep matematis per langkah
│       │   ├── PseudocodePanel.jsx       # Sinkronisasi baris pseudocode
│       │   └── DataPanel.jsx             # Matriks jarak, kandidat greedy, swap 2-Opt
│       │
│       ├── map/                # Pemetaan geografis Leaflet
│       │   └── LeafletMapView.jsx        # Peta OpenStreetMap kampus Unsri Bukit Besar
│       │
│       └── graph/              # Visualisasi kanvas graf abstrak
│           ├── InteractiveGraphCanvas.jsx# Kanvas SVG interaktif (drag-and-drop simpul & sisi)
│           └── AbstractGraphView.jsx     # Penampil graf abstrak statis
│
├── pages/                      # Halaman utama aplikasi (orchestrator)
│   ├── LandingPage.jsx         # Route: /
│   ├── CampusVisualizerPage.jsx# Route: /campus
│   └── CustomGraphPage.jsx     # Route: /custom
│
├── hooks/                      # Custom React Hooks
│   ├── useStepPlayer.js        # State machine pemutar langkah algoritma
│   └── useGraphEditor.js       # State pengelola simpul, sisi, dan koordinat
│
├── data/                       # Data statis & konfigurasi
│   ├── config.js               # Sakelar fitur (misal: APP_CONFIG.ALLOW_CAMPUS_EDIT)
│   ├── content.js              # Teks edukasi, deskripsi langkah, dan pseudocode
│   └── sampleGraphs.js         # Preset koordinat GPS Unsri Palembang & preset graf
│
├── lib/                        # Helper fungsi umum
├── styles/                     # Aset styling tambahan jika diperlukan
├── App.jsx                     # Root router, inisialisasi Lenis scroll, ScrollToTop
├── main.jsx                    # Entry point React DOM
└── index.css                   # Tailwind v4, Leaflet CSS, Lenis CSS, & font
```

---

## 3. Panduan untuk Developer & AI Agent

Ketika menambahkan fitur baru atau memperluas antarmuka:
- **Jangan tambahkan kode langsung ke file halaman jika panjangnya > 50 baris baru**: Ekstraksi menjadi komponen baru di dalam subfolder `src/components/features/<fitur>/`.
- **Gunakan komponen dari `src/components/common/`** untuk elemen yang bersifat umum seperti tombol, kartu, badge, atau modal.
- **Periksa `TECH_STACK.md`** jika ada penambahan dependensi baru.
- **Jalankan `npm test` dan `npm run build`** untuk memverifikasi bahwa pemisahan komponen tidak merusak alur kompilasi dan unit test invariant algoritma TSP.
