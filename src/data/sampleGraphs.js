/**
 * Kumpulan contoh graf untuk visualisasi Traveling Salesperson Problem (TSP).
 * Mendukung 2 jenis simpul:
 * - 'place': Gedung / Fakultas / Halte tujuan bus yang wajib dikunjungi tepat 1 kali.
 * - 'waypoint': Persimpangan / Tikungan jalan sebagai penghubung rute jalan.
 */

export const SAMPLE_GRAPHS = [
  {
    id: 'unsri-palembang',
    name: 'Unsri Bukit Besar Palembang (Jaringan Jalan)',
    description: 'Rute shuttle bus antar fakultas dan gedung di Kampus Unsri Bukit Besar melewati ruas jalan kampus.',
    isGeographic: true,
    initialCenter: [-2.9855, 104.7328],
    initialZoom: 17,
    nodes: [
      // 1. Simpul Tempat / Gedung (Wajib Dikunjungi Bus)
      { id: 'Terminal', label: 'Terminal / Gerbang Utama', type: 'place', lat: -2.9839, lng: 104.7312 },
      { id: 'FK', label: 'Fakultas Kedokteran', type: 'place', lat: -2.9848, lng: 104.7332 },
      { id: 'FH', label: 'Fakultas Hukum', type: 'place', lat: -2.9858, lng: 104.7345 },
      { id: 'Fasilkom', label: 'Fakultas Ilmu Komputer', type: 'place', lat: -2.9870, lng: 104.7338 },
      { id: 'Pascasarjana', label: 'Gedung Pascasarjana', type: 'place', lat: -2.9865, lng: 104.7318 },
      { id: 'KPA', label: 'Gedung KPA / Administrasi', type: 'place', lat: -2.9845, lng: 104.7348 },
      { id: 'Perpus', label: 'Perpustakaan Bukit', type: 'place', lat: -2.9856, lng: 104.7322 },

      // 2. Simpul Penghubung Jalan / Tikungan (Waypoints)
      { id: 'J_Gerbang', label: 'Simpang Gerbang', type: 'waypoint', lat: -2.9842, lng: 104.7318 },
      { id: 'J_Tengah', label: 'Simpang Tengah', type: 'waypoint', lat: -2.9852, lng: 104.7330 },
      { id: 'J_Selatan', label: 'Tikungan Selatan', type: 'waypoint', lat: -2.9868, lng: 104.7328 }
    ],
    edges: [
      { id: 'e1', from: 'Terminal', to: 'J_Gerbang' },
      { id: 'e2', from: 'J_Gerbang', to: 'FK' },
      { id: 'e3', from: 'J_Gerbang', to: 'Perpus' },
      { id: 'e4', from: 'FK', to: 'KPA' },
      { id: 'e5', from: 'KPA', to: 'FH' },
      { id: 'e6', from: 'FK', to: 'J_Tengah' },
      { id: 'e7', from: 'Perpus', to: 'J_Tengah' },
      { id: 'e8', from: 'J_Tengah', to: 'FH' },
      { id: 'e9', from: 'FH', to: 'Fasilkom' },
      { id: 'e10', from: 'Fasilkom', to: 'J_Selatan' },
      { id: 'e11', from: 'J_Selatan', to: 'Pascasarjana' },
      { id: 'e12', from: 'Pascasarjana', to: 'Perpus' }
    ]
  }
];
