import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TALENT_CATEGORIES } from "../utils/constants";
import NigeriaMap from "../components/ui/NigeriaMap";
import { getStateLeaderboard, getCategoryLeaderboard } from "../services/talentService";
import api from "../services/api";
import {
  Music, Medal, Volleyball, Laugh, Palette,
  Scissors, Shirt, Clapperboard, Camera, Laptop, Flame, Shield
} from "lucide-react";

const CATEGORY_ICONS = {
  music: Music,
  football: Medal,
  basketball: Volleyball,
  comedy: Laugh,
  artwork: Palette,
  hair: Scissors,
  fashion: Shirt,
  film: Clapperboard,
  photography: Camera,
  tech: Laptop,
  dance: Flame,
  security: Shield,
};

// ─── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center relative overflow-hidden bg-black px-5 md:px-12 pt-20">
      {/* Cinematic gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#008751]/20 via-transparent to-black/90 pointer-events-none"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col items-center text-center">
        {/* Headline */}
        <h1 
          className="font-black text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.05] tracking-tight mb-8 animate-slide-up text-white uppercase max-w-5xl"
        >
          Building the digital infrastructure for Nigerian <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#008751] to-emerald-300">excellence</span>, <span className="text-white/60">heritage & opportunity</span>
        </h1>


      </div>
    </div>
  );
}

// ─── Flagship Initiatives ──────────────────────────────────────────────────────
const INITIATIVES = [
  {
    id: "excellence",
    index: "01",
    title: "Compendium of Nigerian Global Excellence",
    body: "Celebrating the outstanding achievements of Nigerians on the global stage across various industries and disciplines.",
    cta: "Explore →",
    href: "/#",
  },
  {
    id: "documentary",
    index: "02",
    title: "Digital Documentary",
    body: "Immersive storytelling capturing the rich history, diverse culture, and powerful journeys of the Nigerian people.",
    cta: "Watch Now →",
    href: "/#",
  },
  {
    id: "talent",
    index: "03",
    title: "Naija Talent Zone",
    body: "Upload your talent across multiple categories. Get discovered, get voted, and rise to national stardom.",
    cta: "Upload Now →",
    href: "/register",
  },
  {
    id: "heritage",
    index: "04",
    title: "Nigerian Heritage & Ancestry",
    body: "Dive deep into the roots of our nation. Discover the traditions, languages, and legacy of our ancestors.",
    cta: "Discover →",
    href: "/#",
  },
  {
    id: "diaspora",
    index: "05",
    title: "Business & Diaspora Network",
    body: "Connecting Nigerian professionals and entrepreneurs globally to foster collaboration, investment, and growth.",
    cta: "Connect →",
    href: "/#",
  },
  {
    id: "innovation",
    index: "06",
    title: "Youth Talent & Innovation",
    body: "Empowering the next generation of Nigerian innovators, creatives, and leaders to shape the future.",
    cta: "Learn More →",
    href: "/#",
  },
];

function Initiatives() {
  return (
    <section id="initiatives" className="section border-t border-white/8">
      <div className="container-main">
        <div className="mb-10">
          <p className="text-xs text-white uppercase tracking-[0.2em] mb-3">What We <span className="text-[color:#008751]">Celebrate</span></p>
          <h2 className="heading text-2xl sm:text-3xl">Flagship <span className="text-[color:#008751]">Initiatives</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/8">
          {INITIATIVES.map(({ id, index, title, body, cta, href }) => (
            <article key={id} className="bg-black p-8 md:p-10 flex flex-col gap-6 group relative z-0 border border-transparent transition-all duration-300 hover:z-10 hover:-translate-y-2 hover:-translate-x-2 hover:border-[#008751] hover:shadow-[8px_8px_0px_#008751]">
              <p className="text-xs font-mono text-white group-hover:text-[#008751] transition-colors">{index}</p>
              <h3 className="font-semibold text-[color:#008751] text-lg leading-snug">{title}</h3>
              <p className="text-sm text-white leading-relaxed flex-1">{body}</p>
              <a
                href={href}
                id={`initiative-${id}`}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {TALENT_CATEGORIES.map(({ id, label, description, emoji }, index) => {
            // Bento Box Logic: Make Music and Dance prominent
            const isFeatured = index === 0 || index === 1;
            const spanClass = isFeatured ? "sm:col-span-2 lg:col-span-2 lg:row-span-2" : "col-span-1";
            
            return (
              <Link
                key={id}
                to={`/register?category=${id}`}
                id={`category-${id}`}
                className={`relative bg-[#050505] p-5 sm:p-6 flex flex-col justify-between border border-white/10 group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1 hover:border-[#008751] hover:bg-[#0a0a0a] hover:shadow-[6px_6px_0px_#008751] ${spanClass}`}
                style={{ minHeight: isFeatured ? '220px' : '160px' }}
              >
                {/* Background Emoji Watermark */}
                <div className="absolute -bottom-6 -right-6 text-[6rem] sm:text-[8rem] opacity-5 grayscale group-hover:grayscale-0 group-hover:opacity-10 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 pointer-events-none select-none z-0 mix-blend-luminosity">
                  {emoji}
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="flex items-start justify-between">
                    <p className="font-mono text-white/20 group-hover:text-[#008751] transition-colors text-lg sm:text-xl font-black tracking-widest mb-3">
                      {String(index + 1).padStart(2, '0')}
                    </p>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#008751] text-xl font-black">
                      +
                    </span>
                  </div>
                  
                  <div>
                    <h3 className={`font-black text-white uppercase tracking-tight mb-2 group-hover:text-white transition-colors ${isFeatured ? 'text-2xl sm:text-4xl' : 'text-lg sm:text-xl'}`}>
                      {label}
                    </h3>
                    <p className={`text-white/60 leading-relaxed group-hover:text-white/90 transition-colors ${isFeatured ? 'text-sm sm:text-base max-w-xs' : 'text-xs sm:text-sm'}`}>
                      {description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
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
      { title: "The Roots", image: "https://www.nobelprize.org/images/soyinka-13380-content-portrait-mobile-tiny.jpg", body: "Born in Abeokuta in 1934, Akinwande Oluwole Babatunde Soyinka was immersed in a rich blend of Yoruba tradition and Western education. This dual heritage formed the foundation of his unique literary voice." },
      { title: "The Breakthrough", image: "https://wscij.org/wp-content/uploads/2016/02/Prof-Wole-Soyinka.jpg", body: "In 1986, he made history by becoming the first sub-Saharan African to be awarded the Nobel Prize in Literature, recognized for his wide cultural perspective and poetic overtones." },
      { title: "Impact for Nigeria", image: "https://s3-us-east-2.amazonaws.com/cdn-test.poetryfoundation.org/content/images/2c42903ba2cf47a6c8dd1a07946590549984dbdb.jpeg", body: "Beyond literature, Soyinka has been a fierce political activist. He stood against dictatorship, endured imprisonment during the civil war, and remains a powerful moral conscience for the nation." }
    ]
  },
  { 
    name: "Ngozi Okonjo-Iweala", role: "WTO Director-General",
    chapters: [
      { title: "The Roots", image: "https://i.guim.co.uk/img/static/sys-images/Observer/Columnist/Columnists/2012/3/31/1333192641025/SNOW--OKONJO-IWEATA-006.jpg?width=465&dpr=1&s=none&crop=none", body: "Hailing from Ogwashi-Ukwu, Delta State, she pursued her education at Harvard and MIT, developing a profound understanding of global economics and development." },
      { title: "The Breakthrough", image: "https://assets.cfr.org/images/t_cfr_3_2/f_auto/w_1920/v1758970871/Africa-Okonjo-Iweala-speech/Africa-Okonjo-Iweala-speech.jpg", body: "She served twice as Nigeria's Finance Minister, driving critical reforms that led to the wiping out of $30 billion of Nigeria's Paris Club debt." },
      { title: "Impact for Nigeria", image: "https://www.wto.org/images/img_index/photos/dgselection24_lg.jpg", body: "In 2021, she shattered glass ceilings globally by becoming the first woman and the first African to lead the World Trade Organization, setting a towering standard for Nigerian excellence globally." }
    ]
  },
  { 
    name: "Wizkid", role: "Grammy Award Winner — Music",
    chapters: [
      { title: "The Roots", image: "https://inspiringnigerians.wordpress.com/wp-content/uploads/2021/04/r6778f8fc441111b1e6f89c6826046fc6.jpg", body: "Ayodeji Ibrahim Balogun started singing in church at age 11 in Surulere, Lagos. His early hustle laid the groundwork for a generational talent." },
      { title: "The Breakthrough", image: "https://i.ytimg.com/vi/yO6DYZLzwC8/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAtv_Cf8kb-7EGMs92q23HZTOiffA", imagePosition: "right", body: "His 2011 album 'Superstar' shifted the paradigm of modern Afrobeats. Global recognition exploded with his Drake collaboration 'One Dance' and his own smash hit 'Essence'." },
      { title: "Impact for Nigeria", image: "https://charts-static.billboard.com/img/2015/12/wizkid-qj3-344x344.jpg", body: "Wizkid didn't just win a Grammy; he opened the door for Afrobeats to become a dominant global genre, exporting Nigerian culture to every corner of the earth." }
    ]
  },
  { 
    name: "Chinua Achebe", role: "Author — Things Fall Apart",
    chapters: [
      { title: "The Roots", image: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Chinua_Achebe%2C_1966.jpg", body: "Born in Ogidi in 1930, Achebe grew up at the crossroads of traditional Igbo culture and colonial Christianity, giving him a sharp lens on the African experience." },
      { title: "The Breakthrough", image: "https://i.guim.co.uk/img/static/sys-images/Guardian/Pix/pictures/2013/3/22/1363955292184/chinua-achebe-008.jpg?width=465&dpr=1&s=none&crop=none", body: "His 1958 magnum opus, 'Things Fall Apart', became the most widely read book in modern African literature, selling over 20 million copies and translated into 50 languages." },
      { title: "Impact for Nigeria", image: "https://africanarguments.org/wp-content/uploads/2013/03/Chinua_Achebe.jpg", body: "He reclaimed the African narrative from Western storytellers. By writing with authentic Nigerian nuance, he gave an entire continent its voice on the global literary stage." }
    ]
  },
  { 
    name: "Nnamdi Azikiwe", role: "1st President of Nigeria",
    chapters: [
      { title: "The Roots", image: "https://cdn.britannica.com/84/76284-050-3549B442/Nnamdi-Azikiwe.jpg", body: "Born in Zungeru in 1904, 'Zik of Africa' was educated in the United States, where he was heavily influenced by the Pan-African movement and the fight for racial equality." },
      { title: "The Breakthrough", image: "https://upload.wikimedia.org/wikipedia/commons/b/bb/Nnamdi_Azikiwe_PC_%28cropped%29.jpg", body: "He became a pioneering journalist and political leader, using his newspapers to champion the cause of Nigerian independence from British colonial rule." },
      { title: "Impact for Nigeria", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6Zyq1pAHijySy_9iRXAtC8kHexLBk2YPQVA&s", body: "As the first President of an independent Nigeria, he laid the democratic foundations of the republic. His vision of a united, self-determined Africa continues to inspire." }
    ]
  },
  { 
    name: "Burna Boy", role: "African Giant — Music",
    chapters: [
      { title: "The Roots", image: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Burna_Boy_%28cropped%29.jpg", body: "Damini Ebunoluwa Ogulu was born in Port Harcourt. With a grandfather who managed Fela Kuti, Afrobeat royalty was in his blood from day one." },
      { title: "The Breakthrough", image: "https://image.okayafrica.com/129323.webp?imageId=129323&width=960&height=642&format=jpg", body: "His album 'African Giant' propelled him to international stardom, but it was 'Twice as Tall' that earned him the Grammy Award for Best Global Music Album." },
      { title: "Impact for Nigeria", image: "https://static.euronews.com/articles/stories/09/37/46/38/900x506_cmsv2_0335a459-a9f6-5076-a9f1-3a2cc6639900-9374638.jpg", body: "He sells out the biggest stadiums in the world, boldly carrying the Nigerian flag. He is a cultural ambassador who demands global respect for African artistry." }
    ]
  },
  { 
    name: "Fela Kuti", role: "Pioneer of Afrobeat",
    chapters: [
      { title: "The Roots", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTdVBSa3oNTks18q8Rp8ZrkQg6hEN1gNmJyQ&s", body: "Born in Abeokuta in 1938 to a prominent family, his early exposure to highlife music and radical politics in London and the US shaped his revolutionary mindset." },
      { title: "The Breakthrough", image: "https://echoesanddust.com/wp-content/uploads/2016/03/Fela_feature.jpg", body: "He pioneered Afrobeat—a complex fusion of Jazz, Funk, and African rhythms—and established the legendary Kalakuta Republic, a commune and recording studio." },
      { title: "Impact for Nigeria", image: "https://upload.wikimedia.org/wikipedia/commons/1/12/Fela_Kuti_circa_1986.jpg", body: "An eternal symbol of resistance and African consciousness. He criticized corruption and championed the common man, leaving behind a timeless, politically charged musical legacy." }
    ]
  },
  { 
    name: "Funke Akindele", role: "Actress & Filmmaker",
    chapters: [
      { title: "The Roots", image: "https://cdn.businessday.ng/2023/07/Funke-Akindele.png", body: "Hailing from Ikorodu, Lagos State, she entered the television industry with the UNPFA-sponsored sitcom 'I Need to Know' in the late 90s." },
      { title: "The Breakthrough", image: "https://waffitv.com/uploads/2025/5/Funke-Akindelee.jpg", body: "Her creation of the 'Jenifa' character became a massive cultural phenomenon, leading to a long-running, award-winning TV series and spin-offs." },
      { title: "Impact for Nigeria", image: "https://234star.com/wp-content/uploads/2025/02/Snapinst.app_467337629_18476770810027265_4027477711569292019_n_1080-e1740568663510.jpg", body: "She shattered domestic box office records with 'A Tribe Called Judah', becoming one of the most powerful, successful, and influential forces in modern Nollywood history." }
    ]
  },
  { 
    name: "Chioma Ajunwa", role: "Olympic Gold Medalist",
    chapters: [
      { title: "The Roots", image: "https://cdn.vanguardngr.com/wp-content/uploads/2020/10/gettyimages-51976837-2048x2048-1.jpg", body: "Born in Ahiazu-Mbaise, she was a fiercely multi-talented athlete who initially represented Nigeria playing football for the Super Falcons." },
      { title: "The Breakthrough", image: "https://i0.wp.com/genderpedia.ng/wp-content/uploads/2024/06/Chioma-Ajunwa-jpg.webp?fit=659%2C971&ssl=1", body: "Switching focus to track and field, she defied massive odds at the 1996 Atlanta Olympics to win gold in the women's long jump with a leap of 7.12 meters." },
      { title: "Impact for Nigeria", image: "https://theinterview.ng/wp-content/uploads/2016/08/chioma_ajunawa.jpg", body: "She made history as the first Nigerian—and first black African woman—to win an Olympic gold medal in a field event. She also became an officer of the Nigerian Police Force, where she retired as a Deputy Commissioner of Police after 35 years of dedicated service." }
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
    <div className="fixed inset-0 z-50 flex flex-col bg-[#050505] overflow-hidden animate-fade-in">
      
      {/* Massive Background Typography */}
      <div 
        className="absolute -top-10 sm:-top-20 -right-10 text-[300px] sm:text-[400px] md:text-[500px] font-black pointer-events-none select-none z-0 transition-all duration-700" 
        style={{ WebkitTextStroke: "2px rgba(255,255,255,0.05)", color: "transparent", lineHeight: 0.8 }}
      >
        0{activeSlide + 1}
      </div>

      {/* Top Bar */}
      <div className="flex items-center justify-between p-6 md:p-10 z-50">
        <div>
          <p className="text-xs text-white uppercase tracking-[0.3em] mb-2">Global Icon</p>
          <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase">{icon.name}</h3>
        </div>
        <button onClick={onClose} className="text-white hover:text-[#008751] hover:border-[#008751] transition-colors text-sm font-bold tracking-widest uppercase px-6 py-3 border border-white/20 bg-black shadow-[4px_4px_0_rgba(255,255,255,0.1)] hover:shadow-[4px_4px_0_rgba(0,135,81,0.5)]">
          [ Exit ]
        </button>
      </div>

      {/* Aggressive Side Navigation Controls */}
      <button 
        onClick={handlePrev} 
        disabled={activeSlide === 0}
        className="absolute left-0 top-0 bottom-0 w-16 md:w-24 hover:bg-white/5 flex items-center justify-center transition-all group z-40 disabled:opacity-0"
      >
        <span className="text-white/20 group-hover:text-white text-5xl md:text-7xl font-black group-hover:-translate-x-2 transition-transform">{"<"}</span>
      </button>

      <button 
        onClick={handleNext} 
        disabled={activeSlide === icon.chapters.length - 1}
        className="absolute right-0 top-0 bottom-0 w-16 md:w-24 hover:bg-white/5 flex items-center justify-center transition-all group z-40 disabled:opacity-0"
      >
        <span className="text-white/20 group-hover:text-white text-5xl md:text-7xl font-black group-hover:translate-x-2 transition-transform">{">"}</span>
      </button>

      {/* 3D Slide Engine */}
      <div className="flex-1 relative perspective-container flex items-center justify-center w-full max-w-[1600px] mx-auto px-16 md:px-24 py-8 z-10">
        {icon.chapters.map((chapter, idx) => {
          const delta = idx - activeSlide;
          
          let transform = "translateX(0) translateZ(0) rotateY(0) scale(1)";
          let opacity = 1;
          let pointerEvents = "auto";

          if (delta < 0) {
            transform = `translateX(-80%) translateZ(-500px) rotateY(30deg) scale(0.9)`;
            opacity = 0;
            pointerEvents = "none";
          } else if (delta > 0) {
            const xOffset = 30 * delta;
            const zOffset = -300 * delta;
            const rotate = -10 - (2 * delta);
            transform = `translateX(${xOffset}%) translateZ(${zOffset}px) rotateY(${rotate}deg) scale(${1 - delta * 0.05})`;
            opacity = Math.max(0, 1 - (delta * 0.4));
            pointerEvents = "none";
          }

          return (
            <div 
              key={idx}
              className="absolute w-[90vw] max-w-[1200px] min-h-[60vh] flex flex-col md:flex-row border border-white/10 bg-[#050505]"
              style={{
                transform,
                opacity,
                pointerEvents,
                zIndex: 50 - Math.abs(delta),
                transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
                boxShadow: delta === 0 ? "16px 16px 0px 0px rgba(0,135,81,0.3)" : "none"
              }}
            >
              {/* Image Area (Left side) */}
              <div className="w-full md:w-5/12 min-h-[300px] md:min-h-full bg-[#0a0a0a] border-b md:border-b-0 md:border-r border-white/10 flex flex-col items-center justify-center relative overflow-hidden group p-8">
                {/* Subtle background layer */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#008751]/10 to-transparent pointer-events-none"></div>
                <span className="text-white/5 text-[8rem] md:text-[15rem] font-black tracking-tighter uppercase absolute -left-4 md:-left-10 top-1/2 -translate-y-1/2 select-none pointer-events-none leading-none z-0">
                  0{idx + 1}
                </span>

                {/* Framed Image */}
                {chapter.image ? (
                  <div className="relative z-10 w-full max-w-[220px] md:max-w-[280px] aspect-[3/4] border border-white/20 bg-[#111] shadow-[8px_8px_0_rgba(0,135,81,0.3)] overflow-hidden group-hover:shadow-[12px_12px_0_rgba(0,135,81,0.5)] group-hover:-translate-y-2 transition-all duration-500 flex-shrink-0">
                    <img 
                      src={chapter.image} 
                      alt={chapter.title} 
                      className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                      style={{ objectPosition: chapter.imagePosition || 'center' }}
                    />
                    <div className="absolute inset-0 border-[2px] border-black/20 pointer-events-none"></div>
                  </div>
                ) : (
                  <span className="text-white/50 text-sm tracking-widest uppercase z-10 font-bold border border-white/20 px-6 py-3 bg-black/50 backdrop-blur-sm">
                    Image Placeholder
                  </span>
                )}
              </div>

              {/* Text Content (Right side) */}
              <div className="w-full md:w-7/12 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-[#0a0a0a]">
                <p className="font-mono text-[#008751] text-xs mb-4 uppercase tracking-[0.3em] font-bold">Chapter 0{idx + 1} // 0{icon.chapters.length}</p>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-[1.05] tracking-tighter uppercase">
                  {chapter.title}
                </h2>
                <p className="text-white/80 text-base md:text-lg leading-relaxed max-w-xl">
                  {chapter.body}
                </p>
                
                {idx === icon.chapters.length - 1 && (
                  <button onClick={onClose} className="mt-10 btn-primary self-start text-base px-6 py-3 uppercase tracking-widest font-bold">
                    Return to Legends
                  </button>
                )}
              </div>
            </div>
          );
        })}
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
export function StateLeaderboard() {
  const [selectedState, setSelectedState]       = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState(null);

  // ── Real state leaderboard data ────────────────────────────────────────────
  const [stateData, setStateData]   = useState([]);
  const [catEntries, setCatEntries] = useState([]);
  const [catLoading, setCatLoading] = useState(false);
  const [apiCategories, setApiCategories] = useState([]);

  useEffect(() => {
    getStateLeaderboard({ byVoterLocation: false })
      .then(data => setStateData(data.entries || []))
      .catch(() => {});

    api.get("/talents/categories/approved")
      .then(res => setApiCategories(res.data || []))
      .catch(() => {
        setApiCategories([
          "Music", "Football Freestyle", "Basketball Freestyle",
          "Comedy Skits", "Handmade Artwork", "Hair Artistry",
          "Fashion", "Short Film", "Photography", "Tech Innovation", "Dance", "Security",
        ].map((name, i) => ({ id: i + 1, name, status: "approved" })));
      });
  }, []);

  // Fetch leaderboard when state+category are both selected
  useEffect(() => {
    if (!selectedState || !selectedCategoryName) return;
    setCatLoading(true);
    getCategoryLeaderboard(selectedCategoryName, { location: selectedState, limit: 10 })
      .then(data => setCatEntries(data.entries || []))
      .catch(() => setCatEntries([]))
      .finally(() => setCatLoading(false));
  }, [selectedState, selectedCategoryName]);

  // Build top-3 from real data, fall back to placeholders if empty
  const top3 = stateData.slice(0, 3).map((e, i) => ({
    state: e.state,
    score: e.vote_count.toLocaleString(),
    rank: i + 1,
  }));
  // Pad with placeholders if the API hasn't returned 3 yet
  while (top3.length < 3) top3.push({ state: "—", score: "0", rank: top3.length + 1 });

  const openModal = (stateName) => { if (stateName !== "—") { setSelectedState(stateName); setSelectedCategoryName(null); } };
  const closeModal = () => {
    setSelectedState(null);
    setSelectedCategoryName(null);
  };

  return (
    <section id="leaderboard" className="section border-t border-white/8 overflow-hidden relative">
      <div className="w-full max-w-[1400px] mx-auto px-5 sm:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 xl:gap-20">
          
          {/* Left Side: Interactive Map */}
          <div className="w-full lg:w-2/3 order-2 lg:order-1 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <NigeriaMap 
              leaderboardData={stateData.map((e, i) => ({ rank: i + 1, state: e.state, score: e.vote_count.toLocaleString(), tag: "Votes" }))} 
              onStateClick={(stateData) => openModal(stateData.state)} 
            />
          </div>

          {/* Right Side: Text & Podium */}
          <div className="w-full lg:w-1/3 order-1 lg:order-2">
            <div className="text-left mb-12">
              <p className="text-xs text-white uppercase tracking-[0.2em] mb-3">Rep Your <span className="text-[color:#008751]">State</span></p>
              <h2 className="heading text-4xl sm:text-5xl lg:text-6xl leading-tight mb-4">State <span className="text-[color:#008751]">Leaderboard</span></h2>
              <p className="text-sm text-white/80 max-w-sm leading-relaxed mb-6">
                Which state brings the most heat? Tap a state on the map to explore its top talent by category.
              </p>
              <Link to="/leaderboard" className="btn-primary text-xs px-5 py-2.5">
                View Full Leaderboard →
              </Link>
            </div>

            {/* 3D Podium for Top 3 */}
            <div className="flex items-end justify-start gap-3 sm:gap-4 scale-90 sm:scale-100 origin-left">
              <button onClick={() => openModal(top3[1].state)} className="relative flex flex-col items-center justify-start pt-4 border border-white/20 bg-[#0a0a0a] transition-transform duration-300 shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] h-[160px] w-[90px] mt-auto cursor-pointer">
                <span className="text-white/60 font-mono text-[10px] mb-1">#2</span>
                <span className="font-bold text-sm text-white mb-1">{top3[1].state}</span>
                <span className="text-[10px] text-[#008751] font-bold">{top3[1].score}</span>
              </button>
              <button onClick={() => openModal(top3[0].state)} className="relative flex flex-col items-center justify-start pt-4 border border-white/80 bg-[#111] transition-transform duration-300 shadow-[8px_8px_0px_0px_rgba(255,255,255,0.25)] hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.35)] h-[200px] w-[110px] mt-auto cursor-pointer z-10">
                <span className="text-white font-mono text-[10px] mb-1">#1</span>
                <span className="font-black text-xl text-white mb-1">{top3[0].state}</span>
                <span className="text-xs text-[#008751] font-bold">{top3[0].score}</span>
                <span className="mt-2 text-[9px] font-bold px-1.5 py-0.5 bg-white text-black tracking-widest">CHAMPION</span>
              </button>
              <button onClick={() => openModal(top3[2].state)} className="relative flex flex-col items-center justify-start pt-4 border border-white/20 bg-[#0a0a0a] transition-transform duration-300 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)] h-[130px] w-[90px] mt-auto cursor-pointer">
                <span className="text-white/60 font-mono text-[10px] mb-1">#3</span>
                <span className="font-bold text-sm text-white mb-1">{top3[2].state}</span>
                <span className="text-[10px] text-[#008751] font-bold">{top3[2].score}</span>
              </button>
            </div>
          </div>
          
        </div>
      </div>

      {/* Two-Step Modal Overlay */}
      {selectedState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0a0a0a] border border-white/20 w-full max-w-md animate-slide-up relative shadow-[8px_8px_0_rgba(0,135,81,0.2)]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                {selectedCategoryName ? (
                  <button onClick={() => setSelectedCategoryName(null)} className="text-[10px] text-white/40 uppercase tracking-widest mb-1 flex items-center gap-1 hover:text-white transition-colors">
                    ← {selectedState}
                  </button>
                ) : (
                  <p className="text-[10px] text-[#008751] uppercase tracking-widest mb-1 font-bold">State Selected</p>
                )}
                <h3 className="text-xl font-black text-white uppercase tracking-tight">
                  {selectedCategoryName ? selectedCategoryName : selectedState}
                </h3>
              </div>
              <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center border border-white/20 text-white hover:border-white transition-colors text-sm">✕</button>
            </div>

            {/* Step 1: Category Grid */}
            {!selectedCategoryName && (
              <div className="p-6">
                <p className="text-xs text-white/40 uppercase tracking-widest mb-5 font-bold">Pick a category to view the leaderboard</p>
                <div className="grid grid-cols-2 gap-2">
                  {apiCategories.map((cat) => {
                    const iconKey = cat.name.toLowerCase().includes("football") ? "football" 
                                  : cat.name.toLowerCase().includes("basketball") ? "basketball"
                                  : cat.name.toLowerCase().includes("music") ? "music"
                                  : cat.name.toLowerCase().includes("comedy") ? "comedy"
                                  : cat.name.toLowerCase().includes("hair") ? "hair"
                                  : cat.name.toLowerCase().includes("fashion") ? "fashion"
                                  : cat.name.toLowerCase().includes("film") ? "film"
                                  : cat.name.toLowerCase().includes("photo") ? "photography"
                                  : cat.name.toLowerCase().includes("tech") ? "tech"
                                  : cat.name.toLowerCase().includes("dance") ? "dance"
                                  : cat.name.toLowerCase().includes("security") ? "security"
                                  : "artwork";
                    const Icon = CATEGORY_ICONS[iconKey] || Music;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategoryName(cat.name)}
                        className="flex items-center gap-3 p-3 border border-white/10 bg-black text-left hover:border-[#008751] hover:bg-[#0a1a0f] transition-all group"
                      >
                        <span className="w-8 h-8 flex items-center justify-center border border-white/10 bg-[#111] text-white/50 group-hover:text-[#008751] group-hover:border-[#008751]/40 transition-colors flex-shrink-0">
                          <Icon className="w-4 h-4" strokeWidth={2} />
                        </span>
                        <span className="text-[10px] font-black text-white/70 group-hover:text-white uppercase tracking-wide">{cat.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Category Leaderboard for Selected State */}
            {selectedCategoryName && (
              <div className="p-6">
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-4 font-bold">
                  Top talent in {selectedState}
                </p>
                <div className="space-y-3 mb-6">
                  {catLoading ? (
                    <div className="flex justify-center py-6">
                      <div className="w-5 h-5 border-2 border-[#008751] border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : catEntries.length === 0 ? (
                    <p className="text-xs text-white/30 text-center py-6">No entries yet for {selectedCategoryName.toLowerCase()} in {selectedState}.</p>
                  ) : (
                     catEntries.map((p, idx) => (
                        <div key={p.submission_id || idx} className="flex items-center gap-3 py-2.5 border-b border-white/8 last:border-0">
                          <span className="font-mono text-white/30 text-xs w-5">#{idx + 1}</span>
                          <div className="w-8 h-8 flex items-center justify-center bg-[#111] border border-white/10 text-white font-black text-xs flex-shrink-0">
                            {(p.title || "?").charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-black text-white truncate">{p.title || `Submission #${p.submission_id}`}</p>
                            <p className="text-[10px] text-white/40 uppercase tracking-wide">ID #{p.submission_id}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-black text-[#008751]">{(p.vote_count || 0).toLocaleString()}</p>
                            <p className="text-[9px] text-white/30 uppercase">votes</p>
                          </div>
                        </div>
                      ))
                  )}
                </div>
                <Link
                  to="/leaderboard"
                  onClick={closeModal}
                  className="btn-primary w-full justify-center text-xs py-3"
                >
                  View Full Leaderboard →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

// ─── The Challenge ─────────────────────────────────────────────────────────────
function Challenge() {
  return (
    <section className="section bg-[#050505] py-24 md:py-32">
      <div className="container-main max-w-4xl text-center">
        <p className="text-xs text-[#008751] uppercase tracking-[0.3em] font-bold mb-6">The Challenge</p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white/90 leading-tight font-medium">
          Nigeria is rich in remarkable people, achievements, heritage, knowledge, businesses and stories. 
          <span className="text-white font-black block mt-6">Yet most of this wealth remains scattered, under-documented and difficult to discover.</span>
        </h2>
        <p className="mt-12 text-white/50 text-base md:text-lg leading-relaxed max-w-3xl mx-auto font-medium">
          NGC Global builds one living digital ecosystem that gathers these resources, preserves Nigeria's story, celebrates its people, and creates clear pathways for the next generation to find opportunity, build careers and drive sustainable development.
        </p>
      </div>
    </section>
  );
}

// ─── One Ecosystem. Many Possibilities. ────────────────────────────────────────
const ECOSYSTEM_ITEMS = [
  { title: "Excellence", body: "Discover the Nigerians and achievements that define our progress." },
  { title: "Heritage & Ancestry", body: "Preserve identity, history and ancestral connections." },
  { title: "Knowledge", body: "Create a lasting, searchable record of Nigerian knowledge." },
  { title: "Business", body: "Surface the companies building value and growing the economy." },
  { title: "Diaspora", body: "Connect Nigerians at home with Nigeria's global community." },
  { title: "Emerging Generation", body: "Discover and elevate young talent, creators, innovators and entrepreneurs." },
  { title: "Stories", body: "Document people, places and experiences through documentaries, profiles and publications." },
  { title: "Opportunities", body: "Link talent to mentors, investors, grants, employers and global networks." }
];

function Ecosystem() {
  return (
    <section className="section bg-[#020202] border-t border-white/5">
      <div className="container-main">
        <div className="text-center mb-16">
          <h2 className="heading text-4xl sm:text-5xl lg:text-6xl text-white uppercase leading-none">
            One Ecosystem.<br />
            <span className="text-[#008751]">Many Possibilities.</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ECOSYSTEM_ITEMS.map((item, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 p-8 hover:border-[#008751]/50 hover:bg-white/10 transition-all group flex flex-col h-full cursor-default">
              <span className="text-[#008751] font-mono text-xs font-bold mb-4 block group-hover:-translate-y-1 transition-transform">0{idx + 1}</span>
              <h3 className="text-xl font-black text-white uppercase tracking-tight mb-3 group-hover:text-[#008751] transition-colors">{item.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed mt-auto">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── From Discovery to Opportunity ─────────────────────────────────────────────
function DiscoveryPathway() {
  return (
    <section className="section bg-[#050505] border-t border-white/5 overflow-hidden">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs text-[#008751] uppercase tracking-[0.3em] font-bold mb-4">The Pipeline</p>
            <h2 className="heading text-4xl sm:text-5xl lg:text-6xl text-white uppercase mb-8 leading-[1.05]">
              From Discovery<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#008751] to-emerald-300">To Opportunity</span>
            </h2>
            <p className="text-white/70 text-base md:text-lg leading-relaxed mb-6">
              We find what deserves to be known, document what must not be lost, preserve our heritage, celebrate excellence, and connect people and ideas to the resources that help them grow.
            </p>
            <p className="text-white/70 text-base md:text-lg leading-relaxed font-bold">
              Through this ecosystem, young Nigerians are discovered, mentored, connected to employers, investors and funding, and supported to build sustainable livelihoods and enterprises.
            </p>
          </div>
          <div className="relative py-10 pl-4 sm:pl-10">
            <div className="absolute inset-0 bg-gradient-to-r from-[#008751]/10 to-transparent blur-3xl -z-10"></div>
            <div className="flex flex-col gap-10 border-l-2 border-[#008751]/30 pl-8">
              {['Find & Document', 'Preserve & Celebrate', 'Connect & Grow', 'Fund & Build'].map((step, i) => (
                <div key={i} className="relative group cursor-default">
                  <div className="absolute -left-[41px] top-1.5 w-4 h-4 bg-[#050505] border-2 border-[#008751] rounded-full group-hover:bg-[#008751] group-hover:shadow-[0_0_15px_#008751] transition-all"></div>
                  <h4 className="text-2xl font-black text-white uppercase tracking-wider group-hover:translate-x-2 transition-transform">{step}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Technology & Impact ───────────────────────────────────────────────────────
function TechAndImpact() {
  return (
    <section className="section bg-black border-t border-white/5 py-0">
      <div className="container-main max-w-full px-0 sm:px-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/10 border-y sm:border border-white/10">
          <div className="bg-[#050505] p-10 md:p-16 lg:p-24 flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#008751]/5 to-transparent pointer-events-none"></div>
            <p className="text-xs text-[#008751] uppercase tracking-[0.3em] font-bold mb-6 relative z-10">Technology</p>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-[1.1] mb-6 uppercase tracking-tight relative z-10">
              The Infrastructure That Holds Everything Together
            </h3>
            <p className="text-white/60 text-base md:text-lg leading-relaxed font-medium relative z-10 max-w-lg">
              Technology is the digital engine powering discovery, profiles, documentation, search, storytelling and the connections that turn raw potential into tangible opportunity.
            </p>
          </div>
          <div className="bg-[#020202] p-10 md:p-16 lg:p-24 flex flex-col justify-center relative z-10">
            <p className="text-xs text-[#008751] uppercase tracking-[0.3em] font-bold mb-8">Our Impact</p>
            <ul className="space-y-8">
              {[
                "Preserving today's excellence.",
                "Creating opportunity for this generation.",
                "Discovering tomorrow's potential.",
                "Connecting Nigeria to the world."
              ].map((impact, i) => (
                <li key={i} className="flex items-start gap-5 group">
                  <span className="text-[#008751] font-black text-2xl mt-0 group-hover:translate-x-2 transition-transform">→</span>
                  <span className="text-xl md:text-2xl lg:text-3xl font-bold text-white uppercase tracking-tight">{impact}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Partnership & Join Ecosystem ──────────────────────────────────────────────
function Partnership() {
  return (
    <section className="py-10 bg-gradient-to-r from-[#006039] to-[#008751] text-white text-center px-5 border-y border-white/10 shadow-[0_10px_30px_rgba(0,135,81,0.2)] relative z-20">
      <p className="text-sm md:text-base font-medium tracking-[0.1em] uppercase">
        In partnership with the <span className="font-black">African University of Science and Technology (AUST)</span>, Abuja.
      </p>
    </section>
  );
}

function JoinEcosystem() {
  return (
    <section className="pt-32 pb-40 bg-[#050505] text-center border-t border-white/5 relative z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#008751]/5 to-transparent pointer-events-none"></div>
      <div className="container-main max-w-4xl relative z-10">
        <h2 className="heading text-5xl sm:text-6xl md:text-8xl font-black text-white uppercase mb-8 leading-[0.95] tracking-tight">
          Join The <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#008751] to-emerald-300">Ecosystem</span>
        </h2>
        <p className="text-lg md:text-2xl text-white/70 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
          Explore Nigeria. Discover excellence. Connect to opportunity. Be part of the living record of Nigerian excellence — and help turn discovery into lasting opportunity.
        </p>
        
        {/* Flow equation */}
        <div className="bg-black border border-white/10 p-6 md:p-10 rounded-2xl mb-12 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          <p className="text-[#008751] font-mono text-sm md:text-base font-bold leading-loose flex flex-col md:inline-block items-center justify-center text-center">
            <span className="text-white">Nigeria's wealth</span>
            <span className="text-white/30 mx-3 rotate-90 md:rotate-0 inline-block my-1 md:my-0">→</span> documented & preserved
            <span className="text-white/30 mx-3 rotate-90 md:rotate-0 inline-block my-1 md:my-0">→</span> discovered
            <span className="text-white/30 mx-3 rotate-90 md:rotate-0 inline-block my-1 md:my-0">→</span> connected to opportunity
            <span className="text-white/30 mx-3 rotate-90 md:rotate-0 inline-block my-1 md:my-0">→</span> <span className="text-white">young people empowered</span>
            <span className="text-white/30 mx-3 rotate-90 md:rotate-0 inline-block my-1 md:my-0">→</span> sustainable development.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/register" className="btn-primary py-4 px-10 text-lg font-bold shadow-[0_0_20px_rgba(0,135,81,0.3)] hover:shadow-[0_0_30px_rgba(0,135,81,0.5)]">
            Upload Your Profile
          </Link>
          <Link to="/opportunities" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 py-4 px-10 text-lg font-bold rounded-full transition-all">
            Explore Opportunities
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Landing Page (Composed) ──────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="bg-[#050505] min-h-screen flex flex-col">
      <Hero />
      <div className="bg-[#050505] border-t border-white/10">
        <Challenge />
        <Ecosystem />
        <DiscoveryPathway />
        <Initiatives />
        <TalentCategories />
        <StateLeaderboard />
        <GlobalIcons />
        <TechAndImpact />
        <Partnership />
        <JoinEcosystem />
      </div>
    </div>
  );
}
