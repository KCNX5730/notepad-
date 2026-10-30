import { ProjectFile, EditorSettings, GitBranch } from '../types';

export const DEFAULT_SETTINGS: EditorSettings = {
  theme: 'notepad-classic',
  fontSize: 14,
  fontFamily: "'Fira Code', 'Consolas', 'Courier New', monospace",
  tabSize: 2,
  wordWrap: true,
  autoSave: true,
  autoSaveDelay: 1000,
  liveReload: true,
  liveReloadDelay: 400,
  autoCloseTags: true,
  showLineNumbers: true,
  showMinimap: false,
  formatOnSave: false,
  emmetEnabled: true,
};

export const SAMPLE_PROJECTS: { id: string; name: string; description: string; files: ProjectFile[] }[] = [
  {
    id: 'starter-showcase',
    name: 'Modern Web Showcase',
    description: 'Interactive HTML5 web application with modern CSS gradients, glassmorphism, counter, and task manager.',
    files: [
      {
        id: 'file-1',
        name: 'index.html',
        path: '/index.html',
        type: 'html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Notepad++ Web Studio Showcase</title>
  <link rel="stylesheet" href="style.css">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
</head>
<body>
  <div class="app-container">
    <header class="header">
      <div class="badge">Created in Notepad++ HTML Studio</div>
      <h1>Interactive Web Designer</h1>
      <p class="subtitle">Edit HTML, CSS, and JS with instant live preview, Emmet, and zero latency.</p>
    </header>

    <main class="grid">
      <!-- Feature Card 1 -->
      <section class="card glass">
        <div class="card-icon">⚡</div>
        <h2>Instant Counter</h2>
        <p>Interactive JavaScript component running directly in sandboxed iframe.</p>
        <div class="counter-box">
          <button id="dec-btn" class="btn btn-secondary">-</button>
          <span id="counter-value" class="counter-num">0</span>
          <button id="inc-btn" class="btn btn-primary">+</button>
        </div>
      </section>

      <!-- Feature Card 2 -->
      <section class="card glass">
        <div class="card-icon">🎨</div>
        <h2>Theme Styler</h2>
        <p>Change dynamic accent palette in real-time.</p>
        <div class="color-palette">
          <button class="color-dot dot-blue active" data-color="#3b82f6"></button>
          <button class="color-dot dot-emerald" data-color="#10b981"></button>
          <button class="color-dot dot-purple" data-color="#8b5cf6"></button>
          <button class="color-dot dot-rose" data-color="#f43f5e"></button>
          <button class="color-dot dot-amber" data-color="#f59e0b"></button>
        </div>
        <button id="notify-btn" class="btn btn-outline" style="margin-top: 14px; width: 100%;">
          Send Console Notification
        </button>
      </section>

      <!-- Feature Card 3 -->
      <section class="card glass col-span-full">
        <div class="card-icon">✨</div>
        <h2>Quick Task Tracker</h2>
        <div class="todo-input-row">
          <input type="text" id="task-input" placeholder="Type a new goal and press enter..." />
          <button id="add-task-btn" class="btn btn-primary">Add Task</button>
        </div>
        <ul id="task-list" class="task-list">
          <li class="task-item completed">
            <span>Explore multi-tab code editor</span>
            <span class="tag">Done</span>
          </li>
          <li class="task-item">
            <span>Test Emmet expansion (e.g. div.btn>span*2)</span>
            <span class="tag">Pending</span>
          </li>
          <li class="task-item">
            <span>Try Responsive Device View</span>
            <span class="tag">Pending</span>
          </li>
        </ul>
      </section>
    </main>

    <footer class="footer">
      <p>💡 Tip: Use <kbd>Ctrl + S</kbd> to save, <kbd>F5</kbd> to run, and the device switcher above to preview on mobile!</p>
    </footer>
  </div>

  <script src="app.js"></script>
</body>
</html>`,
      },
      {
        id: 'file-2',
        name: 'style.css',
        path: '/style.css',
        type: 'css',
        content: `:root {
  --primary: #3b82f6;
  --primary-hover: #2563eb;
  --bg-gradient: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
  --card-bg: rgba(255, 255, 255, 0.06);
  --card-border: rgba(255, 255, 255, 0.12);
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
}

body {
  min-height: 100vh;
  background: var(--bg-gradient);
  color: var(--text-main);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px 16px;
}

.app-container {
  max-width: 860px;
  width: 100%;
}

.header {
  text-align: center;
  margin-bottom: 32px;
}

.badge {
  display: inline-block;
  padding: 4px 14px;
  background: rgba(59, 130, 246, 0.15);
  border: 1px solid rgba(59, 130, 246, 0.4);
  color: #60a5fa;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 12px;
}

h1 {
  font-size: 2.2rem;
  font-weight: 800;
  letter-spacing: -0.5px;
  margin-bottom: 8px;
  background: linear-gradient(to right, #ffffff, #93c5fd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: var(--text-muted);
  font-size: 1rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 28px;
}

.col-span-full {
  grid-column: 1 / -1;
}

.card {
  padding: 24px;
  border-radius: 16px;
  backdrop-filter: blur(12px);
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.25);
}

.card-icon {
  font-size: 28px;
  margin-bottom: 12px;
}

.card h2 {
  font-size: 1.25rem;
  margin-bottom: 6px;
  color: #ffffff;
}

.card p {
  color: var(--text-muted);
  font-size: 0.88rem;
  line-height: 1.5;
  margin-bottom: 18px;
}

.counter-box {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background: rgba(0, 0, 0, 0.25);
  padding: 12px;
  border-radius: 12px;
}

.counter-num {
  font-size: 2rem;
  font-weight: 800;
  min-width: 60px;
  text-align: center;
  color: var(--primary);
}

.btn {
  padding: 10px 18px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn-primary {
  background: var(--primary);
  color: #fff;
}

.btn-primary:hover {
  background: var(--primary-hover);
  box-shadow: 0 0 15px var(--primary);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}

.btn-outline {
  background: transparent;
  border: 1px solid var(--card-border);
  color: var(--text-main);
}

.btn-outline:hover {
  background: rgba(255, 255, 255, 0.05);
}

.color-palette {
  display: flex;
  gap: 10px;
  align-items: center;
}

.color-dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform 0.2s;
}

.color-dot:hover {
  transform: scale(1.15);
}

.color-dot.active {
  border-color: #fff;
  transform: scale(1.1);
}

.dot-blue { background: #3b82f6; }
.dot-emerald { background: #10b981; }
.dot-purple { background: #8b5cf6; }
.dot-rose { background: #f43f5e; }
.dot-amber { background: #f59e0b; }

.todo-input-row {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

.todo-input-row input {
  flex: 1;
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid var(--card-border);
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
  font-size: 0.95rem;
  outline: none;
}

.todo-input-row input:focus {
  border-color: var(--primary);
}

.task-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  font-size: 0.9rem;
}

.task-item.completed span:first-child {
  text-decoration: line-through;
  color: var(--text-muted);
}

.tag {
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
}

.task-item.completed .tag {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
}

.footer {
  text-align: center;
  color: var(--text-muted);
  font-size: 0.85rem;
}

kbd {
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8rem;
}`,
      },
      {
        id: 'file-3',
        name: 'app.js',
        path: '/app.js',
        type: 'js',
        content: `// Interactive script executed inside the sandbox
console.log("🚀 App loaded successfully inside Notepad++ Web Studio!");

let count = 0;
const countEl = document.getElementById('counter-value');
const incBtn = document.getElementById('inc-btn');
const decBtn = document.getElementById('dec-btn');

incBtn.addEventListener('click', () => {
  count++;
  countEl.textContent = count;
  console.log("Counter incremented:", count);
});

decBtn.addEventListener('click', () => {
  count--;
  countEl.textContent = count;
  console.log("Counter decremented:", count);
});

// Dynamic Theme Switcher
const colorDots = document.querySelectorAll('.color-dot');
colorDots.forEach(dot => {
  dot.addEventListener('click', () => {
    colorDots.forEach(d => d.classList.remove('active'));
    dot.classList.add('active');
    const chosenColor = dot.getAttribute('data-color');
    document.documentElement.style.setProperty('--primary', chosenColor);
    console.log("Theme accent color updated to:", chosenColor);
  });
});

// Console Notification Button
document.getElementById('notify-btn').addEventListener('click', () => {
  console.info("Information: You clicked the notification trigger at", new Date().toLocaleTimeString());
  alert("Interactive script is working smoothly!");
});

// Task Manager
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;
  
  const li = document.createElement('li');
  li.className = 'task-item';
  li.innerHTML = '<span>' + text + '</span><span class="tag">New</span>';
  
  li.addEventListener('click', () => {
    li.classList.toggle('completed');
    const tag = li.querySelector('.tag');
    if (li.classList.contains('completed')) {
      tag.textContent = 'Done';
    } else {
      tag.textContent = 'Pending';
    }
  });

  taskList.appendChild(li);
  taskInput.value = '';
  console.log("New task added:", text);
}

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTask();
});
`,
      },
    ],
  },
  {
    id: 'retro-game',
    name: 'Retro Arcade Brick Breaker',
    description: 'A complete HTML5 Canvas arcade game with paddle physics, scores, and keyboard/touch controls.',
    files: [
      {
        id: 'game-1',
        name: 'index.html',
        path: '/index.html',
        type: 'html',
        content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Arcade Brick Breaker</title>
  <style>
    body {
      margin: 0;
      background: #0b0f19;
      color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      font-family: 'Courier New', monospace;
      overflow: hidden;
    }
    h1 {
      margin: 8px 0;
      color: #38bdf8;
      text-shadow: 0 0 10px #38bdf8;
    }
    canvas {
      background: #111827;
      border: 3px solid #38bdf8;
      box-shadow: 0 0 25px rgba(56, 189, 248, 0.4);
      border-radius: 8px;
      touch-action: none;
    }
    .hud {
      margin-top: 10px;
      font-size: 16px;
      color: #94a3b8;
    }
  </style>
</head>
<body>
  <h1>⚡ NEON BREAKER ⚡</h1>
  <canvas id="gameCanvas" width="480" height="340"></canvas>
  <div class="hud">Use Left/Right Arrows or Drag Paddle with Mouse/Touch</div>
  <script src="game.js"></script>
</body>
</html>`,
      },
      {
        id: 'game-2',
        name: 'game.js',
        path: '/game.js',
        type: 'js',
        content: `const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let ballRadius = 7;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2.5;
let dy = -2.5;

let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

let rightPressed = false;
let leftPressed = false;

let score = 0;
let lives = 3;

const brickRowCount = 4;
const brickColumnCount = 6;
const brickWidth = 65;
const brickHeight = 18;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 18;

const colors = ["#f43f5e", "#fb923c", "#facc15", "#4ade80"];

const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1, color: colors[r % colors.length] };
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
  else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
  else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
});

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  const relativeX = e.clientX - rect.left;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
});

canvas.addEventListener("touchmove", (e) => {
  const rect = canvas.getBoundingClientRect();
  const relativeX = e.touches[0].clientX - rect.left;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
});

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          b.status = 0;
          score++;
          if (score === brickRowCount * brickColumnCount) {
            alert("CONGRATULATIONS, YOU WON!");
            document.location.reload();
          }
        }
      }
    }
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#38bdf8";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight, 5) : ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#a855f7";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = bricks[c][r].color;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawScore() {
  ctx.font = "14px 'Courier New', monospace";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("Score: " + score, 15, 20);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  collisionDetection();

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      lives--;
      if (!lives) {
        // Game Over
        ctx.font = "24px 'Courier New', monospace";
        ctx.fillStyle = "#ef4444";
        ctx.fillText("GAME OVER", canvas.width / 2 - 70, canvas.height / 2);
        return;
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2.5;
        dy = -2.5;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 6;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 6;
  }

  x += dx;
  y += dy;
  requestAnimationFrame(draw);
}

draw();
console.log("Game loop initiated!");`,
      },
    ],
  },
  {
    id: 'blank-canvas',
    name: 'Blank HTML5 Starter',
    description: 'Clean HTML5, CSS, and JS starter template.',
    files: [
      {
        id: 'blank-1',
        name: 'index.html',
        path: '/index.html',
        type: 'html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blank Document</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      margin: 40px;
      line-height: 1.6;
    }
    h1 {
      color: #2563eb;
    }
  </style>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>Start writing HTML, CSS, and JavaScript here.</p>
  <script>
    console.log("Hello from blank starter!");
  </script>
</body>
</html>`,
      },
    ],
  },
];

const STORAGE_KEY_FILES = 'notepad_studio_files_v1';
const STORAGE_KEY_TABS = 'notepad_studio_tabs_v1';
const STORAGE_KEY_ACTIVE = 'notepad_studio_active_v1';
const STORAGE_KEY_SETTINGS = 'notepad_studio_settings_v1';
const STORAGE_KEY_GIT = 'notepad_studio_git_v1';

export function loadStoredFiles(): ProjectFile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FILES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to load stored files from localStorage', err);
  }
  return SAMPLE_PROJECTS[0].files;
}

export function saveStoredFiles(files: ProjectFile[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_FILES, JSON.stringify(files));
  } catch (err) {
    console.error('Failed to save files to localStorage', err);
  }
}

export function loadStoredSettings(): EditorSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (err) {
    console.warn('Failed to load settings', err);
  }
  return DEFAULT_SETTINGS;
}

export function saveStoredSettings(settings: EditorSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings', err);
  }
}

export function loadStoredTabs(): { tabs: string[]; activeId: string | null } {
  try {
    const rawTabs = localStorage.getItem(STORAGE_KEY_TABS);
    const activeId = localStorage.getItem(STORAGE_KEY_ACTIVE);
    if (rawTabs) {
      const parsed = JSON.parse(rawTabs);
      return { tabs: parsed, activeId };
    }
  } catch (e) {
    console.warn('Failed to load tabs', e);
  }
  return { tabs: ['file-1'], activeId: 'file-1' };
}

export function saveStoredTabs(tabs: string[], activeId: string | null): void {
  try {
    localStorage.setItem(STORAGE_KEY_TABS, JSON.stringify(tabs));
    if (activeId) localStorage.setItem(STORAGE_KEY_ACTIVE, activeId);
  } catch (e) {
    console.error('Failed to save tabs', e);
  }
}

export function loadStoredGit(): GitBranch[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_GIT);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to load git history', e);
  }
  return [
    {
      name: 'main',
      isCurrent: true,
      commits: [
        {
          id: 'c-init',
          hash: '8f3b9a1',
          message: 'Initial project commit',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          author: 'Developer',
          files: {},
        },
      ],
    },
  ];
}

export function saveStoredGit(branches: GitBranch[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_GIT, JSON.stringify(branches));
  } catch (e) {
    console.error('Failed to save git history', e);
  }
}
