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

  const isRoadNetwork = graph.nodes.some((n) => n.type === 'waypoint');
  let targetNodeIds = [];
  let dist = {};
  let getPath = () => [];

  if (isRoadNetwork) {
    // 1. Pada Jaringan Jalan Kampus: gunakan Floyd-Warshall untuk mencari shortest path melalui tikungan/waypoint
    const network = buildRoadNetworkDistanceMatrix(graph.nodes, graph.edges || []);
    if (!network.ok) {
      return {
        ok: false,
        error: network.error,
        code: network.code
      };
    }
    targetNodeIds = network.targetNodeIds;
    dist = network.dist;
    getPath = network.getPath;
  } else {
    // Pada Graf Murni / Abstrak (Custom Graph):
    targetNodeIds = graph.nodes.map((n) => n.id);

    // 1. Validasi keterhubungan graf (BFS)
    const adj = {};
    for (const id of targetNodeIds) adj[id] = [];
    for (const edge of (graph.edges || [])) {
      if (adj[edge.from] && adj[edge.to]) {
        adj[edge.from].push(edge.to);
        adj[edge.to].push(edge.from);
      }
    }
    const visitedBFS = new Set();
    const queue = [targetNodeIds[0]];
    visitedBFS.add(targetNodeIds[0]);
    while (queue.length > 0) {
      const curr = queue.shift();
      for (const nbr of (adj[curr] || [])) {
        if (!visitedBFS.has(nbr)) {
          visitedBFS.add(nbr);
          queue.push(nbr);
        }
      }
    }
    if (visitedBFS.size < targetNodeIds.length) {
      return {
        ok: false,
        error: "Terdapat simpul yang terputus atau terisolasi. Seluruh simpul harus saling terhubung.",
        code: "DISCONNECTED_TARGETS"
      };
    }

    // 2. Syarat mutlak Siklus Hamilton: setiap simpul wajib memiliki derajat (degree) >= 2.
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

    // Matriks Jarak Sisi Langsung (Direct Edges Only - Tanpa Multi-hop Floyd-Warshall)
    // Pada graf murni, setiap sisi tur adalah sisi langsung. Jarak tidak boleh dihitung
    // melewati simpul perantara karena akan melanggar aturan Siklus Hamilton (mengunjungi ulang simpul).
    for (const u of targetNodeIds) {
      dist[u] = {};
      for (const v of targetNodeIds) {
        dist[u][v] = u === v ? 0 : Infinity;
      }
    }
    for (const edge of (graph.edges || [])) {
      const u = edge.from;
      const v = edge.to;
      if (dist[u] && dist[v]) {
        let weight = edge.weight;
        if (typeof weight !== 'number' || isNaN(weight)) {
          const nodeU = graph.nodes.find((n) => n.id === u);
          const nodeV = graph.nodes.find((n) => n.id === v);
          if (nodeU && nodeV && typeof nodeU.x === 'number' && typeof nodeV.x === 'number') {
            const dx = nodeU.x - nodeV.x;
            const dy = nodeU.y - nodeV.y;
            weight = Math.round(Math.sqrt(dx * dx + dy * dy));
          } else {
            weight = 10;
          }
        }
        weight = Math.round(weight * 100) / 100;
        dist[u][v] = Math.min(dist[u][v], weight);
        dist[v][u] = Math.min(dist[v][u], weight);
      }
    }
    getPath = (u, v) => (dist[u]?.[v] < Infinity ? [u, v] : []);
  }
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
    title: isRoadNetwork ? 'Matriks Jarak Terpendek Antar Lokasi' : 'Matriks Bobot Antar Simpul',
    explanation: isRoadNetwork
      ? `Menghitung matriks jarak terpendek (kilometer) antar seluruh ${targetNodeIds.length} fasilitas kampus melalui jaringan jalan.`
      : `Menghitung matriks bobot terpendek antar seluruh ${targetNodeIds.length} simpul graf.`,
    highlight: {
      nodes: targetNodeIds,
      edges: []
    },
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
  const nnResult = solveNearestNeighbor(targetNodeIds, dist, start, nodeLabels, { isRoadNetwork });
  if (!nnResult.ok) {
    return {
      ok: false,
      error: nnResult.error,
      code: nnResult.code
    };
  }

  for (const step of nnResult.steps) {
    const tourList = step.data?.tour || step.data?.visited;
    if (tourList && tourList.length > 0) {
      const { fullTour: stepFull, tourEdges: stepEdges } = expandTourToFullTour(tourList);
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
    title: isRoadNetwork
      ? 'Hasil Akhir Rute Siklus Hamilton (Nearest Neighbor)'
      : 'Hasil Akhir Siklus Hamilton (Nearest Neighbor)',
    explanation: isRoadNetwork
      ? `Rute tur selesai! Seluruh ${targetNodeIds.length} fasilitas kampus berhasil dikunjungi tepat satu kali dan kembali ke [${getLabel(start)}] dengan total jarak ${(nnResult.totalCost / 1000).toFixed(2)} km.`
      : `Siklus Hamilton selesai! Seluruh ${targetNodeIds.length} simpul graf berhasil dikunjungi tepat satu kali dan kembali ke [${getLabel(start)}] dengan total bobot ${nnResult.totalCost}.`,
    highlight: {
      nodes: fullTour,
      edges: tourEdges
    },
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
