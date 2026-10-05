import React from 'react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-24 overflow-hidden selection:bg-[#008751] selection:text-white relative">
      
      {/* ── HERO SECTION ──────────────────────────────────────────────────────── */}
      <section className="relative max-w-7xl mx-auto px-6 mb-40">
        {/* HUGE VERTICAL BACKGROUND TEXT */}
        <div className="absolute top-[-100px] left-0 md:left-20 text-[150px] md:text-[250px] font-black text-white/[0.03] select-none pointer-events-none rotate-90 origin-left z-0 whitespace-nowrap hidden lg:block uppercase tracking-tighter">
          About
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-16 lg:pl-40">
          
          {/* Main Text */}
          <div className="w-full max-w-3xl animate-slide-up py-20">
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight italic font-serif">
              About Nigeria<br/>Celebrates Global
            </h1>
            <div className="space-y-4 mt-8">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">What We Do</h2>
              <p className="text-[#008751] font-bold text-lg md:text-xl leading-relaxed max-w-xl italic">
                From Nigeria's foothills, we channel a global Ocean of Greatness mapping legends, filming history, and igniting youth brilliant enough to move mountains.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── MEET THE TEAM SECTION ──────────────────────────────────────────────────── */}
      <section className="relative max-w-7xl mx-auto px-6 mb-40">
        {/* Decorative faint background circle */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5 pointer-events-none -z-10 hidden md:block"></div>
        
        <div className="flex flex-col-reverse md:flex-row items-center gap-16 lg:gap-24">
          
          {/* Left Image */}
          <div className="w-full md:w-1/2">
            <div className="relative w-full rounded-[2rem] md:rounded-[3rem] overflow-hidden border-8 border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <img src="/team.jpeg" alt="The Team" className="w-full h-auto block" />
            </div>
          </div>

          {/* Right Text */}
          <div className="w-full md:w-1/2">
            <h2 className="text-4xl md:text-5xl font-medium mb-4 leading-tight tracking-tight">
              Meet the Team<br/>
              <span className="text-white/60 text-2xl md:text-3xl tracking-normal">Behind Nigeria Celebrates Global (NGC Global)</span>
            </h2>
            <div className="space-y-6 text-white text-base leading-relaxed mt-8">
              <p>
                A passionate team of innovators, academics, project managers, creatives, and student leaders united by a common vision to celebrate Nigeria's achievements, inspire the next generation, and build a stronger future through innovation, education, and collaboration.
              </p>
              <p>
                This multidisciplinary team is leading the implementation of the Nigeria Global Excellence Compendium & Documentary, the Nigeria National Digital Youth Talent Challenge (NNDYTC), and other flagship initiatives that recognize outstanding Nigerians at home and across the globe while creating opportunities for young innovators and entrepreneurs.
              </p>
              <p>
                <strong className="text-white font-black">Nigeria Celebrates Global</strong> is proudly powered by De Ambassadors Global Network (DAGN) in strategic partnership with the African University of Science and Technology (AUST), Abuja. Together, we are building an ecosystem that connects government, academia, the private sector, the media, and Nigerians across the globe to showcase excellence, promote innovation, and inspire national pride.
              </p>
              <p className="text-[#008751] font-bold text-lg">
                Together, we are celebrating excellence, inspiring the future, and telling Nigeria's story to the world.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── THE FOUNDER SECTION ────────────────────────────────────────────────────── */}
      <section className="relative max-w-7xl mx-auto px-6 mb-40">
        {/* HUGE BACKGROUND TEXT */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[80px] md:text-[180px] font-black text-white/[0.02] select-none pointer-events-none z-0 whitespace-nowrap uppercase tracking-widest hidden md:block">
          FOUNDER
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-16 lg:gap-24">
          
          {/* Left Text */}
          <div className="w-full md:w-3/5">
            <h2 className="text-4xl md:text-5xl font-medium mb-8 tracking-tight">
              The Founder
            </h2>
            <div className="space-y-4 text-white text-base leading-relaxed">
              <p>
                <strong className="text-white font-black">Jennifer Chinyelu Obiasor</strong> is a Nigerian social entrepreneur, innovation advocate, and Founder of De Ambassadors Global Network (DAGN), a technology and social enterprise committed to celebrating excellence, empowering young people, advancing innovation, promoting healthier communities, and contributing to national development.
              </p>
              <p>
                With nearly two decades of experience developing initiatives that identify talent, recognize achievement, and create opportunities, Jennifer has built platforms that seek to unlock human potential and inspire the next generation. Her journey began in 2007 with the Young Talent Discovery Project, established to identify, nurture, and showcase exceptional young people in science, technology, creativity, and leadership.
              </p>
              <p>
                Her commitment to science, technology, and innovation has included collaboration on “Science and Technology: Key to National Development,” a conference undertaken alongside UNESCO-related initiatives, and participation in the European Union Contest for Young Scientists in Copenhagen, Denmark, in 2008.
              </p>
              <p>
                Over the years, she has also collaborated with institutions including the Nigerian Television Authority (NTA), African Independent Television (AIT), Federal Ministry of Science and Technology, Federal Ministry of Education, and the Raw Materials Research and Development Council (RMRDC) on initiatives relating to education, innovation, talent development, and national development.
              </p>
              <p>
                Jennifer conceived “How Well Do You Know Nigeria?”, a national quiz and talent platform designed to deepen knowledge of Nigeria while celebrating its history, culture, and young talents. She also founded OYANAHEALTH, an initiative focused on healthier living and elderly care.
              </p>
              <p>
                Today, Jennifer leads <strong className="text-white font-black">Nigeria Celebrates Global (NGC Global)</strong>, the flagship initiative of DAGN. NGC Global is a technology and social-impact ecosystem designed to document and celebrate Nigerian excellence, preserve heritage and stories, discover emerging talent, and connect people to opportunities while showcasing Nigeria’s achievements on the global stage.
              </p>
              <p>
                DAGN works in partnership with the African University of Science and Technology (AUST), Abuja, strengthening its capacity to advance technology, innovation, youth development, and knowledge-driven social impact.
              </p>
              <p className="italic text-[#008751] font-medium border-l-4 border-[#008751] pl-4 py-1 mt-6">
                Jennifer is guided by the belief that “Great nations are built by celebrating excellence, empowering people, and inspiring future generations.” Through DAGN and its initiatives, she continues to build platforms that create opportunities, promote innovation, and contribute to a stronger and more confident Nigeria and Africa.
              </p>
            </div>
          </div>

          {/* Right Image */}
          <div className="w-full md:w-2/5">
            <div className="relative w-full aspect-[3/4] rounded-[2.5rem] overflow-hidden border-8 border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <img src="/founder.jpeg" alt="Jennifer Chinyelu Obiasor - Founder" className="w-full h-full object-cover" />
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
