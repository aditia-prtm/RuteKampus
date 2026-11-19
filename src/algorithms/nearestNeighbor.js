/**
 * Algoritma Heuristik Greedy: Nearest Neighbor untuk Traveling Salesperson Problem (TSP).
 *
 * Prinsip Kerja:
 * 1. Mulai dari simpul awal (startNode).
 * 2. Pada setiap langkah, evaluasi seluruh lokasi yang belum dikunjungi.
 * 3. Pilih lokasi terdekat (jarak terkecil / greedy choice) sebagai tujuan berikutnya.
 * 4. Ulangi proses hingga seluruh lokasi berhasil dikunjungi tepat satu kali.
 * 5. Kembali ke titik awal untuk menutup sirkuit menjadi Siklus Hamilton.
 *
 * Kompleksitas Waktu: O(n^2) - Sangat cepat, efisien, dan mudah dipahami.
 */

/**
 * Menyelesaikan TSP menggunakan metode Nearest Neighbor dengan langkah visualisasi terperinci.
 *
 * @param {string[]} nodeIds - Daftar seluruh simpul tempat/tujuan yang wajib dikunjungi
 * @param {Record<string, Record<string, number>>} distMatrix - Matriks jarak berbobot
 * @param {string} startNode - Titik awal keberangkatan
 * @param {Record<string, string>} [nodeLabels] - Label ramah nama lokasi untuk visualisasi
 * @returns {{
 *   tour: string[],
 *   totalCost: number,
 *   steps: Array<any>
 * }}
 */
export function solveNearestNeighbor(nodeIds, distMatrix, startNode, nodeLabels = {}, options = {}) {
  if (!nodeIds || nodeIds.length === 0) {
    return { tour: [], totalCost: 0, steps: [] };
  }

  const isRoadNetwork = options.isRoadNetwork ?? false;
  const formatDist = (val) => {
    if (isRoadNetwork) {
      return `${(val / 1000).toFixed(2)} km`;
    }
    return `${Math.round(val * 10) / 10}`;
  };

  const getLabel = (id) => nodeLabels[id] || id;
  const start = nodeIds.includes(startNode) ? startNode : nodeIds[0];
  const unvisited = new Set(nodeIds.filter(id => id !== start));
  const tour = [start];
  const steps = [];
  let current = start;
  let totalCost = 0;

  // Step 1: Titik Awal Keberangkatan
  steps.push({
    type: 'nn-start',
    title: isRoadNetwork ? `Titik Awal Tur Kampus: [${getLabel(start)}]` : `Simpul Awal: [${getLabel(start)}]`,
    explanation: isRoadNetwork
      ? `Perjalanan tur keliling kampus dimulai dari titik awal keberangkatan: [${getLabel(start)}].`
      : `Penelusuran graf dimulai dari simpul awal: [${getLabel(start)}].`,
    highlight: {
      nodes: [start],
      edges: []
    },
    pseudocodeLines: [2, 3],
    data: {
      current,
      visited: [...tour],
      unvisited: Array.from(unvisited),
      currentCost: 0,
      nodeLabels
    }
  });

  // Step 2: Kunjungan Titik Terdekat Satu per Satu (Greedy Step)
  while (unvisited.size > 0) {
    let nearestNode = null;
    let minDistance = Infinity;
    const candidates = [];

    for (const candidate of unvisited) {
      const d = distMatrix[current]?.[candidate] ?? Infinity;
      candidates.push({ node: candidate, distance: d });
      if (d < minDistance) {
        minDistance = d;
        nearestNode = candidate;
      }
    }

    candidates.sort((a, b) => a.distance - b.distance);

    totalCost += minDistance;
    tour.push(nearestNode);
    unvisited.delete(nearestNode);

    const edgeKey = current < nearestNode ? `${current}-${nearestNode}` : `${nearestNode}-${current}`;

    steps.push({
      type: 'nn-step',
      title: isRoadNetwork ? `Pilih Lokasi Terdekat: [${getLabel(nearestNode)}]` : `Pilih Simpul Terdekat: [${getLabel(nearestNode)}]`,
      explanation: isRoadNetwork
        ? `Dari [${getLabel(current)}], lokasi belum dikunjungi dengan jarak terpendek adalah [${getLabel(nearestNode)}] sejauh ${formatDist(minDistance)}.`
        : `Dari [${getLabel(current)}], simpul belum dikunjungi dengan bobot terkecil adalah [${getLabel(nearestNode)}] (bobot: ${formatDist(minDistance)}).`,
      highlight: {
        nodes: [current, nearestNode],
        edges: [edgeKey]
      },
      pseudocodeLines: [4, 5, 6],
      data: {
        from: current,
        to: nearestNode,
        distance: minDistance,
        candidates,
        visited: [...tour],
        unvisited: Array.from(unvisited),
        currentCost: Math.round(totalCost * 100) / 100,
        nodeLabels
      }
    });

    current = nearestNode;
  }

  // Step 3: Kembali ke Titik Awal (Menutup Siklus Hamilton)
  const returnDistance = distMatrix[current]?.[start] ?? 0;
  totalCost += returnDistance;
  tour.push(start);

  const returnKey = current < start ? `${current}-${start}` : `${start}-${current}`;
  const tourEdges = [];
  for (let i = 0; i < tour.length - 1; i++) {
    const u = tour[i];
    const v = tour[i + 1];
    tourEdges.push(u < v ? `${u}-${v}` : `${v}-${u}`);
  }

  steps.push({
    type: 'nn-complete',
    title: 'Siklus Hamilton Terbentuk',
    explanation: isRoadNetwork
      ? `Seluruh ${nodeIds.length} lokasi kampus telah dikunjungi tepat satu kali. Rute kembali ke lokasi awal [${getLabel(start)}] (+${formatDist(returnDistance)}). Total jarak rute: ${formatDist(totalCost)}.`
      : `Seluruh ${nodeIds.length} simpul graf telah dikunjungi tepat satu kali. Rute kembali ke simpul awal [${getLabel(start)}] (+${formatDist(returnDistance)}). Total bobot tur: ${formatDist(totalCost)}.`,
    highlight: {
      nodes: tour,
      edges: tourEdges
    },
    pseudocodeLines: [7],
    data: {
      from: current,
      to: start,
      distance: returnDistance,
      tour,
      tourEdges,
      currentCost: Math.round(totalCost * 100) / 100,
      nodeLabels
    }
  });

  return {
    tour,
    totalCost: Math.round(totalCost * 100) / 100,
    tourEdges,
    steps
  };
}
