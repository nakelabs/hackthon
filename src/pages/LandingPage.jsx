import { useState } from "react";
import { Link } from "react-router-dom";
import { TALENT_CATEGORIES, MOCK_STATE_LEADERBOARD, MOCK_STATE_PARTICIPANTS } from "../utils/constants";

// ─── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section id="hero" className="min-h-screen flex flex-col justify-center pt-14 relative overflow-hidden">
      
      {/* 3D Flag Ribbon */}
      <img 
        src="/flag-ribbon.png" 
        alt="Nigerian Flag Ribbon" 
        className="absolute -top-10 -left-10 md:-top-20 md:-left-20 w-full max-w-lg md:max-w-3xl opacity-90 pointer-events-none animate-slide-up mix-blend-lighten"
        style={{ animationDuration: '1.2s' }}
      />

      <div className="container-main py-24 md:py-32 relative z-10">
        {/* Overline */}
        <p 
          className="text-xs text-white uppercase tracking-[0.2em] mb-8 animate-fade-in font-black ml-8 sm:ml-32"
          style={{ textShadow: "0 2px 10px rgba(0,0,0,1)" }}
        >
          Nigeria's <span className="text-[color:#008751]">Celebration</span> Platform
        </p>

        {/* Headline */}
        <h1 
          className="font-bold text-5xl sm:text-6xl md:text-8xl leading-[1.05] tracking-tight mb-8 animate-slide-up text-white"
          style={{ textShadow: "0 0 40px rgba(0,0,0,0.8)" }}
        >
          One <span style={{ color: "#008751" }}>Nation.</span><br />
          Infinite <span style={{ color: "#008751" }}>Talent.</span><br />
          Endless <span style={{ color: "#008751" }}>Pride.</span>
        </h1>

        {/* Body copy */}
        <p 
          className="text-white text-base sm:text-lg max-w-xl mb-12 leading-relaxed animate-slide-up font-medium" 
          style={{ animationDelay: "0.1s", textShadow: "0 2px 10px rgba(0,0,0,1)" }}
        >
          Upload your talent, vote for Nigeria's finest, test your knowledge,
          and discover the icons who shaped a great nation.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <Link to="/register" id="hero-upload" className="btn-primary">
            Upload Your Talent
          </Link>
          <a href="/#talent" id="hero-explore" className="btn-outline">
            Explore Categories
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Pillars / What We Celebrate ───────────────────────────────────────────────
const PILLARS = [
  {
    id: "talent",
    index: "01",
    title: "Naija Talent Zone",
    body: "Upload your talent across 11 categories — from music and dance to tech and entrepreneurship. Get discovered, get voted.",
    cta: "Upload Now →",
    href: "/register",
  },
  {
    id: "votes",
    index: "02",
    title: "Naija Votes",
    body: "Vote for the most talented Nigerians. Rally your state, support your favourites, and watch stars rise.",
    cta: "Start Voting →",
    href: "/#talent",
  },
  {
    id: "quiz",
    index: "03",
    title: "Weekly Live Quiz",
    body: "Test your knowledge of Nigeria every week. Compete live, earn points, and climb the national leaderboard.",
    cta: "Join Quiz →",
    href: "/#quiz",
  },
];

function Pillars() {
  return (
    <section id="pillars" className="section border-t border-white/8">
      <div className="container-main">
        <div className="mb-10">
          <p className="text-xs text-white uppercase tracking-[0.2em] mb-3">What We <span className="text-[color:#008751]">Celebrate</span></p>
          <h2 className="heading text-2xl sm:text-3xl">Three <span className="text-[color:#008751]">Pillars</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/8">
          {PILLARS.map(({ id, index, title, body, cta, href }) => (
            <article key={id} className="bg-black p-8 md:p-10 flex flex-col gap-6 group">
              <p className="text-xs font-mono text-white">{index}</p>
              <h3 className="font-semibold text-[color:#008751] text-lg leading-snug">{title}</h3>
              <p className="text-sm text-white leading-relaxed flex-1">{body}</p>
              <a
                href={href}
                id={`pillar-${id}`}
                className="text-sm text-white hover:text-white transition-colors inline-flex items-center gap-2"
              >
                {cta}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Talent Categories ─────────────────────────────────────────────────────────
function TalentCategories() {
  return (
    <section id="talent" className="section border-t border-white/8">
      <div className="container-main">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs text-white uppercase tracking-[0.2em] mb-3">Naija <span className="text-[color:#008751]">Talent Zone</span></p>
            <h2 className="heading text-2xl sm:text-3xl">11 <span className="text-[color:#008751]">Categories</span></h2>
          </div>
          <Link to="/register" id="talent-upload-all" className="btn-outline text-sm self-start sm:self-auto">
            Upload Your Talent
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-white/8">
          {TALENT_CATEGORIES.map(({ id, label, description }) => (
            <Link
              key={id}
              to={`/register?category=${id}`}
              id={`category-${id}`}
              className="bg-black p-5 group hover:bg-[#0a0a0a] transition-colors"
            >
              <p className="font-medium text-sm text-[color:#008751] mb-1 group-hover:text-[#00a663] transition-colors">
                {label}
              </p>
              <p className="text-xs text-white leading-snug">{description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Nigeria Global Icons ──────────────────────────────────────────────────────
const ICONS = [
  { 
    name: "Wole Soyinka", role: "Nobel Laureate — Literature",
    chapters: [
      { title: "The Roots", body: "Born in Abeokuta in 1934, Akinwande Oluwole Babatunde Soyinka was immersed in a rich blend of Yoruba tradition and Western education. This dual heritage formed the foundation of his unique literary voice." },
      { title: "The Breakthrough", body: "In 1986, he made history by becoming the first sub-Saharan African to be awarded the Nobel Prize in Literature, recognized for his wide cultural perspective and poetic overtones." },
      { title: "Impact for Nigeria", body: "Beyond literature, Soyinka has been a fierce political activist. He stood against dictatorship, endured imprisonment during the civil war, and remains a powerful moral conscience for the nation." }
    ]
  },
  { 
    name: "Ngozi Okonjo-Iweala", role: "WTO Director-General",
    chapters: [
      { title: "The Roots", body: "Hailing from Ogwashi-Ukwu, Delta State, she pursued her education at Harvard and MIT, developing a profound understanding of global economics and development." },
      { title: "The Breakthrough", body: "She served twice as Nigeria's Finance Minister, driving critical reforms that led to the wiping out of $30 billion of Nigeria's Paris Club debt." },
      { title: "Impact for Nigeria", body: "In 2021, she shattered glass ceilings globally by becoming the first woman and the first African to lead the World Trade Organization, setting a towering standard for Nigerian excellence globally." }
    ]
  },
  { 
    name: "Wizkid", role: "Grammy Award Winner — Music",
    chapters: [
      { title: "The Roots", body: "Ayodeji Ibrahim Balogun started singing in church at age 11 in Surulere, Lagos. His early hustle laid the groundwork for a generational talent." },
      { title: "The Breakthrough", body: "His 2011 album 'Superstar' shifted the paradigm of modern Afrobeats. Global recognition exploded with his Drake collaboration 'One Dance' and his own smash hit 'Essence'." },
      { title: "Impact for Nigeria", body: "Wizkid didn't just win a Grammy; he opened the door for Afrobeats to become a dominant global genre, exporting Nigerian culture to every corner of the earth." }
    ]
  },
  { 
    name: "Chinua Achebe", role: "Author — Things Fall Apart",
    chapters: [
      { title: "The Roots", body: "Born in Ogidi in 1930, Achebe grew up at the crossroads of traditional Igbo culture and colonial Christianity, giving him a sharp lens on the African experience." },
      { title: "The Breakthrough", body: "His 1958 magnum opus, 'Things Fall Apart', became the most widely read book in modern African literature, selling over 20 million copies and translated into 50 languages." },
      { title: "Impact for Nigeria", body: "He reclaimed the African narrative from Western storytellers. By writing with authentic Nigerian nuance, he gave an entire continent its voice on the global literary stage." }
    ]
  },
  { 
    name: "Nnamdi Azikiwe", role: "1st President of Nigeria",
    chapters: [
      { title: "The Roots", body: "Born in Zungeru in 1904, 'Zik of Africa' was educated in the United States, where he was heavily influenced by the Pan-African movement and the fight for racial equality." },
      { title: "The Breakthrough", body: "He became a pioneering journalist and political leader, using his newspapers to champion the cause of Nigerian independence from British colonial rule." },
      { title: "Impact for Nigeria", body: "As the first President of an independent Nigeria, he laid the democratic foundations of the republic. His vision of a united, self-determined Africa continues to inspire." }
    ]
  },
  { 
    name: "Burna Boy", role: "African Giant — Music",
    chapters: [
      { title: "The Roots", body: "Damini Ebunoluwa Ogulu was born in Port Harcourt. With a grandfather who managed Fela Kuti, Afrobeat royalty was in his blood from day one." },
      { title: "The Breakthrough", body: "His album 'African Giant' propelled him to international stardom, but it was 'Twice as Tall' that earned him the Grammy Award for Best Global Music Album." },
      { title: "Impact for Nigeria", body: "He sells out the biggest stadiums in the world, boldly carrying the Nigerian flag. He is a cultural ambassador who demands global respect for African artistry." }
    ]
  },
  { 
    name: "Fela Kuti", role: "Pioneer of Afrobeat",
    chapters: [
      { title: "The Roots", body: "Born in Abeokuta in 1938 to a prominent family, his early exposure to highlife music and radical politics in London and the US shaped his revolutionary mindset." },
      { title: "The Breakthrough", body: "He pioneered Afrobeat—a complex fusion of Jazz, Funk, and African rhythms—and established the legendary Kalakuta Republic, a commune and recording studio." },
      { title: "Impact for Nigeria", body: "An eternal symbol of resistance and African consciousness. He criticized corruption and championed the common man, leaving behind a timeless, politically charged musical legacy." }
    ]
  },
  { 
    name: "Funke Akindele", role: "Actress & Filmmaker",
    chapters: [
      { title: "The Roots", body: "Hailing from Ikorodu, Lagos State, she entered the television industry with the UNPFA-sponsored sitcom 'I Need to Know' in the late 90s." },
      { title: "The Breakthrough", body: "Her creation of the 'Jenifa' character became a massive cultural phenomenon, leading to a long-running, award-winning TV series and spin-offs." },
      { title: "Impact for Nigeria", body: "She shattered domestic box office records with 'A Tribe Called Judah', becoming one of the most powerful, successful, and influential forces in modern Nollywood history." }
    ]
  },
  { 
    name: "Chioma Ajunwa", role: "Olympic Gold Medalist",
    chapters: [
      { title: "The Roots", body: "Born in Ahiazu-Mbaise, she was a fiercely multi-talented athlete who initially represented Nigeria playing football for the Super Falcons." },
      { title: "The Breakthrough", body: "Switching focus to track and field, she defied massive odds at the 1996 Atlanta Olympics to win gold in the women's long jump with a leap of 7.12 meters." },
      { title: "Impact for Nigeria", body: "She made history as the first Nigerian—and first black African woman—to win an Olympic gold medal in a field event, cementing her legacy in global sports history." }
    ]
  }
];

// ─── 3D Slide Presentation Overlay ─────────────────────────────────────────────
function IconPresentation({ icon, onClose }) {
  const [activeSlide, setActiveSlide] = useState(0);

  if (!icon) return null;

  const handleNext = () => {
    if (activeSlide < icon.chapters.length - 1) setActiveSlide(s => s + 1);
  };
  
  const handlePrev = () => {
    if (activeSlide > 0) setActiveSlide(s => s - 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-md animate-fade-in">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-6 z-10">
        <div>
          <p className="text-xs text-white uppercase tracking-[0.2em] mb-1">Global Icon</p>
          <h3 className="text-xl font-bold text-white">{icon.name}</h3>
        </div>
        <button onClick={onClose} className="text-white hover:text-white transition-colors text-sm font-medium px-4 py-2 border border-white/10 rounded-md">
          Exit Presentation
        </button>
      </div>

      {/* 3D Slide Engine */}
      <div className="flex-1 relative perspective-container overflow-hidden flex items-center justify-center">
        {icon.chapters.map((chapter, idx) => {
          const delta = idx - activeSlide;
          
          let transform = "translateX(0) translateZ(0) rotateY(0)";
          let opacity = 1;
          let pointerEvents = "auto";

          if (delta < 0) {
            transform = `translateX(-120%) translateZ(-400px) rotateY(45deg)`;
            opacity = 0;
            pointerEvents = "none";
          } else if (delta > 0) {
            const xOffset = 40 * delta;
            const zOffset = -200 * delta;
            const rotate = -15 - (5 * delta);
            transform = `translateX(${xOffset}%) translateZ(${zOffset}px) rotateY(${rotate}deg)`;
            opacity = Math.max(0, 1 - (delta * 0.3));
            pointerEvents = "none";
          }

          return (
            <div 
              key={idx}
              className="absolute w-full max-w-5xl flex flex-col md:flex-row border border-white/10 bg-black min-h-[400px]"
              style={{
                transform,
                opacity,
                pointerEvents,
                zIndex: 50 - Math.abs(delta),
                transition: "all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)",
                boxShadow: delta === 0 ? "0 25px 50px -12px rgba(255,255,255,0.05)" : "none"
              }}
            >
              {/* Image Placeholder (Left side) */}
              <div className="w-full md:w-1/2 aspect-video md:aspect-auto bg-[#0a0a0a] border-b md:border-b-0 md:border-r border-white/10 flex items-center justify-center">
                <span className="text-white text-sm tracking-widest uppercase">Chapter Image Placeholder</span>
              </div>

              {/* Text Content (Right side) */}
              <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
                <p className="font-mono text-white text-sm mb-4">Chapter {idx + 1} of {icon.chapters.length}</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">{chapter.title}</h2>
                <p className="text-white text-lg leading-relaxed">{chapter.body}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Navigation */}
      <div className="p-6 sm:p-10 flex items-center justify-between z-10 border-t border-white/5 bg-black/50">
        <div className="flex gap-2">
          {icon.chapters.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1 transition-all duration-300 ${idx === activeSlide ? 'w-8 bg-white' : 'w-2 bg-white/20'}`}
            />
          ))}
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handlePrev} 
            disabled={activeSlide === 0}
            className="btn-ghost disabled:opacity-20"
          >
            Previous
          </button>
          <button 
            onClick={handleNext} 
            disabled={activeSlide === icon.chapters.length - 1}
            className="btn-primary"
          >
            {activeSlide === icon.chapters.length - 1 ? "Finish" : "Next Chapter →"}
          </button>
        </div>
      </div>
    </div>
  );
}

function GlobalIcons() {
  const [activeIcon, setActiveIcon] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const visibleIcons = showAll ? ICONS : ICONS.slice(0, 3);

  return (
    <section id="icons" className="section border-t border-white/8">
      <div className="container-main">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs text-white uppercase tracking-[0.2em] mb-3">Nigeria Global <span className="text-[color:#008751]">Icons</span></p>
            <h2 className="heading text-2xl sm:text-3xl">Hall of <span className="text-[color:#008751]">Legends</span></h2>
          </div>
          <p className="text-sm text-white max-w-xs text-left sm:text-right">
            Tap on an icon to explore their journey.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/8">
          {visibleIcons.map((icon) => (
            <button
              key={icon.name}
              onClick={() => setActiveIcon(icon)}
              className="bg-black p-6 hover:bg-[#0a0a0a] transition-colors text-left cursor-pointer group flex flex-col h-full animate-fade-in"
            >
              <h3 className="font-bold text-lg text-[color:#008751] mb-2">{icon.name}</h3>
              <p className="text-xs text-white mb-6">{icon.role}</p>
              <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between text-white group-hover:text-white transition-colors">
                <span className="text-xs font-medium">Read Journey</span>
                <span>→</span>
              </div>
            </button>
          ))}
        </div>

        {ICONS.length > 3 && (
          <div className="text-center mt-8">
            <button 
              onClick={() => setShowAll(!showAll)}
              className="btn-ghost text-sm"
            >
              {showAll ? "Show Less ↑" : `Load More Icons (${ICONS.length - 3}) ↓`}
            </button>
          </div>
        )}
      </div>

      <IconPresentation icon={activeIcon} onClose={() => setActiveIcon(null)} />
    </section>
  );
}

// ─── Rep Your State Leaderboard ───────────────────────────────────────────────
function StateLeaderboard() {
  const [selectedState, setSelectedState] = useState(null);

  const top3 = MOCK_STATE_LEADERBOARD.slice(0, 3);
  const rest = MOCK_STATE_LEADERBOARD.slice(3);

  const openModal = (stateName) => setSelectedState(stateName);
  const closeModal = () => setSelectedState(null);

  const participants = selectedState ? MOCK_STATE_PARTICIPANTS[selectedState] : [];

  return (
    <section id="leaderboard" className="section border-t border-white/8 overflow-hidden relative">
      <div className="container-main">
        <div className="text-center mb-4">
          <p className="text-xs text-white uppercase tracking-[0.2em] mb-3">Rep Your <span className="text-[color:#008751]">State</span></p>
          <h2 className="heading text-3xl sm:text-4xl">State <span className="text-[color:#008751]">Leaderboard</span></h2>
          <p className="text-sm text-white max-w-md mx-auto mt-4">
            Which state brings the most heat? Ranking is based on total talent uploads, votes, and quiz scores.
            Tap a state to view its top contributors.
          </p>
        </div>

        {/* 3D Podium for Top 3 */}
        <div className="podium-container">
          {/* Rank 2 (Left) */}
          <button onClick={() => openModal(top3[1].state)} className="podium-block podium-rank-2 mt-auto cursor-pointer">
            <span className="text-white font-mono text-sm mb-1">#2</span>
            <span className="font-bold text-lg text-white mb-2">{top3[1].state}</span>
            <span className="text-xs text-white">{top3[1].score}</span>
          </button>

          {/* Rank 1 (Center) */}
          <button onClick={() => openModal(top3[0].state)} className="podium-block podium-rank-1 border-white/80 mt-auto shadow-[12px_12px_0px_0px_rgba(255,255,255,0.3)] cursor-pointer">
            <span className="text-white font-mono text-sm mb-1">#1</span>
            <span className="font-black text-2xl text-white mb-2">{top3[0].state}</span>
            <span className="text-xs text-white">{top3[0].score}</span>
            <span className="mt-4 text-xs font-bold px-2 py-1 bg-white text-black">CHAMPION</span>
          </button>

          {/* Rank 3 (Right) */}
          <button onClick={() => openModal(top3[2].state)} className="podium-block podium-rank-3 mt-auto cursor-pointer">
            <span className="text-white font-mono text-sm mb-1">#3</span>
            <span className="font-bold text-lg text-white mb-2">{top3[2].state}</span>
            <span className="text-xs text-white">{top3[2].score}</span>
          </button>
        </div>

        {/* List for the rest */}
        <div className="max-w-lg mx-auto">
          {rest.map((item) => (
            <button 
              key={item.state} 
              onClick={() => openModal(item.state)}
              className="list-item-3d w-full cursor-pointer text-left"
            >
              <div className="flex items-center gap-4">
                <span className="font-mono text-white text-sm">#{item.rank}</span>
                <span className="font-semibold text-white">{item.state}</span>
              </div>
              <span className="text-sm font-medium text-white">{item.score} <span className="text-xs text-white font-normal">pts</span></span>
            </button>
          ))}
          <div className="text-center mt-8">
            <button className="btn-ghost text-sm">Load Full Rankings ↓</button>
          </div>
        </div>
      </div>

      {/* Participants Modal Overlay */}
      {selectedState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-black border border-white/20 p-6 sm:p-8 w-full max-w-md animate-slide-up relative">
            
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 text-white hover:text-white transition-colors"
              aria-label="Close modal"
            >
              ✕
            </button>

            <div className="mb-8">
              <p className="text-xs text-white uppercase tracking-widest mb-1">Top Contributors</p>
              <h3 className="heading text-2xl">{selectedState}</h3>
            </div>

            <div className="space-y-4">
              {participants && participants.length > 0 ? (
                participants.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b border-white/10 pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="font-semibold text-sm text-white mb-0.5">{p.name}</p>
                      <p className="text-xs text-white">{p.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">{p.votes}</p>
                      <p className="text-[10px] text-white uppercase tracking-wide mt-0.5">Votes</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-white">No participants data available for this state yet.</p>
              )}
            </div>

            <button onClick={closeModal} className="btn-outline w-full mt-8">
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

// ─── CTA Banner ────────────────────────────────────────────────────────────────
function CtaBanner() {
  return (
    <section className="section border-t border-white/8">
      <div className="container-main text-center">
        <h2 className="heading text-2xl sm:text-3xl mb-4">Ready to <span className="text-[color:#008751]">Celebrate</span> Nigeria?</h2>
        <p className="text-sm text-white max-w-md mx-auto mb-8">
          Join thousands of Nigerians showcasing talent, voting for their favourites, and celebrating the culture.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/register" id="cta-join" className="btn-primary">
            Join Free
          </Link>
          <a href="/#talent" id="cta-explore" className="btn-outline">
            Explore Talent
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Landing Page (Composed) ──────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <>
      <Hero />
      <Pillars />
      <TalentCategories />
      <StateLeaderboard />
      <GlobalIcons />
      <CtaBanner />
    </>
  );
}
