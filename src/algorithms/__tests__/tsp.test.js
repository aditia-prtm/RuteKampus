import { describe, it, expect } from 'vitest';
import { solveTSP } from '../solveTSP.js';
import { SAMPLE_GRAPHS } from '../../data/sampleGraphs.js';

describe('Traveling Salesperson Problem (TSP) - Nearest Neighbor Heuristic', () => {
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
    expect(res.result.tour.length).toBe(4);
    expect(res.result.tour[0]).toBe('A');
    expect(res.result.tour[res.result.tour.length - 1]).toBe('A');
    expect(res.result.totalWeight).toBe(30);
  });

  it('2. Persegi A-B-C-D -> Menghasilkan Siklus Hamilton valid', () => {
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
        { from: 'A', to: 'C', weight: 14.14 },
        { from: 'B', to: 'D', weight: 14.14 }
      ]
    };

    const res = solveTSP(graph, 'A');
    expect(res.ok).toBe(true);
    expect(res.result.tour.length).toBe(5);
    expect(res.result.tour[0]).toBe('A');
    expect(res.result.tour[res.result.tour.length - 1]).toBe('A');
  });

  it('3. Error jika kurang dari 3 simpul (TOO_FEW_NODES)', () => {
    const graph = {
      nodes: [
        { id: 'A', x: 0, y: 0 },
        { id: 'B', x: 10, y: 0 }
      ],
      edges: [
        { from: 'A', to: 'B', weight: 10 }
      ]
    };

    const res = solveTSP(graph, 'A');
    expect(res.ok).toBe(false);
    expect(res.code).toBe('TOO_FEW_NODES');
  });

  it('4. Error jika ada simpul yang terputus / terisolasi (DISCONNECTED_TARGETS)', () => {
    const graph = {
      nodes: [
        { id: 'A', x: 0, y: 0 },
        { id: 'B', x: 10, y: 0 },
        { id: 'C', x: 20, y: 0 }
      ],
      edges: [
        { from: 'A', to: 'B', weight: 10 }
        // C terisolasi
      ]
    };

    const res = solveTSP(graph, 'A');
    expect(res.ok).toBe(false);
    expect(res.code).toBe('DISCONNECTED_TARGETS');
  });

  it('5. Error jika terdapat simpul dengan derajat < 2 pada graf murni (LOW_DEGREE_NODES)', () => {
    // Graf garis A-B-C-D: simpul A dan D berderajat 1 (mustahil membentuk Siklus Hamilton)
    const graph = {
      nodes: [
        { id: 'A', x: 0, y: 0 },
        { id: 'B', x: 10, y: 0 },
        { id: 'C', x: 20, y: 0 },
        { id: 'D', x: 30, y: 0 }
      ],
      edges: [
        { from: 'A', to: 'B', weight: 10 },
        { from: 'B', to: 'C', weight: 10 },
        { from: 'C', to: 'D', weight: 10 }
      ]
    };

    const res = solveTSP(graph, 'A');
    expect(res.ok).toBe(false);
    expect(res.code).toBe('LOW_DEGREE_NODES');
  });

  it('6. Peta Kampus Unsri Palembang -> Berhasil menghasilkan rute tur keliling kampus', () => {
    const startNode = SAMPLE_GRAPHS[0].nodes.find((n) => n.type === 'place')?.id || 'Gerbang';
    const placeCount = SAMPLE_GRAPHS[0].nodes.filter((n) => n.type === 'place').length;
    const res = solveTSP(SAMPLE_GRAPHS[0], startNode);
    expect(res.ok).toBe(true);
    expect(res.result.algorithm).toBe('nearest-neighbor');
    expect(res.result.tour.length).toBe(placeCount + 1); // Setiap lokasi dikunjungi tepat satu kali + kembali ke titik awal
    expect(res.result.tour[0]).toBe(startNode);
    expect(res.result.tour[res.result.tour.length - 1]).toBe(startNode);
    expect(res.result.fullTour.length).toBeGreaterThan(placeCount + 1); // melewati waypoints jalan fisik
    expect(res.result.totalWeight).toBeGreaterThan(0);
  });

  it('7. Graf Kustom: sisi penutup harus menggunakan bobot sisi langsung (tidak boleh jalan pintas multi-hop)', () => {
    // Topologi pentagon yang sama persis seperti pengujian pengguna:
    // A-E: 10, E-D: 7, D-C: 11, C-B: 9, A-C: 14, B-A: 80
    const graph = {
      nodes: [
        { id: 'A', x: 300, y: 80 },
        { id: 'B', x: 470, y: 200 },
        { id: 'C', x: 410, y: 370 },
        { id: 'D', x: 190, y: 370 },
        { id: 'E', x: 130, y: 200 }
      ],
      edges: [
        { from: 'A', to: 'B', weight: 80 },
        { from: 'B', to: 'C', weight: 9 },
        { from: 'C', to: 'D', weight: 11 },
        { from: 'D', to: 'E', weight: 7 },
        { from: 'E', to: 'A', weight: 10 },
        { from: 'A', to: 'C', weight: 14 },
        { from: 'B', to: 'D', weight: 15 },
        { from: 'C', to: 'E', weight: 12 }
      ]
    };

    const res = solveTSP(graph, 'A');
    expect(res.ok).toBe(true);
    // Tur yang sah: A -> E (10) -> D (7) -> C (11) -> B (9) -> A (80)
    expect(res.result.tour).toEqual(['A', 'E', 'D', 'C', 'B', 'A']);
    // Total bobot wajib 10 + 7 + 11 + 9 + 80 = 117 (BUKAN 60 karena tidak boleh jalan pintas lewat C lagi)
    expect(res.result.totalWeight).toBe(117);
  });
});
