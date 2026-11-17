import { buildRoadNetworkDistanceMatrix } from './distanceMatrix.js';
import { solveNearestNeighbor } from './nearestNeighbor.js';
import { optimizeTwoOpt } from './twoOpt.js';

/**
 * Titik masuk utama penyelesaian Traveling Salesperson Problem (TSP) pada jaringan jalan.
 * Mendukung simpul tempat tujuan (place) dan simpul perantara/tikungan (waypoint).
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
 *     totalWeight: number,
 *     initialWeight: number,
 *     savedWeight: number,
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

  // 1. Bangun matriks jarak shortest-path jaringan jalan
  const network = buildRoadNetworkDistanceMatrix(graph.nodes, graph.edges || []);
  if (!network.ok) {
    return {
      ok: false,
      error: network.error,
      code: network.code
    };
  }

  const { targetNodeIds, dist, getPath } = network;
  const start = startNodeId && targetNodeIds.includes(startNodeId)
    ? startNodeId
    : targetNodeIds[0];

  const allSteps = [];
  let stepId = 1;

  // Step 1: Matriks Jarak Antar Lokasi
  allSteps.push({
    id: stepId++,
    type: 'matrix',
    title: 'Matriks Jarak Terpendek Antar Lokasi',
    explanation: `Menghitung jarak terpendek (shortest path melalui sisi jalan) antar seluruh ${targetNodeIds.length} lokasi tujuan.`,
    highlight: {
      nodes: targetNodeIds,
      edges: []
    },
    pseudocodeLines: [1, 2],
    data: {
      nodeIds: targetNodeIds,
      distMatrix: dist,
      startNode: start
    }
  });

  // Step 2..K: Heuristik Konstruktif Nearest Neighbor
  const nnResult = solveNearestNeighbor(targetNodeIds, dist, start);
  for (const step of nnResult.steps) {
    allSteps.push({
      ...step,
      id: stepId++
    });
  }

  // Step K+1..M: Optimasi 2-Opt
  const twoOptResult = optimizeTwoOpt(nnResult.tour, dist);
  for (const step of twoOptResult.steps) {
    allSteps.push({
      ...step,
      id: stepId++
    });
  }

  const finalTour = twoOptResult.tour;
  const finalTotalCost = twoOptResult.totalCost;
  const initialCost = nnResult.totalCost;
  const savedCost = Math.round((initialCost - finalTotalCost) * 100) / 100;

  // Rekonstruksi rute lengkap termasuk simpul waypoint/tikungan jalan
  const fullTour = [];
  const tourEdges = [];

  for (let i = 0; i < finalTour.length - 1; i++) {
    const u = finalTour[i];
    const v = finalTour[i + 1];
    const segmentNodes = getPath(u, v);

    if (segmentNodes.length > 0) {
      if (fullTour.length === 0) {
        fullTour.push(segmentNodes[0]);
      }
      for (let s = 1; s < segmentNodes.length; s++) {
        fullTour.push(segmentNodes[s]);
        tourEdges.push(`${segmentNodes[s - 1]}-${segmentNodes[s]}`);
      }
    } else {
      if (fullTour.length === 0) fullTour.push(u);
      fullTour.push(v);
      tourEdges.push(`${u}-${v}`);
    }
  }

  // Step Akhir: Hasil Rute Optimal
  allSteps.push({
    id: stepId++,
    type: 'result',
    title: 'Hasil Akhir Rute Optimal Siklus Hamilton',
    explanation: `Rute optimal selesai! Shuttle bus mengelilingi seluruh ${targetNodeIds.length} lokasi tepat satu kali dan kembali ke [${start}]. Total jarak: ${finalTotalCost} meter (Hemat ${savedCost} m melalui 2-Opt).`,
    highlight: {
      nodes: finalTour,
      edges: tourEdges
    },
    pseudocodeLines: [11, 12],
    data: {
      tour: finalTour,
      fullTour,
      totalWeight: finalTotalCost,
      initialWeight: initialCost,
      savedWeight: savedCost,
      tourEdges
    }
  });

  return {
    ok: true,
    steps: allSteps,
    result: {
      totalWeight: finalTotalCost,
      initialWeight: initialCost,
      savedWeight: savedCost,
      tour: finalTour,
      fullTour,
      tourEdges
    }
  };
}
