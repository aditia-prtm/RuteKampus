import { buildRoadNetworkDistanceMatrix } from './distanceMatrix.js';
import { solveNearestNeighbor } from './nearestNeighbor.js';

/**
 * Titik masuk utama penyelesaian Traveling Salesperson Problem (TSP)
 * Menggunakan Algoritma Tunggal: Heuristik Greedy (Nearest Neighbor).
 *
 * @param {{
 *   nodes: Array<{ id: string, label?: string, type?: 'place' | 'waypoint', lat?: number, lng?: number, x?: number, y?: number }>,
 *   edges: Array<{ id?: string, from: string, to: string, weight?: number }>
 * }} graph
 * @param {string} [startNodeId]
 * @returns {{
 *   ok: boolean,
 *   error?: string,
 *   code?: string,
 *   steps?: Array<any>,
 *   result?: {
 *     algorithm: string,
 *     totalWeight: number,
 *     tour: string[],
 *     fullTour: string[],
 *     tourEdges: string[]
 *   }
 * }}
 */
export function solveTSP(graph, startNodeId) {
  if (!graph || !graph.nodes || graph.nodes.length < 3) {
    return {
      ok: false,
      error: "Diperlukan minimal 3 simpul untuk membentuk Siklus Hamilton (TSP).",
      code: "TOO_FEW_NODES"
    };
  }

  // 1. Bangun matriks jarak shortest-path jaringan jalan (Floyd-Warshall)
  const network = buildRoadNetworkDistanceMatrix(graph.nodes, graph.edges || []);
  if (!network.ok) {
    return {
      ok: false,
      error: network.error,
      code: network.code
    };
  }

  const isRoadNetwork = graph.nodes.some((n) => n.type === 'waypoint');

  // Pada Graf Murni / Abstrak (tanpa tikungan/waypoint):
  // Syarat mutlak Siklus Hamilton adalah setiap simpul wajib memiliki derajat (degree) >= 2.
  // Simpul dengan derajat 0 atau 1 mustahil membentuk Siklus Hamilton karena tidak bisa dikunjungi dan ditinggalkan melalui sisi yang berbeda.
  if (!isRoadNetwork) {
    const degreeMap = {};
    for (const node of graph.nodes) degreeMap[node.id] = 0;
    for (const edge of (graph.edges || [])) {
      if (degreeMap[edge.from] !== undefined) degreeMap[edge.from]++;
      if (degreeMap[edge.to] !== undefined) degreeMap[edge.to]++;
    }

    const lowDegreeNodes = graph.nodes.filter((n) => (degreeMap[n.id] || 0) < 2);
    if (lowDegreeNodes.length > 0) {
      const list = lowDegreeNodes
        .map((n) => `Simpul '${n.label || n.id}' (derajat: ${degreeMap[n.id] || 0})`)
        .join(', ');
      return {
        ok: false,
        error: `Graf tidak memiliki Siklus Hamilton! Terdapat simpul berderajat < 2: ${list}. Syarat Siklus Hamilton adalah setiap simpul memiliki derajat minimal 2.`,
        code: "LOW_DEGREE_NODES"
      };
    }
  }

  const { targetNodeIds, dist, getPath } = network;
  const start = startNodeId && targetNodeIds.includes(startNodeId)
    ? startNodeId
    : targetNodeIds[0];

  // Mapping nama label gedung/tempat agar visualisasi ramah dibaca
  const nodeLabels = {};
  for (const node of graph.nodes) {
    nodeLabels[node.id] = node.label || node.id;
  }
  const getLabel = (id) => nodeLabels[id] || id;

  const allSteps = [];
  let stepId = 1;

  // Step 1: Matriks Jarak Antar Lokasi
  allSteps.push({
    id: stepId++,
    type: 'matrix',
    title: 'Matriks Jarak Terpendek Antar Lokasi',
    explanation: `Menghitung jarak terpendek antar seluruh ${targetNodeIds.length} fasilitas kampus melalui jaringan jalan.`,
    highlight: {
      nodes: targetNodeIds,
      edges: []
    },
    pseudocodeLines: [1, 2],
    data: {
      nodeIds: targetNodeIds,
      distMatrix: dist,
      nodeLabels,
      startNode: start
    }
  });

  // Helper untuk merekonstruksi rute fisik lengkap beserta tikungan/waypoint
  function expandTourToFullTour(tourList) {
    if (!tourList || tourList.length < 2) {
      return { fullTour: tourList ? [...tourList] : [], tourEdges: [] };
    }
    const full = [];
    const edges = [];
    for (let i = 0; i < tourList.length - 1; i++) {
      const u = tourList[i];
      const v = tourList[i + 1];
      const segmentNodes = getPath(u, v);
      if (segmentNodes && segmentNodes.length > 0) {
        if (full.length === 0) full.push(segmentNodes[0]);
        for (let s = 1; s < segmentNodes.length; s++) {
          full.push(segmentNodes[s]);
          edges.push(`${segmentNodes[s - 1]}-${segmentNodes[s]}`);
        }
      } else {
        if (full.length === 0) full.push(u);
        full.push(v);
        edges.push(`${u}-${v}`);
      }
    }
    return { fullTour: full, tourEdges: edges };
  }

  // 2. Eksekusi Algoritma Nearest Neighbor (Greedy)
  const nnResult = solveNearestNeighbor(targetNodeIds, dist, start, nodeLabels);

  // Pada Graf Abstrak (Custom Graph), setiap perpindahan tur WAJIB berupa sisi langsung (direct edge)
  if (!isRoadNetwork) {
    for (let i = 0; i < nnResult.tour.length - 1; i++) {
      const u = nnResult.tour[i];
      const v = nnResult.tour[i + 1];
      const hasDirectEdge = (graph.edges || []).some(
        (e) => (e.from === u && e.to === v) || (e.from === v && e.to === u)
      );
      if (!hasDirectEdge) {
        return {
          ok: false,
          error: `Graf tidak memiliki Siklus Hamilton! Tidak ada sisi langsung antara '${u}' dan '${v}'. Siklus Hamilton melarang pengulangan simpul untuk mencapai simpul lain.`,
          code: "NO_DIRECT_HAMILTON_CYCLE"
        };
      }
    }
  }

  for (const step of nnResult.steps) {
    if (step.data?.visited && step.data.visited.length > 0) {
      const { fullTour: stepFull, tourEdges: stepEdges } = expandTourToFullTour(step.data.visited);
      step.data.fullTour = stepFull;
      step.data.tourEdges = stepEdges;
    }

    if (step.data?.from && step.data?.to) {
      const activeSeg = getPath(step.data.from, step.data.to);
      if (activeSeg && activeSeg.length > 1) {
        const physicalActiveEdges = [];
        for (let s = 0; s < activeSeg.length - 1; s++) {
          physicalActiveEdges.push(`${activeSeg[s]}-${activeSeg[s + 1]}`);
        }
        step.highlight.edges = Array.from(new Set([...(step.highlight?.edges || []), ...physicalActiveEdges]));
        step.highlight.nodes = Array.from(new Set([...(step.highlight?.nodes || []), ...activeSeg]));
      }
    }

    allSteps.push({
      ...step,
      id: stepId++
    });
  }

  // Rekonstruksi rute tur final lengkap
  const { fullTour, tourEdges } = expandTourToFullTour(nnResult.tour);

  // Step Terakhir: Hasil Rute Siklus Hamilton Optimal
  allSteps.push({
    id: stepId++,
    type: 'result',
    title: 'Hasil Akhir Rute Siklus Hamilton (Nearest Neighbor)',
    explanation: `Rute tur selesai! Seluruh ${targetNodeIds.length} fasilitas kampus berhasil dikunjungi tepat satu kali dan kembali ke [${getLabel(start)}] dengan total jarak ${nnResult.totalCost} meter.`,
    highlight: {
      nodes: fullTour,
      edges: tourEdges
    },
    pseudocodeLines: [8],
    data: {
      algorithm: 'nearest-neighbor',
      tour: nnResult.tour,
      fullTour,
      totalWeight: nnResult.totalCost,
      tourEdges,
      nodeLabels
    }
  });

  return {
    ok: true,
    steps: allSteps,
    result: {
      algorithm: 'nearest-neighbor',
      totalWeight: nnResult.totalCost,
      tour: nnResult.tour,
      fullTour,
      tourEdges
    }
  };
}
