---
name: Shivani Rai Portfolio (The Pastel Paper Page)
description: One warm cream page, soft ink Geist type, borderless pastel cards on soft ambient shadow, GSAP-scrubbed scroll scenes.
colors:
  cream-ground: "#faf4ec"
  soft-ink: "#262626"
  paper-white: "#fffdf9"
  card-cream: "#ffe3ac"
  card-pink: "#ffd3fe"
  card-lavender: "#d3d3ff"
  card-sky: "#b8e3e9"
  card-mint: "#cfefe2"
  signal-green: "#33c791"
  reveal-block-grey: "#bfbcb4"
  highlight-mint: "#a8ebcf"
  highlight-coral: "#ffb9b9"
  wordmark-tone: "#efe5d7"
typography:
  display:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 7vw, 5rem)"
    fontWeight: 600
    lineHeight: 1.06
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4.6vw, 3.4rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4vw, 3rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  story:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  lead:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "0.94rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "0.85rem"
    fontWeight: 500
    lineHeight: 1.6
rounded:
  pill: "999px"
  highlight: "8px"
  frame: "20px"
  panel: "22px"
  note: "24px"
  card: "28px"
  project: "36px"
spacing:
  gutter: "clamp(20px, 5vw, 64px)"
  card-gap: "14px"
  section-y: "110px"
  wrap-max: "1180px"
  work-wrap-max: "1400px"
  story-column: "896px"
components:
  button-primary:
    backgroundColor: "{colors.soft-ink}"
    textColor: "{colors.cream-ground}"
    rounded: "{rounded.pill}"
    padding: "12px 22px"
  button-soft:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.soft-ink}"
    rounded: "{rounded.pill}"
    padding: "12px 22px"
  button-soft-hover:
    backgroundColor: "{colors.card-mint}"
  nav-pill:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.soft-ink}"
    rounded: "{rounded.pill}"
    padding: "5px"
  nav-active-pill:
    backgroundColor: "{colors.cream-ground}"
    rounded: "{rounded.pill}"
  nav-resume:
    backgroundColor: "{colors.card-mint}"
    textColor: "{colors.soft-ink}"
    rounded: "{rounded.pill}"
    padding: "8px 14px"
  nav-resume-hover:
    backgroundColor: "{colors.card-sky}"
  tool-card:
    backgroundColor: "{colors.card-cream}"
    textColor: "{colors.soft-ink}"
    rounded: "{rounded.card}"
    padding: "26px"
  project-card:
    backgroundColor: "{colors.card-pink}"
    textColor: "{colors.soft-ink}"
    rounded: "{rounded.project}"
    padding: "clamp(18px, 2.6vw, 38px)"
  project-info-panel:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.soft-ink}"
    rounded: "{rounded.panel}"
    padding: "22px"
  browser-frame:
    backgroundColor: "{colors.paper-white}"
    rounded: "{rounded.frame}"
  job-card:
    backgroundColor: "{colors.card-lavender}"
    textColor: "{colors.soft-ink}"
    rounded: "{rounded.card}"
    padding: "26px 28px"
  contact-card:
    backgroundColor: "{colors.card-sky}"
    textColor: "{colors.soft-ink}"
    rounded: "{rounded.card}"
    padding: "22px 24px"
  chip:
    backgroundColor: "{colors.cream-ground}"
    textColor: "{colors.soft-ink}"
    rounded: "{rounded.pill}"
    padding: "4px 11px"
  story-block:
    backgroundColor: "{colors.reveal-block-grey}"
    rounded: "{rounded.highlight}"
  story-highlight-mint:
    backgroundColor: "{colors.highlight-mint}"
    textColor: "{colors.soft-ink}"
    rounded: "{rounded.highlight}"
  story-highlight-coral:
    backgroundColor: "{colors.highlight-coral}"
    textColor: "{colors.soft-ink}"
    rounded: "{rounded.highlight}"
---

# Design System: Shivani Rai Portfolio

## Overview

**Creative North Star: "The Pastel Paper Page"**

A single warm cream page on which soft pastel cards rest like cut paper, with no outlines drawn around anything. Structure comes from fill colour, generous radii and one diffuse ambient shadow. Everything is Geist at 600 weight with tight negative tracking, in sentence case; the voice is calm and plain, and the motion does the performing.

The page is told in order and scrolled: a centered headline whose words rise, with small muted project-image pills set inline; a pinned story that reveals as grey blocks turning into text; stacking project cards; a thin winding road of career stops; contact cards that arrive from the sides and then pop up; and a footer with a live IST clock above a huge tone-on-tone wordmark. The pinned story replicates the reference course page's block-to-text reveal.

Density is generous: 110px section padding, big type, few elements per viewport. Colour is quiet; the one saturated hue (green) appears only in tiny status and progress marks.

**Key Characteristics:**
- One cream ground (#faf4ec) top to bottom; soft ink (#262626) text; paper (#fffdf9) for inset panels.
- Five pastel fills (cream, pink, lavender, sky, mint) cycle through cards; no dark outlines or borders anywhere.
- Geist only, weight 600 for headings, tracking -0.035em, sentence case.
- Pill controls, 20-36px card radii, one soft ambient shadow.
- Hover uses individual CSS `scale`, `rotate`, `translate` so GSAP transforms are never fought.
- Labelled lavender cursor circle on fine pointers.

## Colors

A warm cream paper, soft ink, five sugary pastels and one small green for state.

### Primary
- **Signal Green** (`signal-green`): status dot and its pulse, road fill and passed stops, the reached-card ring (at 28% alpha), highlight bullets in project panels. Never a card, button or section fill.

### Secondary
- **Pastel fills** (`card-cream`, `card-pink`, `card-lavender`, `card-sky`, `card-mint`): the card fills, cycled by index through tool, project, journey and contact cards and story beat dots. Lavender also fills the nav home roundel, hero image pill 1, text selection and the cursor label; mint fills the nav Resume button and soft-button hover; sky is Resume hover.

### Neutral
- **Cream Ground** (`cream-ground`): the one page background, theme colour, scrollbar track, active nav pill, chip fill, text on ink fills.
- **Soft Ink** (`soft-ink`): all text and the primary button fill. Secondary text is ink at 60% (`rgba(38,38,38,.6)`); hairlines are ink at 10%.
- **Paper White** (`paper-white`): the nav pill, browser-frame bar, project info panel, soft button, certificate pills.
- **Reveal Block Grey** (`reveal-block-grey`, rgb(191,188,180)): story word blocks only.
- **Story highlights** (`highlight-mint`, `highlight-coral`): the pastel green and coral chips on key story words.
- **Wordmark Tone** (`wordmark-tone`): the footer wordmark, barely darker than the ground.

### Named Rules
**The One Ground Rule.** The page is a single cream. Sections are separated by spacing and cards, never by a change of background colour.
**The Soft Ink Rule.** Text is #262626, never pure black; text on a pastel is always ink.
**The Green Is a Dot Rule.** Signal green appears only as tiny status or progress marks (dots, road, ring, bullets). Cards and buttons take pastels.

## Typography

**Display Font:** Geist (via next/font, with system-ui)
**Body Font:** Geist (with system-ui)

**Character:** One family doing everything: heavy, tight, sentence-case headings and plain regular-weight reading text. Hierarchy comes from size and muted ink, not from a second face or capitals.

### Hierarchy
- **Display** (600, clamp 2.5rem to 5rem, 1.06, -0.035em): hero h1, centered, in three nowrap lines; each word rises from a mask; some words muted to ink at 60%.
- **Headline** (600, clamp 2rem to 3.4rem, 1.05, -0.035em, max 18ch): section h2; a `mark` phrase is muted rather than highlighted.
- **Title** (600, clamp 2rem to 3rem, -0.035em): project names; journey roles use 1.5-2rem, contact names 1.4-1.9rem; the email link and live clock run larger (up to 4rem and 3.2rem).
- **Story** (600, 1.25rem rising to 1.875rem at 768px, 1.5 then 1.2, -0.025em): pinned reveal in a 896px column.
- **Lead / Body** (400-500, 0.94 to 1.05rem, 1.6): section leads capped at 52ch; panel text 0.88-0.94rem.
- **Label** (500, 0.75 to 0.9rem, sentence case): meta, footer headings, pills, chips.

### Named Rules
**The Sentence Case Rule.** Nothing is uppercased or letterspaced open. Headings are 600 with negative tracking; labels are 500 at small size.

## Layout

A centered `wrap` (max 1180px; 1400px for Work; fluid gutter 20-64px). Sections stack on the one cream ground with 110px vertical padding. Hero is a full-height centered column. Toolbox and note grids use `auto-fit` columns (260px and 200px minimums) with 14px gaps. Story pins to 100dvh with its 896px column centred. Work cards stack sticky (top 88px plus 18px per card, 20vh spacing) from 960px wide and 820px tall, otherwise they flow; each card is a screenshot frame beside a 320px info panel from 1000px. Journey cards alternate sides of the road (width min 500px / 38%, 86% below 1000px). Contact uses a 2-up and a 3-up row from 720px. Footer is a 1.3fr/1fr/1fr link grid from 800px above a full-width wordmark. Fixed layers: top-centre nav pill, cursor. The Resume nav button hides below 720px.

## Elevation & Depth

Mostly flat tonal layering: cards are pastel planes on cream, and paper-white insets sit on the pastels. One soft ambient shadow lifts only floating or inset objects.

### Shadow Vocabulary
- **Ambient** (`box-shadow: 0 18px 40px -22px rgba(38,38,38,0.22)`): nav pill, soft button, browser frame, certificate pills, cursor label.
- **Reached ring** (`0 0 0 5px rgba(51,199,145,0.28)`, plus 4px lift): the journey card the road has reached.

### Named Rules
**The Soft-Only Rule.** Shadows are blurred, offset downward, negative spread. Pastel cards themselves carry no shadow.
**The No Outline Rule.** No dark outlines or borders. Allowed hairlines: ink at 10-30% in road strokes and browser-frame dots, and the 1px dashed ink (55%) on revealed story highlight chips, which is part of the reference reveal.

## Shapes

Soft and round. Controls, chips, pills, nav and image pills are 999px. Cards run 20px (browser frame), 22px (info panel), 24px (notes), 28px (tool, journey, contact) and 36px (project). Story word blocks are 8px. Dots, roundels, monograms and arrow circles are circles. Notes rest at small rotations of -2 to 2deg.

## Components

### Buttons
- **Shape:** pill, 12px 22px, 15px weight 500, no border.
- **Primary:** ink fill, cream text; hover lightens fill to ink at 82%.
- **Soft:** paper fill, ink text, ambient shadow; hover fills mint.
- **Focus:** global 2px ink-at-55% outline, 3px offset, 8px radius.

### Cards / Containers
- **Tool card** (28px, 26px padding): pastel fill, heading plus chips (paper at 70%) that lift 2px on hover; notes (24px) lift 3px.
- **Project card** (36px): large sticky stack with tilt-in scaling; borderless browser-frame screenshot (20px, three faint dots, URL pill on cream) with pointer tilt, glare and click-to-flip clip-path wipe, beside a paper info panel (22px) with green bullet highlights and cream chips.
- **Journey card** (28px): width min 500px / 38%; lifts 4px and gains the green ring when reached.
- **Contact card** (28px, 170-210px tall): name, monogram circle, arrow circle that rotates 45deg on hover; cards lift 5px.

### Navigation
- Fixed top-centre paper pill (16px from top, ambient shadow) with a lavender home roundel (36px), 14px weight-500 muted labels that turn ink on hover, a gliding cream active pill under the current section, and a mint Resume button that turns sky on hover.

### Story reveal (signature)
- Geist 30px/600 column of 896px. Each word sits in a grey 8px block that runs 10 words ahead of the reading point and clears behind it; key words end as a pastel green or coral chip with a 1px dashed ink outline. Beats beneath are large headings with a pastel dot.

### Hero (signature)
- Centered sentence-case headline with muted inline project-image pills (lavender, pink, sky tint, image at 55% opacity), words that rise from masks, a one-line who and sub, two buttons and a pulsing green status dot.

### Winding Road (signature)
- Thin SVG road: dotted base at 22% ink, 4px green fill drawn on scroll; stops are cream dots with a 3px ink-at-30% ring that turn green when passed, sitting on card edges; a paper marker with a green ring travels the path.

### Footer (signature)
- Live IST clock at up to 3.2rem tabular figures, quiet link lists that slide 6px right and fade on hover, and a viewport-wide wordmark in tone-on-tone whose letters tint lavender and lift on hover.

### Motion Grammar
- GSAP drives entrances and scroll scenes (story scrub, sticky stack, road draw, contact pop-ins); CSS easing is `cubic-bezier(0.16, 1, 0.3, 1)`.
- CSS hover and rest effects use individual `scale`, `rotate`, `translate`, never `transform`, on GSAP-animated elements.
- `prefers-reduced-motion` collapses CSS durations.

## Do's and Don'ts

### Do:
- **Do** keep one cream page background (#faf4ec) and separate sections with spacing and cards.
- **Do** fill cards from cream, pink, lavender, sky and mint, with text in soft ink.
- **Do** separate surfaces by fill and the ambient shadow, using paper-white insets on pastel cards.
- **Do** set every heading in Geist 600, -0.035em, sentence case.
- **Do** keep controls as 999px pills and cards at 20-36px radii.
- **Do** write hover states with `scale`, `rotate` and `translate` properties.
- **Do** keep one scroll-driven idea per section: pinned reveal, sticky stack, winding road, side-in contact cards.
- **Do** keep signal green to tiny status and progress marks.

### Don't:
- **Don't** draw dark outlines or borders around cards, buttons, chips or frames.
- **Don't** use hard offset or block shadows.
- **Don't** alternate section background colours or add full-bleed colour bands.
- **Don't** use green as a card, button or section fill.
- **Don't** use `transform` in CSS hover rules on GSAP-animated elements.
- **Don't** replace the winding road with a straight rail or the stacking cards with a plain grid.
