/* =========================================================
   Pathfinding Visualizer
   Implements BFS, DFS, Dijkstra's Algorithm and A* Search
   on an interactive grid, with animated visualization.
   ========================================================= */

const ROWS = 18;
const COLS = 42;

const START_NODE = { row: 9, col: 8 };
const END_NODE = { row: 9, col: COLS - 9 };

let grid = [];
let isMouseDown = false;
let draggingNode = null; // 'start' | 'end' | null
let isVisualizing = false;

const gridEl = document.getElementById("grid");
const algoSelect = document.getElementById("algoSelect");
const speedSelect = document.getElementById("speedSelect");
const visualizeBtn = document.getElementById("visualizeBtn");
const clearWallsBtn = document.getElementById("clearWallsBtn");
const clearBoardBtn = document.getElementById("clearBoardBtn");
const mazeBtn = document.getElementById("mazeBtn");
const statusText = document.getElementById("statusText");
const statsText = document.getElementById("statsText");

/* ---------------- Grid construction ---------------- */

function createNode(row, col) {
  return {
    row,
    col,
    isStart: row === START_NODE.row && col === START_NODE.col,
    isEnd: row === END_NODE.row && col === END_NODE.col,
    isWall: false,
    distance: Infinity,
    gCost: Infinity,
    hCost: 0,
    fCost: Infinity,
    isVisited: false,
    previousNode: null,
  };
}

function buildGrid() {
  grid = [];
  for (let r = 0; r < ROWS; r++) {
    const row = [];
    for (let c = 0; c < COLS; c++) {
      row.push(createNode(r, c));
    }
    grid.push(row);
  }
}

function renderGrid() {
  gridEl.innerHTML = "";
  gridEl.style.gridTemplateColumns = `repeat(${COLS}, 24px)`;
  gridEl.style.gridTemplateRows = `repeat(${ROWS}, 24px)`;

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cellEl = document.createElement("div");
      cellEl.classList.add("cell");
      cellEl.dataset.row = r;
      cellEl.dataset.col = c;
      applyNodeClass(cellEl, grid[r][c]);

      cellEl.addEventListener("mousedown", () => handleMouseDown(r, c));
      cellEl.addEventListener("mouseenter", () => handleMouseEnter(r, c));
      cellEl.addEventListener("mouseup", () => handleMouseUp());

      gridEl.appendChild(cellEl);
    }
  }
}

function cellEl(row, col) {
  return gridEl.children[row * COLS + col];
}

function applyNodeClass(el, node) {
  el.className = "cell";
  if (node.isStart) el.classList.add("start");
  else if (node.isEnd) el.classList.add("end");
  else if (node.isWall) el.classList.add("wall");
}

/* ---------------- Mouse interactions ---------------- */

function handleMouseDown(row, col) {
  if (isVisualizing) return;
  const node = grid[row][col];
  if (node.isStart) { draggingNode = "start"; return; }
  if (node.isEnd) { draggingNode = "end"; return; }

  isMouseDown = true;
  toggleWall(row, col);
}

function handleMouseEnter(row, col) {
  if (isVisualizing) return;

  if (draggingNode) {
    moveSpecialNode(draggingNode, row, col);
    return;
  }
  if (isMouseDown) {
    toggleWall(row, col, true);
  }
}

function handleMouseUp() {
  isMouseDown = false;
  draggingNode = null;
}

document.addEventListener("mouseup", () => {
  isMouseDown = false;
  draggingNode = null;
});

function toggleWall(row, col, forceWall = false) {
  const node = grid[row][col];
  if (node.isStart || node.isEnd) return;
  node.isWall = forceWall ? true : !node.isWall;
  applyNodeClass(cellEl(row, col), node);
}

function moveSpecialNode(type, row, col) {
  const target = grid[row][col];
  if (target.isWall) return;
  if (type === "start" && target.isEnd) return;
  if (type === "end" && target.isStart) return;

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (type === "start") grid[r][c].isStart = false;
      if (type === "end") grid[r][c].isEnd = false;
    }
  }
  if (type === "start") { target.isStart = true; START_NODE.row = row; START_NODE.col = col; }
  if (type === "end") { target.isEnd = true; END_NODE.row = row; END_NODE.col = col; }

  renderGrid();
}

/* ---------------- Reset helpers ---------------- */

function resetPathVisuals() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const node = grid[r][c];
      node.isVisited = false;
      node.distance = Infinity;
      node.gCost = Infinity;
      node.fCost = Infinity;
      node.previousNode = null;
      const el = cellEl(r, c);
      if (!node.isStart && !node.isEnd && !node.isWall) {
        el.className = "cell";
      }
    }
  }
  statsText.textContent = "";
}

function clearWalls() {
  if (isVisualizing) return;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      grid[r][c].isWall = false;
    }
  }
  resetPathVisuals();
  renderGrid();
  statusText.textContent = "Walls cleared.";
}

function resetBoard() {
  if (isVisualizing) return;
  buildGrid();
  renderGrid();
  statusText.textContent = "Board reset. Choose an algorithm and hit Visualize.";
  statsText.textContent = "";
}

function generateMaze() {
  if (isVisualizing) return;
  buildGrid();
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const node = grid[r][c];
      if (node.isStart || node.isEnd) continue;
      if (Math.random() < 0.28) node.isWall = true;
    }
  }
  renderGrid();
  statusText.textContent = "Random maze generated.";
  statsText.textContent = "";
}

/* ---------------- Neighbor helper ---------------- */

function getNeighbors(node) {
  const { row, col } = node;
  const neighbors = [];
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < ROWS - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < COLS - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter((n) => !n.isWall);
}

function manhattan(a, b) {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

/* ---------------- Algorithms ---------------- */
/* Each algorithm returns an array of nodes in the order they
   were visited, which is used to drive the animation. */

function bfs(startNode, endNode) {
  const visitedInOrder = [];
  const queue = [startNode];
  startNode.isVisited = true;

  while (queue.length) {
    const current = queue.shift();
    visitedInOrder.push(current);
    if (current === endNode) return visitedInOrder;

    for (const neighbor of getNeighbors(current)) {
      if (!neighbor.isVisited) {
        neighbor.isVisited = true;
        neighbor.previousNode = current;
        queue.push(neighbor);
      }
    }
  }
  return visitedInOrder;
}

function dfs(startNode, endNode) {
  const visitedInOrder = [];
  const stack = [startNode];

  while (stack.length) {
    const current = stack.pop();
    if (current.isVisited) continue;
    current.isVisited = true;
    visitedInOrder.push(current);
    if (current === endNode) return visitedInOrder;

    for (const neighbor of getNeighbors(current)) {
      if (!neighbor.isVisited) {
        neighbor.previousNode = current;
        stack.push(neighbor);
      }
    }
  }
  return visitedInOrder;
}

function dijkstra(startNode, endNode) {
  const visitedInOrder = [];
  const unvisited = [];

  for (const row of grid) for (const node of row) unvisited.push(node);
  startNode.distance = 0;

  while (unvisited.length) {
    unvisited.sort((a, b) => a.distance - b.distance);
    const current = unvisited.shift();

    if (current.isWall) continue;
    if (current.distance === Infinity) break;

    current.isVisited = true;
    visitedInOrder.push(current);
    if (current === endNode) return visitedInOrder;

    for (const neighbor of getNeighbors(current)) {
      const tentativeDistance = current.distance + 1;
      if (tentativeDistance < neighbor.distance) {
        neighbor.distance = tentativeDistance;
        neighbor.previousNode = current;
      }
    }
  }
  return visitedInOrder;
}

function astar(startNode, endNode) {
  const visitedInOrder = [];
  const openSet = [startNode];
  startNode.gCost = 0;
  startNode.fCost = manhattan(startNode, endNode);

  while (openSet.length) {
    openSet.sort((a, b) => a.fCost - b.fCost);
    const current = openSet.shift();

    if (current.isVisited) continue;
    current.isVisited = true;
    visitedInOrder.push(current);
    if (current === endNode) return visitedInOrder;

    for (const neighbor of getNeighbors(current)) {
      const tentativeG = current.gCost + 1;
      if (tentativeG < neighbor.gCost) {
        neighbor.previousNode = current;
        neighbor.gCost = tentativeG;
        neighbor.fCost = tentativeG + manhattan(neighbor, endNode);
        if (!neighbor.isVisited) openSet.push(neighbor);
      }
    }
  }
  return visitedInOrder;
}

function getShortestPath(endNode) {
  const path = [];
  let current = endNode;
  while (current !== null) {
    path.unshift(current);
    current = current.previousNode;
  }
  return path;
}

/* ---------------- Animation & orchestration ---------------- */

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function setControlsDisabled(disabled) {
  isVisualizing = disabled;
  visualizeBtn.disabled = disabled;
  clearWallsBtn.disabled = disabled;
  clearBoardBtn.disabled = disabled;
  mazeBtn.disabled = disabled;
  algoSelect.disabled = disabled;
}

async function visualize() {
  if (isVisualizing) return;
  resetPathVisuals();
  setControlsDisabled(true);

  const algo = algoSelect.value;
  const speed = Number(speedSelect.value);
  const startNode = grid[START_NODE.row][START_NODE.col];
  const endNode = grid[END_NODE.row][END_NODE.col];

  const algoNames = {
    bfs: "Breadth-First Search",
    dfs: "Depth-First Search",
    dijkstra: "Dijkstra's Algorithm",
    astar: "A* Search",
  };

  statusText.textContent = `Running ${algoNames[algo]}...`;

  let visitedInOrder;
  if (algo === "bfs") visitedInOrder = bfs(startNode, endNode);
  else if (algo === "dfs") visitedInOrder = dfs(startNode, endNode);
  else if (algo === "dijkstra") visitedInOrder = dijkstra(startNode, endNode);
  else visitedInOrder = astar(startNode, endNode);

  for (const node of visitedInOrder) {
    if (node.isStart || node.isEnd) continue;
    const el = cellEl(node.row, node.col);
    el.classList.add("visited");
    await sleep(speed);
  }

  const pathFound = endNode.previousNode !== null || startNode === endNode;

  if (!pathFound) {
    statusText.textContent = `${algoNames[algo]} finished — no path exists.`;
    statsText.textContent = `${visitedInOrder.length} nodes explored`;
    setControlsDisabled(false);
    return;
  }

  const path = getShortestPath(endNode);
  for (const node of path) {
    if (node.isStart || node.isEnd) continue;
    const el = cellEl(node.row, node.col);
    el.classList.remove("visited");
    el.classList.add("path");
    await sleep(speed * 1.5);
  }

  statusText.textContent = `${algoNames[algo]} finished.`;
  statsText.textContent = `${visitedInOrder.length} nodes explored · path length ${path.length - 1}`;
  setControlsDisabled(false);
}

/* ---------------- Wire up buttons ---------------- */

visualizeBtn.addEventListener("click", visualize);
clearWallsBtn.addEventListener("click", clearWalls);
clearBoardBtn.addEventListener("click", resetBoard);
mazeBtn.addEventListener("click", generateMaze);

/* ---------------- Init ---------------- */

buildGrid();
renderGrid();
