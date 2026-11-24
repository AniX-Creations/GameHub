import { useEffect, useState } from "react";
import { ArrowLeft, RotateCcw, Cpu, Users, Trophy, Sparkles, Move, CircleHelp } from "lucide-react";

type Mode = "classic" | "advanced";
type Difficulty = "easy" | "medium" | "hard";
type Player = "X" | "O";
type Cell = Player | null;
type Phase = "setup" | "playing" | "finished";

const WIN_LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

function getWinner(board: Cell[]): Player | null {
  for (const [a,b,c] of WIN_LINES) if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  return null;
}
function available(board: Cell[]) { return board.map((cell, index) => cell === null ? index : -1).filter(index => index >= 0); }
function minimax(board: Cell[], player: Player, depth: number): { score: number; move: number | null } {
  const winner = getWinner(board);
  if (winner === "O") return { score: 10 - depth, move: null };
  if (winner === "X") return { score: depth - 10, move: null };
  const empty = available(board);
  if (!empty.length) return { score: 0, move: null };
  let best = { score: player === "O" ? -Infinity : Infinity, move: empty[0] };
  for (const index of empty) {
    const next = [...board]; next[index] = player;
    const result = minimax(next, player === "O" ? "X" : "O", depth + 1);
    if ((player === "O" && result.score > best.score) || (player === "X" && result.score < best.score)) best = { score: result.score, move: index };
  }
  return best;
}
function chooseComputerMove(board: Cell[], level: Difficulty): number {
  const empty = available(board);
  if (level === "easy") return empty[Math.floor(Math.random() * empty.length)];
  const winningMove = (symbol: Player) => empty.find(index => { const next=[...board]; next[index]=symbol; return getWinner(next) === symbol; });
  const win = winningMove("O");
  if (win !== undefined) return win;
  const block = winningMove("X");
  if (block !== undefined) return block;
  if (level === "hard") {
    const best = minimax(board, "O", 0);
    return best.move ?? empty[Math.floor(Math.random() * empty.length)];
  }
  if (board[4] === null) return 4;
  const corners = [0,2,6,8].filter(index => board[index] === null);
  if (corners.length) return corners[Math.floor(Math.random() * corners.length)];
  return empty[Math.floor(Math.random() * empty.length)];
}

export default function TicTacToe({ onBack }: { onBack: () => void }) {
  const [mode, setMode] = useState<Mode>("classic");
  const [opponent, setOpponent] = useState<"computer" | "human">("computer");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [phase, setPhase] = useState<Phase>("setup");
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<Player>("X");
  const [firstPlayer, setFirstPlayer] = useState<Player>("X");
  const [selected, setSelected] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [message, setMessage] = useState("");
  const winner = getWinner(board);
  const isComputerTurn = mode === "classic" && opponent === "computer" && turn === "O" && phase === "playing";

  const startGame = () => {
    const first: Player = mode === "classic" && opponent === "computer" && Math.random() < 0.5 ? "O" : "X";
    setBoard(Array(9).fill(null)); setTurn(first); setFirstPlayer(first); setSelected(null); setMoves(0); setMessage("");
    setPhase("playing");
  };

  useEffect(() => {
    if (!isComputerTurn) return;
    const timer = window.setTimeout(() => {
      setBoard(current => {
        if (getWinner(current)) return current;
        const move = chooseComputerMove(current, difficulty);
        if (move === undefined) return current;
        const next = [...current]; next[move] = "O";
        if (getWinner(next)) setMessage("Computer wins this round.");
        else if (available(next).length === 0) setMessage("It's a draw. Well played.");
        return next;
      });
      setMoves(current => current + 1);
      setTurn("X");
    }, 420);
    return () => window.clearTimeout(timer);
  }, [isComputerTurn, difficulty]);

  useEffect(() => {
    if (phase === "playing" && (winner || (mode === "classic" && available(board).length === 0))) {
      setPhase("finished");
      if (winner) setMessage(winner === "X" ? "Player X wins!" : (opponent === "computer" && mode === "classic" ? "Computer wins this round." : "Player O wins!"));
      else setMessage("It's a draw. Well played.");
    }
  }, [board, mode, opponent, phase, winner]);

  const placeClassic = (index: number) => {
    if (phase !== "playing" || board[index] || isComputerTurn || winner) return;
    const next = [...board]; next[index] = turn; setBoard(next); setMoves(value => value + 1); setTurn(turn === "X" ? "O" : "X");
  };

  const moveAdvanced = (from: number, to: number) => {
    if (phase !== "playing" || board[to] || board[from] !== turn || from === to || advancedPlaced[turn] < 3) return;
    const next = [...board]; next[to] = turn; next[from] = null;
    setBoard(next); setMoves(value => value + 1); setSelected(null);
    setTurn(turn === "X" ? "O" : "X");
  };

  const handleCell = (index: number) => {
    if (mode === "classic") { placeClassic(index); return; }
    if (phase !== "playing" || winner) return;
    if (selected !== null) {
      if (selected === index) { setSelected(null); return; }
      if (board[index] === null) { moveAdvanced(selected, index); return; }
    }
    if (advancedPlaced[turn] < 3 && board[index] === null) {
      const next = [...board]; next[index] = turn;
      setBoard(next); setMoves(value => value + 1); setTurn(turn === "X" ? "O" : "X");
      return;
    }
    if (advancedPlaced[turn] === 3 && board[index] === turn) setSelected(index);
  };

  const resetToSetup = () => { setPhase("setup"); setBoard(Array(9).fill(null)); setSelected(null); setMoves(0); setMessage(""); };
  const advancedPlaced = { X: board.filter(cell => cell === "X").length, O: board.filter(cell => cell === "O").length };
  const status = phase === "setup" ? "CONFIGURE YOUR MATCH" : phase === "finished" ? "ROUND COMPLETE" : isComputerTurn ? "COMPUTER IS THINKING" : mode === "advanced" ? `PLAYER ${turn} · MOVE A MARKER` : `PLAYER ${turn}’S TURN`;

  return (
    <main className="app-shell ttt-shell">
      <header className="topbar">
        <button className="ttt-back" onClick={onBack}><ArrowLeft size={15}/> GAMEHUB</button>
        <span className="edition-label">GAME 04 · STRATEGY</span>
      </header>
      <section className="ttt-hero">
        <div className="eyebrow"><span className="eyebrow-dot"/> ANI X CREATIONS <span className="eyebrow-divider">/</span> THINK AHEAD</div>
        <h1>Tic Tac <span>Toe.</span></h1>
        <p>A familiar little battle of logic. Choose classic rules or try the advanced moving-marker challenge.</p>
      </section>

      {phase === "setup" ? (
        <section className="ttt-setup">
          <div className="ttt-setup-heading"><span className="panel-title">SET UP YOUR MATCH</span><span className="ttt-step">01 / 01</span></div>
          <div className="ttt-mode-grid">
            <button className={`ttt-mode-card ${mode === "classic" ? "active" : ""}`} onClick={() => setMode("classic")}>
              <span className="ttt-mode-icon">X<span>O</span></span><b>Classic Mode</b><small>Three in a row wins. The timeless 3 × 3 game.</small>
              <i>{mode === "classic" ? "SELECTED" : "SELECT MODE"}</i>
            </button>
            <button className={`ttt-mode-card ${mode === "advanced" ? "active" : ""}`} onClick={() => setMode("advanced")}>
              <span className="ttt-mode-icon advanced-icon"><Move/></span><b>Advanced Mode</b><small>Each player gets only 3 markers. Move them around to make a line.</small>
              <i>{mode === "advanced" ? "SELECTED" : "SELECT MODE"}</i>
            </button>
          </div>
          {mode === "classic" ? (
            <div className="ttt-options">
              <div className="control-group"><label>PLAY STYLE</label>
                <div className="ttt-choice-row">
                  <button className={opponent === "computer" ? "chosen" : ""} onClick={() => setOpponent("computer")}><Cpu size={16}/> Single Player</button>
                  <button className={opponent === "human" ? "chosen" : ""} onClick={() => setOpponent("human")}><Users size={16}/> Two Players</button>
                </div>
              </div>
              {opponent === "computer" ? <div className="control-group"><label>COMPUTER DIFFICULTY</label>
                <div className="ttt-levels">
                  {(["easy","medium","hard"] as Difficulty[]).map(level => <button key={level} className={difficulty === level ? "chosen" : ""} onClick={() => setDifficulty(level)}><b>{level.toUpperCase()}</b><small>{level === "easy" ? "Random moves" : level === "medium" ? "Smart, beatable play" : "Unbeatable strategy"}</small></button>)}
                </div>
              </div> : <p className="ttt-note">Take turns on the same board. Player X goes first.</p>}
            </div>
          ) : <div className="ttt-advanced-note"><Move size={18}/><div><b>Three markers. Endless possibilities.</b><p>Players take turns placing their three markers. Once all three are on the board, select one of your markers and move it to any empty square. First to line up three wins.</p></div></div>}
          <button className="primary-button ttt-start" onClick={startGame}>START GAME <Sparkles size={15}/></button>
        </section>
      ) : (
        <section className="ttt-game-layout">
          <div className="ttt-board-panel">
            <div className="ttt-board-heading"><div><span className={`status-dot ${phase === "finished" ? "over" : "playing"}`}/>{status}</div><span className="ttt-mode-label">{mode === "classic" ? "CLASSIC" : "ADVANCED"}</span></div>
            <div className="ttt-board" role="group" aria-label="Tic tac toe board">
              {board.map((cell, index) => {
                const isMovable = mode === "advanced" && cell === turn && phase === "playing" && advancedPlaced[turn] === 3;
                const isDropTarget = mode === "advanced" && selected !== null && cell === null && phase === "playing";
                return <button key={index} className={`ttt-cell ${cell ? `mark-${cell.toLowerCase()}` : ""} ${selected === index ? "selected" : ""} ${isDropTarget ? "drop-target" : ""}`} onClick={() => handleCell(index)} onDragOver={event => { if (mode === "advanced" && selected !== null) event.preventDefault(); }} onDrop={event => { event.preventDefault(); const from = Number(event.dataTransfer.getData("text/plain")); if (Number.isInteger(from)) moveAdvanced(from, index); }} onDragStart={event => { if (!isMovable) { event.preventDefault(); return; } event.dataTransfer.setData("text/plain", String(index)); setSelected(index); }} draggable={isMovable} aria-label={`Square ${index + 1}: ${cell ?? "empty"}`}>
                  {cell && <span className="ttt-mark">{cell}</span>}
                  {!cell && <span className="ttt-cell-number">{index + 1}</span>}
                </button>;
              })}
            </div>
            {mode === "advanced" && phase === "playing" && <div className="ttt-advanced-status"><span>PLAYER X <b>{advancedPlaced.X}/3</b></span><span>PLAYER O <b>{advancedPlaced.O}/3</b></span><small>{selected !== null ? "Choose an empty square to move your marker." : "Select or drag one of your markers to an empty square."}</small></div>}
            {phase === "finished" ? <div className="ttt-result"><Trophy size={20}/><b>{message}</b><button className="primary-button" onClick={startGame}>PLAY AGAIN <RotateCcw size={14}/></button></div> :
              <div className="ttt-game-footer"><span>{mode === "classic" && opponent === "computer" ? `YOU: X · COMPUTER: O` : "PLAYER X: X · PLAYER O: O"}</span><span>MOVE {moves + 1}</span></div>}
          </div>
          <aside className="ttt-side-panel">
            <div className="panel-title">MATCH DETAILS <span className="panel-number">04</span></div>
            <div className="ttt-turn-card"><small>{phase === "finished" ? "FINAL STATUS" : "CURRENT TURN"}</small><strong>{phase === "finished" ? "DONE" : isComputerTurn ? "CPU" : `PLAYER ${turn}`}</strong><span>{phase === "finished" ? message : isComputerTurn ? "Choosing a move..." : mode === "advanced" ? "Move one marker" : opponent === "computer" && turn === "X" ? "Your move" : "Make your move"}</span></div>
            {mode === "classic" && opponent === "computer" && <div className="ttt-detail-row"><span>COMPUTER LEVEL</span><b>{difficulty.toUpperCase()}</b></div>}
            {mode === "advanced" && <div className="ttt-detail-row"><span>MARKERS ON BOARD</span><b>{advancedPlaced.X + advancedPlaced.O} / 6</b></div>}
            <div className="ttt-rules"><b><CircleHelp size={15}/> HOW TO PLAY</b>
              {mode === "classic" ? <p>Take turns placing X and O. Line up three horizontally, vertically, or diagonally to win. Fill the board with no winner and it is a draw.</p> : <p>Each player has three markers. After placing all three, select one of your own markers and move it to an empty square. Keep moving until someone makes a line of three.</p>}
            </div>
            <button className="secondary-button ttt-reset" onClick={resetToSetup}><RotateCcw size={14}/> NEW MATCH</button>
          </aside>
        </section>
      )}
      <footer className="site-footer"><span>© 2026 ANIX CREATIONS</span><span>MADE TO PLAY. BUILT TO LAST.</span><span>GAMEHUB <b>·</b> 04 / 04</span></footer>
    </main>
  );
}
