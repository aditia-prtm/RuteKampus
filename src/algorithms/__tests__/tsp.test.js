import { describe, it, expect } from 'vitest';
import { solveTSP } from '../solveTSP.js';
import { SAMPLE_GRAPHS } from '../../data/sampleGraphs.js';

describe('Traveling Salesperson Problem (TSP) - Topologi Sisi Graf Murni', () => {
  it('1. Segitiga A-B-C -> Siklus Hamilton melewati 3 simpul dan kembali ke awal (1 siklus)', () => {
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

    const res = solveTSP(graph, 'A', { algorithm: 'brute-force' });
    expect(res.ok).toBe(true);
    expect(res.result.totalCycles).toBe(1);
    expect(res.result.totalWeight).toBe(30);
    expect(res.result.tour[0]).toBe('A');
    expect(res.result.tour[res.result.tour.length - 1]).toBe('A');
  });

  it('2. Persegi A-B-C-D hanya dengan sisi keliling -> Tepat 1 Siklus Hamilton', () => {
    const graph = {
      nodes: [
        { id: 'A', x: 0, y: 0 },
        { id: 'B', x: 10, y: 0 },
        { id: 'C', x: 10, y: 10 },
        { id: 'D', x: 0, y: 10 }
      ],
      edges: [
        { from: 'A', to: 'B', weight: 10 },
        { from: 'B', to: 'C', weight: 10 },
        { from: 'C', to: 'D', weight: 10 },
        { from: 'D', to: 'A', weight: 10 }
      ]
    };

    const res = solveTSP(graph, 'A', { algorithm: 'brute-force' });
    expect(res.ok).toBe(true);
    expect(res.result.totalCycles).toBe(1);
    expect(res.result.totalWeight).toBe(40);
  });

  it('3. Graf Lengkap K4 (Persegi + 2 Diagonal) -> Menghasilkan tepat 3 Siklus Hamilton', () => {
    const graph = {
      nodes: [
        { id: 'A', x: 0, y: 0 },
        { id: 'B', x: 10, y: 0 },
        { id: 'C', x: 10, y: 10 },
        { id: 'D', x: 0, y: 10 }
      ],
      edges: [
        { from: 'A', to: 'B', weight: 10 },
        { from: 'B', to: 'C', weight: 10 },
        { from: 'C', to: 'D', weight: 10 },
        { from: 'D', to: 'A', weight: 10 },
        { from: 'A', to: 'C', weight: 20 },
        { from: 'B', to: 'D', weight: 20 }
      ]
    };

    const res = solveTSP(graph, 'A', { algorithm: 'brute-force' });
    expect(res.ok).toBe(true);
    expect(res.result.totalCycles).toBe(3); // Tepat 3 siklus di K4
    expect(res.result.totalWeight).toBe(40); // Siklus keliling paling minimum
  });

  it('4. Error jika simpul buntu/derajat < 2 (NODE_DEGREE_TOO_LOW)', () => {
    const graph = {
      nodes: [
        { id: 'A', x: 0, y: 0 },
        { id: 'B', x: 10, y: 0 },
        { id: 'C', x: 5, y: 10 }
      ],
      edges: [
        { from: 'A', to: 'B', weight: 10 },
        { from: 'B', to: 'C', weight: 10 },
        { from: 'A', to: 'B', weight: 10 }
      ]
    };

    const res = solveTSP(graph, 'A');
    expect(res.ok).toBe(false);
    expect(res.code).toBe('NODE_DEGREE_TOO_LOW');
  });

  it('5. Graf Kampus Unsri Palembang -> Menghasilkan tepat 6 Siklus Hamilton nyata pada sisi jalan', () => {
    const res = solveTSP(SAMPLE_GRAPHS[0], 'Terminal', { algorithm: 'brute-force' });
    expect(res.ok).toBe(true);
    expect(res.result.totalCycles).toBe(6);
    expect(res.result.totalWeight).toBe(1284.7);
    expect(res.result.tour[0]).toBe('Terminal');
    expect(res.result.tour[res.result.tour.length - 1]).toBe('Terminal');
  });
});
