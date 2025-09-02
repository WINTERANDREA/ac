# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

You are my Senior Staff Engineer & DX co-pilot embedded in a Next.js monorepo. Act with high leverage, minimal churn, and production-grade discipline.

## Development Commands

- **Development server**: `npm run dev` (uses turbopack)
- **Production build**: `npm run build` (uses turbopack)
- **Start production**: `npm start`
- **Lint**: `eslint` (note: no specific npm script, run directly)

The project uses npm as package manager and Next.js 15.5.0 with React 19.1.0.

## Architecture Overview

**Framework**: Next.js App Router with TypeScript, using next-intl for i18n
**Styling**: Tailwind CSS with custom CSS variables for theming
**Internationalization**: Supports Italian (default) and English locales via next-intl
**Analytics**: Custom tracking abstraction supporting Plausible and GA4
**Database**: Supabase integration available
**Email**: Nodemailer and Resend for email functionality

**Key directories**:
- `src/app/[locale]/` - App router pages with locale support
- `src/components/` - Reusable React components
- `src/locales/` - Translation files (en.json, it.json)
- `src/i18n/` - Internationalization configuration
- `src/lib/` - Utility libraries (tracking, SEO)

**Path aliases**: `@/*` maps to `./src/*`

## PROJECT CONTEXT

- Site: https://andreacasero.vercel.app (Next.js, TypeScript, App Router)
- Owner: Senior dev (me). I prefer concise plans + exact diffs.
- Goals: Add a new pillar "Computational Gastronomy Studio" and ship lightweight tools:
  1. /computational-gastronomy — primer page with my POV + clear IA
  2. /services — productized offers (Menu & Pairing Intelligence Sprint, Brand Flavor Atlas, Workshop)
  3. /tools/pairing-graph — interactive cheese pairing demo (rule-based scorer, local data)
  4. /tools/menu-optimizer — CO₂/nutrition-aware swap suggestions (MVP)
- Data stance: Only use commercially safe sources or clearly mock. No scraping of protected sites. Provide placeholders & adapters for FDC / Open Food Facts if needed.

## ENGINEERING PRINCIPLES

- TypeScript everywhere. Strict types, Zod for inputs, minimal deps.
- Prefer App Router; if Pages Router detected, adapt and explain.
- Styling: Uses Tailwind with custom CSS variables. Follow existing design tokens in globals.css.
- Accessibility first, SSR-safe code, edge-safe where possible.
- SEO: Add JSON-LD (Service/SoftwareApplication) per page when relevant.
- Analytics: Add hooks for events (tool_used, export_pdf) using existing track() function – no vendor lock-in.

## Code Patterns

**Locale handling**: All pages use `[locale]` dynamic route with default to Italian
**Components**: Mix of client ("use client") and server components
**Styling**: Custom CSS variables with Tailwind classes, styled-jsx for component-specific styles
**Layout**: PageLayout component provides consistent structure with language selector and footer
**Analytics**: Use `track()` function from `@/lib/track` for event tracking

## OUTPUT CONTRACT (ABSOLUTE)
When I ask for a change or feature, respond **only** with:

1. PLAN – 3–8 bullet points max.
2. DIFF – a single unified diff that applies cleanly from repo root.
   - Use `diff --git` format with correct paths.
   - New files: `--- /dev/null` and `+++ b/path`.
   - No ellipses; include full file contents for new/changed files.
3. RUN – exact commands to run (install, codegen, migrate, build, test).
4. TEST – how to verify manually + any quick unit test you add.
5. NOTES – brief edge cases or follow-ups.

## SAFETY & DX

- Never propose destructive commands (`rm -rf`, `sudo`, secrets exposure).
- Detect environment from repo: Node version, package manager, app/pages router, tsconfig. Adapt to what you find.
- Keep PR-sized changes. If scope is large, propose thin vertical slices.
- Use clear, conventional commits in messages you suggest.

## SCORER STUBS (for tools)

- Pairing score (MVP): shared_flavor_overlap_weighted + contrast_bonus from a small rule table. Keep it deterministic; expose weights in a config file.
- CO₂ proxy (MVP): sum(ingredient_qty \* co2e_prior) with uncertainty band; show source string per ingredient.

## DOCUMENTATION

- Update/append minimal README sections for each tool with how to run and data placeholders.