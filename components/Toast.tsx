import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => Math.max(0, prev - 1));
    }, 30);

    const closeTimer = setTimeout(onClose, 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(closeTimer);
    };
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="text-green-500" size={20} />,
    error: <AlertCircle className="text-red-500" size={20} />,
    info: <Info className="text-blue-500" size={20} />,
  };

  const colors = {
    success: 'border-green-100 bg-green-50',
    error: 'border-red-100 bg-red-50',
    info: 'border-blue-100 bg-blue-50',
  };

  return (
    <div className={`fixed bottom-6 right-6 z-[100] w-80 p-4 rounded-xl border shadow-lg flex items-start gap-3 animate-slide-in ${colors[type]}`}>
      {icons[type]}
      <div className="flex-1">
        <p className="text-sm font-semibold text-slate-800">{message}</p>
        <div className="mt-2 h-1 w-full bg-slate-200 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-30 ${
              type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
            }`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
        <X size={16} />
      </button>
      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
      `}</style>
    </div>
  );
}