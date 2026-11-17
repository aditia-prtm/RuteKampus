/**
 * Optimasi lokal 2-Opt untuk mengurai persilangan rute dan memperpendek total jarak Siklus Hamilton.
 *
 * @param {string[]} initialTour
 * @param {Record<string, Record<string, number>>} dist
 * @returns {{
 *   tour: string[],
 *   totalCost: number,
 *   improvementCount: number,
 *   steps: Array<any>
 * }}
 */
export function optimizeTwoOpt(initialTour, dist) {
  if (!initialTour || initialTour.length <= 3) {
    return {
      tour: initialTour,
      totalCost: 0,
      improvementCount: 0,
      steps: []
    };
  }

  let tour = [...initialTour];
  const steps = [];
  let improved = true;
  let improvementCount = 0;
  const maxIterations = 50;
  let iteration = 0;

  function calculateTourLength(t) {
    let len = 0;
    for (let i = 0; i < t.length - 1; i++) {
      len += dist[t[i]]?.[t[i + 1]] ?? 0;
    }
    return Math.round(len * 100) / 100;
  }

  let currentTotalCost = calculateTourLength(tour);

  while (improved && iteration < maxIterations) {
    improved = false;
    iteration++;

    const n = tour.length - 1; // Jumlah simpul unik

    for (let i = 0; i < n - 1; i++) {
      for (let j = i + 2; j < n; j++) {
        // Jangan tukar jika sisi bersebelahan di penutup siklus
        if (i === 0 && j === n - 1) continue;

        const u1 = tour[i];
        const v1 = tour[i + 1];
        const u2 = tour[j];
        const v2 = tour[j + 1];

        const currentDist = (dist[u1]?.[v1] ?? 0) + (dist[u2]?.[v2] ?? 0);
        const newDist = (dist[u1]?.[u2] ?? 0) + (dist[v1]?.[v2] ?? 0);
        const delta = Math.round((newDist - currentDist) * 100) / 100;

        if (delta < -0.01) {
          // Lakukan pembalikan segmen antara i + 1 dan j
          const segment = tour.slice(i + 1, j + 1).reverse();
          tour = [...tour.slice(0, i + 1), ...segment, ...tour.slice(j + 1)];
          currentTotalCost = calculateTourLength(tour);
          improvementCount++;
          improved = true;

          steps.push({
            type: 'two-opt-step',
            title: `Optimasi 2-Opt #${improvementCount}`,
            explanation: `Memotong dan menukar sisi persilangan (${u1}—${v1} & ${u2}—${v2}) menjadi (${u1}—${u2} & ${v1}—${v2}). Rute hemat ${Math.abs(delta)} meter. Jarak baru: ${currentTotalCost} m.`,
            highlight: {
              nodes: [u1, v1, u2, v2],
              edges: [`${u1}-${u2}`, `${v1}-${v2}`]
            },
            pseudocodeLines: [7, 8],
            data: {
              swappedNodes: [u1, v1, u2, v2],
              savedDistance: Math.abs(delta),
              currentTour: [...tour],
              currentTotalCost
            }
          });

          break; // restart dari awal setelah perbaikan
        }
      }
      if (improved) break;
    }
  }

  return {
    tour,
    totalCost: currentTotalCost,
    improvementCount,
    steps
  };
}
