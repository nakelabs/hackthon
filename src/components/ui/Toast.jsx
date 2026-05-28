import { useEffect, useState } from "react";

export default function Toast({ message, type = "info", duration = 4000, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); setTimeout(onClose, 300); }, duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);

  const icon = type === "success" ? "✓" : type === "error" ? "✕" : "ℹ";

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 border border-white/10 bg-black text-white text-sm shadow-lg transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <span className="text-white/60 font-mono">{icon}</span>
      <span className="text-white/80">{message}</span>
      <button onClick={onClose} className="ml-3 text-white/30 hover:text-white transition-colors">✕</button>
    </div>
  );
}
