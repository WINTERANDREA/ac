"use client";

import { useEffect } from "react";

type ToastKind = "success" | "error";

type Props = {
  open: boolean;
  kind: ToastKind;
  message: string;
  onClose: () => void;
  duration?: number; // ms, default 10000
};

export default function Toast({
  open,
  kind,
  message,
  onClose,
  duration = 10000,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const id = setTimeout(onClose, duration);
    return () => clearTimeout(id);
  }, [open, duration, onClose]);

  if (!open) return null;

  const isSuccess = kind === "success";

  return (
    <div
      className='toastDock'
      role='status'
      aria-live={isSuccess ? "polite" : "assertive"}
    >
      <div className={`toast ${kind}`}>
        <span className='ico' aria-hidden>
          {isSuccess ? "✅" : "⚠️"}
        </span>
        <div className='txt'>{message}</div>
        <button
          className='close'
          onClick={onClose}
          aria-label='Close notification'
          type='button'
        >
          ×
        </button>
      </div>

      <style jsx>{`
        .toastDock {
          position: fixed;
          right: max(14px, env(safe-area-inset-right));
          bottom: max(14px, env(safe-area-inset-bottom));
          z-index: 70;
          animation: slideUp 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .toast {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 10px;
          max-width: min(92vw, 520px);
          padding: 12px 14px;
          border-radius: 14px;
          border: 1px solid #1a1d27;
          background: radial-gradient(
              700px 280px at 110% -10%,
              rgba(108, 243, 194, 0.06),
              transparent 55%
            ),
            #0b0e14;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
        }
        .toast.success {
          border-color: #163a2e;
        }
        .toast.error {
          border-color: #3a1620;
          background: radial-gradient(
              700px 280px at 110% -10%,
              rgba(255, 120, 120, 0.07),
              transparent 55%
            ),
            #0b0e14;
        }
        .ico {
          font-size: 18px;
        }
        .txt {
          color: var(--text);
        }
        .close {
          appearance: none;
          background: #0b0e14;
          border: 1px solid #1a1d27;
          color: var(--text);
          border-radius: 10px;
          padding: 4px 10px;
          cursor: pointer;
        }
        @keyframes slideUp {
          from {
            transform: translateY(8px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
