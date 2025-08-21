// app/api/lead/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

// Usa Node.js runtime (consigliato con Supabase/Resend)
export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY!);

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // server-only
  { auth: { persistSession: false, autoRefreshToken: false } }
);

// Helper: estrai IP dagli header proxy
function getClientIp(req: NextRequest): string {
  const h = req.headers;
  const fwd = h.get("x-forwarded-for"); // "ip, ip-proxy, ..."
  const candidates = [
    fwd?.split(",")[0]?.trim(),
    h.get("x-real-ip"),
    h.get("x-client-ip"),
    h.get("x-vercel-ip"),
  ].filter(Boolean) as string[];
  const ip = candidates[0] ?? "unknown";
  return ip === "::1" ? "127.0.0.1" : ip;
}

// Piccola util per sanificare HTML
function escapeHTML(s: string) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const ua = req.headers.get("user-agent") || "unknown";

    const payload = await req.json();

    // Validazioni minime
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

    // Insert su Supabase
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
      console.error("Supabase insert error:", dbErr);
      return NextResponse.json({ error: "DB_INSERT_FAILED" }, { status: 500 });
    }

    // Email di notifica
    const to = process.env.CONTACT_EMAIL!;
    const from = process.env.RESEND_FROM_EMAIL!;
    const subject = `Nuova richiesta quota ${share}% — 2026`;

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
      </div>
    `;

    await resend.emails.send({ to, from, subject, html });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "UNEXPECTED" }, { status: 500 });
  }
}
