import { haversine } from './geo.js';

/**
 * Bangun matriks jarak shortest-path antar lokasi target berdasarkan sisi (edges) yang dibuat.
 * Mendukung simpul tempat (place) dan simpul tikungan/penghubung jalan (waypoint).
 *
 * @param {Array<{ id: string, type?: 'place' | 'waypoint', lat?: number, lng?: number, x?: number, y?: number }>} nodes
 * @param {Array<{ id?: string, from: string, to: string, weight?: number }>} edges
 * @returns {{
 *   ok: boolean,
 *   targetNodeIds: string[],
 *   dist: Record<string, Record<string, number>>,
 *   next: Record<string, Record<string, string | null>>,
 *   getPath: (u: string, v: string) => string[],
 *   error?: string,
 *   code?: string
 * }}
 */
export function buildRoadNetworkDistanceMatrix(nodes = [], edges = []) {
  if (!nodes || nodes.length < 3) {
    return {
      ok: false,
      error: "Diperlukan minimal 3 simpul untuk membentuk Siklus Hamilton (TSP).",
      code: "TOO_FEW_NODES",
      targetNodeIds: [],
      dist: {},
      next: {},
      getPath: () => []
    };
  }

  const nodeMap = new Map();
  const allNodeIds = [];
  const targetNodeIds = [];

  for (const node of nodes) {
    nodeMap.set(node.id, node);
    allNodeIds.push(node.id);
    // Simpul yang wajib dikunjungi adalah selain waypoint
    if (node.type !== 'waypoint') {
      targetNodeIds.push(node.id);
    }
  }

  // Jika semua simpul ditandai waypoint (kasus ekstrem), anggap semua simpul sebagai target
  if (targetNodeIds.length < 3) {
    return {
      ok: false,
      error: `Hanya ada ${targetNodeIds.length} lokasi tempat/tujuan. Minimal 3 lokasi tempat (bukan sekadar tikungan/waypoint) diperlukan untuk rute TSP.`,
      code: "TOO_FEW_PLACES",
      targetNodeIds,
      dist: {},
      next: {},
      getPath: () => []
    };
  }

  // Inisialisasi matriks jarak dan next untuk Floyd-Warshall
  const dist = {};
  const next = {};

  for (const u of allNodeIds) {
    dist[u] = {};
    next[u] = {};
    for (const v of allNodeIds) {
      dist[u][v] = u === v ? 0 : Infinity;
      next[u][v] = null;
    }
  }

  // Isi bobot dari edges yang dibuat pengguna
  if (edges && edges.length > 0) {
    for (const edge of edges) {
      const u = nodeMap.get(edge.from);
      const v = nodeMap.get(edge.to);
      if (!u || !v) continue;

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

      // Graf jalan dua arah (undirected)
      if (weight < dist[edge.from][edge.to]) {
        dist[edge.from][edge.to] = weight;
        dist[edge.to][edge.from] = weight;
        next[edge.from][edge.to] = edge.to;
        next[edge.to][edge.from] = edge.from;
      }
    }
  }

  // Algoritma Floyd-Warshall untuk mencari shortest path antar seluruh simpul jaringan jalan
  for (const k of allNodeIds) {
    for (const i of allNodeIds) {
      for (const j of allNodeIds) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = Math.round((dist[i][k] + dist[k][j]) * 100) / 100;
          next[i][j] = next[i][k];
        }
      }
    }
  }

  // Periksa apakah semua targetNodeIds saling terhubung melalui jalan yang dibuat
  for (let i = 0; i < targetNodeIds.length; i++) {
    for (let j = i + 1; j < targetNodeIds.length; j++) {
      const u = targetNodeIds[i];
      const v = targetNodeIds[j];
      if (dist[u][v] === Infinity) {
        return {
          ok: false,
          error: `Lokasi "${u}" dan "${v}" belum terhubung oleh jalan/sisi. Silakan tambahkan sisi (edge) untuk menghubungkannya.`,
          code: "DISCONNECTED_TARGETS",
          targetNodeIds,
          dist,
          next,
          getPath: () => []
        };
      }
    }
  }

  // Fungsi rekonstruksi lintasan lengkap melewati waypoint
  const getPath = (u, v) => {
    if (dist[u]?.[v] === undefined || dist[u][v] === Infinity) return [];
    if (u === v) return [u];

    const path = [u];
    let curr = u;
    while (curr !== v) {
      const nextNode = next[curr]?.[v];
      if (!nextNode) return [];
      path.push(nextNode);
      curr = nextNode;
    }
    return path;
  };

  // Bangun matriks jarak tereduksi khusus untuk simpul target TSP
  const targetDist = {};
  for (const u of targetNodeIds) {
    targetDist[u] = {};
    for (const v of targetNodeIds) {
      targetDist[u][v] = dist[u][v];
    }
  }

  return {
    ok: true,
    targetNodeIds,
    dist: targetDist,
    fullDist: dist,
    next,
    getPath
  };
}
