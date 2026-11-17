import { haversine } from './geo.js';

/**
 * Hitung jarak terpendek semua pasangan (All-Pairs Shortest Path) menggunakan algoritma Floyd-Warshall.
 * Mendukung graf berbobot positif dan multigraf (memilih sisi terkecil untuk jalur langsung).
 *
 * @param {{ nodes: Array<{ id: string, lat?: number, lng?: number }>, edges: Array<{ id: string, from: string, to: string, weight?: number }> }} graph
 * @returns {{
 *   nodeIds: string[],
 *   dist: Record<string, Record<string, number>>,
 *   next: Record<string, Record<string, string | null>>,
 *   getPath: (u: string, v: string) => { nodes: string[], edges: Array<{ id: string, from: string, to: string, weight: number }> } | null
 * }}
 */
export function floydWarshall(graph) {
  const nodeMap = new Map();
  const nodeIds = [];

  for (const node of (graph.nodes || [])) {
    nodeMap.set(node.id, node);
    nodeIds.push(node.id);
  }

  // Jika ada simpul di edges yang belum ada di graph.nodes
  for (const edge of (graph.edges || [])) {
    if (!nodeMap.has(edge.from)) {
      nodeMap.set(edge.from, { id: edge.from });
      nodeIds.push(edge.from);
    }
    if (!nodeMap.has(edge.to)) {
      nodeMap.set(edge.to, { id: edge.to });
      nodeIds.push(edge.to);
    }
  }

  const dist = {};
  const next = {};
  const directEdge = {};

  for (const u of nodeIds) {
    dist[u] = {};
    next[u] = {};
    directEdge[u] = {};
    for (const v of nodeIds) {
      dist[u][v] = u === v ? 0 : Infinity;
      next[u][v] = null;
      directEdge[u][v] = null;
    }
  }

  // Isi bobot dari sisi
  for (const edge of (graph.edges || [])) {
    const { from: u, to: v } = edge;
    let weight = edge.weight;
    if (weight === undefined || weight === null) {
      weight = haversine(nodeMap.get(u), nodeMap.get(v));
    }

    const edgeObj = { ...edge, weight };

    // Jika ada multi-edge langsung antara u dan v, ambil bobot minimum
    if (weight < dist[u][v]) {
      dist[u][v] = weight;
      dist[v][u] = weight;
      next[u][v] = v;
      next[v][u] = u;
      directEdge[u][v] = edgeObj;
      directEdge[v][u] = edgeObj;
    }
  }

  // Jalankan Floyd-Warshall
  for (const k of nodeIds) {
    for (const i of nodeIds) {
      for (const j of nodeIds) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
          next[i][j] = next[i][k];
        }
      }
    }
  }

  // Fungsi rekonstruksi jalur
  const getPath = (u, v) => {
    if (dist[u] === undefined || dist[u][v] === undefined || dist[u][v] === Infinity) {
      return null;
    }
    if (u === v) {
      return { nodes: [u], edges: [] };
    }

    const pathNodes = [u];
    const pathEdges = [];
    let curr = u;

    while (curr !== v) {
      const nextNode = next[curr][v];
      if (!nextNode) return null;

      const edge = directEdge[curr][nextNode];
      if (!edge) return null;

      pathEdges.push(edge);
      curr = nextNode;
      pathNodes.push(curr);
    }

    return { nodes: pathNodes, edges: pathEdges };
  };

  return {
    nodeIds,
    dist,
    next,
    getPath
  };
}
