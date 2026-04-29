# Design System Specification: Interstellar Brutalism

## 1. Overview & Creative North Star: "The Obsidian Monolith"

The Creative North Star for this design system is **The Obsidian Monolith**. We are moving away from the "friendly" web of rounded corners and soft pastels. This system celebrates aggressive precision, high-tech minimalism, and the atmospheric depth of deep space.

We break the "template" look by favoring **intentional asymmetry** and **kinetic energy**. Imagine a UI that isn't just a container, but a piece of advanced spacecraft hardware. We use sharp, 45-degree cuts and overlapping "glass" panels to create an interface that feels engineered rather than drawn. The layout should feel "Editorial Sci-Fi"—large, cinematic type scales juxtaposed against hyper-detailed technical elements.

## 2. Colors: Tonal Depth & The Neon Pulse

Our palette is rooted in `background: #0f1511`, a deep, near-black obsidian. The interaction between the dark voids and the electric `primary: #c7fffe` creates a high-contrast, premium "HUD" (Heads-Up Display) feel.

- **The "No-Line" Rule:** 1px solid borders are strictly prohibited for defining sections. Content blocks must be separated by shifts in surface tiers. Use `surface_container_low` for large section backgrounds and `surface_container_high` for interactive zones.
- **Surface Hierarchy & Nesting:** Treat the UI as physical layers of obsidian glass. An inner module (`surface_container_highest`) should sit inside a broader section (`surface_container_low`) to create "natural" depth through tonal shifting.
- **The "Glass & Gradient" Rule:** Use `surface` colors at 60-80% opacity with a `backdrop-filter: blur(20px)` to create high-tech translucent panels.
- **Signature Textures:** For primary actions, utilize a linear gradient from `primary` (#c7fffe) to `primary_container` (#00f0f0). This provides a "powered-on" glow that a flat hex code cannot replicate.

## 3. Typography: The Cinematic HUD

The typography is designed to be authoritative. We pair the technical, wide-set nature of **Space Grotesk** for displays with the utilitarian clarity of **Inter** for data-heavy sections.

- **Display & Headline (Space Grotesk):** These should be treated as graphic elements. Use `display-lg` for hero moments with tight letter-spacing (-0.02em) to emphasize the aggressive, "bold" nature of the brand.
- **Body & Labels (Inter):** Used for tactical information. All `label-sm` elements should be in uppercase with increased letter-spacing (+0.05em) to mimic technical serial numbers on hardware.
- **Hierarchy:** High contrast is key. Pair a `display-lg` headline with a `label-md` sub-header to create a "Big/Small" editorial rhythm that feels premium and intentional.

## 4. Elevation & Depth: Tonal Layering

We do not use traditional drop shadows to indicate height. Depth is a result of light emission and material density.

- **The Layering Principle:** Stack `surface_container` tokens. A card shouldn't "float" via a shadow; it should be "etched" into the layout by being a slightly lighter `surface_variant` than its parent background.
- **Ambient Glows:** Instead of shadows, use "Glows." When a component is active, use a diffused `primary` shadow (Blur: 20px, Opacity: 15%) to simulate light bleeding from a screen or LED.
- **The "Ghost Border" Fallback:** If a container needs an edge (e.g., in complex data grids), use a 1px border using `outline_variant` at 15% opacity. It must look like a faint reflection on a glass edge, never a solid line.
- **Aggressive Geometry:** All containers must utilize a **0px border-radius**. Use CSS `clip-path` to create 45-degree chamfered (angled) corners on the top-right and bottom-left to reinforce the sci-fi aesthetic.

## 5. Components: Engineered Precision

### Buttons: The Power Core

- **Primary:** 45-degree angled corners. Gradient fill (`primary` to `primary_container`). Text is `on_primary` (heavy black). Add a `drop-shadow` glow of the `primary` color on hover.
- **Secondary:** Ghost style. Transparent background with a `primary` "Ghost Border" (20% opacity). On hover, the border opacity jumps to 100%.

### Input Fields: Tactical Entry

- **Styling:** No bottom border only. Use a full-surround `surface_container_highest` fill.
- **Focus State:** The left border thickens to 2px with a `primary` color neon glow.

### Cards: Glass Modules

- **Execution:** Forbid dividers. Separate content using `body-lg` for titles and `label-md` for metadata, separated by 24px of vertical space (`spacing-6`).
- **Background:** Use `surface_container_low` at 70% opacity with backdrop blur.

### Chips: Status Indicators

- **Styling:** Sharp rectangular edges. For "active" states, use `secondary` (#d0bcff) text with a subtle `secondary_container` background.

### Tactical Additions:

- **The "Scanline" Overlay:** Apply a subtle, repeating horizontal linear-gradient pattern (1px height) at 3% opacity over hero images to enhance the high-tech screen feel.
- **The "Corner Brackets":** Use `primary` color L-shaped vectors in the corners of significant modules to "frame" the content like a targeting reticle.

## 6. Do's and Don'ts

### Do:

- **Do** use extreme white space. The "Minimalist but Powerful" look requires breathing room between aggressive geometric elements.
- **Do** use `primary` cyan sparingly. It is a "power source"—if everything glows, nothing is important.
- **Do** lean into asymmetry. Offset a text block to the left while keeping a decorative element to the far right.

### Don't:

- **Don't** use rounded corners (0px radius is the law). Even a 2px radius breaks the "Obsidian Monolith" feel.
- **Don't** use standard grey shadows. Use the `surface_container` tiers or tinted glows.
- **Don't** use "centered" layouts for everything. It feels too much like a standard template; favor left-aligned, heavy-weight editorial compositions.
- **Don't** use 100% opaque borders. They clutter the UI and destroy the "glassmorphism" depth.
