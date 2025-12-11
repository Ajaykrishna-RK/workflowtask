import type { ReactNode } from "react";
import { FaTimes } from "react-icons/fa";
import Button from "./Button";

interface ModalProps {
  open: boolean;
  title?: string;
  message?: string;             // message optional now
  children?: ReactNode;         // NEW: allows custom content like error lists
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;       // optional
  onCancel: () => void;
}

export default function Modal({
  open,
  title,
  message,
  children,
  confirmLabel,
  cancelLabel,
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
            <Button
              onClick={onCancel}
             
            >
              <FaTimes size={18} />
            </Button>
          </div>
        )}

        {/* Default message OR custom content */}
        {children ? children : message && (
          <p className="text-gray-400 mb-6">{message}</p>
        )}

        {/* Buttons: optional confirm button */}
        <div className="flex gap-3">
          {confirmLabel && onConfirm && (
            <Button
              onClick={onConfirm}
              // className="flex-1 bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition-colors"
            >
              {confirmLabel}
            </Button>
          )}

          {cancelLabel && (
            <Button
              onClick={onCancel}
              // className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded transition-colors"
            >
              {cancelLabel}
            </Button>
          )}

          {/* If only OK button is needed */}
          {!confirmLabel && !cancelLabel && (
            <Button
              onClick={onCancel}
              className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
            >
              OK
            </Button>
          )}
        </div>

      </div>
    </div>
  );
}
