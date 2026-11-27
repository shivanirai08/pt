# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Recruiters, hiring managers, and freelance or startup clients evaluating Shivani Rai (software developer with a product-design sensibility, Next.js / Node / Python). They skim on desktop and phone, usually for under a minute, deciding whether to open the resume or write to her. Both audiences are equally primary.

## Product Purpose

A personal portfolio that proves, through the way it behaves, that Shivani sweats interaction details ("the motion that either earns its place or gets cut"). Success: a visitor remembers one interaction, understands what she builds, and either opens the resume or emails her.

## Positioning

A quiet, minimal portfolio where restraint speaks loudest: soft pastel cards on one cream ground, light type, and a few well-made scroll interactions (a pinned block-to-text story, stacking project cards, a winding career road). The previous version was a terminal; this one replaces it entirely. The illustrated tour guide was tried and removed at the owner's request.

## Operating Context

Single-page visitor site on Next.js 16 (App Router) with GSAP, @gsap/react and framer-motion already installed. Content lives in content/portfolio.json, served via /api/content and edited through /admin. Project screenshots are in public/projects.

## Capabilities and Constraints

- Keep content/portfolio.json as the single source of truth, and keep /admin and the API routes working. Only the visitor-facing UI is replaced; the terminal UI (app/cli, terminal components, /api/terminal) is removed.
- Motion budget: "rich but light". GSAP, CSS, SVG and canvas only; no WebGL or 3D libraries. Must honor prefers-reduced-motion and work on mid-range phones.
- Resume URL and email are in portfolio.json (personal.resumeUrl, personal.email).

## Brand Commitments

- Name: Shivani Rai (handle @shivanirai08), role "Software Developer · Product Designer".
- Voice: first person, direct, a little playful (see personal.bio in portfolio.json).
- Explicit user request: replace the terminal/minimal-CLI look with a visually pleasing, minimal-but-highly-interactive theme built on micro-interactions.

## Evidence on Hand

Projects with screenshots (chess, classence, codeclash, codecollab; two images each) and experience entries with achievements in content/portfolio.json. No testimonials, client logos or metrics beyond what is in that file; do not invent any.

## Product Principles

1. Interaction is the portfolio: every motion must earn its place or be cut.
2. Quiet by default: pastel fills, no dark outlines, no decorative underlines, no loud elements.
3. Minimal surface, rich behavior: few elements, each with a considered response.
4. Content comes from portfolio.json only; no fabricated claims.

## Accessibility & Inclusion

Respect prefers-reduced-motion, full keyboard operation, visible focus, and sufficient contrast.
