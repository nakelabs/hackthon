import { useState, useEffect } from "react";
import { adminApi } from "../../services/api";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { useToast } from "../../context/ToastContext";
import { Briefcase, CheckCircle, XCircle } from "lucide-react";

export default function AdminOpportunitiesPage() {
  const { adminToken } = useAdminAuth();
  const { showToast, showConfirm } = useToast();
  const [opportunities, setOpportunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("PENDING");

  useEffect(() => {
    fetchOpportunities(filterStatus);
  }, [adminToken, filterStatus]);

  const fetchOpportunities = async (status) => {
    setIsLoading(true);
    try {
      const endpoints = [
        `/admin/jobs?status=${status}`, 
        `/admin/internships?status=${status}`, 
        `/admin/grants?status=${status}`
      ];
      
      const responses = await Promise.all(endpoints.map(ep => adminApi.get(ep)));
      
      const dataArrays = responses.map((res, i) => {
        const data = res.data;
        let type = 'job';
        if (endpoints[i].includes('internships')) type = 'internship';
        if (endpoints[i].includes('grants')) type = 'grant';
        return data.map(item => ({ ...item, type }));
      });
      
      const combined = dataArrays.flat().sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setOpportunities(combined);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproval = (id, type, status) => {
    const action = status === "CONFIRMED" ? "approve" : "reject";
    showConfirm(`Are you sure you want to ${action} this ${type}?`, async () => {
      try {
        await adminApi.patch(`/admin/${type}s/${id}/${action}`);
        
        // Update local state
        setOpportunities(prev => prev.filter(opp => opp.id !== id));
        showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} has been ${status.toLowerCase()}!`);
      } catch (err) {
        console.error(err);
        showToast(`Failed to ${action} ${type}.`, "error");
      }
    });
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-black mb-2 flex items-center gap-3">
          <Briefcase className="w-8 h-8 text-[#008751]" />
          Opportunity Moderation
        </h1>
        <p className="text-gray-500 font-medium">Approve or reject employer postings (Jobs, Internships, Grants).</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        {["PENDING", "CONFIRMED", "REJECTED"].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
              filterStatus === status 
                ? "bg-black text-white" 
                : "bg-white text-gray-500 hover:bg-gray-100"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#008751]"></div>
        </div>
      ) : opportunities.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No {filterStatus.toLowerCase()} opportunities found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {opportunities.map(opp => (
            <div key={opp.id} className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-[#008751]/10 text-[#008751] px-2 py-1 rounded text-xs font-bold uppercase">
                    {opp.type}
                  </span>
                  <span className="text-gray-400 text-xs font-medium">
                    Posted on {new Date(opp.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-black mb-1">{opp.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2 max-w-2xl">{opp.description}</p>
                {opp.organization_name && <p className="text-gray-500 text-xs mt-2 font-semibold">Org: {opp.organization_name}</p>}
              </div>

              {filterStatus === "PENDING" && (
                <div className="flex gap-3 shrink-0">
                  <button 
                    onClick={() => handleApproval(opp.id, opp.type, "REJECTED")}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-bold text-sm hover:bg-red-100 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                  <button 
                    onClick={() => handleApproval(opp.id, opp.type, "CONFIRMED")}
                    className="flex items-center gap-2 px-4 py-2 bg-[#008751] text-white rounded-lg font-bold text-sm hover:bg-[#007043] transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
