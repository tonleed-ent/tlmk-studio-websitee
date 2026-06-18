---
name: tlmk-styling
description: Apply TLMK Studio's visual identity. Use whenever creating or editing any page, component, or stylesheet for the TLMK Studio photography website.
---

# TLMK Studio Styling

Apply this whenever building or editing any TLMK Studio page or component.

## Colours (use these exact values)
- Background:    #0A0A0A
- Text:          #FFFFFF
- Muted text:    rgba(255,255,255,0.45)
- Faint text:    rgba(255,255,255,0.25)
- Borders:       rgba(255,255,255,0.1)
- Hover bg:      rgba(255,255,255,0.08)
No accent colour. Ever. The photography is the only colour on the page.

## Typography
- Brand font: **Space Grotesk** (Google Fonts), weights 300/400/500/700. Load it in
  the `<head>` of every page; it's the typeface for all text on the site.
- Logo / nav / labels: uppercase, letter-spacing 0.2em–0.3em, small (10–13px), weight 400.
- Display headings: large (36–64px), font-weight 300 (light), tight letter-spacing.
- Eyebrow labels: 10px uppercase, faint, above each section.
- Body: 13px, weight 400, muted colour, line-height 1.8.

## Components

### Buttons
Outline style: transparent bg, 0.5px white border at 0.4 opacity, uppercase 11px
text, letter-spacing 0.2em, padding 12px 28px. Hover: subtle white fill (0.08).
Primary button: solid white bg, black text.

### Hero
Full-bleed image, brightness 0.7 filter. Overlay content bottom-left:
eyebrow label, huge name, subtitle, one button.

### Gallery
Asymmetric grid (mix of aspect ratios — some 3/4, some square, one wide span).
6px gap. Each item numbered "TLMK / 0XX". Hover shows a dark overlay with "View".

### Forms
Borderless inputs with only a bottom border (0.5px white at 0.2 opacity).
Transparent background. Placeholder text faint.
Focus brightens the bottom border.

### Sections
Separated by 0.5px white borders at 0.07 opacity. Padding 80px vertical, 48px
horizontal on desktop. Reduce on mobile.

## Rules
- Mobile-first, always responsive.
- Sentence case in copy, uppercase only for labels/nav.
- Generous black whitespace — never crowd elements.
- Keep it minimal. When in doubt, remove something.
