import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

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
  WHATSAPP_TOKEN,
  WHATSAPP_PHONE_ID,
  WHATSAPP_TO,
} = process.env as Record<string, string>;

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { persistSession: false, autoRefreshToken: false },
});

/* ---------- Email (Nodemailer) ---------- */
function getTransport() {
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
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
async function sendWhatsApp(text: string) {
  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID || !WHATSAPP_TO) {
    console.warn("[WA] Config mancante: skip WhatsApp");
    return { ok: false, reason: "WA_CONFIG_MISSING" };
  }
  const url = `https://graph.facebook.com/v20.0/${WHATSAPP_PHONE_ID}/messages`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: WHATSAPP_TO,
      type: "text",
      text: { body: text.slice(0, 1024) }, // limite prudenziale
    }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error("[WA] Errore invio:", json || res.statusText);
    return { ok: false, reason: json || res.statusText };
  }
  return { ok: true, id: json?.messages?.[0]?.id };
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
function escapeHTML(s: string) {
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

    let emailResult: any = { ok: false, reason: "SMTP_DISABLED" };
    const transporter = getTransport();
    if (transporter) {
      try {
        const info = await transporter.sendMail({
          from: `${SMTP_FROM_NAME} <${SMTP_USER}>`,
          to: CONTACT_EMAIL,
          subject: `Nuova richiesta quota ${share}% — 2026`,
          html,
          replyTo: email || undefined,
        });
        emailResult = {
          ok: true,
          messageId: info.messageId,
          accepted: info.accepted,
          rejected: info.rejected,
        };
      } catch (err) {
        console.error("[SMTP] sendMail error:", err);
        emailResult = { ok: false, reason: String(err) };
      }
    }

    // ---- WhatsApp (opzionale) ----
    let waResult: any = { ok: false, reason: "WA_DISABLED" };
    // Se vuoi inviare sempre, togli la condizione; qui inviamo solo se l'email è ok o se vuoi fallback
    if (WHATSAPP_TOKEN && WHATSAPP_PHONE_ID && WHATSAPP_TO) {
      const text =
        `Lead ${share}% — 2026\n` +
        `Nome: ${name || "-"}\nEmail: ${email || "-"}\nAzienda: ${
          company || "-"
        }\n` +
        `Ore: ${clientHours} · Costo: € ${Number(clientCost).toLocaleString(
          "it-IT"
        )}\n` +
        `Msg: ${message?.slice(0, 300) || "-"}`;
      waResult = await sendWhatsApp(text);
    }

    return NextResponse.json(
      { ok: true, email: emailResult, whatsapp: waResult },
      { status: 200 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "UNEXPECTED" }, { status: 500 });
  }
}
