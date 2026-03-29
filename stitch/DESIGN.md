# Design System Document: The Industrial Precision Framework

## 1. Overview & Creative North Star: "The Mechanical Luxury"
The creative direction for this design system is **Mechanical Luxury**. We are moving away from the "cheap" look of typical lead-gen sites (bright buttons, cluttered grids) and toward an aesthetic that mirrors a high-end automotive cockpit. 

The North Star is **Rugged Professionalism**. We achieve this through "Organic Brutalism"—using heavy, bold typography and a dark, moody palette, but softening the experience with sophisticated tonal layering and "glass" surfaces. We break the template by using intentional asymmetry—offsetting car imagery against bold, oversized display type—to create a sense of forward motion and high-value curation.

---

## 2. Colors: Tonal Depth & The "No-Line" Rule
This system relies on atmospheric depth rather than structural lines. We use a palette of deep charcoals and precision oranges to guide the eye.

*   **Primary (#ffb77d / #ff8c00):** Used for "Critical Path" actions. It represents the heat of an engine and the urgency of a lead.
*   **Surface Hierarchy:** To create depth, we stack containers using the `surface-container` tiers. 
    *   **The "No-Line" Rule:** 1px solid borders for sectioning are strictly prohibited. Boundaries must be defined by shifting from `surface` (#131313) to `surface-container-low` (#1c1b1b) or `surface-container-high` (#2a2a2a).
*   **The Glass & Gradient Rule:** Floating cards or mobile navigation bars must use `surface-variant` (#353535) at 60% opacity with a `20px` backdrop-blur. 
*   **Signature Textures:** For Hero CTAs, use a subtle radial gradient: `primary_container` (#ff8c00) to `primary` (#ffb77d) at a 45-degree angle to simulate the metallic sheen of automotive paint.

---

## 3. Typography: High-Impact Editorial
We pair **Space Grotesk** (Display/Headlines) with **Inter** (Body) to balance raw mechanical energy with clean, trustworthy readability.

*   **Display-LG (Space Grotesk, 3.5rem):** Use for hero value propositions. Set with `-0.04em` letter spacing for a "crushed" high-impact look.
*   **Headline-MD (Space Grotesk, 1.75rem):** Used for section titles. Always in Bold.
*   **Title-MD (Inter, 1.125rem):** The workhorse for car names and model specs.
*   **Body-MD (Inter, 0.875rem):** For descriptions. Use `on_surface_variant` (#ddc1ae) to reduce eye strain against the dark background.
*   **Label-SM (Inter, 0.6875rem):** Uppercase with `0.1em` tracking for technical specs (e.g., "0-60 MPH", "HORSEPOWER").

---

## 4. Elevation & Depth: Tonal Layering
In this design system, shadows are light, and depth is felt, not seen.

*   **The Layering Principle:** Place a `surface-container-highest` card (#353535) atop a `surface-container-low` (#1c1b1b) background. This creates a "lift" of 2dp without a single shadow pixel.
*   **Ambient Shadows:** If a card must float (e.g., a lead form), use a shadow with a 32px blur, 0px offset, and 6% opacity using the `primary` color tinted toward black. This simulates a "glow" from the dashboard.
*   **The Ghost Border:** If a form field needs a boundary, use `outline-variant` (#564334) at **15% opacity**. It should be felt as a change in texture rather than a hard line.
*   **Roundedness:** Use `sm` (0.125rem) for technical components (inputs/chips) to maintain a "machined" edge. Use `lg` (0.5rem) for primary imagery and hero cards to soften the overall "rugged" feel.

---

## 5. Components: Engineered for Conversion

### Buttons (The Ignition Points)
*   **Primary:** Background `primary_container` (#ff8c00), Text `on_primary_container`. No border. High-gloss finish (subtle top-to-bottom gradient).
*   **Secondary:** Ghost style. Background transparent, "Ghost Border" (15% opacity `outline`), Text `primary`.
*   **Sizing:** Mobile buttons must be a minimum of `12` (3rem) in height to ensure high-speed "tap-ability."

### Input Fields (The Precision Gauges)
*   **Style:** Use `surface_container_highest` (#353535) for the field background. 
*   **Focus State:** Transition the border to 100% opacity `primary` and add a subtle 4px outer glow. 
*   **Error:** Use `error` (#ffb4ab) text only. Do not turn the whole box red; keep the professional dark aesthetic.

### Cards (The Spec Sheets)
*   **Constraint:** Forbid the use of divider lines. Separate "Price," "Year," and "Model" using `spacing-4` (1rem) and typography weight shifts.
*   **Background:** Use `surface_container_low` (#1c1b1b) for the card body.

### Chips (Filtering)
*   **Selection:** Use `secondary_container` with `on_secondary_container` text. Use `full` roundedness for a pill shape to contrast against the sharp-edged UI.

---

## 6. Do's and Don'ts

### Do:
*   **Do** use asymmetrical layouts. Place a car image "bleeding" off the right edge of the screen while text is anchored left.
*   **Do** use `surface_container_lowest` (#0e0e0e) for the "Footer" or "Legal" areas to create a solid "grounding" for the page.
*   **Do** prioritize mobile-first spacing. Use `spacing-6` (1.5rem) as your default gutter for mobile screens.

### Don't:
*   **Don't** use 100% white text for long body copy; it causes "halation" on dark backgrounds. Use `on_surface_variant` (#ddc1ae).
*   **Don't** use standard blue for links. Every interactive element must use the `primary` (Orange) or `tertiary` (Blue-Grey) tokens.
*   **Don't** use "Drop Shadows" on text. If text is unreadable over an image, use a `surface-dim` gradient overlay behind the text.