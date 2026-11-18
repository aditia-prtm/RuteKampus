/**
 * Kumpulan contoh graf untuk visualisasi Traveling Salesperson Problem (TSP).
 * Graf Kampus Unsri Bukit Besar Palembang dengan 7 simpul fakultas/gedung
 * dan 12 ruas jalan kampus yang saling terhubung membentuk Siklus Hamilton nyata.
 */

export const SAMPLE_GRAPHS = [
  {
    id: 'unsri-palembang',
    name: 'Unsri Bukit Besar Palembang (Jaringan Jalan Kampus)',
    description: 'Rute tur keliling antar fakultas dan gedung di Kampus Unsri Bukit Besar melewati ruas-ruas jalan kampus yang saling terhubung.',
    isGeographic: true,
    initialCenter: [-2.9855, 104.7328],
    initialZoom: 17,
    nodes: [
      { id: 'Terminal', label: 'Terminal / Gerbang Utama', lat: -2.9839, lng: 104.7312 },
      { id: 'FK', label: 'Fakultas Kedokteran', lat: -2.9848, lng: 104.7332 },
      { id: 'KPA', label: 'Gedung KPA / Administrasi', lat: -2.9845, lng: 104.7348 },
      { id: 'FH', label: 'Fakultas Hukum', lat: -2.9858, lng: 104.7345 },
      { id: 'Fasilkom', label: 'Fakultas Ilmu Komputer', lat: -2.9870, lng: 104.7338 },
      { id: 'Pascasarjana', label: 'Gedung Pascasarjana', lat: -2.9865, lng: 104.7318 },
      { id: 'Perpus', label: 'Perpustakaan Bukit', lat: -2.9856, lng: 104.7322 }
    ],
    edges: [
      { id: 'e1', from: 'Terminal', to: 'FK' },
      { id: 'e2', from: 'Terminal', to: 'Perpus' },
      { id: 'e3', from: 'Terminal', to: 'KPA' },
      { id: 'e4', from: 'FK', to: 'KPA' },
      { id: 'e5', from: 'KPA', to: 'FH' },
      { id: 'e6', from: 'FK', to: 'FH' },
      { id: 'e7', from: 'FH', to: 'Fasilkom' },
      { id: 'e8', from: 'Fasilkom', to: 'Pascasarjana' },
      { id: 'e9', from: 'Pascasarjana', to: 'Perpus' },
      { id: 'e10', from: 'Perpus', to: 'FK' },
      { id: 'e11', from: 'Pascasarjana', to: 'FH' },
      { id: 'e12', from: 'Perpus', to: 'Fasilkom' }
    ]
  }
];
