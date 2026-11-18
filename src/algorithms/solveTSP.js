import { haversine } from './geo.js';
import { solveNearestNeighborStrict } from './nearestNeighbor.js';
import { solveBruteForceStrict, TOUR_COLORS } from './bruteForce.js';

/**
 * Titik masuk utama penyelesaian Traveling Salesperson Problem (TSP)
 * HANYA pada sisi-sisi (edges) yang terhubung langsung di graf (Topologi Graf Murni).
 *
 * @param {{
 *   nodes: Array<{ id: string, label?: string, type?: string, lat?: number, lng?: number, x?: number, y?: number }>,
 *   edges: Array<{ id?: string, from: string, to: string, weight?: number }>
 * }} graph
 * @param {string} [startNodeId]
 * @param {{ algorithm?: 'nearest-neighbor' | 'brute-force' }} [options]
 * @returns {{
 *   ok: boolean,
 *   error?: string,
 *   code?: string,
 *   steps?: Array<any>,
 *   result?: {
 *     algorithm: string,
 *     totalWeight: number,
 *     tour: string[],
 *     tourEdges: string[],
 *     totalCycles?: number,
 *     bestCycleIndex?: number,
 *     color?: string
 *   }
 * }}
 */
export function solveTSP(graph, startNodeId, options = {}) {
  const algorithm = options.algorithm || 'nearest-neighbor';

  if (!graph || !graph.nodes || graph.nodes.length < 3) {
    return {
      ok: false,
      error: "Diperlukan minimal 3 simpul untuk membentuk Siklus Hamilton (TSP).",
      code: "TOO_FEW_NODES"
    };
  }

  if (!graph.edges || graph.edges.length < 3) {
    return {
      ok: false,
      error: "Diperlukan minimal 3 sisi penghubung (edges) untuk membentuk Siklus Hamilton.",
      code: "TOO_FEW_EDGES"
    };
  }

  const nodeMap = new Map();
  const nodeIds = [];
  for (const node of graph.nodes) {
    nodeMap.set(node.id, node);
    nodeIds.push(node.id);
  }

  const start = startNodeId && nodeIds.includes(startNodeId)
    ? startNodeId
    : nodeIds[0];

  // Bangun daftar ketetanggaan (Adjacency List) dan Bobot Sisi MURNI dari graph.edges
  const adj = {};
  const edgeWeights = {};
  const distMatrix = {};

  for (const id of nodeIds) {
    adj[id] = [];
    distMatrix[id] = {};
    for (const other of nodeIds) {
      distMatrix[id][other] = id === other ? 0 : null; // null = tidak ada sisi langsung
    }
  }

  for (const edge of graph.edges) {
    const u = nodeMap.get(edge.from);
    const v = nodeMap.get(edge.to);
    if (!u || !v || edge.from === edge.to) continue;

    let weight = edge.weight;
    if (typeof weight !== 'number' || isNaN(weight)) {
      if (typeof u.lat === 'number' && typeof v.lat === 'number') {
        weight = haversine(u, v);
      } else if (typeof u.x === 'number' && typeof v.x === 'number') {
        const dx = u.x - v.x;
        const dy = u.y - v.y;
        weight = Math.round(Math.sqrt(dx * dx + dy * dy));
      } else {
        weight = 10;
      }
    }
    weight = Math.round(weight * 100) / 100;

    const from = edge.from;
    const to = edge.to;
    const key = from < to ? `${from}-${to}` : `${to}-${from}`;

    if (!adj[from].includes(to)) adj[from].push(to);
    if (!adj[to].includes(from)) adj[to].push(from);

    edgeWeights[key] = weight;
    distMatrix[from][to] = weight;
    distMatrix[to][from] = weight;
  }

  // Validasi derajat simpul: Setiap simpul wajib memiliki minimal degree >= 2 untuk membentuk siklus
  const isolatedNodes = nodeIds.filter(id => (adj[id] || []).length < 2);
  if (isolatedNodes.length > 0) {
    return {
      ok: false,
      error: `Simpul [${isolatedNodes.join(', ')}] hanya memiliki kurang dari 2 jalur penghubung (buntu/terisolasi). Dalam Teori Graf, setiap simpul wajib memiliki minimal 2 sisi/jalan (derajat ≥ 2) untuk dapat membentuk Siklus Hamilton tertutup.`,
      code: "NODE_DEGREE_TOO_LOW"
    };
  }

  const allSteps = [];
  let stepId = 1;

  // Step 1: Matriks Ketetanggaan Sisi Graf Langsung
  allSteps.push({
    id: stepId++,
    type: 'matrix',
    title: 'Matriks Bobot Sisi Langsung pada Graf',
    explanation: `Menganalisis sisi-sisi jalan yang ada pada graf. Tanda (-) menunjukkan tidak ada sisi langsung antara dua lokasi, sehingga rute tidak boleh melewati jalur tersebut secara langsung.`,
    highlight: {
      nodes: nodeIds,
      edges: []
    },
    pseudocodeLines: [1, 2],
    data: {
      nodeIds,
      distMatrix,
      startNode: start
    }
  });

  // =========================================================================
  // CABANG 1: ALGORITMA BRUTE FORCE (Siklus Hamilton Nyata di Graf)
  // =========================================================================
  if (algorithm === 'brute-force') {
    const bfResult = solveBruteForceStrict(nodeIds, adj, edgeWeights, start);

    if (!bfResult.ok) {
      return {
        ok: false,
        error: bfResult.error,
        code: bfResult.code
      };
    }

    for (const step of bfResult.steps) {
      allSteps.push({
        ...step,
        id: stepId++
      });
    }

    const tourEdges = [];
    for (let i = 0; i < bfResult.tour.length - 1; i++) {
      const u = bfResult.tour[i];
      const v = bfResult.tour[i + 1];
      tourEdges.push(u < v ? `${u}-${v}` : `${v}-${u}`);
    }

    allSteps.push({
      id: stepId++,
      type: 'result',
      title: 'Hasil Akhir Rute Optimal (100% Minimum - Brute Force)',
      explanation: `Pencarian selesai! Dari seluruh ${bfResult.totalCycles} Siklus Hamilton yang ada di graf, Rute #${bfResult.bestCycleIndex} [${bfResult.tour.join(' → ')}] adalah yang paling minimum dengan total jarak ${bfResult.totalCost} meter.`,
      highlight: {
        nodes: bfResult.tour,
        edges: tourEdges
      },
      pseudocodeLines: [8],
      data: {
        algorithm: 'brute-force',
        tour: bfResult.tour,
        tourEdges,
        totalWeight: bfResult.totalCost,
        totalCycles: bfResult.totalCycles,
        bestCycleIndex: bfResult.bestCycleIndex,
        color: bfResult.bestColor || '#10b981'
      }
    });

    return {
      ok: true,
      steps: allSteps,
      result: {
        algorithm: 'brute-force',
        totalWeight: bfResult.totalCost,
        tour: bfResult.tour,
        tourEdges,
        totalCycles: bfResult.totalCycles,
        bestCycleIndex: bfResult.bestCycleIndex,
        color: bfResult.bestColor || '#10b981'
      }
    };
  }

  // =========================================================================
  // CABANG 2: ALGORITMA NEAREST NEIGHBOR (Greedy Sisi Langsung)
  // =========================================================================
  const nnResult = solveNearestNeighborStrict(nodeIds, adj, edgeWeights, start);
  if (!nnResult.ok) {
    return {
      ok: false,
      error: nnResult.error,
      code: nnResult.code
    };
  }

  for (const step of nnResult.steps) {
    allSteps.push({
      ...step,
      id: stepId++
    });
  }

  allSteps.push({
    id: stepId++,
    type: 'result',
    title: 'Hasil Akhir Rute Siklus Hamilton (Nearest Neighbor)',
    explanation: `Rute heuristik greedy selesai! Tur keliling mengitari seluruh ${nodeIds.length} lokasi tepat satu kali lewat sisi-sisi graf yang ada dan kembali ke [${start}]. Total jarak: ${nnResult.totalCost} meter.`,
    highlight: {
      nodes: nnResult.tour,
      edges: nnResult.tourEdges
    },
    pseudocodeLines: [8],
    data: {
      algorithm: 'nearest-neighbor',
      tour: nnResult.tour,
      tourEdges: nnResult.tourEdges,
      totalWeight: nnResult.totalCost
    }
  });

  return {
    ok: true,
    steps: allSteps,
    result: {
      algorithm: 'nearest-neighbor',
      totalWeight: nnResult.totalCost,
      tour: nnResult.tour,
      tourEdges: nnResult.tourEdges
    }
  };
}
