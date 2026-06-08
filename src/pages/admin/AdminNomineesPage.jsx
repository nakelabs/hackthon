import { useState, useEffect } from "react";
import { UserPlus, Star } from "lucide-react";
import { nominateIcon, toggleNomineeFeatured } from "../../services/adminService";
import { getNominees } from "../../services/compendiumService";

const BLANK_NOMINEE  = { name: "", bio: "", photo: null };

export default function AdminNomineesPage() {
  const [nomineeForm, setNomineeForm]   = useState(BLANK_NOMINEE);
  const [nominees, setNominees]         = useState([]);
  const [nomineesLoading, setNomineesLoading] = useState(true);
  const [nomineeError, setNomineeError] = useState("");
  const [nomineeSuccess, setNomineeSuccess] = useState(false);
  const [nominating, setNominating]     = useState(false);

  useEffect(() => {
    getNominees({ limit: 50 })
      .then(data => setNominees(data.nominees || []))
      .catch(() => {})
      .finally(() => setNomineesLoading(false));
  }, []);

  const handleNominate = async (e) => {
    e.preventDefault();
    setNomineeError("");
    if (!nomineeForm.name.trim() || !nomineeForm.bio.trim() || !nomineeForm.photo) {
      setNomineeError("All fields are required."); return;
    }
    setNominating(true);
    try {
      const formData = new FormData();
      formData.append("name", nomineeForm.name);
      formData.append("bio", nomineeForm.bio);
      formData.append("photo", nomineeForm.photo);
      
      const newNominee = await nominateIcon(formData);
      setNominees(prev => [newNominee, ...prev]);
      setNomineeForm(BLANK_NOMINEE);
      setNomineeSuccess(true);
      setTimeout(() => setNomineeSuccess(false), 3000);
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to nominate. Please check your credentials and try again.";
      setNomineeError(Array.isArray(msg) ? msg.map(m => m.msg).join(", ") : msg);
    } finally {
      setNominating(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Compendium Nominees</h1>
        <p className="text-sm text-gray-500 mt-1">Manage compendium nominees and featured status.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-7 h-7 bg-[#008751] rounded-lg flex items-center justify-center">
            <UserPlus className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-base font-bold text-gray-900">Add Compendium Nominee</h2>
        </div>
        <form onSubmit={handleNominate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Name</label>
            <input type="text" value={nomineeForm.name} onChange={e => setNomineeForm({...nomineeForm, name: e.target.value})}
              placeholder="e.g. Chinua Achebe"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#008751]" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Short Bio (10–500 chars)</label>
            <textarea value={nomineeForm.bio} onChange={e => setNomineeForm({...nomineeForm, bio: e.target.value})}
              rows={3} placeholder="Brief description of their impact on Nigeria and the world…"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#008751] resize-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Photo</label>
            <input type="file" accept="image/*" onChange={e => setNomineeForm({...nomineeForm, photo: e.target.files[0]})}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-900 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#008751]/10 file:text-[#008751] hover:file:bg-[#008751]/20 cursor-pointer" />
          </div>
          {nomineeError && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">{nomineeError}</p>}
          <div className="flex items-center gap-3">
            <button type="submit" disabled={nominating}
              className="flex items-center gap-2 bg-[#008751] hover:bg-[#006b40] text-white font-bold text-sm px-5 py-2.5 rounded-lg transition-colors disabled:opacity-60">
              <UserPlus className="w-4 h-4" />
              {nominating ? "Adding…" : "Add to Compendium"}
            </button>
            {nomineeSuccess && <span className="text-sm text-green-600 font-medium">✓ Nominee added!</span>}
          </div>
        </form>
      </div>

      <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-4">
        Current Nominees ({nominees.length})
      </h2>
      {nomineesLoading && (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-[#008751] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <div className="space-y-2">
        {nominees.map(n => (
          <div key={n.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-gray-100">
              {n.photo_url && <img src={n.photo_url} alt={n.name} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = "none"; }} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-gray-900">{n.name}</p>
                {n.is_featured && <span className="text-[10px] font-bold bg-[#008751]/10 text-[#008751] px-1.5 py-0.5 rounded uppercase">Featured</span>}
              </div>
              <p className="text-xs text-gray-500 line-clamp-1">{n.bio}</p>
            </div>
            <div className="text-right shrink-0 flex flex-col items-end gap-1">
              <p className="text-sm font-bold text-gray-700">{(n.vote_count || 0).toLocaleString()}</p>
              <p className="text-xs text-gray-400">votes</p>
              <button
                onClick={async () => {
                  try {
                    const updated = await toggleNomineeFeatured(n.id);
                    setNominees(prev => prev.map(x => x.id === n.id ? updated : x));
                  } catch { alert("Failed to toggle featured."); }
                }}
                className={`text-[10px] font-bold px-2 py-1 rounded mt-1 flex items-center gap-1 transition-colors ${
                  n.is_featured
                    ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Star className="w-3 h-3" />
                {n.is_featured ? "Unfeature" : "Feature"}
              </button>
            </div>
          </div>
        ))}
        {!nomineesLoading && nominees.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-8">No nominees yet. Add the first one above.</p>
        )}
      </div>
    </div>
  );
}
