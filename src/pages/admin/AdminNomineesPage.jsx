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
      <div className="mb-10">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Compendium Nominees</h1>
        <p className="text-base text-gray-500 mt-2">Manage your compendium entries and their featured status.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 mb-12 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gray-100 text-black rounded-xl flex items-center justify-center shrink-0">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Add Nominee</h2>
            <p className="text-sm text-gray-500">Create a new entry for the compendium.</p>
          </div>
        </div>
        
        <form onSubmit={handleNominate} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Name</label>
            <input type="text" value={nomineeForm.name} onChange={e => setNomineeForm({...nomineeForm, name: e.target.value})}
              placeholder="e.g. Chinua Achebe"
              className="w-full bg-gray-50 border-transparent rounded-xl px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black transition-all" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Short Bio (10–500 chars)</label>
            <textarea value={nomineeForm.bio} onChange={e => setNomineeForm({...nomineeForm, bio: e.target.value})}
              rows={3} placeholder="Brief description of their impact on Nigeria and the world…"
              className="w-full bg-gray-50 border-transparent rounded-xl px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black transition-all resize-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Photo</label>
            <input type="file" accept="image/*" onChange={e => setNomineeForm({...nomineeForm, photo: e.target.files[0]})}
              className="w-full bg-gray-50 border-transparent rounded-xl px-4 py-3 text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-white file:border file:border-gray-200 file:text-black hover:file:bg-gray-100 cursor-pointer transition-all" />
          </div>
          {nomineeError && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{nomineeError}</p>}
          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={nominating}
              className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors disabled:opacity-60">
              <UserPlus className="w-4 h-4" />
              {nominating ? "Adding…" : "Add to Compendium"}
            </button>
            {nomineeSuccess && <span className="text-sm text-green-600 font-medium">✓ Nominee successfully added!</span>}
          </div>
        </form>
      </div>

      <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
        Current Nominees ({nominees.length})
      </h2>
      {nomineesLoading && (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <div className="space-y-3">
        {nominees.map(n => (
          <div key={n.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow group">
            <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 bg-gray-100 border border-gray-200">
              {n.photo_url && <img src={n.photo_url} alt={n.name} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = "none"; }} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-base font-bold text-gray-900 group-hover:text-black transition-colors">{n.name}</p>
                {n.is_featured && <span className="text-[10px] font-bold bg-black text-white px-2 py-0.5 rounded-md uppercase tracking-wider">Featured</span>}
              </div>
              <p className="text-sm text-gray-500 line-clamp-1">{n.bio}</p>
            </div>
            <div className="text-right shrink-0 flex flex-col items-end gap-1">
              <p className="text-lg font-black text-gray-900 leading-none">{(n.vote_count || 0).toLocaleString()}</p>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">votes</p>
              <button
                onClick={async () => {
                  try {
                    const updated = await toggleNomineeFeatured(n.id);
                    setNominees(prev => prev.map(x => x.id === n.id ? updated : x));
                  } catch { alert("Failed to toggle featured."); }
                }}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                  n.is_featured
                    ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
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
