import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import InternshipCard from "../../components/opportunities/InternshipCard";

export default function InternshipsFeed() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState(""); // "", "job", "internship", "grant"
  const [roleFilter, setRoleFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [stipendFilter, setStipendFilter] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        // Real API call to GET endpoints
        const params = new URLSearchParams();
        if (searchTerm) params.append("search", searchTerm);
        if (roleFilter) params.append("category", roleFilter);
        if (locationFilter === "remote") params.append("remote_only", "true");
        
        const qs = params.toString();
        const endpoints = [];
        if (!typeFilter || typeFilter === "job") endpoints.push(`/api/jobs?${qs}`);
        if (!typeFilter || typeFilter === "internship") endpoints.push(`/api/internships?${qs}`);
        if (!typeFilter || typeFilter === "grant") endpoints.push(`/api/grants?${qs}`);

        const responses = await Promise.all(endpoints.map(ep => api.get(ep)));
        const dataArrays = responses.map(res => res.data);
        
        // Map the type into the data for the UI to use
        let combined = [];
        dataArrays.forEach((arr, index) => {
           let type = 'job';
           if (endpoints[index].includes('/internships')) type = 'internship';
           if (endpoints[index].includes('/grants')) type = 'grant';
           
           const typedArr = arr.map(item => ({ ...item, type }));
           combined = [...combined, ...typedArr];
        });

        // Sort by created_at descending (newest first)
        combined.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setJobs(combined);
      } catch (error) {
        console.error("Error fetching opportunities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [searchTerm, typeFilter, roleFilter, locationFilter, stipendFilter]);

  return (
    <div className="container-main py-24 min-h-screen">
      
      {/* Header Area */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-16 animate-fade-in">
        <div className="max-w-2xl">
          <p className="text-[#008751] text-xs font-bold uppercase tracking-[0.2em] mb-4">Discover Your Future</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight leading-[1.1]">
            Internships & <br className="hidden md:block"/>
            <span className="text-white/40">Opportunities</span>
          </h1>
          <p className="text-white/60 text-lg leading-relaxed">
            Browse curated internships, grants, and youth opportunities. Your next big break is just one click away.
          </p>
        </div>
        
        {/* Employer CTA */}
        <div className="shrink-0 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="bg-gradient-to-br from-[#0a0a0a] to-[#050505] border border-white/5 p-6 rounded-[2rem] flex flex-col items-start shadow-xl shadow-black">
            <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-2">For Employers</span>
            <p className="text-white/90 font-medium text-sm mb-4">Looking to hire top talent?</p>
            <Link 
              to="/employer/dashboard" 
              className="w-full bg-white text-black hover:bg-[#008751] hover:text-white font-bold py-3 px-6 rounded-full transition-all duration-300 text-sm text-center shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(0,135,81,0.3)]"
            >
              Post an Opportunity →
            </Link>
          </div>
        </div>
      </div>

      {/* Modern Search & Filters Bar */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-2 mb-12 flex flex-col xl:flex-row shadow-[0_8px_30px_rgb(0,0,0,0.5)] relative z-20 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        
        {/* Search Input */}
        <div className="flex-1 relative flex items-center">
          <div className="absolute left-6 text-white/30 pointer-events-none">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            type="text" 
            placeholder="Search roles, companies, or keywords..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border-none pl-14 pr-6 py-4 text-white text-base focus:outline-none placeholder:text-white/30 font-medium"
          />
        </div>

        {/* Divider (hidden on mobile) */}
        <div className="hidden xl:block w-px bg-white/10 my-3 mx-2"></div>

        {/* Filters */}
        <div className="flex overflow-x-auto xl:overflow-visible gap-2 p-2 xl:p-0">
          {[
            { value: typeFilter, setter: setTypeFilter, defaultLabel: "All Types", options: [
                {val: "job", label: "Jobs"}, {val: "internship", label: "Internships"}, {val: "grant", label: "Grants"}
              ] 
            },
            { value: roleFilter, setter: setRoleFilter, defaultLabel: "All Roles", options: [
                {val: "engineering", label: "Engineering"}, {val: "design", label: "Design"}, {val: "marketing", label: "Marketing"}
              ] 
            },
            { value: locationFilter, setter: setLocationFilter, defaultLabel: "All Locations", options: [
                {val: "remote", label: "Remote"}, {val: "lagos", label: "Lagos"}, {val: "abuja", label: "Abuja"}
              ] 
            },
            { value: stipendFilter, setter: setStipendFilter, defaultLabel: "Any Stipend", options: [
                {val: "paid", label: "Paid Only"}, {val: "unpaid", label: "Unpaid"}
              ] 
            }
          ].map((filter, i) => (
            <div key={i} className="relative shrink-0">
              <select 
                value={filter.value} 
                onChange={(e) => filter.setter(e.target.value)}
                className="appearance-none bg-[#111] xl:bg-transparent border border-white/5 xl:border-none rounded-full xl:rounded-xl px-5 py-3 xl:py-4 pr-10 text-white/70 hover:text-white text-sm font-medium focus:outline-none cursor-pointer transition-colors"
              >
                <option className="bg-[#111] text-white" value="">{filter.defaultLabel}</option>
                {filter.options.map(opt => (
                  <option key={opt.val} className="bg-[#111] text-white" value={opt.val}>{opt.label}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#008751] border-t-transparent"></div>
        </div>
      ) : jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          {jobs.map((job) => (
            <InternshipCard key={`${job.type}-${job.id}`} job={job} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 bg-[#050505] border border-white/5 rounded-[2.5rem] animate-fade-in">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-black text-white mb-2">No opportunities found</h3>
          <p className="text-white/40">Try adjusting your filters or search terms.</p>
        </div>
      )}
    </div>
  );
}
