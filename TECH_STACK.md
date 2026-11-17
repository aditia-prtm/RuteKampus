# TECH_STACK.md — Dokumentasi Teknologi & Penggunaannya

Dokumen ini mencatat seluruh teknologi, pustaka (*library*), alat bantu (*tools*), dan framework yang digunakan dalam proyek **Traveling Salesperson Problem (TSP) Visualizer**, beserta lokasi dan fungsinya.

> ⚠️ **Aturan untuk Agent AI & Pengembang:**
> Setiap kali ada penambahan dependensi baru, perubahan pustaka, atau modul baru yang mengadopsi teknologi tertentu, dokumen ini **WAJIB diperbarui** agar tetap sinkron dengan `package.json` dan arsitektur kode terkini.

---

## 1. Daftar Komprehensif Teknologi

| Teknologi / Pustaka | Versi | Kategori | Lokasi Penggunaan Utama | Fungsi & Tujuan |
|---|---|---|---|---|
| **Vite** | `^8.3.x` | Build Tool & Dev Server | `vite.config.js`, `package.json` | Bundler super cepat untuk pengembangan lokal (*Hot Module Replacement*) dan kompilasi produksi (`npm run build`). |
| **React** | `^19.3.x` | UI Framework | `src/` (seluruh komponen `.jsx`) | Membangun antarmuka berbasis komponen deklaratif, manajemen state reaktif, dan rendering visual. |
| **react-router-dom** | `^7.x` | Client-Side Routing | `src/App.jsx`, `src/components/layout/Navbar.jsx`, `src/pages/LandingPage.jsx` | Navigasi SPA antar halaman tanpa reload (`/` untuk Beranda, `/campus` untuk Peta Kampus, `/custom` untuk Graf Sendiri). |
| **Tailwind CSS v4** | `^4.3.x` | Styling / CSS Engine | `src/index.css`, `vite.config.js` | Utility-first CSS untuk penataan layout, tema gelap (*dark theme*), efek glow, badge, tabel, dan responsivitas layar. |
| **Leaflet** | `^1.9.x` | Map Engine Core | `src/components/map/LeafletMapView.jsx`, `src/index.css` | Engine pemetaan interaktif, perhitungan koordinat, dragging marker, dan integrasi OpenStreetMap. |
| **react-leaflet** | `^5.0.x` | React Leaflet Wrapper | `src/components/map/LeafletMapView.jsx` | Komponen React untuk peta (`MapContainer`, `TileLayer`, `Marker`, `Polyline`, `Popup`, `Tooltip`, `useMapEvents`). |
| **Lucide React** | `^1.73.x` | Icon Pack | `src/components/`, `src/pages/` | Ikon visual SVG yang konsisten dan ringan (Play, Pause, Step, Flag, MapPin, Building, Trash, Move, Link, dll.). |
| **Framer Motion** | `^14.14.x` | Motion / Animasi | `src/pages/LandingPage.jsx`, `src/components/` | Menangani animasi transisi UI serta animasi rombongan awan yang bergerak mulus ke kanan tanpa henti (*infinite seamless marquee*) pada hero section. |
| **Vitest** | `^5.1.x` | Unit Testing Framework | `src/algorithms/__tests__/tsp.test.js`, `package.json` | Menjalankan unit test otomatis untuk memvalidasi invariant matematika algoritma TSP secara independen dari UI. |
| **Google Fonts (Poppins & Playfair Display)** | Web CDN | Tipografi & Web Font | `index.html`, `src/index.css` | Menyediakan font modern **Poppins** untuk tampilan UI/teks sans-serif utama dan **Playfair Display (Serif Italic)** untuk aksen tipografi hero section. |
| **JavaScript Murni (ES Modules)** | ES2022+ | Algoritma & Logika | `src/algorithms/` (`geo.js`, `distanceMatrix.js`, `nearestNeighbor.js`, `twoOpt.js`, `solveTSP.js`) | Logika matematika murni (rumus Haversine, Floyd-Warshall, Heuristik Greedy, 2-Opt) tanpa dependensi React/browser. |
| **SVG Interaktif (Native HTML5)** | Native | Canvas Rendering Graf | `src/components/graph/InteractiveGraphCanvas.jsx` | Kanvas graf kustom dengan sistem koordinat viewBox, event drag-and-drop simpul, dan rendering garis sisi berbobot. |
| **OpenStreetMap (OSM)** | Tile Service | Peta Eksternal | `LeafletMapView.jsx` | Penyedia ubin peta gratis untuk menampilkan topografi dan jalanan Kampus Unsri Bukit Besar Palembang. |

---

## 2. Pemetaan Teknologi Berdasarkan Folder & Modul

### A. `src/algorithms/` (Logika Murni Algoritma)
* **Teknologi:** JavaScript Murni (ES Modules) — **Bebas dari React & Leaflet**.
* **File & Peran:**
  * `geo.js`: Rumus *Haversine* untuk menghitung jarak GPS lingkaran besar (meter/km).
  * `distanceMatrix.js`: Membangun matriks jarak jaringan jalan (*Road Network Shortest Path*) menggunakan *Floyd-Warshall* dan mendukung simpul perantara (*waypoints*).
  * `nearestNeighbor.js`: Algoritma Greedy untuk menyusun Siklus Hamilton awal langkah demi langkah.
  * `twoOpt.js`: Algoritma optimasi lokal 2-Opt untuk mengurai sisi persilangan dan memangkas jarak rute.
  * `solveTSP.js`: Orkestrator tunggal yang menghasilkan objek `steps` (untuk playback stepper) dan `result`.
  * `__tests__/tsp.test.js`: Pengujian unit dengan **Vitest** untuk menjamin kebenaran invariant Siklus Hamilton.

### B. `src/components/map/` (Visualisasi Peta Nyata)
* **Teknologi:** `Leaflet`, `react-leaflet`, `OpenStreetMap`.
* **File & Peran:**
  * `LeafletMapView.jsx`:
    * Render ubin peta OpenStreetMap di Kampus Unsri Palembang.
    * Menampilkan gedung (`type: place`) dan tikungan (`type: waypoint`).
    * Implementasi `L.divIcon` pada `Marker` dengan properti `draggable={isEditing}` untuk fitur geser simpul di peta.
    * `Polyline` untuk menggambar ruas jalan dan rute bus kampus.
    * `useMapEvents` untuk menangani klik penambahan gedung/tikungan baru.

### C. `src/components/graph/` (Visualisasi Graf Kustom)
* **Teknologi:** SVG Interaktif, Tailwind CSS.
* **File & Peran:**
  * `InteractiveGraphCanvas.jsx`: Kanvas interaktif berbasis SVG untuk mode bikin graf sendiri. Mendukung drag-and-drop simpul, penarikan sisi berbobot, pengeditan bobot sisi, dan visualisasi rute Siklus Hamilton.
  * `AbstractGraphView.jsx`: Renderer graf abstrak statis.

### D. `src/components/stepper/` (Kontrol Langkah & Analisis)
* **Teknologi:** React Hooks, Lucide Icons, Tailwind CSS.
* **File & Peran:**
  * `StepControls.jsx`: Progress bar, tombol Play, Pause, Step Next/Prev, Restart, dan pengatur kecepatan (*speed*).
  * `ExplanationPanel.jsx`: Kartu penjelasan konsep matematis langkah aktif dalam Bahasa Indonesia.
  * `DataPanel.jsx`: Tabel dinamis (matriks jarak, kandidat halte terdekat, detail pemotongan 2-Opt, urutan akhir rute bus).
  * `PseudocodePanel.jsx`: Penyorotan baris pseudocode algoritma TSP yang sinkron dengan langkah aktif.

### E. `src/pages/` & `src/components/layout/` (Routing & Navigasi)
* **Teknologi:** `react-router-dom`, Tailwind CSS.
* **File & Peran:**
  * `App.jsx`: Root router yang memetakan rute `/`, `/campus`, dan `/custom`.
  * `Navbar.jsx`: Header navigasi responsif dengan highlight rute aktif.
  * `LandingPage.jsx`: Halaman beranda dengan 2 kartu pilihan mode utama (Peta Kampus vs Graf Sendiri) dan teori graf.
  * `CampusVisualizerPage.jsx`: Halaman simulasi Peta Kampus Unsri dengan sakelar izin edit (`APP_CONFIG.ALLOW_CAMPUS_EDIT`).
  * `CustomGraphPage.jsx`: Halaman simulasi Bikin Graf Sendiri dengan preset segitiga, persegi, pentagon K5, dan alat sambung sisi berbobot.

### F. `src/hooks/` (State & Interaksi Reaktif)
* **Teknologi:** React Native Hooks (`useState`, `useEffect`, `useCallback`, `useMemo`, `useRef`).
* **File & Peran:**
  * `useStepPlayer.js`: State machine pengendali pemutaran visualisasi (interval timer, play, pause, next, prev, speed).
  * `useGraphEditor.js`: Pengelola state mutasi simpul dan sisi (tambah simpul, geser koordinat `updateNodePosition`, tambah sisi, hapus simpul/sisi, ekspor JSON).

---

## 3. Panduan Pembaruan Masa Depan (Untuk Developer & Agent AI)

Jika Anda menambahkan fitur baru yang menggunakan pustaka atau teknologi baru:
1. Catat nama paket dan versi persisnya dari `package.json`.
2. Tambahkan baris baru pada tabel **1. Daftar Komprehensif Teknologi**.
3. Jelaskan file dan fungsi modul baru tersebut pada bagian **2. Pemetaan Teknologi Berdasarkan Folder & Modul**.
4. Pastikan `npm run build` dan `npm test` tetap berjalan tanpa error setelah teknologi baru ditambahkan.
