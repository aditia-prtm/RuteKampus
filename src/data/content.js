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
  { line: 1, text: 'function solveTSP_NearestNeighbor(locations, startNode):' },
  { line: 2, text: '  distMatrix = computeDistanceMatrix(locations)' },
  { line: 3, text: '  current = startNode; tour = [startNode]' },
  { line: 4, text: '  while unvisited locations exist:' },
  { line: 5, text: '    next = nearestUnvisited(current, distMatrix)' },
  { line: 6, text: '    tour.append(next); current = next' },
  { line: 7, text: '  tour.append(startNode) // Kembali ke titik awal' },
  { line: 8, text: '  return tour, totalDistance' }
];

export const PSEUDOCODE_BRUTE_FORCE = [
  { line: 1, text: 'function solveTSP_BruteForce(graph, startNode):' },
  { line: 2, text: '  cycles = findHamiltonianCyclesOnGraph(graph, startNode)' },
  { line: 3, text: '  minDistance = Infinity; bestTour = null' },
  { line: 4, text: '  for each cycle in cycles:' },
  { line: 5, text: '    currentDist = calculateCycleDistance(cycle)' },
  { line: 6, text: '    if currentDist < minDistance:' },
  { line: 7, text: '      minDistance = currentDist; bestTour = cycle' },
  { line: 8, text: '  return bestTour, minDistance // 100% Minimum Optimal' }
];

export const STEP_EXPLANATIONS = {
  matrix: {
    badge: 'Langkah 1: Matriks Sisi Graf',
    concept: 'Matriks Ketetanggaan Sisi Berbobot',
    detail: 'Menampilkan bobot jarak untuk setiap pasangan simpul yang terhubung langsung oleh sisi jalan pada graf.'
  },
  'nn-start': {
    badge: 'Langkah 2: Titik Awal',
    concept: 'Inisialisasi Siklus Hamilton',
    detail: 'Menentukan lokasi keberangkatan awal rute tur kampus.'
  },
  'nn-step': {
    badge: 'Langkah 3: Heuristik Greedy',
    concept: 'Pemilihan Sisi Terdekat (Nearest Neighbor)',
    detail: 'Algoritma memilih simpul tetangga terdekat berikutnya yang terhubung langsung oleh sisi jalan dan belum dikunjungi.'
  },
  'nn-complete': {
    badge: 'Langkah 4: Rute Awal',
    concept: 'Siklus Hamilton Terbentuk',
    detail: 'Seluruh fakultas telah dikunjungi, rute kembali ke titik awal lewat sisi langsung untuk melengkapi putaran.'
  },
  'two-opt-step': {
    badge: 'Langkah 5: Optimasi 2-Opt',
    concept: 'Penyempurnaan Lokal (Untangling Edges)',
    detail: 'Memotong dua sisi yang saling bersilangan dan menyambungkannya kembali secara paralel untuk memangkas jarak tempuh.'
  },
  'bf-summary': {
    badge: 'Brute Force: Penemuan Siklus',
    concept: 'Penelusuran Sisi Graf (Backtracking / DFS)',
    detail: 'Menelusuri seluruh jalur sisi yang ada di graf untuk menemukan seluruh Siklus Hamilton nyata yang valid.'
  },
  'bf-cycle': {
    badge: 'Brute Force: Uji Rute',
    concept: 'Evaluasi Bobot Jarak & Pembaruan Rekor',
    detail: 'Menguji setiap rute siklus yang ditemukan dan melacak rute dengan bobot jarak paling minimum.'
  },
  result: {
    badge: 'Langkah Terakhir: Hasil Optimal',
    concept: 'Siklus Hamilton Terpendek (TSP)',
    detail: 'Rute optimal final tur kampus beserta total jarak minimum yang berhasil ditemukan.'
  }
};
