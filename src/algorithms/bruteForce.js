/**
 * Algoritma Brute Force Murni (Backtracking / DFS) untuk Traveling Salesperson Problem (TSP).
 * HANYA berjalan pada sisi-sisi (edges) yang benar-benar ada dan terhubung di graf.
 *
 * Alur Kerja:
 * 1. Membangun graf ketetanggaan (adjacency list) murni dari sisi-sisi (edges) yang dibuat.
 * 2. Mencari seluruh Siklus Hamilton yang valid (mengunjungi setiap simpul tepat satu kali
 *    lewat sisi-sisi yang tersedia dan kembali ke simpul awal).
 * 3. Menyaring duplikasi terbalik (arah bolak-balik) sehingga didapatkan seluruh siklus unik.
 * 4. Memvisualisasikan masing-masing siklus dengan warna berbeda (dari 15 palet warna).
 * 5. Membandingkan siklus 1 sampai n per langkah untuk menemukan siklus dengan bobot paling minimum.
 */

// 15 Palet Warna Berbeda untuk Visualisasi Setiap Rute Siklus Hamilton
export const TOUR_COLORS = [
  '#10b981', // 1. Emerald Green
  '#f59e0b', // 2. Amber Gold
  '#06b6d4', // 3. Sky Cyan
  '#8b5cf6', // 4. Purple Violet
  '#f43f5e', // 5. Rose Pink
  '#3b82f6', // 6. Electric Blue
  '#f97316', // 7. Sunset Orange
  '#84cc16', // 8. Lime Green
  '#d946ef', // 9. Fuchsia
  '#6366f1', // 10. Indigo
  '#14b8a6', // 11. Teal
  '#e11d48', // 12. Crimson Red
  '#eab308', // 13. Sunflower Yellow
  '#38bdf8', // 14. Light Sky Blue
  '#c026d3'  // 15. Deep Magenta
];

/**
 * Mencari seluruh Siklus Hamilton unik pada graf HANYA lewat sisi-sisi yang ada.
 *
 * @param {string[]} nodeIds - Daftar seluruh simpul target
 * @param {Record<string, string[]>} adj - Daftar tetangga terhubung langsung
 * @param {Record<string, number>} edgeWeights - Peta bobot sisi u-v
 * @param {string} startNode - Simpul awal
 * @returns {Array<{ tour: string[], distance: number, cycleIndex: number, color: string }>}
 */
export function findStrictHamiltonianCycles(nodeIds, adj, edgeWeights, startNode) {
  const targetCount = nodeIds.length;
  const rawCycles = [];

  function dfs(curr, path, visited) {
    if (path.length === targetCount) {
      // Cek apakah simpul terakhir memiliki sisi LANGSUNG kembali ke startNode
      const neighbors = adj[curr] || [];
      if (neighbors.includes(startNode)) {
        rawCycles.push([...path, startNode]);
      }
      return;
    }

    const neighbors = adj[curr] || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        dfs(neighbor, [...path, neighbor], visited);
        visited.delete(neighbor);
      }
    }
  }

  dfs(startNode, [startNode], new Set([startNode]));

  // Saring rute duplikat terbalik (graf simetris tidak berarah)
  // Contoh: A-B-C-D-A identik dengan A-D-C-B-A
  const uniqueCycles = [];
  let index = 1;

  for (const tour of rawCycles) {
    // Hanya ambil rute yang simpul kedua < simpul sebelum terakhir
    if (tour.length > 2 && tour[1] < tour[tour.length - 2]) {
      let totalDist = 0;
      for (let i = 0; i < tour.length - 1; i++) {
        const u = tour[i];
        const v = tour[i + 1];
        const key = u < v ? `${u}-${v}` : `${v}-${u}`;
        totalDist += edgeWeights[key] ?? 0;
      }
      totalDist = Math.round(totalDist * 100) / 100;

      uniqueCycles.push({
        tour,
        distance: totalDist,
        cycleIndex: index,
        color: TOUR_COLORS[(index - 1) % TOUR_COLORS.length]
      });
      index++;
    }
  }

  return uniqueCycles;
}

/**
 * Menyelesaikan Brute Force TSP murni pada sisi-sisi graf yang terhubung.
 *
 * @param {Array<{ id: string }>} nodes
 * @param {Array<{ from: string, to: string, weight?: number }>} edges
 * @param {string} startNode
 * @param {Record<string, number>} edgeWeights
 * @returns {{
 *   ok: boolean,
 *   error?: string,
 *   code?: string,
 *   tour?: string[],
 *   totalCost?: number,
 *   totalCycles?: number,
 *   bestCycleIndex?: number,
 *   allCycles?: Array<any>,
 *   steps?: Array<any>
 * }}
 */
export function solveBruteForceStrict(nodeIds, adj, edgeWeights, startNode) {
  const cycles = findStrictHamiltonianCycles(nodeIds, adj, edgeWeights, startNode);

  if (cycles.length === 0) {
    return {
      ok: false,
      error: `Tidak ditemukan Siklus Hamilton pada graf ini! Graf tidak memiliki rute tertutup yang dapat mengunjungi seluruh ${nodeIds.length} simpul tepat satu kali lewat sisi-sisi yang terhubung. Pastikan seluruh simpul memiliki minimal 2 sisi/jalan penghubung.`,
      code: 'NO_HAMILTONIAN_CYCLE'
    };
  }

  const steps = [];

  // Helper untuk membuat highlight sisi
  function getTourEdges(tour) {
    const list = [];
    for (let i = 0; i < tour.length - 1; i++) {
      list.push(`${tour[i]}-${tour[i + 1]}`);
    }
    return list;
  }

  // 1. Step Formulasi: Siklus Hamilton Nyata yang Ditemukan
  steps.push({
    type: 'bf-summary',
    title: `Pencarian Sisi Graf: Ditemukan ${cycles.length} Siklus Hamilton Nyata`,
    explanation: `Algoritma Brute Force menelusuri seluruh jalur sisi yang ada di graf dan menemukan tepat ${cycles.length} Siklus Hamilton berbeda yang dapat dilewati secara fisik. Masing-masing rute disiapkan dengan warna berbeda. Selanjutnya setiap rute akan diuji untuk mencari jarak yang paling minimum.`,
    highlight: {
      nodes: nodeIds,
      edges: []
    },
    pseudocodeLines: [1, 2],
    data: {
      totalCycles: cycles.length,
      nodeCount: nodeIds.length,
      startNode,
      allCycles: cycles
    }
  });

  let bestTour = cycles[0].tour;
  let bestDistance = cycles[0].distance;
  let bestCycleIndex = 1;
  let bestColor = cycles[0].color;

  // 2. Evaluasi Siklus dari 1 sampai n
  for (let i = 0; i < cycles.length; i++) {
    const current = cycles[i];
    const isNewRecord = current.distance < bestDistance || i === 0;

    if (isNewRecord) {
      bestDistance = current.distance;
      bestTour = current.tour;
      bestCycleIndex = current.cycleIndex;
      bestColor = current.color;
    }

    const cycleEdges = getTourEdges(current.tour);

    steps.push({
      type: 'bf-cycle',
      title: `Uji Rute #${current.cycleIndex} dari ${cycles.length} ${isNewRecord ? (i === 0 ? '(Patokan Awal)' : '🏆 Rekor Baru!') : ''}`,
      explanation: i === 0
        ? `Rute #${current.cycleIndex} [${current.tour.join(' → ')}] dihitung melalui sisi jalan yang ada dengan total jarak ${current.distance} meter. Ini dijadikan patokan jarak minimum awal.`
        : isNewRecord
        ? `Rute #${current.cycleIndex} [${current.tour.join(' → ')}] memiliki total jarak ${current.distance} meter. Lebih pendek dari rute terbaik sebelumnya! Rekor minimum berhasil diperbarui. 🎉`
        : `Rute #${current.cycleIndex} [${current.tour.join(' → ')}] memiliki total jarak ${current.distance} meter. Lebih panjang dari rekor terbaik saat ini (${bestDistance} m pada Rute #${bestCycleIndex}).`,
      highlight: {
        nodes: current.tour,
        edges: cycleEdges
      },
      pseudocodeLines: isNewRecord ? [6, 7] : [4, 5],
      data: {
        cycleIndex: current.cycleIndex,
        totalCycles: cycles.length,
        currentTour: current.tour,
        tourEdges: cycleEdges,
        distance: current.distance,
        color: current.color,
        isNewRecord,
        bestDistance,
        bestTour,
        bestCycleIndex,
        allCycles: cycles
      }
    });
  }

  return {
    ok: true,
    tour: bestTour,
    totalCost: bestDistance,
    totalCycles: cycles.length,
    bestCycleIndex,
    bestColor,
    allCycles: cycles,
    steps
  };
}
