# 🗺️ Traveling Salesperson Problem (TSP) Visualizer

Aplikasi web interaktif untuk memvisualisasikan penyelesaian **Traveling Salesperson Problem (TSP)** dan pembentukan **Sirkuit Hamilton** langkah-demi-langkah menggunakan **Algoritma Heuristik Greedy (*Nearest Neighbor*)**.

Proyek ini dibangun sebagai **Proyek Akhir Mata Kuliah Struktur Diskrit II**, Program Studi Teknik Informatika, Fakultas Ilmu Komputer, **Universitas Sriwijaya**.

---

## 📌 Studi Kasus & Latar Belakang

- **Studi Kasus Riil**: Rute optimal **Tur Keliling Kampus Universitas Sriwijaya (Unsri) Bukit Besar Palembang**.
- **Skenario**: Perjalanan dimulai dari **Gerbang Utama Kampus**, mengunjungi seluruh 12 fasilitas/gedung fakultas kampus tepat satu kali, dan kembali ke Gerbang Utama dengan total jarak seminimal mungkin tanpa memotong gedung/lahan kosong (mematuhi lintasan jalan fisik aspal nyata sepanjang **2,62 km**).
- **Mode Graf Bebas (*Custom Graph Sandbox*)**: Kanvas graf interaktif untuk merancang simpul, menghubungkan sisi berbobot, dan menguji teori matematika diskrit (Teorema Dirac, Teorema Ore, Graf Lengkap $K_n$, dan syarat derajat $\deg(v) \ge 2$).

---

## ✨ Fitur Utama

### 1. 🏫 Mode Kampus Unsri (*Real Map Visualizer*)
- **Peta Interaktif Geospasial**: Menggunakan ubin OpenStreetMap dan pustaka Leaflet.
- **Geometri Jalan Nyata**: Memodelkan 12 simpul fasilitas (*places*), 18 simpul tikungan/persimpangan (*waypoints*), dan 36 ruas jalan fisik (*edges*).
- **Matriks Jarak Presisi**: Mengintegrasikan formula geodesik **Haversine** dan algoritma **Floyd-Warshall** untuk kalkulasi jarak terpendek antarfakultas.
- **Visualisasi Belokan Nyata**: Garis tur hijau meliuk mengikuti kontur aspal kampus nyata, bukan garis lurus sembarangan yang menabrak gedung.

### 2. 🎨 Mode Graf Bebas (*Custom Graph Sandbox*)
- **Interaksi Kanvas Intuitif**:
  - Klik area kosong untuk membuat simpul baru.
  - Klik simpul untuk membuka popover aksi: hubungkan sisi atau hapus simpul.
  - Klik garis sisi (*edge*) untuk mengubah bobot numerik secara langsung.
  - Geser (*drag and drop*) simpul kapan saja secara bebas.
- **Anti-Tumpuk Badge**: Label bobot sisi dirender di lapisan paling atas (*top layer*) sehingga tidak tertutup garis berwarna saat rute tur menyala.

### 3. 🧠 Logika Algoritma Murni & Validasi Teoretis
- **Pemisahan Logika (*Pure JavaScript*)**: Modul `src/algorithms/solveTSP.js` tidak bergantung pada React maupun Leaflet, sehingga dapat diuji secara mandiri (*unit testing*).
- **Validasi Ketat Graf Hamilton**:
  - Menolak graf dengan simpul daun / berderajat rendah ($\deg(v) < 2$) karena mustahil membentuk siklus tertutup sederhana.
  - Menolak graf tidak terhubung (*disconnected graph*).
  - Menolak graf dengan $n < 3$ simpul.
- **Pencatatan Langkah (*Step-by-Step Logging*)**:
  - Menyajikan log detail setiap langkah penelusuran: simpul asal, simpul terpilih, bobot langkah, dan jarak kumulatif.
  - Menampilkan posisi aktif saat ini dengan sorotan warna ungu dan simpul awal dengan warna emas/amber.
  - Membedakan langkah penutupan sirkuit (*Step n-1*) dengan hasil akhir (*Step n*).

### 4. ⏯️ Kontrol Pemutar Langkah (*Step Player*)
- Tombol navigasi intuitif diletakkan tepat di bawah kanvas:
  - **Play / Pause**: Otomatisasi penelusuran rute.
  - **Prev / Next Step**: Melangkah manual satu per satu.
  - **Speed Slider**: Pengaturan kecepatan animasi pemutaran.

---

## 🛠️ Teknologi yang Digunakan

| Kategori | Teknologi / Pustaka | Keterangan |
| :--- | :--- | :--- |
| **Framework & Runtime** | [React 19](https://react.dev/) + [Vite 6](https://vite.dev/) | Ekosistem frontend modern berbasis komponen |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Utilitas styling responsif dan antarmuka modern |
| **Animasi** | [Framer Motion](https://www.framer.com/motion/) | Transisi halus panel data, badge, dan modal |
| **Peta Digital** | [Leaflet](https://leafletjs.com/) + [React-Leaflet](https://react-leaflet.js.org/) | Rendering peta interaktif OpenStreetMap |
| **Ikonografi** | [Lucide React](https://lucide.dev/) | Kumpulan ikon UI minimalis dan bersih |
| **Pengujian Unit** | [Vitest](https://vitest.dev/) | Unit testing logika algoritma (6/6 passed) |

---

## 📂 Struktur Direktori

```text
chinese-postman/
├── public/                     # Aset statis (favicon, foto anggota, logo)
├── src/
│   ├── algorithms/             # Logika matematika murni (Pure JS - Bebas UI)
│   │   ├── solveTSP.js         # Algoritma Nearest Neighbor, Floyd-Warshall & Validasi
│   │   └── __tests__/          # Berkas unit test Vitest (tsp.test.js)
│   ├── components/             # Komponen visual antarmuka (UI)
│   │   ├── common/             # Komponen reusable (Card, Button, Footer, Toast)
│   │   └── features/           # Komponen spesifik fitur
│   │       ├── campus/         # Peta kampus Leaflet & panel inspeksi rute
│   │       ├── custom-graph/   # Kanvas interaktif SVG mode graf kustom
│   │       ├── landing/        # Hero section, panduan teori, & daftar tim
│   │       └── stepper/        # Kontrol pemutar langkah (Play, Prev, Next, Speed)
│   ├── data/                   # Data spasial & teks statis
│   │   ├── sampleGraphs.js     # Koordinat 12 lokasi kampus, 18 waypoint, & 36 ruas jalan
│   │   └── content.js          # Ringkasan materi teori graf & panduan
│   ├── hooks/                  # Kustom React Hooks
│   │   ├── useStepPlayer.js    # Logika pengontrol playback animasi langkah
│   │   └── useGraphEditor.js   # Logika manipulasi graf kustom
│   ├── lib/                    # Fungsi utilitas (rumus Haversine, pemformatan angka)
│   ├── pages/                  # Halaman aplikasi (LandingPage, CampusVisualizerPage, CustomGraphPage)
│   ├── App.jsx                 # Routing halaman (react-router-dom)
│   └── main.jsx                # Entry point React
├── scripts/                    # Skrip otomasi pembuat laporan (.docx)
├── package.json
└── vite.config.js
```

---

## 🚀 Memulai Proyek (*Getting Started*)

### Prasyarat
- **Node.js** versi 20 atau lebih baru.
- **npm** atau package manager kompatibel lainnya.

### 1. Klon Repositori & Masuk ke Direktori
```bash
git clone https://github.com/aditia-prtm/TourKampus.git
cd TourKampus
```

### 2. Pasang Dependensi
```bash
npm install
```

### 3. Jalankan Server Pengembangan (*Development Server*)
```bash
npm run dev
```
Buka peramban di tautan lokal yang ditampilkan (biasanya `http://localhost:5173/`).

### 4. Menjalankan Pengujian Unit (*Unit Testing*)
Untuk memverifikasi keabsahan logika algoritma TSP:
```bash
npm run test
```

### 5. Membangun Proyek untuk Produksi (*Production Build*)
```bash
npm run build
```

---

## 👥 Tim Pengembang (Kelompok 3)

Proyek ini disusun oleh mahasiswa Program Studi **Teknik Informatika**, Fakultas Ilmu Komputer, **Universitas Sriwijaya**:

| Nama | NIM | 
| :--- | :---: |
| **Rafa Rasyad Anfero** | `09021282530057` | 
| **Sabil Alaudin** | `09021282530121` | 
| **Muhammad Syehan Fahrezi Prashya** | `09021282530051` | 
| **M. Aditia Putra Pratama** | `09021282530045` | 

---

## 📚 Referensi Akademis

1. **Munir, R.** (2016). *Matematika Diskrit (Revisi Keenam)*. Bandung: Penerbit Informatika.
2. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms (4th ed.)*. Cambridge, MA: MIT Press.
3. **Rosen, K. H.** (2019). *Discrete Mathematics and Its Applications (8th ed.)*. New York: McGraw-Hill Education.
4. **Dirac, G. A.** (1952). *Some theorems on abstract graphs*. Proceedings of the London Mathematical Society.
5. **Ore, O.** (1960). *Note on Hamilton circuits*. The American Mathematical Monthly.
6. **Sinnott, R. W.** (1984). *Virtues of the Haversine*. Sky and Telescope.
