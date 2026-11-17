# AGENTS.md — Traveling Salesperson Problem (TSP) Visualizer

Read this file fully before writing any code. It describes what the project is, how it is structured, and the rules you must follow.

## 1. Project overview

An interactive web app that **visualizes the Traveling Salesperson Problem (TSP)** step by step, on top of a real-world map (Leaflet / OpenStreetMap) focusing on the Unsri Bukit Besar Palembang campus and an abstract graph mode.

- **Context**: final project for the course *Struktur Diskrit 2* (Discrete Structures), team of 4 university students.
- **Audience**: lecturers and classmates. The app must be visually polished and the algorithm must be easy to explain.
- **Real-world scenario**: A campus shuttle / bus starting at the Campus Terminal, visiting every faculty/building at Unsri Palembang exactly once, and returning to the terminal with the minimum total travel distance.
- **Language of the UI text: Indonesian (Bahasa Indonesia).** Code, comments, identifiers and this file are in English.

### The problem

Given a set of locations (faculties/buildings) and distances between them, find the **shortest closed tour (Hamiltonian Cycle) that visits each location exactly once and returns to the starting location**.

## 2. Tech stack

- **Vite + React** (JavaScript, `.js` / `.jsx`). Do NOT use Next.js.
- **react-router-dom** for page routing (`/` for landing page, `/visualizer` for simulation).
- **Tailwind CSS**
- **Framer Motion** for animation
- **react-leaflet + Leaflet** for the map (OpenStreetMap tiles, keep attribution)
- **Vitest** for unit tests of `src/algorithms/`
- Keep dependencies minimal.

## 3. Folder structure and architecture rules

```
src/
├── algorithms/   # Pure JavaScript, NO React / Leaflet imports
│   └── __tests__/
├── components/
│   ├── common/   # Universal shared components (Navbar, Footer, Card, Badge, etc.)
│   └── features/ # Feature-driven components (landing, campus, custom-graph, stepper, map, graph)
├── pages/        # Lightweight orchestrators: LandingPage.jsx, CampusVisualizerPage.jsx, CustomGraphPage.jsx
├── hooks/        # useStepPlayer.js, useGraphEditor.js
├── data/         # sampleGraphs.js, content.js (static text and pseudocode)
├── lib/          # generic helpers (formatting, haversine)
└── styles/
```

**Hard rules:**

1. `src/algorithms/` must **never** import React, Leaflet, or anything browser-specific. Functions there are pure: input graph in, result out.
2. `components/` only **render** data. They never run the algorithm themselves.
3. Interaction logic (playback, graph editing) lives in `hooks/`.
4. Static text, pseudocode and sample graphs live in `data/`, not inside components.
5. Support two modes: Real Map (Unsri Palembang) and Abstract Graph, with interactive Click-to-Add Node / Custom Graph Editor.
6. **No monolithic files / Keep code modular**: Avoid piling up massive code in single files (>150-200 lines). Break sections down into subcomponents in `components/features/<feature>/` and common elements in `components/common/`.
7. **Maintain `TECH_STACK.md`:** Any agent or developer adding a new dependency, library, or technology, or expanding an existing module to use a new tool MUST update `TECH_STACK.md` immediately to reflect the changes.

## 4. Algorithms (in `src/algorithms/`)

`solveTSP(graph, startNodeId, options)` is the single entry point. It returns:

```js
{
  ok: true,
  steps: [ /* Step objects */ ],
  result: {
    totalWeight,      // total distance of the optimal/heuristic tour
    tour: ["Terminal", "FK", "FH", "Fasilkom", ..., "Terminal"], // ordered node ids
    tourEdges: [ /* list of edge segments representing the tour */ ]
  }
}
```

Pipeline:
1. **Validate & Distance Matrix**: Build distance matrix between all target locations (using direct edge weights or Haversine distances).
2. **Nearest Neighbor (Greedy Tour Construction)**: Build an initial valid Hamiltonian cycle step-by-step.
3. **2-Opt Local Search / Exact Branch & Bound**: Optimize the tour by untangling crossing edges.
4. **Final Tour Result**: Compute total distance, verify Hamiltonian cycle properties.

## 5. Testing (required for `algorithms/`)

Write Vitest tests for:
- Triangle graph (A-B-C-A)
- Square graph (A-B-C-D-A)
- K4 complete graph
- Invariant verification: visits every node exactly once and returns to the start node.
