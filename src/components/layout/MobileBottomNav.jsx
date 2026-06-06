import { Link, useLocation } from "react-router-dom";

export default function MobileBottomNav() {
  const location = useLocation();

  const navItems = [
    {
      name: "Feed",
      path: "/home",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      name: "Quiz",
      path: "/quiz",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      name: "Upload",
      path: "/upload",
      isUpload: true,
      icon: (
        <div className="w-12 h-8 bg-white text-black flex items-center justify-center rounded-md font-bold text-xl hover:bg-[#008751] hover:text-white transition-colors">
          +
        </div>
      )
    },
    {
      name: "Map",
      path: "/map",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      name: "Profile",
      path: "/my-arena",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
  ];

  return (
    <div className="fixed bottom-0 w-full z-50 flex justify-center bg-transparent pointer-events-none">
      <div className="w-full max-w-[450px] md:max-w-full md:px-10 lg:px-20 bg-black border-t border-white/10 px-2 py-3 flex justify-between items-center pointer-events-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path && !item.isUpload;
          
          return (
            <Link 
              key={item.name} 
              to={item.path}
              className={`flex flex-col items-center justify-center w-[20%] transition-colors ${
                isActive ? "text-white" : "text-white/40 hover:text-white"
              }`}
            >
              {item.isUpload ? (
                <div className="mb-1">{item.icon}</div>
              ) : (
                <>
                  <div className={`mb-1 transition-transform ${isActive ? 'scale-110' : ''}`}>
                    {item.icon}
                  </div>
                  <span className={`text-[10px] font-bold tracking-widest uppercase ${isActive ? 'text-white' : ''}`}>
                    {item.name}
                  </span>
                </>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
