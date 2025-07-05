"use client";
import { createContext, useContext, useState, useCallback } from "react";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaTimes,
  FaTimesCircle,
} from "@/components/icons/Icons";

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 4000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type, duration };

    setToasts((prev) => [...prev, newToast]);

    // Auto remove toast after duration
    setTimeout(() => {
      removeToast(id);
    }, duration);

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback(
    (message, duration) => {
      return addToast(message, "success", duration);
    },
    [addToast]
  );

  const error = useCallback(
    (message, duration) => {
      return addToast(message, "error", duration);
    },
    [addToast]
  );

  const warning = useCallback(
    (message, duration) => {
      return addToast(message, "warning", duration);
    },
    [addToast]
  );

  const info = useCallback(
    (message, duration) => {
      return addToast(message, "info", duration);
    },
    [addToast]
  );

  return (
    <ToastContext.Provider
      value={{ success, error, warning, info, removeToast }}
    >
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  const getToastStyles = (type) => {
    const baseStyles =
      "flex items-center gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-sm transition-all duration-300 transform";

    switch (type) {
      case "success":
        return `${baseStyles} bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200`;
      case "error":
        return `${baseStyles} bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200`;
      case "warning":
        return `${baseStyles} bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200`;
      case "info":
        return `${baseStyles} bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200`;
      default:
        return `${baseStyles} bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200`;
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return (
          <FaCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
        );
      case "error":
        return (
          <FaTimesCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
        );
      case "warning":
        return (
          <FaExclamationCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
        );
      case "info":
        return (
          <FaInfoCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
        );
      default:
        return (
          <FaInfoCircle className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
        );
    }
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 space-y-3 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${getToastStyles(
            toast.type
          )} animate-in slide-in-from-top duration-300`}
        >
          {getIcon(toast.type)}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium leading-relaxed">
              {toast.message}
            </p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastProvider;
