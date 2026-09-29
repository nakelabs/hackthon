import { useState, useEffect } from "react";
import api from "../../services/api";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { Star, Plus, Edit2, Trash2, X } from "lucide-react";

const CATEGORIES = [
  "Nigeria in diaspora",
  "Nigerians in Nigeria",
  "Nigerian companies",
  "The 36 state Governors"
];

export default function AdminAchieversPage() {
  const { adminToken } = useAdminAuth();
  const [achievers, setAchievers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchAchievers();
  }, [adminToken]);

  const fetchAchievers = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get("/api/achievers");
      const arr = Array.isArray(data) ? data : (data?.data || data?.achievers || []);
      setAchievers(arr);
    } catch (err) {
      console.error(err);
      setAchievers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setName("");
    setCategory(CATEGORIES[0]);
    setDescription("");
    setImageFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (achiever) => {
    setEditingId(achiever.id);
    setName(achiever.name);
    setCategory(achiever.category || CATEGORIES[0]);
    setDescription(achiever.description || "");
    setImageFile(null); // Will not update image unless selected
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this achiever?")) return;
    try {
      await api.delete(`/api/achievers/${id}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      fetchAchievers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete achiever.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !category) {
      return alert("Name and Category are required.");
    }

    if (!editingId && !imageFile) {
      return alert("Image is required for new achievers.");
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    if (description) formData.append("description", description);
    if (imageFile) formData.append("image", imageFile);

    try {
      const headers = {
        Authorization: `Bearer ${adminToken}`,
        "Content-Type": "multipart/form-data"
      };

      if (editingId) {
        await api.put(`/api/achievers/${editingId}`, formData, { headers });
      } else {
        await api.post("/api/achievers", formData, { headers });
      }
      setIsModalOpen(false);
      fetchAchievers();
    } catch (err) {
      console.error(err);
      alert("Failed to save achiever. Check console for details.");
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-black mb-2 flex items-center gap-3">
            <Star className="w-8 h-8 text-[#008751]" />
            Achievers CMS
          </h1>
          <p className="text-gray-500 font-medium">Manage achievers displayed on the Heroes page.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-[#008751] hover:bg-[#007043] text-white px-5 py-2.5 rounded-full font-bold transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add Achiever
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#008751]"></div>
        </div>
      ) : achievers.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No achievers found. Click "Add Achiever" to create one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {achievers.map((achiever) => (
            <div key={achiever.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
              {achiever.image_url ? (
                <img src={achiever.image_url} alt={achiever.name} className="w-full h-48 object-cover bg-gray-100" />
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                  <Star className="w-8 h-8" />
                </div>
              )}
              <div className="p-4 flex-1 flex flex-col">
                <span className="text-[10px] font-bold text-[#008751] uppercase tracking-wider mb-1">
                  {achiever.category}
                </span>
                <h3 className="font-bold text-lg text-black leading-tight mb-2">{achiever.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">{achiever.description}</p>
                <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-auto">
                  <button 
                    onClick={() => openEditModal(achiever)}
                    className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(achiever.id)}
                    className="flex items-center gap-1 text-sm font-semibold text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h2 className="text-xl font-bold text-black">{editingId ? "Edit Achiever" : "Add Achiever"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-black transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Name *</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white text-black border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#008751] focus:ring-1 focus:ring-[#008751]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Category *</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white text-black border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#008751] focus:ring-1 focus:ring-[#008751]"
                  required
                >
                  {CATEGORIES.map(c => <option className="text-black" key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-white text-black border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#008751] focus:ring-1 focus:ring-[#008751]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Image {editingId ? "(Leave empty to keep current)" : "*"}
                </label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="w-full bg-white text-black border border-gray-200 rounded-xl px-4 py-2 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#008751]/10 file:text-[#008751] hover:file:bg-[#008751]/20 transition-all cursor-pointer"
                  required={!editingId}
                />
              </div>

              <div className="pt-2 mt-2 border-t border-gray-100 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-[#008751] hover:bg-[#007043] text-white px-6 py-2.5 rounded-xl font-bold transition-colors shadow-lg"
                >
                  {editingId ? "Save Changes" : "Add Achiever"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
