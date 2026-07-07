# Pathfinding Visualizer

An interactive grid-based visualizer for classic pathfinding algorithms — watch **BFS**, **DFS**, **Dijkstra's Algorithm**, and **A\* Search** explore a maze in real time and trace out the shortest path.

**Live Demo:** _add your GitHub Pages link here after deployment_

---

## Features

- **4 algorithms** implemented from scratch: Breadth-First Search, Depth-First Search, Dijkstra's Algorithm, and A* Search (Manhattan-distance heuristic)
- **Interactive grid** — draw/erase walls by clicking and dragging, or drag the start and target nodes anywhere on the board
- **Random maze generator** for quickly testing algorithms against obstacles
- **Adjustable animation speed** (Fast / Normal / Slow)
- **Live stats** — nodes explored and shortest-path length shown after every run
- Zero dependencies — pure HTML, CSS, and vanilla JavaScript

## Why this project

Most beginner web projects stop at CRUD apps. This one is built to demonstrate core computer-science fundamentals — graph traversal, shortest-path algorithms, heuristics, and time/space complexity trade-offs — through a visual, interactive medium.

| Algorithm | Guarantees Shortest Path? | Time Complexity | Notes |
|---|---|---|---|
| BFS | Yes (unweighted grid) | O(V + E) | Explores level by level |
| DFS | No | O(V + E) | Explores depth-first; used for comparison |
| Dijkstra's | Yes | O(V² ) (array-based) | Explores by cumulative distance |
| A* Search | Yes (admissible heuristic) | O(E) average, better in practice | Uses Manhattan distance to guide search toward the target |

## Tech Stack

- **HTML5** — grid structure & semantic layout
- **CSS3** — custom properties, grid layout, keyframe animations
- **JavaScript (ES6+)** — algorithm implementations, DOM manipulation, async/await-driven animation

## Project Structure

```
pathfinding-visualizer/
├── index.html      # Page structure & controls
├── style.css        # Visual design & animations
├── script.js         # Grid logic + BFS/DFS/Dijkstra/A* implementations
└── README.md
```

## Running Locally

No build step or dependencies required.

```bash
git clone https://github.com/<your-username>/pathfinding-visualizer.git
cd pathfinding-visualizer
```

Then simply open `index.html` in any browser, or serve it locally:

```bash
python3 -m http.server 8000
# visit http://localhost:8000
```

## How to Use

1. Choose an algorithm from the dropdown.
2. Click and drag on the grid to draw walls (or hit **Generate Maze** for a random layout).
3. Drag the orange **start** node or red **target** node to reposition them.
4. Hit **Visualize** to watch the algorithm explore the grid and trace the shortest path.
5. Use **Clear Walls** to keep the same start/target but remove obstacles, or **Reset Board** to start fresh.

## Possible Extensions

- Weighted terrain (variable-cost cells) to better showcase Dijkstra vs. BFS
- Recursive-division maze generation for structured mazes
- Bidirectional search and Greedy Best-First Search
- Diagonal movement support

## Author

**Suhani Bansal**
[LinkedIn](https://linkedin.com/in/suhanibansal20) · suhanibansal20@gmail.com

## License

MIT
