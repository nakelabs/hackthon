import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const showConfirm = useCallback((message, onConfirm) => {
    setConfirmDialog({ message, onConfirm });
  }, []);

  const closeConfirm = () => setConfirmDialog(null);

  return (
    <ToastContext.Provider value={{ showToast, showConfirm }}>
      {children}

      {/* Global Toasts */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.3)] transform transition-all duration-300 animate-slide-up backdrop-blur-xl ${t.type === 'error' ? 'bg-[#1c1c1e]/90 border border-red-500/30 text-red-400' : 'bg-[#1c1c1e]/90 border border-[#008751]/30 text-emerald-400'}`}>
            {t.type === 'error' ? (
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            ) : (
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            )}
            <p className="text-sm font-semibold tracking-wide">{t.message}</p>
          </div>
        ))}
      </div>

      {/* Global Confirm Modal */}
      {confirmDialog && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity" onClick={closeConfirm}></div>
          <div className="relative bg-[#1c1c1e] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-5 border border-red-500/20">
              <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Confirm Action</h3>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">{confirmDialog.message}</p>
            <div className="flex gap-3">
              <button onClick={closeConfirm} className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors border border-white/5">Cancel</button>
              <button onClick={() => { confirmDialog.onConfirm(); closeConfirm(); }} className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-2.5 rounded-xl text-sm font-semibold transition-colors border border-red-500/20">Yes, delete</button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
