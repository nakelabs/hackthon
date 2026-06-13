import React, { createContext, useState, useContext, useCallback } from 'react';

const PopupContext = createContext();

export function PopupProvider({ children }) {
  const [popup, setPopup] = useState(null);

  const showAlert = useCallback((message) => {
    return new Promise((resolve) => {
      setPopup({
        type: 'alert',
        message,
        onClose: () => {
          setPopup(null);
          resolve();
        }
      });
    });
  }, []);

  const showConfirm = useCallback((message) => {
    return new Promise((resolve) => {
      setPopup({
        type: 'confirm',
        message,
        onConfirm: () => {
          setPopup(null);
          resolve(true);
        },
        onCancel: () => {
          setPopup(null);
          resolve(false);
        }
      });
    });
  }, []);

  const showPrompt = useCallback((message, defaultValue = "") => {
    return new Promise((resolve) => {
      setPopup({
        type: 'prompt',
        message,
        defaultValue,
        onConfirm: (value) => {
          setPopup(null);
          resolve(value);
        },
        onCancel: () => {
          setPopup(null);
          resolve(null);
        }
      });
    });
  }, []);

  return (
    <PopupContext.Provider value={{ showAlert, showConfirm, showPrompt }}>
      {children}
      {popup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
          <div className="bg-[#0a0a0a] border border-white/20 w-full max-w-sm shadow-[0_0_40px_rgba(0,135,81,0.15)] flex flex-col transform transition-transform scale-100">
            <div className="p-6">
              <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{popup.message}</p>
              {popup.type === 'prompt' && (
                <input
                  type="text"
                  autoFocus
                  defaultValue={popup.defaultValue}
                  className="w-full bg-transparent border border-white/20 text-white text-sm px-4 py-3 mt-4 focus:outline-none focus:border-[#008751] transition-colors"
                  id="popup-prompt-input"
                />
              )}
            </div>
            <div className="p-4 border-t border-white/10 shrink-0 bg-[#050505] flex justify-end gap-3">
              {popup.type !== 'alert' && (
                <button
                  onClick={popup.onCancel}
                  className="border border-white/20 text-white/70 px-4 py-2 text-xs uppercase tracking-widest hover:border-white/50 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={() => {
                  if (popup.type === 'prompt') {
                    popup.onConfirm(document.getElementById('popup-prompt-input').value);
                  } else if (popup.type === 'confirm') {
                    popup.onConfirm();
                  } else {
                    popup.onClose();
                  }
                }}
                className="bg-[#008751] text-white px-6 py-2 text-xs font-bold uppercase tracking-widest shadow-[4px_4px_0_rgba(0,135,81,0.5)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0_rgba(0,135,81,0.5)] transition-all"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </PopupContext.Provider>
  );
}

export function usePopup() {
  return useContext(PopupContext);
}
