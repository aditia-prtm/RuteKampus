/**
 * Konstruksi rute awal TSP menggunakan Heuristik Greedy / Nearest Neighbor.
 * Menghasilkan data langkah demi langkah untuk visualisasi.
 *
 * @param {string[]} nodeIds
 * @param {Record<string, Record<string, number>>} dist
 * @param {string} startNode
 * @returns {{
 *   tour: string[],
 *   totalCost: number,
 *   steps: Array<any>
 * }}
 */
export function solveNearestNeighbor(nodeIds, dist, startNode) {
  if (!nodeIds || nodeIds.length === 0) {
    return { tour: [], totalCost: 0, steps: [] };
  }

  const start = nodeIds.includes(startNode) ? startNode : nodeIds[0];
  const unvisited = new Set(nodeIds.filter(id => id !== start));
  const tour = [start];
  const steps = [];
  let current = start;
  let totalCost = 0;

  steps.push({
    type: 'nn-start',
    title: 'Titik Awal Tur Kampus',
    explanation: `Perjalanan tur keliling kampus dimulai dari titik awal: [${start}].`,
    highlight: { nodes: [start], edges: [] },
    pseudocodeLines: [1, 2],
    data: {
      current,
      visited: [...tour],
      unvisited: Array.from(unvisited),
      currentCost: 0
    }
  });

  while (unvisited.size > 0) {
    let nearestNode = null;
    let minDistance = Infinity;
    const candidates = [];

    for (const candidate of unvisited) {
      const d = dist[current]?.[candidate] ?? Infinity;
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

    steps.push({
      type: 'nn-step',
      title: `Kunjungan Halte Terdekat: ${nearestNode}`,
      explanation: `Dari [${current}], lokasi terdekat yang belum dikunjungi adalah [${nearestNode}] dengan jarak ${minDistance} meter.`,
      highlight: {
        nodes: [current, nearestNode],
        edges: [`${current}-${nearestNode}`]
      },
      pseudocodeLines: [3, 4],
      data: {
        from: current,
        to: nearestNode,
        distance: minDistance,
        candidates,
        visited: [...tour],
        unvisited: Array.from(unvisited),
        currentCost: Math.round(totalCost * 100) / 100
      }
    });

    current = nearestNode;
  }

  // Kembali ke titik awal
  const returnDistance = dist[current]?.[start] ?? 0;
  totalCost += returnDistance;
  tour.push(start);

  steps.push({
    type: 'nn-complete',
    title: 'Siklus Hamilton Awal Selesai Terbentuk',
    explanation: `Semua fakultas/gedung telah dikunjungi tepat satu kali. Rute kembali ke lokasi awal [${start}] (+${returnDistance} m). Total jarak rute awal: ${Math.round(totalCost * 100) / 100} meter.`,
    highlight: {
      nodes: tour,
      edges: tour.slice(0, -1).map((u, i) => `${u}-${tour[i + 1]}`)
    },
    pseudocodeLines: [5, 6],
    data: {
      from: current,
      to: start,
      distance: returnDistance,
      tour: [...tour],
      totalCost: Math.round(totalCost * 100) / 100
    }
  });

  return {
    tour,
    totalCost: Math.round(totalCost * 100) / 100,
    steps
  };
}
