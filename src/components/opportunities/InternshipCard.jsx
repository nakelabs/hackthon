import { Link } from "react-router-dom";

export default function InternshipCard({ job }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors flex flex-col gap-3 h-full">
      <div className="flex justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {job.type && (
              <span className="bg-white/10 text-white/90 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded">
                {job.type}
              </span>
            )}
            <h3 className="text-xl font-bold text-white line-clamp-1">{job.title}</h3>
          </div>
          <p className="text-white/60 text-sm font-medium">
            {job.company_name || job.organization_name || "Unknown"}
            {job.remote_only !== undefined ? ` • ${job.remote_only ? "Remote" : "On-site"}` : ""}
          </p>
        </div>
        {(job.stipend || job.amount) && (
          <div className="text-right">
            <span className="text-emerald-400 font-bold block">{job.stipend || job.amount}</span>
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2 mt-2">
        {job.category && <span className="bg-white/5 text-white/70 text-xs px-2.5 py-1 rounded-md capitalize">{job.category}</span>}
        {job.duration && <span className="bg-white/5 text-white/70 text-xs px-2.5 py-1 rounded-md">{job.duration}</span>}
        {job.remote_only && <span className="bg-white/5 text-white/70 text-xs px-2.5 py-1 rounded-md">Remote</span>}
      </div>

      <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center">
        <span className="text-white/40 text-xs">
          {job.deadline ? `Deadline: ${new Date(job.deadline).toLocaleDateString()}` : "Recently posted"}
        </span>
        <Link 
          to={`/opportunities/${job.type || 'job'}/${job.id}`} 
          className="text-sm font-semibold text-white hover:text-emerald-400 transition-colors"
        >
          View Details &rarr;
        </Link>
      </div>
    </div>
  );
}
