import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Check, CircleHelp, Gamepad2, Moon, Pause, Play, RotateCcw, Sun, Trophy } from "lucide-react";
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  createStartingSnake,
  getMazeCells,
  getNextSnake,
  getRandomFood,
  getScorePerFood,
  isOpposite,
  type Direction,
  type MazeId,
  type Point,
} from "./snakeEngine";

type Theme = "modern" | "classic";
type GameStatus = "ready" | "playing" | "paused" | "over" | "won";

const initialTheme = (): Theme => {
  try { return localStorage.getItem("anix-snake-theme") === "classic" ? "classic" : "modern"; }
  catch { return "modern"; }
};

const bestKey = "anix-snake-best";
const initialBest = () => {
  try { return Number(localStorage.getItem(bestKey) || 0); }
  catch { return 0; }
};

export default function SnakeGame() {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [level, setLevel] = useState(1);
  const [maze, setMaze] = useState<MazeId>(1);
  const [status, setStatus] = useState<GameStatus>("ready");
  const [snake, setSnake] = useState<Point[]>(createStartingSnake);
  const [food, setFood] = useState<Point>(() => getRandomFood(createStartingSnake(), getMazeCells(1)));
  const directionRef = useRef<Direction>("right");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(initialBest);
  const [showHelp, setShowHelp] = useState(false);
  const obstacles = useMemo(() => getMazeCells(maze), [maze]);
  const speed = [0, 100, 75, 50][level];

  const resetGame = useCallback((start = false) => {
    const nextSnake = createStartingSnake();
    directionRef.current = "right";
    setSnake(nextSnake);
    setScore(0);
    setFood(getRandomFood(nextSnake, obstacles));
    setStatus(start ? "playing" : "ready");
  }, [obstacles]);

  useEffect(() => {
    try { localStorage.setItem("anix-snake-theme", theme); } catch { /* storage is optional */ }
  }, [theme]);

  useEffect(() => {
    try { localStorage.setItem(bestKey, String(best)); } catch { /* storage is optional */ }
  }, [best]);

  useEffect(() => {
    if (status !== "playing") return;
    const timer = window.setInterval(() => {
      const result = getNextSnake(snake, directionRef.current, food, obstacles);
      if (result.crashed) {
        setStatus("over");
        return;
      }
      setSnake(result.snake);
      if (result.ate) {
        const nextScore = score + getScorePerFood(level);
        setScore(nextScore);
        if (nextScore > best) setBest(nextScore);
        setFood(getRandomFood(result.snake, obstacles));
        if (result.snake.length >= BOARD_WIDTH * BOARD_HEIGHT - obstacles.size) setStatus("won");
      }
    }, speed);
    return () => window.clearInterval(timer);
  }, [status, snake, food, obstacles, level, speed, score, best]);

  const changeDirection = useCallback((next: Direction) => {
    if (!isOpposite(directionRef.current, next)) directionRef.current = next;
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const keyMap: Record<string, Direction> = {
        ArrowUp: "up", w: "up", W: "up",
        ArrowDown: "down", s: "down", S: "down",
        ArrowLeft: "left", a: "left", A: "left",
        ArrowRight: "right", d: "right", D: "right",
      };
      const next = keyMap[event.key];
      if (next) {
        event.preventDefault();
        if (status === "over" || status === "won") resetGame(true);
        else if (status === "ready") setStatus("playing");
        changeDirection(next);
      }
      if (event.code === "Space") {
        event.preventDefault();
        setStatus(current => current === "playing" ? "paused" : current === "paused" || current === "ready" ? "playing" : current);
      }
      if (event.key === "Escape") setShowHelp(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [changeDirection, status]);

  const start = () => {
    if (status === "over" || status === "won") resetGame(true);
    else setStatus("playing");
  };

  const changeMaze = (value: string) => {
    const nextMaze = Number(value) as MazeId;
    const nextSnake = createStartingSnake();
    const nextObstacles = getMazeCells(nextMaze);
    setMaze(nextMaze);
    setSnake(nextSnake);
    directionRef.current = "right";
    setFood(getRandomFood(nextSnake, nextObstacles));
    setScore(0);
    setStatus("ready");
  };

  const obstacleCells = useMemo(() => Array.from(obstacles, value => {
    const [x, y] = value.split(",").map(Number);
    return { x, y };
  }), [obstacles]);

  const cellStyle = (point: Point) => ({
    left: `${(point.x / BOARD_WIDTH) * 100}%`,
    top: `${(point.y / BOARD_HEIGHT) * 100}%`,
    width: `${100 / BOARD_WIDTH}%`,
    height: `${100 / BOARD_HEIGHT}%`,
  });

  const statusText = status === "playing" ? "IN GAME" :
    status === "paused" ? "PAUSED" :
    status === "over" ? "GAME OVER" :
    status === "won" ? "YOU WIN" : "READY";

  return (
    <main className={`app-shell theme-${theme}`}>
      <header className="topbar">
        <a className="brand" href="./" aria-label="AniX Creations GameHub">
          <span className="brand-mark">A<span>X</span></span>
          <span><strong>AniX</strong><small>CREATIONS · GAMEHUB</small></span>
        </a>
        <div className="top-actions">
          <span className="edition-label">BROWSER ARCADE</span>
          <div className="theme-switch" role="group" aria-label="Choose visual theme">
            <button className={theme === "modern" ? "selected" : ""} onClick={() => setTheme("modern")} aria-pressed={theme === "modern"}><Sun size={15}/> Modern</button>
            <button className={theme === "classic" ? "selected" : ""} onClick={() => setTheme("classic")} aria-pressed={theme === "classic"}><Moon size={15}/> Classic</button>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot"/> GAME 01 <span className="eyebrow-divider">/</span> THE ORIGINAL ARCADE CLASSIC</div>
          <h1>Snake <span>Challenge</span></h1>
          <p>A familiar classic, rebuilt for your browser. Collect food, grow longer, and find your way through the mazes.</p>
        </div>
        <div className="hero-icon"><Gamepad2 size={34}/><span>01</span></div>
      </section>

      <section className="game-layout">
        <div className="play-column">
          <div className="board-frame">
            <div className="board-heading">
              <div><span className={`status-dot ${status}`}/><strong>{statusText}</strong></div>
              <span className="board-hint">ARROW KEYS / WASD <i>·</i> SPACE TO PAUSE</span>
            </div>
            <div className="board-wrap">
              <div className="game-board" role="img" aria-label={`Snake game board, score ${score}`}>
                {obstacleCells.map(point => <span key={`${point.x},${point.y}`} className="obstacle-cell" style={cellStyle(point)}/>)}
                <span className="food-cell" style={cellStyle(food)}/>
                {snake.map((point, index) => <span key={index} className={index === 0 ? "snake-cell snake-head" : "snake-cell"} style={cellStyle(point)}/>)}
                {status !== "playing" && (
                  <div className="board-overlay">
                    <div className="overlay-card">
                      {status === "over" ? <span className="overlay-symbol danger">!</span> : status === "won" ? <Trophy size={30}/> : <Gamepad2 size={30}/>}
                      <strong>{status === "over" ? "Game over" : status === "won" ? "Maze mastered!" : status === "paused" ? "Take a breather" : "Ready when you are"}</strong>
                      <span>{status === "over" ? "You hit a maze wall. Give it another go." : status === "won" ? "You filled the board. Incredible run." : status === "paused" ? "Your game is paused." : "Press play to start your run."}</span>
                      <button className="primary-button overlay-button" onClick={start}><Play size={15}/> {status === "paused" ? "Resume game" : status === "over" || status === "won" ? "Play again" : "Start game"}</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="board-footer"><span><span className="legend-dot food-legend"/> FOOD <b>+{getScorePerFood(level)} PTS</b></span><span><span className="legend-dot wall-legend"/> MAZE WALL</span><span className="board-size">64 × 38 GRID</span></div>
          </div>

          <div className="mobile-controls" aria-label="Touch controls">
            <button onClick={() => changeDirection("up")} aria-label="Move up"><ArrowUp/></button>
            <div><button onClick={() => changeDirection("left")} aria-label="Move left"><ArrowLeft/></button><button onClick={() => changeDirection("down")} aria-label="Move down"><ArrowDown/></button><button onClick={() => changeDirection("right")} aria-label="Move right"><ArrowRight/></button></div>
          </div>
        </div>

        <aside className="control-panel">
          <div className="panel-title"><span>GAME CONTROL</span><span className="panel-number">01 / 03</span></div>
          <div className="score-grid">
            <div className="score-card"><span>YOUR SCORE</span><strong>{score.toString().padStart(3, "0")}</strong><small>POINTS</small></div>
            <div className="score-card best-card"><span><Trophy size={12}/> PERSONAL BEST</span><strong>{best.toString().padStart(3, "0")}</strong><small>POINTS</small></div>
          </div>
          <div className="control-group">
            <label htmlFor="level">DIFFICULTY LEVEL</label>
            <select id="level" value={level} onChange={event => { setLevel(Number(event.target.value)); resetGame(false); }}>
              <option value={1}>Level 1 · Beginner</option>
              <option value={2}>Level 2 · Intermediate</option>
              <option value={3}>Level 3 · Expert</option>
            </select>
            <div className="level-indicator"><span style={{width: `${level * 33.333}%`}}/></div>
            <small className="control-note">Higher levels move faster and award more points.</small>
          </div>
          <div className="control-group">
            <label htmlFor="maze">MAZE LAYOUT</label>
            <select id="maze" value={maze} onChange={event => changeMaze(event.target.value)}>
              <option value={1}>Maze 1 · Twin pillars</option>
              <option value={2}>Maze 2 · Cross paths</option>
              <option value={3}>Maze 3 · The labyrinth</option>
            </select>
          </div>
          <div className="panel-actions">
            <button className="primary-button" onClick={start} disabled={status === "playing"}><Play size={15}/> {status === "paused" ? "Resume" : "Start game"}</button>
            <button className="secondary-button" onClick={() => setStatus(current => current === "playing" ? "paused" : current === "paused" ? "playing" : current)} disabled={status === "ready" || status === "over" || status === "won"}><Pause size={15}/> Pause</button>
            <button className="icon-button" onClick={() => resetGame(false)} aria-label="Reset game"><RotateCcw size={16}/></button>
          </div>
          <button className="help-button" onClick={() => setShowHelp(true)}><CircleHelp size={16}/> How to play <span>↗</span></button>
          <div className="panel-footnote"><Check size={13}/> Your theme and best score are saved on this device.</div>
        </aside>
      </section>

      <footer className="site-footer"><span>© 2026 ANIX CREATIONS</span><span>MADE TO PLAY. BUILT TO LAST.</span><span>GAME 01 <b>·</b> SNAKE</span></footer>

      {showHelp && <div className="modal-backdrop" role="presentation" onClick={() => setShowHelp(false)}>
        <section className="help-modal" role="dialog" aria-modal="true" aria-labelledby="help-title" onClick={event => event.stopPropagation()}>
          <button className="modal-close" onClick={() => setShowHelp(false)} aria-label="Close instructions">×</button>
          <div className="eyebrow"><span className="eyebrow-dot"/> QUICK GUIDE</div>
          <h2 id="help-title">How to play</h2>
          <p>Guide the snake to the red food pieces. Each piece makes the snake longer and adds points.</p>
          <div className="help-list">
            <div><span className="keycap">↑ ↓ ← →</span><span>Move the snake. WASD works too.</span></div>
            <div><span className="keycap">SPACE</span><span>Pause or resume the game.</span></div>
            <div><span className="keycap">WALLS</span><span>A maze wall ends your run. The board edges wrap around.</span></div>
            <div><span className="keycap">FOOD</span><span>Level 1 gives 5 points, Level 2 gives 10, and Level 3 gives 15.</span></div>
          </div>
          <button className="primary-button modal-action" onClick={() => setShowHelp(false)}>Got it</button>
        </section>
      </div>}
    </main>
  );
}