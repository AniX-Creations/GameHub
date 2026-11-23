import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Moon, RotateCcw, Sparkles, Sun } from "lucide-react";

type Theme = "modern" | "classic";
type Stage = "intro" | "table" | "reveal";

const randomLetter = () => String.fromCharCode(65 + Math.floor(Math.random() * 25));

export default function IllusionGame({ onBack }: { onBack: () => void }) {
  const [theme, setTheme] = useState<Theme>("modern");
  const [stage, setStage] = useState<Stage>("intro");
  const [secret, setSecret] = useState(randomLetter);
  const [round, setRound] = useState(1);

  const symbols = useMemo(() => {
    const next = Array.from({ length: 99 }, (_, index) => ({
      number: index + 1,
      letter: (index + 1) % 9 === 0 ? secret : randomLetter(),
    }));
    return next;
  }, [secret]);

  const start = () => {
    setSecret(randomLetter());
    setStage("table");
  };

  const playAgain = () => {
    setRound(value => value + 1);
    setSecret(randomLetter());
    setStage("intro");
  };

  return (
    <main className={`app-shell illusion-shell theme-${theme}`}>
      <header className="topbar">
        <button className="brand brand-button" onClick={onBack} aria-label="Back to GameHub">
          <span className="brand-mark">A<span>X</span></span>
          <span><strong>AniX</strong><small>CREATIONS · GAMEHUB</small></span>
        </button>
        <div className="top-actions">
          <span className="edition-label">GAME 02 · MIND MAGIC</span>
          <div className="theme-switch" role="group" aria-label="Choose visual theme">
            <button className={theme === "modern" ? "selected" : ""} onClick={() => setTheme("modern")} aria-pressed={theme === "modern"}><Sun size={15}/> Modern</button>
            <button className={theme === "classic" ? "selected" : ""} onClick={() => setTheme("classic")} aria-pressed={theme === "classic"}><Moon size={15}/> Classic</button>
          </div>
        </div>
      </header>

      <section className="illusion-hero">
        <div className="eyebrow"><span className="eyebrow-dot"/> ANI X ORIGINAL <span className="eyebrow-divider">/</span> ROUND {round.toString().padStart(2, "0")}</div>
        <div className="illusion-title-row">
          <div><h1>The <span>Letter</span> Illusion</h1><p>A little arithmetic. A little mystery. Think of a number and let the magic do the rest.</p></div>
          <div className="magic-emblem"><Sparkles size={32}/></div>
        </div>
      </section>

      <section className="illusion-stage">
        <div className="illusion-stage-head">
          <div><span className="status-dot playing"/><strong>{stage === "intro" ? "YOUR CHALLENGE" : stage === "table" ? "THE LETTER BOARD" : "THE REVEAL"}</strong></div>
          <span className="board-hint">NO CALCULATOR NEEDED</span>
        </div>

        {stage === "intro" && <div className="illusion-intro">
          <div className="magic-orbit"><span/><span/><span/><Sparkles size={34}/></div>
          <div className="illusion-intro-copy">
            <span className="step-tag">01 / THINK</span>
            <h2>Keep a two-digit number in your mind.</h2>
            <p>Don't tell anyone. Just follow these steps carefully and remember the letter beside your final answer.</p>
            <ol className="magic-instructions">
              <li><b>Choose</b> any number from 10 to 99.</li>
              <li><b>Add</b> the two digits together.</li>
              <li><b>Subtract</b> that digit sum from your original number.</li>
              <li><b>Find</b> your answer on the letter board and remember its letter.</li>
            </ol>
            <button className="primary-button magic-primary" onClick={start}>Show me the board <ArrowRight size={16}/></button>
          </div>
        </div>}

        {stage === "table" && <div className="letter-board-wrap">
          <div className="letter-board-intro"><span className="step-tag">02 / FIND YOUR LETTER</span><h2>Find your answer below.</h2><p>Look up the number you got after subtracting. Remember the letter next to it. Don't click the reveal until you're ready.</p></div>
          <div className="letter-grid" aria-label="Number and letter grid">
            {symbols.map(item => <div className="letter-tile" key={item.number}><span>{item.number}</span><b>{item.letter}</b></div>)}
          </div>
          <div className="letter-board-actions"><button className="secondary-button" onClick={onBack}><ArrowLeft size={15}/> Game library</button><button className="primary-button magic-primary" onClick={() => setStage("reveal")}><Eye size={16}/> Reveal my letter</button></div>
        </div>}

        {stage === "reveal" && <div className="magic-reveal">
          <div className="reveal-rings"><span/><span/><span/><div>{secret}</div></div>
          <span className="step-tag">03 / THE MAGIC MOMENT</span>
          <h2>Is this your letter?</h2>
          <p>Focus on the letter you remembered from the number board.</p>
          <div className="revealed-letter">{secret}</div>
          <p className="reveal-footnote">Every valid two-digit number leads to a multiple of nine. Those positions share the same letter.</p>
          <div className="letter-board-actions centered"><button className="secondary-button" onClick={() => setStage("table")}><EyeOff size={15}/> Back to board</button><button className="primary-button magic-primary" onClick={playAgain}><RotateCcw size={15}/> Play again</button></div>
        </div>}
      </section>
      <footer className="site-footer"><button onClick={onBack}>← GAME LIBRARY</button><span>ANI X CREATIONS <b>·</b> A LITTLE BIT OF MAGIC</span><span>GAME 02 <b>·</b> ILLUSION</span></footer>
    </main>
  );
}