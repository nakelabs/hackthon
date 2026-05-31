import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const MOCK_QUESTIONS = [
  {
    id: 1,
    question: "Which Nigerian artist won the Grammy Award for Best Global Music Album in 2021?",
    options: ["Wizkid", "Burna Boy", "Davido", "Tiwa Savage"],
    answer: "Burna Boy"
  },
  {
    id: 2,
    question: "What year did Nigeria gain independence from British rule?",
    options: ["1957", "1960", "1963", "1999"],
    answer: "1960"
  },
  {
    id: 3,
    question: "Which of these states is known as the 'Centre of Excellence'?",
    options: ["Abuja", "Rivers", "Kano", "Lagos"],
    answer: "Lagos"
  },
  {
    id: 4,
    question: "Who was the first woman to drive a car in Nigeria?",
    options: ["Funmilayo Ransome-Kuti", "Margaret Ekpo", "Flora Shaw", "Queen Amina"],
    answer: "Funmilayo Ransome-Kuti"
  },
  {
    id: 5,
    question: "What is the highest mountain in Nigeria?",
    options: ["Olumo Rock", "Zuma Rock", "Chappal Waddi", "Idanre Hill"],
    answer: "Chappal Waddi"
  }
];

export default function QuizPage() {
  const [phase, setPhase] = useState("lobby"); // lobby | playing | leaderboard
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  // Timer logic
  useEffect(() => {
    if (phase !== "playing" || isChecking) return;

    if (timeLeft === 0) {
      handleAnswerSelection(null); // Time's up
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, phase, isChecking]);

  const startGame = () => {
    setPhase("playing");
    setCurrentQIndex(0);
    setScore(0);
    setTimeLeft(15);
    setSelectedAnswer(null);
    setIsChecking(false);
  };

  const handleAnswerSelection = (option) => {
    if (isChecking) return;
    
    setSelectedAnswer(option);
    setIsChecking(true);

    const currentQ = MOCK_QUESTIONS[currentQIndex];
    if (option === currentQ.answer) {
      setScore(prev => prev + 100 + (timeLeft * 10)); // Bonus points for speed
    }

    // Wait a moment to show correct/incorrect state
    setTimeout(() => {
      if (currentQIndex < MOCK_QUESTIONS.length - 1) {
        setCurrentQIndex(prev => prev + 1);
        setTimeLeft(15);
        setSelectedAnswer(null);
        setIsChecking(false);
      } else {
        setPhase("leaderboard");
      }
    }, 2000);
  };

  if (phase === "lobby") {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center relative overflow-y-auto overflow-x-hidden pt-20 pb-24 px-4">
        {/* Abstract Background Elements */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#008751]/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-white/5 rounded-full blur-[100px] pointer-events-none"></div>

        <p className="text-[#008751] font-mono tracking-[0.4em] uppercase text-sm mb-4 animate-pulse">Next Live Event In</p>
        
        {/* Massive Timer */}
        <div className="flex gap-4 sm:gap-8 mb-16 text-center z-10">
          <div className="flex flex-col">
            <span className="text-6xl sm:text-8xl md:text-[10rem] font-black text-white leading-none tracking-tighter" style={{ WebkitTextStroke: "2px rgba(255,255,255,0.1)" }}>04</span>
            <span className="text-white/40 font-mono tracking-widest text-xs mt-2 uppercase">Hours</span>
          </div>
          <span className="text-6xl sm:text-8xl md:text-[10rem] font-black text-[#008751] leading-none animate-pulse">:</span>
          <div className="flex flex-col">
            <span className="text-6xl sm:text-8xl md:text-[10rem] font-black text-white leading-none tracking-tighter">20</span>
            <span className="text-white/40 font-mono tracking-widest text-xs mt-2 uppercase">Minutes</span>
          </div>
          <span className="text-6xl sm:text-8xl md:text-[10rem] font-black text-[#008751] leading-none animate-pulse hidden sm:block">:</span>
          <div className="flex flex-col hidden sm:flex">
            <span className="text-6xl sm:text-8xl md:text-[10rem] font-black text-white/50 leading-none tracking-tighter">00</span>
            <span className="text-white/40 font-mono tracking-widest text-xs mt-2 uppercase">Seconds</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 z-10">
          <div className="border border-white/10 bg-black/50 backdrop-blur-md p-6 max-w-lg text-center shadow-[8px_8px_0px_#008751]">
            <h2 className="text-white text-2xl font-black uppercase mb-2">Weekly Prize Pool</h2>
            <p className="text-5xl font-black text-[#008751] tracking-tighter">₦500,000</p>
            <p className="text-white/60 text-sm mt-4">Top 3 players take the cash. Everyone else takes the glory.</p>
          </div>

          <button onClick={startGame} className="btn-primary text-xl px-12 py-5 mt-4 hover:scale-105 transition-transform uppercase tracking-widest">
            Enter The Arena (Demo)
          </button>
        </div>
      </div>
    );
  }

  if (phase === "playing") {
    const q = MOCK_QUESTIONS[currentQIndex];
    return (
      <div className="min-h-screen bg-black flex flex-col relative pt-16">
        {/* Frantic Progress Bar */}
        <div className="absolute top-16 left-0 right-0 h-2 bg-white/10 z-50">
          <div 
            className={`h-full transition-all duration-1000 ease-linear ${timeLeft <= 5 ? 'bg-red-500' : 'bg-[#008751]'}`} 
            style={{ width: `${(timeLeft / 15) * 100}%` }}
          ></div>
        </div>

        <div className="flex-1 flex flex-col md:flex-row">
          {/* Left: Question Area */}
          <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-[#050505] relative overflow-hidden">
            <span className="absolute -left-10 -top-10 text-[15rem] font-black text-white/5 select-none pointer-events-none">
              Q{currentQIndex + 1}
            </span>
            
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-8">
                <p className="font-mono text-[#008751] tracking-widest font-bold">QUESTION 0{currentQIndex + 1} / 0{MOCK_QUESTIONS.length}</p>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-white/50">TIME:</span>
                  <span className={`text-4xl font-black ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                    {String(timeLeft).padStart(2, '0')}
                  </span>
                </div>
              </div>
              
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.1] uppercase tracking-tight">
                {q.question}
              </h2>

              <div className="mt-12 inline-block border border-white/20 px-6 py-3">
                <span className="text-white/50 font-mono text-sm mr-2">CURRENT SCORE:</span>
                <span className="text-white font-black text-xl">{score.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Right: Answers Grid */}
          <div className="w-full md:w-1/2 p-4 md:p-8 pb-24 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#0a0a0a] overflow-y-auto">
            {q.options.map((option, idx) => {
              let stateClass = "border-white/10 bg-[#111] hover:bg-[#1a1a1a] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#008751]";
              
              if (isChecking) {
                if (option === q.answer) {
                  stateClass = "border-[#008751] bg-[#008751]/20 shadow-[0_0_20px_#008751] scale-[1.02] z-10";
                } else if (option === selectedAnswer) {
                  stateClass = "border-red-500 bg-red-500/20 opacity-50";
                } else {
                  stateClass = "border-white/5 bg-[#050505] opacity-30";
                }
              }

              return (
                <button 
                  key={idx}
                  disabled={isChecking}
                  onClick={() => handleAnswerSelection(option)}
                  className={`p-8 flex flex-col justify-between text-left transition-all duration-300 border ${stateClass}`}
                >
                  <span className="font-mono text-white/30 text-sm mb-4">OPT 0{idx + 1}</span>
                  <span className="text-2xl sm:text-3xl font-bold text-white leading-tight">{option}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Leaderboard Phase
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center pt-24 px-4 pb-24 overflow-y-auto">
      <p className="text-white/50 font-mono uppercase tracking-[0.3em] mb-4">Quiz Complete</p>
      <h1 className="text-5xl sm:text-7xl font-black text-white uppercase tracking-tighter mb-12 text-center">
        Final <span className="text-[#008751]">Results</span>
      </h1>

      <div className="flex items-end justify-center gap-4 sm:gap-6 w-full max-w-4xl h-80 mb-16">
        {/* 2nd Place */}
        <div className="w-1/3 flex flex-col items-center animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <p className="text-white/70 font-bold text-xl mb-2">Shadow</p>
          <p className="text-[#008751] font-mono mb-4 text-sm">{(score * 0.8).toFixed(0)} PTS</p>
          <div className="w-full bg-[#111] border border-white/20 h-40 flex justify-center items-start pt-4 shadow-[8px_8px_0px_rgba(255,255,255,0.1)]">
            <span className="text-white/30 font-black text-4xl">2</span>
          </div>
        </div>

        {/* 1st Place */}
        <div className="w-1/3 flex flex-col items-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <p className="text-white font-black text-3xl mb-2">YOU</p>
          <p className="text-[#008751] font-mono mb-4 font-bold text-lg">{score.toLocaleString()} PTS</p>
          <div className="w-full bg-[#0a0a0a] border border-[#008751] h-64 flex justify-center items-start pt-4 shadow-[12px_12px_0px_rgba(0,135,81,0.5)] z-10 relative">
            <span className="text-white font-black text-6xl">1</span>
            <div className="absolute -top-4 bg-white text-black px-3 py-1 font-bold text-xs uppercase tracking-widest">Winner</div>
          </div>
        </div>

        {/* 3rd Place */}
        <div className="w-1/3 flex flex-col items-center animate-slide-up" style={{ animationDelay: "0.6s" }}>
          <p className="text-white/70 font-bold text-xl mb-2">Ghost</p>
          <p className="text-[#008751] font-mono mb-4 text-sm">{(score * 0.6).toFixed(0)} PTS</p>
          <div className="w-full bg-[#111] border border-white/20 h-32 flex justify-center items-start pt-4 shadow-[8px_8px_0px_rgba(255,255,255,0.1)]">
            <span className="text-white/30 font-black text-4xl">3</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button onClick={() => setPhase("lobby")} className="btn-outline px-8 py-4">Play Again</button>
        <Link to="/" className="btn-primary px-8 py-4">Return Home</Link>
      </div>
    </div>
  );
}
