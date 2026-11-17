import { describe, it, expect } from 'vitest';
import { solveTSP } from '../solveTSP.js';

describe('Traveling Salesperson Problem with Road Network & Waypoints', () => {
  it('1. Segitiga A-B-C -> Siklus Hamilton melewati 3 simpul dan kembali ke awal', () => {
    const graph = {
      nodes: [
        { id: 'A', x: 0, y: 0 },
        { id: 'B', x: 10, y: 0 },
        { id: 'C', x: 5, y: 8.66 }
      ],
      edges: [
        { from: 'A', to: 'B', weight: 10 },
        { from: 'B', to: 'C', weight: 10 },
        { from: 'C', to: 'A', weight: 10 }
      ]
    };

    const res = solveTSP(graph, 'A');
    expect(res.ok).toBe(true);
    expect(res.result.tour[0]).toBe('A');
    expect(res.result.tour[res.result.tour.length - 1]).toBe('A');
    expect(res.result.totalWeight).toBe(30);
  });

  it('2. Mendukung simpul perantara (waypoint/tikungan)', () => {
    // 3 lokasi tempat (A, B, C) dengan waypoint W1 di antara A dan B
    const graph = {
      nodes: [
        { id: 'A', type: 'place', x: 0, y: 0 },
        { id: 'W1', type: 'waypoint', x: 5, y: 0 }, // Tikungan jalan
        { id: 'B', type: 'place', x: 10, y: 0 },
        { id: 'C', type: 'place', x: 5, y: 10 }
      ],
      edges: [
        { from: 'A', to: 'W1', weight: 5 },
        { from: 'W1', to: 'B', weight: 5 },
        { from: 'B', to: 'C', weight: 11.18 },
        { from: 'C', to: 'A', weight: 11.18 }
      ]
    };

    const res = solveTSP(graph, 'A');
    expect(res.ok).toBe(true);
    // Tour utama hanya mencakup lokasi tempat A, B, C
    expect(res.result.tour.length).toBe(4); // A -> ... -> A
    expect(res.result.tour).not.toContain('W1');
    // Full tour menyertakan tikungan W1 saat melewati rute A ke B
    expect(res.result.fullTour).toContain('W1');
  });

  it('3. Error jika ada simpul target yang tidak terhubung', () => {
    const graph = {
      nodes: [
        { id: 'A', type: 'place' },
        { id: 'B', type: 'place' },
        { id: 'C', type: 'place' }
      ],
      edges: [
        { from: 'A', to: 'B', weight: 10 }
        // C terisolasi
      ]
    };

    const res = solveTSP(graph);
    expect(res.ok).toBe(false);
    expect(res.code).toBe('DISCONNECTED_TARGETS');
  });
});
