import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronRight, CircleHelp, Globe2, Pause, Play, RotateCcw, Sparkles, Telescope, X } from "lucide-react";

type Planet = { id: string; name: string; kind: string; color: string; size: number; orbit: number; period: string; description: string; facts: string[] };
type QuizQuestion = { question: string; options: string[]; answer: number; note: string };

const planets: Planet[] = [
  { id: "sun", name: "Sun", kind: "Star", color: "#ffbd55", size: 46, orbit: 0, period: "About 225 million years around the Milky Way", description: "The star at the centre of our solar system. Its gravity keeps the planets in orbit and its light and heat make life on Earth possible.", facts: ["A star made mostly of hydrogen and helium", "About 1.39 million km in diameter", "Its light takes about 8 minutes 20 seconds to reach Earth"] },
  { id: "mercury", name: "Mercury", kind: "Terrestrial planet", color: "#aaa7a2", size: 9, orbit: 88, period: "88 Earth days", description: "The smallest planet and the closest planet to the Sun. Its surface is covered with craters.", facts: ["Smallest planet in the solar system", "Has no moons", "A solar day lasts 176 Earth days"] },
  { id: "venus", name: "Venus", kind: "Terrestrial planet", color: "#e5b66f", size: 14, orbit: 225, period: "225 Earth days", description: "A world wrapped in a thick carbon-dioxide atmosphere. Its powerful greenhouse effect makes it the hottest planet.", facts: ["Hottest planetary surface in the solar system", "Rotates in the opposite direction to most planets", "Has no moons"] },
  { id: "earth", name: "Earth", kind: "Terrestrial planet", color: "#55a9e8", size: 15, orbit: 365, period: "365.25 days", description: "Our home planet, with liquid water on the surface and the only known world to support life.", facts: ["One natural satellite: the Moon", "About 71% of its surface is covered by water", "Has a protective magnetic field"] },
  { id: "mars", name: "Mars", kind: "Terrestrial planet", color: "#d96d4e", size: 12, orbit: 687, period: "687 Earth days", description: "The Red Planet has a thin atmosphere, giant volcanoes, ancient river channels and two small moons.", facts: ["Its two moons are Phobos and Deimos", "Home to Olympus Mons, a giant volcano", "Robotic rovers are exploring its surface"] },
  { id: "jupiter", name: "Jupiter", kind: "Gas giant", color: "#d6a77e", size: 31, orbit: 4333, period: "About 11.86 Earth years", description: "The largest planet, known for its colourful cloud bands and the long-lived storm called the Great Red Spot.", facts: ["Largest planet in the solar system", "Has a faint ring system", "Its moon Ganymede is larger than Mercury"] },
  { id: "saturn", name: "Saturn", kind: "Gas giant", color: "#e6d09b", size: 27, orbit: 10759, period: "About 29.4 Earth years", description: "A gas giant famous for its spectacular rings, made mostly of countless pieces of ice and rock.", facts: ["Its rings span a huge distance but are very thin", "Less dense than water on average", "Has many confirmed moons"] },
  { id: "uranus", name: "Uranus", kind: "Ice giant", color: "#8bd5d5", size: 21, orbit: 30687, period: "About 84 Earth years", description: "An ice giant with a blue-green colour from methane in its atmosphere. It rotates on its side.", facts: ["Axial tilt is about 98 degrees", "Has a faint ring system", "Atmosphere contains hydrogen, helium and methane"] },
  { id: "neptune", name: "Neptune", kind: "Ice giant", color: "#547ee8", size: 20, orbit: 60190, period: "About 165 Earth years", description: "A distant, deep-blue ice giant with supersonic winds and a dynamic atmosphere.", facts: ["The most distant recognised planet from the Sun", "Has a large moon named Triton", "Discovered in 1846"] },
  { id: "pluto", name: "Pluto", kind: "Dwarf planet", color: "#c5a58f", size: 8, orbit: 90560, period: "About 248 Earth years", description: "A fascinating dwarf planet in the Kuiper Belt. It was reclassified from planet to dwarf planet in 2006.", facts: ["Has five known moons", "Its largest moon is Charon", "NASA's New Horizons flew past it in 2015"] },
  { id: "moon", name: "Moon", kind: "Earth's natural satellite", color: "#d7dce5", size: 8, orbit: 27, period: "About 27.3 days around Earth", description: "Earth's only natural satellite. Its gravity helps drive ocean tides and it shows phases as it orbits Earth.", facts: ["About 3,475 km in diameter", "The same side generally faces Earth", "Humans first walked on it in 1969"] },
];

const questions: QuizQuestion[] = [
  { question: "Which object is at the centre of our solar system?", options: ["Earth", "The Sun", "Jupiter", "The Moon"], answer: 1, note: "The Sun is the star at the centre. Its gravity holds the solar system together." },
  { question: "Which is the smallest of the eight planets?", options: ["Mars", "Venus", "Mercury", "Neptune"], answer: 2, note: "Mercury is the smallest recognised planet. Pluto is classified as a dwarf planet." },
  { question: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Uranus"], answer: 1, note: "Iron-rich dust gives Mars much of its reddish appearance." },
  { question: "Which planet has the most prominent ring system?", options: ["Saturn", "Earth", "Mercury", "Mars"], answer: 0, note: "All four giant planets have rings, but Saturn's are by far the most spectacular." },
  { question: "Which planet is the largest?", options: ["Earth", "Saturn", "Neptune", "Jupiter"], answer: 3, note: "Jupiter is the largest planet by both diameter and mass." },
  { question: "Which planet rotates on its side?", options: ["Uranus", "Mars", "Venus", "Mercury"], answer: 0, note: "Uranus has an extreme axial tilt of about 98 degrees." },
  { question: "Which planet is the hottest?", options: ["Mercury", "Venus", "Mars", "Jupiter"], answer: 1, note: "Venus is hottest because its thick atmosphere traps heat in an extreme greenhouse effect." },
  { question: "What is the name of Earth's natural satellite?", options: ["Triton", "Phobos", "The Moon", "Europa"], answer: 2, note: "The Moon is Earth's only natural satellite." },
  { question: "What is Halley's object?", options: ["A comet", "An asteroid", "A planet", "A galaxy"], answer: 0, note: "Halley's Comet is a periodic comet that returns to the inner solar system about every 76 years." },
  { question: "Which of these is classified as a dwarf planet?", options: ["Neptune", "Pluto", "Venus", "Saturn"], answer: 1, note: "Pluto was reclassified as a dwarf planet by the IAU in 2006." },
];

type View = "explore" | "details" | "quiz";

export default function SolarSystemExplorer({ onBack }: { onBack: () => void }) {
  const [view, setView] = useState<View>("explore");
  const [selected, setSelected] = useState("earth");
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [showLabels, setShowLabels] = useState(true);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const current = planets.find(p => p.id === selected) ?? planets[3];
  const score = answers.reduce((sum, answer, index) => sum + (answer === questions[index].answer ? 1 : 0), 0);
  const chooseAnswer = (answer: number) => {
    if (answers[questionIndex] !== undefined) return;
    setAnswers(prev => [...prev, answer]);
  };
  const nextQuestion = () => {
    if (questionIndex === questions.length - 1) setFinished(true);
    else setQuestionIndex(value => value + 1);
  };
  const resetQuiz = () => { setQuestionIndex(0); setAnswers([]); setFinished(false); };

  return (
    <main className="app-shell solar-shell">
      <header className="topbar">
        <button className="brand brand-button" onClick={onBack} aria-label="Back to GameHub">
          <span className="brand-mark">A<span>X</span></span>
          <span><strong>AniX</strong><small>CREATIONS · GAMEHUB</small></span>
        </button>
        <div className="solar-top-actions"><span className="edition-label">GAME 03 · SPACE EXPLORATION</span><button className="solar-back" onClick={onBack}><ArrowLeft size={15}/> Game library</button></div>
      </header>

      <section className="solar-hero">
        <div className="eyebrow"><span className="eyebrow-dot"/> ANI X CREATIONS <span className="eyebrow-divider">/</span> EXPLORE OUR COSMIC NEIGHBOURHOOD</div>
        <div className="solar-title-row"><div><h1>Solar System <span>Explorer</span></h1><p>Travel from the Sun to the edge of our planetary neighbourhood. Explore, learn, and test what you know.</p></div><div className="solar-hero-icon"><Telescope size={30}/></div></div>
      </section>

      <nav className="solar-tabs" aria-label="Explorer sections">
        <button className={view === "explore" ? "active" : ""} onClick={() => setView("explore")}><Globe2 size={16}/> Explore</button>
        <button className={view === "details" ? "active" : ""} onClick={() => setView("details")}><Sparkles size={16}/> Planet guide</button>
        <button className={view === "quiz" ? "active" : ""} onClick={() => setView("quiz")}><CircleHelp size={16}/> Knowledge quiz <span>10 Q</span></button>
      </nav>

      {view !== "quiz" ? <section className="solar-content">
        <div className="solar-scene-panel">
          <div className="solar-scene-heading"><div><span className="status-dot playing"/><strong>{view === "explore" ? "LIVE SOLAR SYSTEM" : "SELECT A WORLD"}</strong></div><span className="board-hint">ILLUSTRATIVE ORBIT VIEW · NOT TO SCALE</span></div>
          <div className={`solar-scene ${isPlaying ? "orbit-running" : "orbit-paused"}`}>
            <div className="starfield"/>
            <div className="sun-glow"><div className="sun-core"/><span>SUN</span></div>
            {planets.filter(p => p.orbit > 0 && p.id !== "moon").map((planet, index) => <div className={`orbit-ring orbit-${planet.id}`} key={planet.id} style={{ "--orbit-duration": `${Math.max(9, 34 / Math.sqrt(speed) + index * 2)}s` } as React.CSSProperties}>
              <button className={`orbit-planet ${selected === planet.id ? "planet-selected" : ""}`} style={{ "--planet-color": planet.color, "--planet-size": `${planet.size}px` } as React.CSSProperties} onClick={() => setSelected(planet.id)} aria-label={planet.name}>
                {planet.id === "saturn" && <i className="saturn-ring"/>}
                {showLabels && <span>{planet.name}</span>}
              </button>
            </div>)}
            <div className="earth-moon-orbit"><button className={`moon-dot ${selected === "moon" ? "planet-selected" : ""}`} onClick={() => setSelected("moon")} aria-label="Moon"/></div>
            <div className="scene-caption"><span>01</span> THE MILKY WAY · SOLAR NEIGHBOURHOOD</div>
          </div>
          <div className="solar-controls">
            <button className="solar-play" onClick={() => setIsPlaying(value => !value)}>{isPlaying ? <Pause size={15}/> : <Play size={15}/>} {isPlaying ? "Pause orbits" : "Resume orbits"}</button>
            <label>ORBIT SPEED <select value={speed} onChange={event => setSpeed(Number(event.target.value))}><option value={0.5}>0.5×</option><option value={1}>1×</option><option value={2}>2×</option><option value={4}>4×</option></select></label>
            <button className={`solar-label-toggle ${showLabels ? "on" : ""}`} onClick={() => setShowLabels(value => !value)}>{showLabels ? "Hide labels" : "Show labels"}</button>
          </div>
        </div>

        <aside className="solar-info-panel">
          <div className="solar-info-top"><span className="step-tag">{current.kind.toUpperCase()}</span><span className="solar-index">{String(planets.findIndex(p => p.id === current.id) + 1).padStart(2, "0")} / 11</span></div>
          <div className="planet-portrait" style={{ "--planet-color": current.color, "--planet-size": current.size > 35 ? "82px" : "68px" } as React.CSSProperties}><span/></div>
          <h2>{current.name}</h2><p className="planet-period">{current.period}</p><p className="planet-description">{current.description}</p>
          <div className="planet-facts"><span>QUICK FACTS</span>{current.facts.map(fact => <div key={fact}><i/> {fact}</div>)}</div>
          <button className="solar-detail-button" onClick={() => setView("details")}>Open planet guide <ArrowRight size={15}/></button>
        </aside>

        <div className="solar-planet-picker"><div className="solar-picker-title">CHOOSE A WORLD <span>11 OBJECTS</span></div><div className="solar-picker-list">{planets.map(planet => <button key={planet.id} className={selected === planet.id ? "selected" : ""} onClick={() => setSelected(planet.id)}><i style={{ background: planet.color }}/>{planet.name}<ChevronRight size={13}/></button>)}</div></div>
      </section> : <section className="solar-quiz-panel">
        {!finished ? <>
          <div className="quiz-header"><div><span className="step-tag">KNOWLEDGE CHECK</span><h2>How well do you know our solar system?</h2><p>Ten questions, one at a time. Choose your answer to see instant feedback.</p></div><div className="quiz-counter"><b>{questionIndex + 1}</b><span>/ 10</span></div></div>
          <div className="quiz-progress"><span style={{ width: `${(questionIndex + (answers[questionIndex] !== undefined ? 1 : 0)) / 10 * 100}%` }}/></div>
          <div className="quiz-question"><span>QUESTION {String(questionIndex + 1).padStart(2, "0")}</span><h3>{questions[questionIndex].question}</h3></div>
          <div className="quiz-options">{questions[questionIndex].options.map((option, index) => { const chosen = answers[questionIndex]; const correct = index === questions[questionIndex].answer; return <button key={option} disabled={chosen !== undefined} className={chosen !== undefined && correct ? "correct" : chosen === index ? "incorrect" : ""} onClick={() => chooseAnswer(index)}><b>{String.fromCharCode(65 + index)}</b>{option}{chosen !== undefined && correct && <CheckCircle2 size={18}/>} {chosen === index && !correct && <X size={18}/>}</button>; })}</div>
          {answers[questionIndex] !== undefined && <div className="quiz-feedback"><CheckCircle2 size={18}/><div><b>{answers[questionIndex] === questions[questionIndex].answer ? "That's right!" : "Not quite!"}</b><p>{questions[questionIndex].note}</p></div><button onClick={nextQuestion}>{questionIndex === 9 ? "See my score" : "Next question"} <ArrowRight size={15}/></button></div>}
          <div className="quiz-footer"><span>ANSWERED {answers.length} OF 10</span><span>+1 FOR EACH CORRECT ANSWER</span></div>
        </> : <div className="quiz-result"><div className="quiz-trophy"><Sparkles size={32}/></div><span className="step-tag">MISSION COMPLETE</span><h2>{score >= 8 ? "Stellar work!" : score >= 5 ? "Great exploring!" : "Keep looking up!"}</h2><div className="quiz-score">{score}<small>/ 10</small></div><p>You got {score} out of 10 questions right.</p><div className="quiz-result-actions"><button className="solar-secondary" onClick={() => { resetQuiz(); setView("explore"); }}><Globe2 size={15}/> Explore planets</button><button className="solar-primary" onClick={resetQuiz}><RotateCcw size={15}/> Try again</button></div></div>}
      </section>}

      {view === "details" && <section className="solar-guide-list"><div className="solar-guide-heading"><div><span className="step-tag">FIELD GUIDE</span><h2>Meet the neighbourhood</h2><p>Select any object to see its overview in the explorer.</p></div><button onClick={() => setView("explore")}>Back to orbit view <ArrowRight size={14}/></button></div><div className="solar-guide-grid">{planets.map((planet,index) => <button key={planet.id} className={selected === planet.id ? "active" : ""} onClick={() => { setSelected(planet.id); setView("explore"); }}><span className="guide-number">{String(index + 1).padStart(2,"0")}</span><i style={{ background: planet.color, width: Math.max(9, Math.min(25, planet.size)) }}/><span><b>{planet.name}</b><small>{planet.kind}</small></span><ChevronRight size={15}/></button>)}</div></section>}
      <footer className="site-footer"><span>© 2026 ANIX CREATIONS</span><span>LOOK UP. STAY CURIOUS.</span><span>GAMEHUB <b>·</b> 03 / 03</span></footer>
    </main>
  );
}
