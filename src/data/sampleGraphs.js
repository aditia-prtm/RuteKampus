/**
 * Kumpulan contoh graf untuk visualisasi Traveling Salesperson Problem (TSP).
 * Graf Kampus Unsri Bukit Besar Palembang dengan 10 gedung/fasilitas kampus (places)
 * dan 16 simpang/tikungan jalan (waypoints) yang disinkronkan persis dengan denah jalan kampus.
 */

export const SAMPLE_GRAPHS = [
  {
    id: 'unsri-palembang',
    name: 'Unsri Bukit Besar Palembang (Jaringan Jalan Kampus)',
    description: 'Rute tur keliling antar fakultas dan gedung di Kampus Unsri Bukit Besar melewati ruas-ruas jalan kampus nyata dan tikungan persimpangan jalan.',
    isGeographic: true,
    initialCenter: [-2.9855, 104.7328],
    initialZoom: 17,
    nodes: [
      // ==========================================
      // 1. FASILITAS & GEDUNG KAMPUS (PLACES)
      // ==========================================
      { id: 'Gerbang', label: 'Gerbang Utama', type: 'place', lat: -2.98698, lng: 104.73181 },
      { id: 'Gedung_1', label: 'POLSRI', type: 'place', lat: -2.98331, lng: 104.73297 }, // Ujung Utara (Akses Simpang 1)
      { id: 'Gedung_2', label: 'FH', type: 'place', lat: -2.98392, lng: 104.73312 }, // Utara Tengah (Akses Simpang 4)
      { id: 'Gedung_3', label: 'FK', type: 'place', lat: -2.98398, lng: 104.73205 }, // Barat Laut (Akses Simpang 3)
      { id: 'Gedung_4', label: 'FE', type: 'place', lat: -2.98457, lng: 104.73230 }, // Barat Atas (Akses Simpang 6)
      { id: 'Gedung_5', label: 'FASILKOM', type: 'place', lat: -2.98485, lng: 104.73220 }, // Barat Tengah (Akses Simpang 9)
      { id: 'Gedung_6', label: 'FT', type: 'place', lat: -2.98470, lng: 104.73395 }, // Sayap Timur / FT (Akses Simpang 7)
      { id: 'Gedung_7', label: 'Gedung KPA', type: 'place', lat: -2.98515, lng: 104.73227 }, // Barat Bawah (Akses Simpang 10)
      { id: 'Gedung_8', label: 'FISIP', type: 'place', lat: -2.98544, lng: 104.73346 }, // Tengah Timur (Akses Simpang 11)
      { id: 'Gedung_9', label: 'Graha', type: 'place', lat: -2.98608, lng: 104.73341 }, // Selatan Lapangan (Akses Simpang 13)
      { id: 'Gedung_10', label: 'Masjid Al-Ghazali', type: 'place', lat: -2.98829, lng: 104.73346 }, // Ujung Selatan (Akses Simpang 16)

      // ==========================================
      // 2. SIMPANG & TIKUNGAN JALAN (WAYPOINTS)
      // ==========================================
      { id: 'W_1', label: 'Tikungan 1', type: 'waypoint', lat: -2.98354, lng: 104.73278 },
      { id: 'W_2', label: 'Simpang 2', type: 'waypoint', lat: -2.98421, lng: 104.73273 },
      { id: 'W_3', label: 'Tikungan 3', type: 'waypoint', lat: -2.98421, lng: 104.73210 },
      { id: 'W_4', label: 'Simpang 4', type: 'waypoint', lat: -2.98422, lng: 104.73310 },
      { id: 'W_5', label: 'Tikungan 5', type: 'waypoint', lat: -2.98427, lng: 104.73376 },
      { id: 'W_6', label: 'Simpang 6', type: 'waypoint', lat: -2.98470, lng: 104.73203 },
      { id: 'W_7', label: 'Simpang 7', type: 'waypoint', lat: -2.98449, lng: 104.73379 },
      { id: 'W_8', label: 'Simpang 8', type: 'waypoint', lat: -2.98480, lng: 104.73264 },
      { id: 'W_9', label: 'Tikungan 9', type: 'waypoint', lat: -2.98517, lng: 104.73187 },
      { id: 'W_10', label: 'Tikungan 10', type: 'waypoint', lat: -2.98610, lng: 104.73187 },
      { id: 'W_11', label: 'Simpang 11', type: 'waypoint', lat: -2.98526, lng: 104.73379 },
      { id: 'W_12', label: 'Simpang 12', type: 'waypoint', lat: -2.98621, lng: 104.73234 },
      { id: 'W_13', label: 'Simpang 13', type: 'waypoint', lat: -2.98634, lng: 104.73337 },
      { id: 'W_14', label: 'Simpang 14', type: 'waypoint', lat: -2.98638, lng: 104.73362 },
      { id: 'W_15', label: 'Simpang 15', type: 'waypoint', lat: -2.98676, lng: 104.73220 },
      { id: 'W_16', label: 'Tikungan 16', type: 'waypoint', lat: -2.98796, lng: 104.73354 }
    ],
    edges: [
      // Ruas Penghubung Gedung/Gerbang ke Akses Simpang Terdekat
      { id: 'e1', from: 'Gedung_1', to: 'W_1' },
      { id: 'e2', from: 'Gedung_2', to: 'W_4' },
      { id: 'e3', from: 'Gedung_3', to: 'W_3' },
      { id: 'e4', from: 'Gedung_4', to: 'W_6' },
      { id: 'e5', from: 'Gedung_5', to: 'W_9' },
      { id: 'e6', from: 'Gedung_6', to: 'W_7' },
      { id: 'e7', from: 'Gedung_7', to: 'W_10' },
      { id: 'e8', from: 'Gedung_8', to: 'W_11' },
      { id: 'e9', from: 'Gedung_9', to: 'W_13' },
      { id: 'e10', from: 'Gedung_10', to: 'W_16' },
      { id: 'e11', from: 'Gerbang', to: 'W_15' },

      // Ruas Jalur Fisik Jalan Kampus Antar Simpang & Tikungan
      { id: 'e12', from: 'W_1', to: 'W_2' },
      { id: 'e13', from: 'W_2', to: 'W_3' },
      { id: 'e14', from: 'W_2', to: 'W_4' },
      { id: 'e15', from: 'W_2', to: 'W_8' },
      { id: 'e16', from: 'W_3', to: 'W_6' },
      { id: 'e17', from: 'W_4', to: 'W_5' },
      { id: 'e18', from: 'W_5', to: 'W_7' },
      { id: 'e19', from: 'W_6', to: 'W_8' },
      { id: 'e20', from: 'W_6', to: 'W_9' },
      { id: 'e21', from: 'W_7', to: 'W_11' },
      { id: 'e22', from: 'W_9', to: 'W_10' },
      { id: 'e23', from: 'W_10', to: 'W_12' },
      { id: 'e24', from: 'W_11', to: 'W_14' },
      { id: 'e25', from: 'W_12', to: 'W_13' },
      { id: 'e26', from: 'W_12', to: 'W_15' },
      { id: 'e27', from: 'W_13', to: 'W_14' },
      { id: 'e28', from: 'W_14', to: 'W_16' },
      { id: 'e29', from: 'W_15', to: 'W_16' },

      // Ruas Akses Jalan Tambahan Antar Fasilitas & Simpang
      { id: 'e30', from: 'Gedung_7', to: 'Gedung_5' },
      { id: 'e31', from: 'W_9', to: 'Gedung_7' },
      { id: 'e32', from: 'W_8', to: 'Gedung_5' },
      { id: 'e33', from: 'Gedung_8', to: 'Gedung_9' }
    ]
  }
];
