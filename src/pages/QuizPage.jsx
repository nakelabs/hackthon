import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getSessions, getSessionQuestions, submitAnswers } from "../services/quizService";
import Spinner from "../components/ui/Spinner";

import { getSessionLeaderboard } from "../services/quizService";

export default function QuizPage() {
  const [phase, setPhase] = useState("lobby"); // lobby | playing | submitting | leaderboard | past_leaderboard
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [selectedPastSession, setSelectedPastSession] = useState(null);
  
  // Real data states
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [finalScoreData, setFinalScoreData] = useState(null);
  const [countdown, setCountdown] = useState({ hours: "00", minutes: "00", seconds: "00" });
  const [pastLeaderboardData, setPastLeaderboardData] = useState([]);
  
  const submittedAnswersRef = useRef([]);

  const pastSessions = sessions.filter(s => s.id !== activeSession?.id);

  // Fetch sessions on mount
  useEffect(() => {
    getSessions()
      .then(data => {
        setSessions(data);
        const live = data.find(s => s.status === "live");
        setActiveSession(live || data[0] || null);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  // Lobby Countdown Timer
  useEffect(() => {
    if (phase !== "lobby" || !activeSession || activeSession.status === "live") return;

    const targetDate = new Date(activeSession.open_time).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        setCountdown({ hours: "00", minutes: "00", seconds: "00" });
        setActiveSession(prev => ({ ...prev, status: "live" }));
        return;
      }

      const hours = Math.floor(distance / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdown({
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0')
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [activeSession, phase]);

  // Timer logic
  useEffect(() => {
    if (phase !== "playing" || isChecking) return;

    if (timeLeft === 0) {
      handleAnswerSelection(null, null); // Time's up
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, phase, isChecking]); // eslint-disable-line react-hooks/exhaustive-deps

  const startGame = async () => {
    if (!activeSession) return;
    setIsLoading(true);
    try {
      const qData = await getSessionQuestions(activeSession.id);
      if (!qData || qData.length === 0) {
        alert("No questions found for this session!");
        setIsLoading(false);
        return;
      }
      setQuestions(qData);
      setPhase("playing");
      setCurrentQIndex(0);
      submittedAnswersRef.current = [];
      setTimeLeft(qData[0].time_limit_seconds || 15);
      setSelectedAnswer(null);
      setIsChecking(false);
    } catch (e) {
      console.error(e);
      alert("Failed to load questions.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelection = (optionStr, optionLetter) => {
    if (isChecking) return;
    
    setSelectedAnswer(optionStr);
    setIsChecking(true);

    const currentQ = questions[currentQIndex];
    if (optionLetter) {
      submittedAnswersRef.current.push({ question_id: currentQ.id, answer: optionLetter });
    }

    // Wait a moment to show selection highlight
    setTimeout(async () => {
      if (currentQIndex < questions.length - 1) {
        setCurrentQIndex(prev => prev + 1);
        setTimeLeft(questions[currentQIndex + 1].time_limit_seconds || 15);
        setSelectedAnswer(null);
        setIsChecking(false);
      } else {
        setPhase("submitting");
        try {
          const scoreData = await submitAnswers(activeSession.id, submittedAnswersRef.current);
          setFinalScoreData(scoreData);
          setPhase("leaderboard");
        } catch (e) {
          console.error(e);
          alert("Failed to submit answers");
          setPhase("lobby");
        }
      }
    }, 1500);
  };

  if (phase === "lobby") {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col lg:flex-row relative pt-16">
        {/* Abstract Background Elements */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#008751]/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-white/5 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Left Side: Upcoming Quiz */}
        <div className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-white/10 relative z-10 pb-24 lg:pb-16">
          {isLoading ? (
            <div className="flex justify-center my-12">
              <Spinner size={32} className="text-[#008751]" />
            </div>
          ) : activeSession ? (
            <>
              <div className="mb-12 text-center lg:text-left">
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white uppercase tracking-tighter mb-4 leading-none">
                  {activeSession.title || "Next Quiz Session"}
                </h1>
                <p className="text-white/50 text-sm sm:text-base max-w-md mx-auto lg:mx-0">
                  {activeSession.description || "Get ready to prove your knowledge!"}
                </p>
              </div>

              <p className="text-[#008751] font-mono tracking-[0.4em] uppercase text-sm mb-4 animate-pulse text-center lg:text-left">
                {activeSession.status === "live" ? "Live Right Now!" : "Next Live Event"}
              </p>
              
              {/* Massive Timer */}
              {activeSession.status !== "live" && (
                <div className="flex justify-center lg:justify-start gap-4 sm:gap-6 mb-12 text-center">
                  <div className="flex flex-col">
                    <span className="text-5xl sm:text-7xl font-black text-white leading-none tracking-tighter" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.1)" }}>{countdown.hours}</span>
                    <span className="text-white/40 font-mono tracking-widest text-[10px] mt-2 uppercase">Hours</span>
                  </div>
                  <span className="text-5xl sm:text-7xl font-black text-[#008751] leading-none animate-pulse">:</span>
                  <div className="flex flex-col">
                    <span className="text-5xl sm:text-7xl font-black text-white leading-none tracking-tighter">{countdown.minutes}</span>
                    <span className="text-white/40 font-mono tracking-widest text-[10px] mt-2 uppercase">Mins</span>
                  </div>
                  <span className="text-5xl sm:text-7xl font-black text-[#008751] leading-none animate-pulse hidden sm:block">:</span>
                  <div className="flex flex-col hidden sm:flex">
                    <span className="text-5xl sm:text-7xl font-black text-white/50 leading-none tracking-tighter">{countdown.seconds}</span>
                    <span className="text-white/40 font-mono tracking-widest text-[10px] mt-2 uppercase">Secs</span>
                  </div>
                </div>
              )}

              <div className="flex justify-center lg:justify-start">
                <button onClick={startGame} className="btn-primary text-lg px-10 py-5 hover:scale-105 transition-transform uppercase tracking-widest w-full sm:w-auto">
                  {activeSession.status === "live" ? "Enter The Arena" : "Join Waitlist"}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center lg:text-left">
              <h1 className="text-4xl font-black text-white/30 uppercase tracking-tighter mb-4">No Active Sessions</h1>
            </div>
          )}
        </div>

        {/* Right Side: Past Sessions */}
        <div className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col bg-[#0a0a0a] relative z-10 min-h-[500px] pb-32 lg:pb-16">
          <div className="flex flex-col h-full animate-in slide-in-from-left duration-300">
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3">
              <span className="text-white/20">/</span> Past Sessions
            </h2>

            <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
              {pastSessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-white/30">
                  <span className="text-4xl mb-4">📭</span>
                  <p className="text-sm uppercase tracking-widest font-bold">No Past Sessions</p>
                </div>
              ) : (
                pastSessions.map((session) => (
                  <button 
                    key={session.id}
                    onClick={async () => {
                      setSelectedPastSession(session);
                      try {
                        const lb = await getSessionLeaderboard(session.id);
                        setPastLeaderboardData(lb.top_three || []);
                      } catch (e) {
                        setPastLeaderboardData([]);
                      }
                      setPhase("past_leaderboard");
                    }}
                    className="w-full flex items-center justify-between p-6 bg-[#111] border border-white/5 hover:border-[#008751]/50 hover:bg-[#151515] transition-all group text-left shadow-lg"
                  >
                    <div>
                      <h3 className="font-bold text-white text-lg sm:text-xl group-hover:text-[#008751] transition-colors">{session.title}</h3>
                      <p className="text-white/40 font-mono text-xs mt-2 tracking-widest">
                        {new Date(session.open_time).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center border border-white/10 group-hover:border-[#008751]/50 group-hover:scale-110 transition-all flex-shrink-0">
                      <svg className="w-5 h-5 text-white/50 group-hover:text-[#008751]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "submitting") {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center relative pt-16">
        <Spinner size={32} className="text-[#008751] mb-6" />
        <h2 className="text-2xl font-black text-white uppercase tracking-widest animate-pulse">Grading Your Answers...</h2>
      </div>
    );
  }

  if (phase === "playing" && questions.length > 0) {
    const q = questions[currentQIndex];
    const options = [
      { text: q.option_a, letter: "A" },
      { text: q.option_b, letter: "B" },
      { text: q.option_c, letter: "C" },
      { text: q.option_d, letter: "D" }
    ].filter(o => o.text);

    return (
      <div className="min-h-screen bg-black flex flex-col relative pt-16">
        {/* Frantic Progress Bar */}
        <div className="absolute top-16 left-0 right-0 h-2 bg-white/10 z-50">
          <div 
            className={`h-full transition-all duration-1000 ease-linear ${timeLeft <= 5 ? 'bg-red-500' : 'bg-[#008751]'}`} 
            style={{ width: `${(timeLeft / (q.time_limit_seconds || 15)) * 100}%` }}
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
                <p className="font-mono text-[#008751] tracking-widest font-bold">QUESTION {String(currentQIndex + 1).padStart(2, '0')} / {String(questions.length).padStart(2, '0')}</p>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-white/50">TIME:</span>
                  <span className={`text-4xl font-black ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                    {String(timeLeft).padStart(2, '0')}
                  </span>
                </div>
              </div>
              
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.1] uppercase tracking-tight">
                {q.question_text}
              </h2>
            </div>
          </div>

          {/* Right: Answers Grid */}
          <div className="w-full md:w-1/2 p-4 md:p-8 pb-24 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#0a0a0a] overflow-y-auto">
            {options.map((option, idx) => {
              let stateClass = "border-white/10 bg-[#111] hover:bg-[#1a1a1a] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#008751]";
              
              if (isChecking) {
                if (option.text === selectedAnswer) {
                  stateClass = "border-[#008751] bg-[#008751]/20 shadow-[0_0_20px_#008751] scale-[1.02] z-10";
                } else {
                  stateClass = "border-white/5 bg-[#050505] opacity-30";
                }
              }

              return (
                <button 
                  key={idx}
                  disabled={isChecking}
                  onClick={() => handleAnswerSelection(option.text, option.letter)}
                  className={`p-8 flex flex-col justify-between text-left transition-all duration-300 border ${stateClass}`}
                >
                  <span className="font-mono text-white/30 text-sm mb-4">OPT {option.letter}</span>
                  <span className="text-2xl sm:text-3xl font-bold text-white leading-tight">{option.text}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (phase === "past_leaderboard" && selectedPastSession) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center pt-24 px-4 pb-32 overflow-y-auto">
        <button 
          onClick={() => { setPhase("lobby"); setSelectedPastSession(null); }}
          className="self-start md:absolute md:top-24 md:left-10 flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors z-50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          <span className="text-sm font-bold uppercase tracking-widest">Back to Lobby</span>
        </button>

        <p className="text-white/50 font-mono uppercase tracking-[0.3em] mb-4 text-center">Past Session</p>
        <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tighter mb-2 text-center">
          {selectedPastSession.title}
        </h1>
        <p className="text-[#008751] font-mono text-sm tracking-widest mb-16">
          COMPLETED: {new Date(selectedPastSession.open_time).toLocaleDateString()}
        </p>

        <div className="w-full max-w-3xl flex flex-col gap-4">
          {pastLeaderboardData.length === 0 ? (
            <div className="py-12 bg-[#0a0a0a] rounded-xl border border-white/10 flex flex-col items-center justify-center text-center">
              <span className="text-4xl opacity-40 mb-4">🏆</span>
              <p className="text-sm text-white/40 font-medium uppercase tracking-widest">No Leaderboard Data Yet</p>
            </div>
          ) : (
            pastLeaderboardData.map((user, idx) => (
              <div key={idx} className="flex items-center justify-between p-5 sm:p-6 bg-[#0a0a0a] border border-white/5 hover:border-white/10 hover:-translate-y-1 transition-all shadow-lg group">
                <div className="flex items-center gap-6">
                  <span className={`font-black text-3xl sm:text-4xl ${user.position === 1 ? 'text-[#008751] drop-shadow-[0_0_10px_#008751]' : user.position === 2 ? 'text-white/80' : user.position === 3 ? 'text-white/60' : 'text-white/20'}`}>
                    #{user.position}
                  </span>
                  <span className="font-bold text-white text-lg sm:text-xl tracking-wide group-hover:text-[#008751] transition-colors">{user.username || user.full_name || `User ${user.user_id}`}</span>
                </div>
                <span className="font-mono text-[#008751] font-bold text-lg bg-[#008751]/10 px-4 py-2 rounded-sm">{user.total_score.toLocaleString()} PTS</span>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // Leaderboard Phase (Post-game)
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
          <p className="text-[#008751] font-mono mb-4 text-sm">--- PTS</p>
          <div className="w-full bg-[#111] border border-white/20 h-40 flex justify-center items-start pt-4 shadow-[8px_8px_0px_rgba(255,255,255,0.1)]">
            <span className="text-white/30 font-black text-4xl">2</span>
          </div>
        </div>

        {/* 1st Place */}
        <div className="w-1/3 flex flex-col items-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <p className="text-white font-black text-3xl mb-2">YOU</p>
          <p className="text-[#008751] font-mono mb-4 font-bold text-lg">
            {finalScoreData?.total_score?.toLocaleString() || 0} PTS
          </p>
          <div className="w-full bg-[#0a0a0a] border border-[#008751] h-64 flex justify-center items-start pt-4 shadow-[12px_12px_0px_rgba(0,135,81,0.5)] z-10 relative">
            <span className="text-white font-black text-6xl">1</span>
            <div className="absolute -top-4 bg-white text-black px-3 py-1 font-bold text-xs uppercase tracking-widest">Participant</div>
          </div>
        </div>

        {/* 3rd Place */}
        <div className="w-1/3 flex flex-col items-center animate-slide-up" style={{ animationDelay: "0.6s" }}>
          <p className="text-white/70 font-bold text-xl mb-2">Ghost</p>
          <p className="text-[#008751] font-mono mb-4 text-sm">--- PTS</p>
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
