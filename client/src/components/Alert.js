import React from "react";

const Alert = ({ type, message, onClose }) => {
  if (!message) return null;

  const alertStyles = {
    error: "bg-red-50 border-red-200 text-red-700",
    success: "bg-green-50 border-green-200 text-green-700",
  };

  const dotStyles = {
    error: "bg-red-500",
    success: "bg-green-500",
  };

  return (
    <div
      className={`border px-6 py-4 rounded-xl mb-6 flex items-center gap-3 ${alertStyles[type]}`}
    >
      <div className={`w-2 h-2 rounded-full ${dotStyles[type]}`}></div>
      <span className="flex-1">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="text-current opacity-70 hover:opacity-100 transition-opacity"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default Alert;
