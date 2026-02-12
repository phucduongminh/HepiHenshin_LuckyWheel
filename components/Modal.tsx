import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Content */}
      <div className="relative glass-panel w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border border-white/10 animate-in zoom-in-95 duration-300">
        <div className="relative mb-6 flex items-center justify-center"> {/* Thay đổi ở đây */}
          <h2 className="text-xl font-bold font-heading text-slate-100 text-center w-full">
            {title}
          </h2>
          
          {/* Nút Close để tuyệt đối ở góc phải để không làm lệch title */}
          <button 
            onClick={onClose} 
            className="absolute right-0 text-slate-500 hover:text-white transition p-1"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;