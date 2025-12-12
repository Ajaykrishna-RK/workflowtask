import type { ReactNode } from "react";
import { FaTimes } from "react-icons/fa";
import Button from "./Button";

interface ModalProps {
  open: boolean;
  title?: string;
  message?: string; 
  children?: ReactNode; 
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void; 
  onCancel: () => void;
}

export default function Modal({
  open,
  title,
  message,
  children,
  confirmLabel,

  onConfirm,
  onCancel,
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 relative">
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">{title}</h3>
            <Button onClick={onCancel}>
              <FaTimes size={18} />
            </Button>
          </div>
        )}

 
        {children
          ? children
          : message && <p className="text-gray-400 mb-6">{message}</p>}

        <div className="justify-end items-end flex">
          {confirmLabel && onConfirm && (
            <Button
              onClick={onConfirm}
           variant="danger"
            >
              {confirmLabel}
            </Button>
          )}

        </div>
      </div>
    </div>
  );
}
