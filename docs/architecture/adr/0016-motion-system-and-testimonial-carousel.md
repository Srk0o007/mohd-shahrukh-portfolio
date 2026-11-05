# ADR 0016: Scroll motion system and the testimonial carousel

- **Status:** Accepted (owner decision, 2026-11-05)
- **Date:** 2026-11-05
- **Supersedes:** A2 ("no carousel" for testimonials)
- **Records:** a known WCAG 2.2.2 gap, accepted by the owner

## Context

The frozen design adds the following, all as specified in the prototype:
- parallax;
- a scroll reveal;
- a self-drawing education journey;
- a denser header on scroll;
- a skills ticker;
- an autoplaying testimonial slider.

These must not cost first-load JS, hide content, or ignore reduced motion.

## Decision

**Motion module:**
- `src/lib/motion/` is loaded by `MotionLayer` after idle (1.3 KB gzip chunk) and restarted on route changes.
- **Scroll listener:** a single rAF-throttled passive one drives:
  - `data-scrolled` on the header past 24 px;
  - `[data-speed]` parallax via `transform` (35 % below 768 px);
  - the journey's `--progress` and `data-lit` milestones.
- **Reveal:** `[data-reveal]` elements fade from blur using `translate`; hover keeps `transform`. The reveal has its own transition list, so the stagger delay never touches hover easing.
  - **Never hidden:** elements on screen when the module starts are marked `data-in` *before* `data-reveal-on` is set.
  - **Entry:** a first IntersectionObserver reveals on entry.
  - **Replay:** a second resets elements only once they are fully below the viewport, so reveals replay from below. With a single observer, elements peeking into the bottom margin at load were hidden; that was a bug in the prototype.
  - **Stagger:** 90 ms per step (max 5) inside `[data-stagger]`.
- **Without JS:** the journey is drawn full, and nothing is hidden.

**Reduced motion:** reveal, parallax, ticker, slider autoplay, hover zoom and card lift are off. Transitions are instant (FR-INT-02, FR-PRJ-07).

**Carousel:**
- `TestimonialSlider` is a client island over server-rendered slides.
- Controls: prev/next buttons, dots with a 7 s progress bar, and pointer swipe.
- Autoplay pauses on hover and focus.
- Inactive slides are `aria-hidden` and dimmed.
- ARIA carousel pattern: `aria-roledescription` carousel / slide, `role="group"`. The live region is polite only when autoplay is off.
- Without JS, both quotes stack.

**Skills tabs:** `SkillTabs` is a client island following the ARIA tabs pattern (arrow, Home and End keys). The panels are server-rendered, with visually hidden plain lists.

## Known gap: WCAG 2.2.2 Pause, Stop, Hide

The particle wave, ticker, portrait morph and orbits move for more than 5 s with no pause control. The owner chose to ship the design exactly as frozen (2026-11-05).

**Mitigations:**
- everything stops under `prefers-reduced-motion`;
- the slider pauses on hover and focus;
- the ticker is decorative and `aria-hidden`.

Tracked as an open item in ACCESSIBILITY_REPORT §6.

## Consequences

- **First-load JS:** 147.2 KB gzip (cap 150; Phase 11 was 144.8). The SkillTabs and slider islands account for most of the increase.
- **Axe runs under reduced motion.** Content is then in its final state; mid-fade opacity would otherwise skew contrast results.
