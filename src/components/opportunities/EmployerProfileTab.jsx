import { useState } from "react";
import api from "../../services/api";
import { useToast } from "../../context/ToastContext";

export default function EmployerProfileTab({ profile, employerToken, onProfileUpdate }) {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    company_name: profile?.company_name || "",
    full_name: profile?.full_name || "",
    bio: profile?.bio || "",
    location: profile?.location || "",
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const picData = new FormData();
    picData.append('file', file);
    
    try {
      showToast("Uploading profile picture...", "info");
      await api.post("/api/employer/profile-picture", picData, {
        headers: { 
          'Authorization': `Bearer ${employerToken}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      showToast("Profile picture updated successfully!");
      onProfileUpdate(); // trigger refresh
    } catch (err) {
      console.error(err);
      showToast("Failed to upload picture.", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.patch("/api/employer/profile", formData, {
        headers: { 'Authorization': `Bearer ${employerToken}` }
      });
      showToast("Profile updated successfully!");
      onProfileUpdate();
    } catch (err) {
      console.error(err);
      showToast("Failed to update profile.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="bg-[#2c2c2e] rounded-xl border border-white/5 p-6 mb-6">
        <h2 className="text-lg font-medium text-white mb-6">Company Profile</h2>
        
        <div className="flex items-center gap-6 mb-8">
          <div className="relative group w-24 h-24 rounded-full overflow-hidden bg-[#1c1c1e] border-2 border-[#008751] shrink-0">
            {profile?.profile_picture_url ? (
              <img src={profile.profile_picture_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-[#008751]">
                {(profile?.company_name || "C").charAt(0).toUpperCase()}
              </div>
            )}
            <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <span className="text-xs font-medium">Upload</span>
              <input type="file" accept="image/*" className="hidden" onChange={handlePictureUpload} />
            </label>
          </div>
          <div>
            <h3 className="text-xl font-bold">{profile?.company_name || "Company Name"}</h3>
            <p className="text-gray-400 text-sm">{profile?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Company Name</label>
              <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} className="w-full bg-[#1c1c1e] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#008751]/50 focus:ring-1 focus:ring-[#008751]/50" placeholder="Your Company Name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Full Name (Contact)</label>
              <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} className="w-full bg-[#1c1c1e] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#008751]/50 focus:ring-1 focus:ring-[#008751]/50" placeholder="Contact Person" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Location</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full bg-[#1c1c1e] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#008751]/50 focus:ring-1 focus:ring-[#008751]/50" placeholder="e.g. Lagos, Nigeria" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Company Bio</label>
            <textarea name="bio" rows="4" value={formData.bio} onChange={handleChange} className="w-full bg-[#1c1c1e] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#008751]/50 focus:ring-1 focus:ring-[#008751]/50 resize-y" placeholder="Tell candidates about your company..."></textarea>
          </div>

          <div className="pt-4 flex justify-end">
            <button type="submit" disabled={isSubmitting} className="bg-[#008751] hover:bg-emerald-600 text-white font-medium py-2.5 px-6 rounded-lg transition-colors disabled:opacity-50">
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
