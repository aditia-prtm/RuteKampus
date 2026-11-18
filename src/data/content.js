/**
 * Teks statis, pseudocode, dan deskripsi edukatif untuk Traveling Salesperson Problem (TSP).
 * Studi Kasus: Rute Shuttle Bus Kampus Unsri Bukit Besar Palembang.
 */

export const APP_INFO = {
  title: 'TourKampus UNSRI',
  subtitle: 'Visualisasi & Optimasi Rute Kampus Unsri (Struktur Diskrit 2)',
  description:
    'Menemukan rute tertutup terpendek (Siklus Hamilton) yang mengunjungi setiap fakultas/gedung kampus tepat satu kali dan kembali ke titik awal dengan jarak minimum.',
  assumptions: [
    'Rute bersifat simetris (jarak A ke B sama dengan B ke A).',
    'Jarak antar gedung dihitung otomatis menggunakan formula Haversine (meter) berdasarkan koordinat GPS.',
    'Setiap gedung/fakultas wajib dikunjungi tepat satu kali sebelum kembali ke titik asal (Siklus Hamilton).',
    'Perjalanan berangkat dan berakhir pada lokasi/gedung yang sama (closed tour).'
  ],
  realWorldExamples: [
    {
      title: 'Shuttle Bus Kampus Unsri',
      desc: 'Mengantar mahasiswa dari gerbang utama mengelilingi seluruh fakultas (FK, FH, Fasilkom, dll.) dengan rute terpendek.'
    },
    {
      title: 'Logistik & Distribusi Paket',
      desc: 'Kurir mengantarkan dokumen dan paket ke beberapa fakultas tanpa mendatangi lokasi yang sama dua kali.'
    },
    {
      title: 'Rute Inspeksi Gedung & Lab',
      desc: 'Petugas keamanan atau teknisi memeriksa sarana di setiap fasilitas kampus dengan urutan paling hemat waktu.'
    }
  ]
};

export const PSEUDOCODE = [
  { line: 1, text: 'function solveTSP(locations, startNode):' },
  { line: 2, text: '  distMatrix = computeDistanceMatrix(locations)' },
  { line: 3, text: '  // Tahap 1: Konstruksi Rute Awal (Greedy / Nearest Neighbor)' },
  { line: 4, text: '  current = startNode; tour = [startNode]' },
  { line: 5, text: '  while unvisited locations exist:' },
  { line: 6, text: '    next = nearestUnvisited(current, distMatrix)' },
  { line: 7, text: '    tour.append(next); current = next' },
  { line: 8, text: '  tour.append(startNode) // Kembali ke titik awal' },
  { line: 9, text: '  // Tahap 2: Optimasi Lokal (2-Opt Edge Swap)' },
  { line: 10, text: '  while edges cross and swap improves distance:' },
  { line: 11, text: '    tour = swapEdges(tour) // Memperpendek rute' },
  { line: 12, text: '  return tour, totalDistance' }
];

export const STEP_EXPLANATIONS = {
  matrix: {
    badge: 'Langkah 1: Matriks Jarak',
    concept: 'Representasi Graf Berbobot Lengkap',
    detail: 'Menghitung matriks jarak berpasangan antar seluruh fakultas dan gedung di Kampus Unsri Palembang.'
  },
  'nn-start': {
    badge: 'Langkah 2: Titik Awal',
    concept: 'Inisialisasi Siklus Hamilton',
    detail: 'Menentukan lokasi keberangkatan awal rute tur kampus.'
  },
  'nn-step': {
    badge: 'Langkah 3: Heuristik Greedy',
    concept: 'Pemilihan Lokasi Terdekat (Nearest Neighbor)',
    detail: 'Algoritma selalu memilih fakultas terdekat berikutnya yang belum pernah dikunjungi untuk meminimalkan jarak lokal.'
  },
  'nn-complete': {
    badge: 'Langkah 4: Rute Awal',
    concept: 'Siklus Hamilton Terbentuk',
    detail: 'Seluruh fakultas telah dikunjungi, rute kembali ke titik awal untuk melengkapi putaran.'
  },
  'two-opt-step': {
    badge: 'Langkah 5: Optimasi 2-Opt',
    concept: 'Penyempurnaan Lokal (Untangling Edges)',
    detail: 'Memotong dua sisi yang saling bersilangan dan menyambungkannya kembali secara paralel untuk memangkas jarak tempuh.'
  },
  result: {
    badge: 'Langkah 6: Hasil Optimal',
    concept: 'Siklus Hamilton Terpendek (TSP)',
    detail: 'Rute optimal final tur kampus beserta total jarak dan penghematan jarak dari optimasi.'
  }
};
