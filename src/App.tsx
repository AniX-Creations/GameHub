import { useState } from "react";
import { ArrowRight, Gamepad2, Sparkles, Telescope } from "lucide-react";
import SnakeGame from "./games/snake/SnakeGame";
import IllusionGame from "./games/illusion/IllusionGame";

type Game = "snake" | "illusion" | null;

export default function App() {
  const [selectedGame, setSelectedGame] = useState<Game>(null);

  if (selectedGame === "snake") return <SnakeGame onBack={() => setSelectedGame(null)} />;
  if (selectedGame === "illusion") return <IllusionGame onBack={() => setSelectedGame(null)} />;

  return (
    <main className="app-shell hub-shell">
      <header className="topbar">
        <a className="brand" href="./" aria-label="AniX Creations GameHub">
          <span className="brand-mark">A<span>X</span></span>
          <span><strong>AniX</strong><small>CREATIONS · GAMEHUB</small></span>
        </a>
        <span className="edition-label">THE BROWSER ARCADE</span>
      </header>
      <section className="hub-hero">
        <div className="eyebrow"><span className="eyebrow-dot"/> ANI X CREATIONS <span className="eyebrow-divider">/</span> EST. IN CURIOSITY</div>
        <h1>Small games.<br/><span>Big memories.</span></h1>
        <p>A collection of classic ideas from the early days of coding, brought back to life for the modern browser.</p>
        <div className="hub-stats"><span><b>02</b> GAMES READY</span><span><b>02</b> THEMES EACH</span><span><b>01</b> CREATIVE SPIRIT</span></div>
      </section>
      <section className="hub-games">
        <div className="hub-section-title"><span>THE GAME COLLECTION</span><span>SELECT A GAME <ArrowRight size={13}/></span></div>
        <div className="hub-game-grid">
          <button className="hub-game-card snake-hub-card" onClick={() => setSelectedGame("snake")}>
            <div className="hub-card-art snake-art"><div className="mini-snake"><i/><i/><i/><i/><i/></div><span className="mini-food"/></div>
            <div className="hub-card-copy"><span className="step-tag">GAME 01 · ARCADE</span><h2>Snake Challenge</h2><p>Collect, grow, and navigate your way through three maze layouts.</p><span className="hub-card-link">PLAY GAME <ArrowRight size={15}/></span></div>
          </button>
          <button className="hub-game-card illusion-hub-card" onClick={() => setSelectedGame("illusion")}>
            <div className="hub-card-art illusion-art"><div className="mini-orbit"><i/><i/><i/><b>?</b></div><span className="mini-stars">✦　·　✧</span></div>
            <div className="hub-card-copy"><span className="step-tag">GAME 02 · MIND MAGIC</span><h2>The Letter Illusion</h2><p>Pick a number, follow the simple maths, and let the program reveal your letter.</p><span className="hub-card-link">TRY THE MAGIC <ArrowRight size={15}/></span></div>
          </button>
          <div className="hub-game-card upcoming-card">
            <div className="hub-card-art solar-art"><Telescope size={45}/><span>COMING NEXT</span></div>
            <div className="hub-card-copy"><span className="step-tag">GAME 03 · EXPLORATION</span><h2>Solar System Explorer</h2><p>Explore the planets, learn their details, and take the original quiz.</p><span className="hub-card-link muted-link">IN DEVELOPMENT</span></div>
          </div>
        </div>
      </section>
      <footer className="site-footer"><span>© 2026 ANIX CREATIONS</span><span>MADE TO PLAY. BUILT TO LAST.</span><span>GAMEHUB <b>·</b> 02 / 03</span></footer>
    </main>
  );
}