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

  // Helper untuk merekonstruksi rute fisik lengkap beserta sisi jalan (termasuk tikungan/waypoint)
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

  // Step 2..K: Heuristik Konstruktif Nearest Neighbor
  const nnResult = solveNearestNeighbor(targetNodeIds, dist, start);
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

  // Step K+1..M: Optimasi 2-Opt
  const twoOptResult = optimizeTwoOpt(nnResult.tour, dist);
  for (const step of twoOptResult.steps) {
    if (step.data?.currentTour && step.data.currentTour.length > 0) {
      const { fullTour: optFull, tourEdges: optEdges } = expandTourToFullTour(step.data.currentTour);
      step.data.fullTour = optFull;
      step.data.tourEdges = optEdges;
    }

    if (step.highlight?.edges && step.highlight.edges.length > 0) {
      const expandedEdges = [];
      const expandedNodes = [...(step.highlight.nodes || [])];
      for (const edgeStr of step.highlight.edges) {
        const parts = edgeStr.split('-');
        if (parts.length === 2) {
          const seg = getPath(parts[0], parts[1]);
          if (seg && seg.length > 1) {
            for (let s = 0; s < seg.length - 1; s++) {
              expandedEdges.push(`${seg[s]}-${seg[s + 1]}`);
            }
            expandedNodes.push(...seg);
          } else {
            expandedEdges.push(edgeStr);
          }
        } else {
          expandedEdges.push(edgeStr);
        }
      }
      step.highlight.edges = Array.from(new Set(expandedEdges));
      step.highlight.nodes = Array.from(new Set(expandedNodes));
    }

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
  const { fullTour, tourEdges } = expandTourToFullTour(finalTour);

  // Step Akhir: Hasil Rute Optimal
  allSteps.push({
    id: stepId++,
    type: 'result',
    title: 'Hasil Akhir Rute Optimal Siklus Hamilton',
    explanation: `Rute optimal selesai! Tur keliling mengitari seluruh ${targetNodeIds.length} lokasi kampus tepat satu kali dan kembali ke [${start}]. Total jarak: ${finalTotalCost} meter (Hemat ${savedCost} m melalui 2-Opt).`,
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
