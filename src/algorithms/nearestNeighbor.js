/**
 * Konstruksi rute awal TSP menggunakan Heuristik Greedy / Nearest Neighbor
 * HANYA pada sisi-sisi (edges) yang terhubung langsung di graf.
 *
 * @param {string[]} nodeIds - Seluruh simpul target
 * @param {Record<string, string[]>} adj - Daftar tetangga langsung
 * @param {Record<string, number>} edgeWeights - Bobot sisi langsung u-v
 * @param {string} startNode - Simpul awal
 * @returns {{
 *   ok: boolean,
 *   tour: string[],
 *   totalCost: number,
 *   steps: Array<any>,
 *   error?: string,
 *   code?: string
 * }}
 */
export function solveNearestNeighborStrict(nodeIds, adj, edgeWeights, startNode) {
  if (!nodeIds || nodeIds.length === 0) {
    return { ok: false, tour: [], totalCost: 0, steps: [] };
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
    pseudocodeLines: [2, 3],
    data: {
      current,
      visited: [...tour],
      unvisited: Array.from(unvisited),
      currentCost: 0
    }
  });

  while (unvisited.size > 0) {
    const rawNeighbors = adj[current] || [];
    const directUnvisited = rawNeighbors.filter(nbr => unvisited.has(nbr));

    if (directUnvisited.length === 0) {
      return {
        ok: false,
        error: `Heuristik Greedy terhenti pada simpul [${current}] karena tidak memiliki sisi jalan langsung ke lokasi yang belum dikunjungi (${Array.from(unvisited).join(', ')}).`,
        code: 'GREEDY_STUCK'
      };
    }

    const candidates = directUnvisited.map(nbr => {
      const key = current < nbr ? `${current}-${nbr}` : `${nbr}-${current}`;
      return {
        node: nbr,
        distance: edgeWeights[key] ?? Infinity
      };
    });

    candidates.sort((a, b) => a.distance - b.distance);
    const chosen = candidates[0];

    totalCost += chosen.distance;
    tour.push(chosen.node);
    unvisited.delete(chosen.node);

    const edgeKey = current < chosen.node ? `${current}-${chosen.node}` : `${chosen.node}-${current}`;

    steps.push({
      type: 'nn-step',
      title: `Pilih Sisi Terdekat: Menuju [${chosen.node}]`,
      explanation: `Dari [${current}], tetangga terhubung langsung yang terdekat adalah [${chosen.node}] dengan jarak ${chosen.distance} meter.`,
      highlight: {
        nodes: [current, chosen.node],
        edges: [edgeKey]
      },
      pseudocodeLines: [4, 5, 6],
      data: {
        from: current,
        to: chosen.node,
        distance: chosen.distance,
        candidates,
        visited: [...tour],
        unvisited: Array.from(unvisited),
        currentCost: Math.round(totalCost * 100) / 100
      }
    });

    current = chosen.node;
  }

  // Cek sisi kembali ke titik awal
  const startNeighbors = adj[current] || [];
  if (!startNeighbors.includes(start)) {
    return {
      ok: false,
      error: `Seluruh lokasi telah dikunjungi, namun simpul terakhir [${current}] tidak memiliki sisi langsung untuk kembali ke titik awal [${start}].`,
      code: 'NO_RETURN_EDGE'
    };
  }

  const returnKey = current < start ? `${current}-${start}` : `${start}-${current}`;
  const returnDist = edgeWeights[returnKey] ?? 0;
  totalCost += returnDist;
  tour.push(start);

  const tourEdges = [];
  for (let i = 0; i < tour.length - 1; i++) {
    const u = tour[i];
    const v = tour[i + 1];
    tourEdges.push(u < v ? `${u}-${v}` : `${v}-${u}`);
  }

  steps.push({
    type: 'nn-complete',
    title: 'Siklus Hamilton Terbentuk',
    explanation: `Semua fakultas/gedung telah dikunjungi tepat satu kali lewat sisi-sisi yang ada. Rute kembali ke titik awal [${start}] (+${returnDist} m). Total jarak rute: ${Math.round(totalCost * 100) / 100} meter.`,
    highlight: {
      nodes: tour,
      edges: tourEdges
    },
    pseudocodeLines: [7],
    data: {
      from: current,
      to: start,
      distance: returnDist,
      tour,
      tourEdges,
      currentCost: Math.round(totalCost * 100) / 100
    }
  });

  return {
    ok: true,
    tour,
    totalCost: Math.round(totalCost * 100) / 100,
    tourEdges,
    steps
  };
}
