"use client";

import { useEffect, useMemo, useRef, useState, KeyboardEvent } from "react";
import { useLocale, useTranslations } from "next-intl";

type EnvConfig = {
  target: number;
  weeks: number;
  daysPerWeek: number;
  hoursPerDay: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onResult?: (status: "ok" | "err") => void;
  share: number;
  clientHours: number;
  clientCost: number;
  contactEmail: string;
  env: EnvConfig;
};

export default function LeadModal({
  open,
  onClose,
  onResult,
  share,
  clientHours,
  clientCost,
  contactEmail,
  env,
}: Props) {
  const t = useTranslations("homePage");
  const locale = useLocale();
  const cur = useMemo(
    () =>
      new Intl.NumberFormat(locale === "it" ? "it-IT" : "en-US", {
        style: "currency",
        currency: "EUR",
      }),
    [locale]
  );

  // form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  // show errors only after user interaction
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    message: false,
  });
  const [showErrors, setShowErrors] = useState(false);

  // refs / a11y
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // validations
  const nameOk = name.trim().length >= 2;
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const messageOk = message.trim().length > 0;

  const invalidName = (showErrors || touched.name) && !nameOk;
  const invalidEmail = (showErrors || touched.email) && !emailOk;
  const invalidMessage = (showErrors || touched.message) && !messageOk;

  const canSubmit = nameOk && emailOk && messageOk && !sending;

  // open -> focus + ESC
  useEffect(() => {
    if (!open) return;
    const tmo = setTimeout(() => firstFieldRef.current?.focus(), 10);
    const onEsc = (e: KeyboardEvent | any) => {
      if ((e as KeyboardEvent).key === "Escape") onClose();
    };
    document.addEventListener("keydown", onEsc as any);
    return () => {
      clearTimeout(tmo);
      document.removeEventListener("keydown", onEsc as any);
    };
  }, [open, onClose]);

  // simple focus trap
  useEffect(() => {
    if (!open) return;
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusables = cardRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    cardRef.current?.addEventListener("keydown", trap as any);
    return () => cardRef.current?.removeEventListener("keydown", trap as any);
  }, [open]);

  // click outside
  const onOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  async function submit() {
    // if invalid, reveal errors and focus the first invalid control
    if (!canSubmit) {
      setShowErrors(true);
      if (!nameOk) {
        firstFieldRef.current?.focus();
        return;
      }
      if (!emailOk) {
        document.getElementById("email")?.focus();
        return;
      }
      if (!messageOk) {
        document.getElementById("message")?.focus();
        return;
      }
      return;
    }

    try {
      setSending(true);
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          message,
          share,
          clientHours,
          clientCost,
          target: env.target,
          weeks: env.weeks,
          daysPerWeek: env.daysPerWeek,
          hoursPerDay: env.hoursPerDay,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      // reset
      setName("");
      setEmail("");
      setCompany("");
      setMessage("");
      setTouched({ name: false, email: false, message: false });
      setShowErrors(false);
      // close + toast success
      onClose();
      onResult?.("ok");
    } catch (err) {
      console.error(err);
      onClose();
      onResult?.("err");
      closeBtnRef.current?.focus();
    } finally {
      setSending(false);
    }
  }

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className='leadOverlay'
      role='dialog'
      aria-modal='true'
      aria-labelledby='leadTitle'
      onClick={onOverlayClick}
    >
      <div ref={cardRef} className='leadCard' role='document'>
        <header className='leadHead'>
          <div className='leadTitleWrap'>
            <h3 id='leadTitle' className='leadTitle'>
              {t("modal.title", { share })}
            </h3>
          </div>
          <button
            ref={closeBtnRef}
            className='leadClose'
            onClick={onClose}
            aria-label={t("modal.closeLabel")}
            type='button'
          >
            ×
          </button>
        </header>

        <p className='leadHint'>
          {t.rich("modal.hoursIncluded", {
            clientHours,
            clientCost: cur.format(clientCost),
            strong: (chunks) => <strong>{chunks}</strong>,
          })}
        </p>

        <form
          className='leadForm'
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          noValidate
        >
          <div className='field'>
            <label htmlFor='name'>{t("modal.nameLabel")}</label>
            <div className={`control ${invalidName ? "invalid" : ""}`}>
              <input
                id='name'
                ref={firstFieldRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setTouched((s) => ({ ...s, name: true }))}
                placeholder={t("modal.namePlaceholder")}
                required
                aria-invalid={invalidName}
              />
            </div>
          </div>

          <div className='field'>
            <label htmlFor='email'>{t("modal.emailLabel")}</label>
            <div className={`control ${invalidEmail ? "invalid" : ""}`}>
              <input
                id='email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((s) => ({ ...s, email: true }))}
                placeholder={t("modal.emailPlaceholder")}
                required
                aria-invalid={invalidEmail}
                aria-describedby={invalidEmail ? "email-err" : undefined}
              />
            </div>
            {invalidEmail && (
              <div id='email-err' className='error'>
                {t("modal.emailInvalid")}
              </div>
            )}
          </div>

          <div className='field'>
            <label htmlFor='company'>{t("modal.companyLabel")}</label>
            <div className='control'>
              <input
                id='company'
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder={t("modal.companyPlaceholder")}
              />
            </div>
          </div>

          <div className='field wide'>
            <label htmlFor='message'>{t("modal.messageLabel")}</label>
            <div className={`control ${invalidMessage ? "invalid" : ""}`}>
              <textarea
                id='message'
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onBlur={() => setTouched((s) => ({ ...s, message: true }))}
                placeholder={t("modal.messagePlaceholder")}
                required
                aria-invalid={invalidMessage}
                aria-describedby={invalidMessage ? "message-err" : undefined}
              />
            </div>
            {invalidMessage && (
              <div id='message-err' className='error'>
                {t("modal.messageRequired")}
              </div>
            )}
          </div>

          <div className='actions'>
            <button
              className='btn'
              type='submit'
              disabled={!canSubmit || sending}
            >
              {sending ? t("modal.submittingButton") : t("modal.submitButton")}
            </button>
          </div>
        </form>
      </div>

      {/* styles */}
      <style jsx>{`
        .leadOverlay {
          position: fixed;
          inset: 0;
          z-index: 60;
          background: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(4px);
          display: grid;
          place-items: center;
          padding: 16px;
          animation: fadeIn 0.25s ease;
        }
        .leadCard {
          width: min(820px, 100%);
          background: linear-gradient(180deg, var(--panel), #0f1117);
          border: 1px solid #1a1d27;
          border-radius: 16px;
          padding: 16px;
          max-height: 90vh;
          overflow: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
          animation: popIn 0.28s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .leadHead {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 6px;
          border-bottom: 1px solid #171a24;
          padding-bottom: 8px;
        }
        .leadTitle {
          margin: 0;
          font-size: clamp(18px, 2vw, 22px);
          font-weight: 800;
        }
        .leadHint {
          color: var(--muted);
          margin: 8px 0 12px;
        }

        .leadForm {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px 12px;
        }

        /* Reserve a small gutter for absolute error text and keep columns aligned */
        .field {
          display: grid;
          gap: 6px;
          position: relative;
          padding-bottom: 18px;
        }
        .field.wide {
          grid-column: 1 / -1;
        }

        .field label {
          font-weight: 600;
          font-size: 13px;
          color: var(--text);
        }

        .control {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #0b0e14;
          border: 1px solid #1a1d27;
          border-radius: 10px;
          padding: 10px 12px;
          transition: box-shadow 0.15s ease, border-color 0.15s ease;
        }
        .control:focus-within {
          box-shadow: 0 0 0 6px var(--ring);
          border-color: #163a2e;
        }
        .control.invalid {
          border-color: #5a1f28;
          box-shadow: 0 0 0 6px rgba(255, 120, 120, 0.12);
        }

        input,
        textarea {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text);
          font: inherit;
          resize: vertical;
        }

        /* Error message pinned inside the field (no layout shift) */
        .error {
          position: absolute;
          left: 12px;
          bottom: 2px;
          font-size: 12px;
          line-height: 1.1;
          color: #ff9b9b;
          pointer-events: none;
        }

        .actions {
          display: flex;
          gap: 10px;
          align-items: center;
          margin-top: 6px;
        }

        @media (max-width: 640px) {
          .leadCard {
            border-radius: 12px;
            padding: 14px;
          }
          .leadForm {
            grid-template-columns: 1fr;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes popIn {
          from {
            transform: translateY(6px) scale(0.98);
            opacity: 0;
          }
          to {
            transform: none;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
