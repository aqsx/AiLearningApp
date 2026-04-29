import React from "react";

const Modal = ({ isModalOpen, onClose, title, children }) => {
  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* BLUR BACKDROP */}
      <div
        className="fixed inset-0 backdrop-blur-lg bg-white/10"
        style={{ backdropFilter: "blur(10px)" }} // 🔥 force blur support
        onClick={onClose}
      />

      {/* MODAL BOX */}
      <div className="relative z-50 w-full max-w-2xl mx-auto p-6 rounded-2xl shadow-2xl bg-white">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl"
          >
            ✕
          </button>
        </div>

        {/* CONTENT */}
        <div className="max-h-[70vh] overflow-y-auto">
          {children}
        </div>

      </div>
    </div>
  );
};

export default Modal;