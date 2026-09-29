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
            <p className="text-[#008751] font-bold text-lg leading-relaxed max-w-md italic">
              "We provide the ultimate platform combining young professionals seamlessly with successful visionary leaders."
            </p>
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

      {/* ── THE TEAM SECTION ──────────────────────────────────────────────────── */}
      <section className="relative max-w-7xl mx-auto px-6 mb-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-medium uppercase tracking-widest inline-flex items-end justify-center">
            THE<br/>TEAM <div className="w-4 h-4 bg-[#008751] ml-2 mb-2 rounded-sm"></div>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          
          {/* Team Member 1 */}
          <div className="group cursor-pointer">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden mb-6 bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center">
              <span className="text-white/20 font-bold uppercase tracking-widest text-sm">Image Pending</span>
            </div>
            <h3 className="text-xl font-bold text-white/50 mb-2 tracking-wide">Pending Details</h3>
            <p className="text-[#008751]/50 text-xs font-bold uppercase tracking-widest mb-4">Role TBA</p>
          </div>

          {/* Team Member 2 */}
          <a href="https://www.linkedin.com/in/ekanakpan" target="_blank" rel="noopener noreferrer" className="group block cursor-pointer">
            <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden mb-6 bg-white/5">
              <img src="/na.png" alt="Ekan Akpan" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              {/* LinkedIn Hover Overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                <div className="p-4 bg-[#F5F5F0] rounded-full text-black border border-black/10 transition-transform shadow-[0_10px_25px_rgba(0,0,0,0.3)] group-hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 tracking-wide group-hover:text-[#008751] transition-colors">Ekan Akpan</h3>
            <p className="text-[#008751] text-xs font-bold uppercase tracking-widest mb-4">Frontend Engineer</p>
            <p className="text-white/40 text-sm leading-relaxed">
              "Ekan is a software developer and frontend engineer specializing in building fast, intuitive web and mobile apps with React, Next.js, and TypeScript. Backed by solid API integration skills and a passion for clean architecture, he focuses on turning complex ideas into scalable, real-world digital products."
            </p>
          </a>
          
          {/* Team Member 3 */}
          <a href="https://www.linkedin.com/in/adegbite-david" target="_blank" rel="noopener noreferrer" className="group block cursor-pointer md:hidden lg:block">
            <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden mb-6 bg-white/5">
              <img src="/kb.jpeg" alt="David Adegbite" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              {/* LinkedIn Hover Overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                <div className="p-4 bg-[#F5F5F0] rounded-full text-black border border-black/10 transition-transform shadow-[0_10px_25px_rgba(0,0,0,0.3)] group-hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 tracking-wide group-hover:text-[#008751] transition-colors">David Adegbite</h3>
            <p className="text-[#008751] text-xs font-bold uppercase tracking-widest mb-4">Backend Developer</p>
            <p className="text-white/40 text-sm leading-relaxed">
              "David is a backend developer specializing in architecting fast, reliable server-side systems with FastAPI and modern databases. He focuses on designing secure REST APIs, optimizing data workflows, and engineering robust backends that scale seamlessly."
            </p>
          </a>

        </div>
      </section>

    </div>
  );
}
