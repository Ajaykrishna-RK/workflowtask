import { useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa';
import type { WorkflowValidationError } from '../types/workflow';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning';
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: FaCheckCircle,
    error: FaExclamationCircle,
    warning: FaExclamationCircle,
  };

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
  };

  const Icon = icons[type];
  const colorClass = colors[type];

  return (
    <div className={`${colorClass} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] max-w-md animate-slide-in`}>
      <Icon className="text-xl flex-shrink-0" />
      <p className="flex-1">{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 hover:opacity-80 transition-opacity"
      >
        <FaTimes />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  errors: WorkflowValidationError[];
  onClose: (index: number) => void;
}

export function ToastContainer({ errors, onClose }: ToastContainerProps) {
  if (errors.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {errors.map((error, index) => (
        <Toast
          key={index}
          message={error.message}
          type={error.type === 'error' ? 'error' : 'warning'}
          onClose={() => onClose(index)}
        />
      ))}
    </div>
  );
}

