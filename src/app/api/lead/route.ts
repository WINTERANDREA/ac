// app/api/lead/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer, { Transporter } from "nodemailer";

export const runtime = "nodejs";

/* ---------- Tipi ---------- */
type EmailResult =
  | { ok: true; messageId: string; accepted: string[]; rejected: string[] }
  | { ok: false; reason: string };

type WAResult = { ok: true; id?: string } | { ok: false; reason: string };

/* ---------- ENV ---------- */
const {
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM_NAME = "Andrea Casero",
  CONTACT_EMAIL = "andrecasero@gmail.com",
  // WhatsApp disattivato: lascio variabili ma non obbligatorie
  WHATSAPP_TOKEN,
  WHATSAPP_PHONE_ID,
  WHATSAPP_TO,
} = process.env;

/* ---------- Supabase ---------- */
const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { persistSession: false, autoRefreshToken: false },
});

/* ---------- Email (Nodemailer) ---------- */
function getTransport(): Transporter | null {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.warn("[SMTP] Config mancante: skip email");
    return null;
  }
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 465,
    secure: String(SMTP_SECURE ?? "true") === "true",
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

/* ---------- WhatsApp (Cloud API) opzionale ---------- */
async function sendWhatsApp(text: string): Promise<WAResult> {
  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID || !WHATSAPP_TO) {
    return { ok: false, reason: "WA_DISABLED" };
  }
  const url = `https://graph.facebook.com/v20.0/${WHATSAPP_PHONE_ID}/messages`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    } as HeadersInit,
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: WHATSAPP_TO,
      type: "text",
      text: { body: text.slice(0, 1024) },
    }),
  });

  // prova a leggere JSON, altrimenti fallback a testo
  let payload: unknown;
  try {
    payload = await res.json();
  } catch {
    payload = await res.text();
  }

  if (!res.ok) {
    console.error("[WA] Errore invio:", payload);
    return {
      ok: false,
      reason: typeof payload === "string" ? payload : "WA_SEND_FAILED",
    };
  }

  const id =
    typeof payload === "object" &&
    payload !== null &&
    // @ts-ignore (shape minimale, non importiamo SDK)
    Array.isArray((payload as any).messages) &&
    // @ts-ignore
    (payload as any).messages[0]?.id;

  return { ok: true, id };
}

/* ---------- Utils ---------- */
function getClientIp(req: NextRequest): string {
  const h = req.headers;
  const first = (h.get("x-forwarded-for") || "").split(",")[0]?.trim();
  return (
    first ||
    h.get("x-real-ip") ||
    h.get("x-client-ip") ||
    h.get("x-vercel-ip") ||
    "unknown"
  );
}
function escapeHTML(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/* ---------- Handler ---------- */
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const ua = req.headers.get("user-agent") || "unknown";
    const payload = await req.json();

    const required = [
      "share",
      "clientHours",
      "clientCost",
      "target",
      "weeks",
      "daysPerWeek",
      "hoursPerDay",
    ] as const;
    for (const k of required) {
      if (payload?.[k] === undefined || payload?.[k] === null) {
        return NextResponse.json(
          { error: `Missing field: ${k}` },
          { status: 400 }
        );
      }
    }

    const {
      name = "",
      email = "",
      company = "",
      message = "",
      share,
      clientHours,
      clientCost,
      target,
      weeks,
      daysPerWeek,
      hoursPerDay,
    } = payload as {
      name?: string;
      email?: string;
      company?: string;
      message?: string;
      share: number;
      clientHours: number;
      clientCost: number;
      target: number;
      weeks: number;
      daysPerWeek: number;
      hoursPerDay: number;
    };

    // ---- DB ----
    const { error: dbErr } = await supabase.from("leads_2026").insert({
      name,
      email,
      company,
      message,
      share_percent: share,
      client_hours: Math.round(clientHours),
      client_cost: Number(clientCost),
      target: Number(target),
      weeks,
      days_per_week: daysPerWeek,
      hours_per_day: hoursPerDay,
      user_agent: ua,
      ip,
    });
    if (dbErr) {
      console.error("[DB] insert error:", dbErr);
      return NextResponse.json({ error: "DB_INSERT_FAILED" }, { status: 500 });
    }

    // ---- Email ----
    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto">
        <h2>Richiesta quota ${share}% — 2026</h2>
        <p><strong>Nome:</strong> ${escapeHTML(name)}<br/>
           <strong>Email:</strong> ${escapeHTML(email)}<br/>
           <strong>Azienda:</strong> ${escapeHTML(company)}</p>
        <p><strong>Messaggio:</strong><br/>${escapeHTML(message).replace(
          /\n/g,
          "<br/>"
        )}</p>
        <hr/>
        <p><strong>Ore stimate incluse:</strong> ${clientHours} h<br/>
           <strong>Investimento stimato:</strong> € ${Number(
             clientCost
           ).toLocaleString("it-IT")}<br/>
           <strong>Obiettivo annuo:</strong> € ${Number(target).toLocaleString(
             "it-IT"
           )}</p>
        <p><strong>Assunzioni</strong>: ${weeks} sett × ${daysPerWeek} gg × ${hoursPerDay} h</p>
        <hr/>
        <p style="color:#666">UA: ${escapeHTML(ua)}<br/>IP: ${escapeHTML(
      ip
    )}</p>
      </div>`;

    let emailResult: EmailResult = { ok: false, reason: "SMTP_DISABLED" };
    const transporter = getTransport();
    if (transporter) {
      try {
        const info = await transporter.sendMail({
          from: `${SMTP_FROM_NAME} <${SMTP_USER}>`,
          to: CONTACT_EMAIL!,
          subject: `Nuova richiesta quota ${share}% — 2026`,
          html,
          text: `Lead ${share}% 2026\nNome: ${name}\nEmail: ${email}\nOre: ${clientHours}\nCosto: € ${Number(
            clientCost
          ).toLocaleString("it-IT")}\n\nMessaggio:\n${message}`,
          replyTo: email || undefined,
          headers: {
            "X-Lead-Share": String(share),
            "X-Lead-ClientHours": String(clientHours),
          },
        });
        emailResult = {
          ok: true,
          messageId: info.messageId,
          accepted: Array.isArray(info.accepted)
            ? info.accepted.map(String)
            : [],
          rejected: Array.isArray(info.rejected)
            ? info.rejected.map(String)
            : [],
        };
      } catch (err) {
        const reason = err instanceof Error ? err.message : String(err);
        console.error("[SMTP] sendMail error:", reason);
        emailResult = { ok: false, reason };
      }
    }

    // ---- WhatsApp (rimane disattivato se non configurato) ----
    const waResult: WAResult = await sendWhatsApp(
      `Lead ${share}% — 2026\nNome: ${name || "-"}\nEmail: ${
        email || "-"
      }\nAzienda: ${company || "-"}\n` +
        `Ore: ${clientHours} · Costo: € ${Number(clientCost).toLocaleString(
          "it-IT"
        )}\n` +
        `Msg: ${message?.slice(0, 300) || "-"}`
    );

    return NextResponse.json(
      { ok: true, email: emailResult, whatsapp: waResult },
      { status: 200 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "UNEXPECTED" }, { status: 500 });
  }
}
