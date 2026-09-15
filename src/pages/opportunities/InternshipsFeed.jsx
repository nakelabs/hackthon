import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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

        const responses = await Promise.all(endpoints.map(ep => fetch(ep)));
        
        // Throw if any fail
        for (const res of responses) {
          if (!res.ok) throw new Error(`Failed to fetch from ${res.url}`);
        }

        const dataArrays = await Promise.all(responses.map(res => res.json()));
        
        // Map the type into the data for the UI to use
        let combined = [];
        dataArrays.forEach((arr, index) => {
           let type = 'job';
           if (endpoints[index].includes('/api/internships')) type = 'internship';
           if (endpoints[index].includes('/api/grants')) type = 'grant';
           
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
      <div className="mb-12 flex flex-col md:flex-row md:justify-between md:items-end gap-6 text-center md:text-left">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Internships & Opportunities</h1>
          <p className="text-white/60 text-lg max-w-2xl">
            Discover your next big break. Browse curated internships, grants, and youth opportunities.
          </p>
        </div>
        <div className="flex flex-col items-center md:items-end border border-white/10 bg-white/5 p-4 rounded-xl">
          <p className="text-white/60 text-sm mb-2 font-medium">Are you an employer or company?</p>
          <Link 
            to="/employer/dashboard" 
            className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-2 px-5 rounded-lg transition-colors text-sm whitespace-nowrap shadow-lg shadow-emerald-500/20"
          >
            Post an Opportunity &rarr;
          </Link>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <input 
            type="text" 
            placeholder="Search roles, companies, or keywords..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-white/30"
          />
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 md:pb-0">
          <select 
            value={typeFilter} 
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-white/30 min-w-[140px]"
          >
            <option className="bg-[#1a1a1a] text-white" value="">All Types</option>
            <option className="bg-[#1a1a1a] text-white" value="job">Jobs</option>
            <option className="bg-[#1a1a1a] text-white" value="internship">Internships</option>
            <option className="bg-[#1a1a1a] text-white" value="grant">Grants</option>
          </select>
          <select 
            value={roleFilter} 
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-white/30 min-w-[140px]"
          >
            <option className="bg-[#1a1a1a] text-white" value="">All Roles</option>
            <option className="bg-[#1a1a1a] text-white" value="engineering">Engineering</option>
            <option className="bg-[#1a1a1a] text-white" value="design">Design</option>
            <option className="bg-[#1a1a1a] text-white" value="marketing">Marketing</option>
          </select>
          <select 
            value={locationFilter} 
            onChange={(e) => setLocationFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-white/30 min-w-[140px]"
          >
            <option className="bg-[#1a1a1a] text-white" value="">All Locations</option>
            <option className="bg-[#1a1a1a] text-white" value="remote">Remote</option>
            <option className="bg-[#1a1a1a] text-white" value="lagos">Lagos</option>
            <option className="bg-[#1a1a1a] text-white" value="abuja">Abuja</option>
          </select>
          <select 
            value={stipendFilter} 
            onChange={(e) => setStipendFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-white/30 min-w-[140px]"
          >
            <option className="bg-[#1a1a1a] text-white" value="">Any Stipend</option>
            <option className="bg-[#1a1a1a] text-white" value="paid">Paid Only</option>
            <option className="bg-[#1a1a1a] text-white" value="unpaid">Unpaid</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-400"></div>
        </div>
      ) : jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <InternshipCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white/5 border border-white/10 rounded-2xl">
          <svg className="w-16 h-16 mx-auto text-white/20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h3 className="text-xl font-bold text-white mb-2">No opportunities found</h3>
          <p className="text-white/50">Try adjusting your filters or check back later.</p>
        </div>
      )}
    </div>
  );
}
