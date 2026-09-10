'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';
import { FaCheck, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';


const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Notification Floating Container */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none font-sans">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto p-4 rounded-2xl border shadow-2xl flex items-center justify-between gap-3 text-xs font-semibold backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-300 ${
              t.type === 'success'
                ? 'bg-emerald-950/90 border-[#00ff62]/40 text-[#00ff62]'
                : t.type === 'error'
                ? 'bg-red-950/90 border-red-500/40 text-red-300'
                : 'bg-indigo-950/90 border-indigo-400/40 text-indigo-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base">
                {t.type === 'success' ? <FaCheck className="text-sm" /> : t.type === 'error' ? <FaExclamationTriangle className="text-sm" /> : <FaInfoCircle className="text-sm" />}
              </span>
              <span>{t.message}</span>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-white/40 hover:text-white font-bold cursor-pointer ml-2"
            >
              <FaTimes className="text-[10px]" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Fallback if context not mounted yet
    return {
      success: (m) => console.log('Toast:', m),
      error: (m) => console.log('Toast Error:', m),
      info: (m) => console.log('Toast Info:', m),
    };
  }
  return context;
}
