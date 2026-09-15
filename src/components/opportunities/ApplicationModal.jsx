import { useState, useRef } from "react";

export default function ApplicationModal({ job, onClose, onSubmit }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(formRef.current);
    
    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-md p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <h2 className="text-2xl font-bold text-white mb-1">Apply for {job?.title}</h2>
        <p className="text-white/50 text-sm mb-6">{job?.company}</p>

        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Full Name</label>
            <input 
              type="text" 
              name="fullName" 
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-white/30" 
              placeholder="Jane Doe" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Email Address</label>
            <input 
              type="email" 
              name="email" 
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-white/30" 
              placeholder="jane@example.com" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Resume (PDF)</label>
            <input 
              type="file" 
              name="resume" 
              accept=".pdf"
              required
              className="w-full text-sm text-white/50 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 transition-colors cursor-pointer" 
            />
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 bg-white text-black font-bold py-3 px-4 rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}
