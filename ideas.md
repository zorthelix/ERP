# Store Manager — Design Directions

## Approach A

**Theme Name:** Ledger & Linen  
**Very Brief Intro:** An editorial operations console inspired by printed stock ledgers and modern retail packaging. Warm paper surfaces make daily inventory work calmer and easier to scan.  
**Probability:** 0.07

## Approach B

**Theme Name:** Signal Shelf  
**Very Brief Intro:** A dense, dark operational interface with bright status signals and compact metrics. It emphasizes speed, alerting, and at-a-glance warehouse awareness.  
**Probability:** 0.04

## Approach C

**Theme Name:** Workshop Index  
**Very Brief Intro:** A utilitarian atelier system combining cobalt documentation marks, ink-like typography, and structured work surfaces. It treats every sale and stock movement as an organized record rather than a generic dashboard card.  
**Probability:** 0.09

# Chosen Direction: Workshop Index

## Design Movement

Contemporary **Swiss editorial design** blended with the practical visual language of inventory control sheets and workshop labels.

## Core Principles

1. Use clear visual hierarchy and purposeful alignment, so high-value inventory information is legible before decorative detail.
2. Pair off-white paper-like surfaces with precise cobalt signals, conveying dependable operations without corporate sterility.
3. Use columns, hairline dividers, and asymmetrical information bands rather than a field of identical rounded cards.
4. Make actions feel tactile through restrained pressed states, strong focus treatment, and concise transition timing.

## Color Philosophy

The base is a warm porcelain white that reduces the coldness of transactional work. Deep ink navy carries primary content and navigation, while **Index Cobalt** identifies interactive controls, current state, and data emphasis. Ochre and vermilion are reserved for stock risk and destructive actions to retain their operational meaning.

## Layout Paradigm

The product uses a fixed left “index spine” for identity and route navigation. The main workspace is a flexible report sheet: a narrow contextual masthead above an asymmetric body that pairs a primary task surface with an adjacent operational rail. Tables read as organized registers with no ornamental card excess.

## Signature Elements

1. A cobalt square “index tab” appears beside active navigation, headings, and selected records.
2. Thin horizontal rule lines and monospace metadata make the interface resemble a controlled workshop document.
3. Small asymmetric counters and status chips separate metrics from narrative headings.

## Interaction Philosophy

Interactions must clarify state rather than decorate it. Selected rows gain a subtle paper-shadow and cobalt rule; buttons depress slightly on activation; forms expose errors immediately beside the relevant control. Navigation changes retain the index spine to preserve orientation.

## Animation

Use only transform and opacity. Panels and page content enter with a 160–220ms, 12–24px vertical transition using `cubic-bezier(0.23, 1, 0.32, 1)`. Buttons transition within 150ms and scale to 0.97 on press. Disable nonessential transitions for `prefers-reduced-motion`.

## Typography System

Use **DM Sans** for compact body text and controls, with **DM Mono** for SKUs, timestamps, quantity controls, and metadata. Headings are DM Sans at 600–700 weight with tight letter spacing; data labels use uppercase DM Mono at 11–12px with increased tracking.

## Brand Essence

**Store Manager is the clear operational record for independent retail teams that need stock and sales control without enterprise clutter.**  
Personality: **methodical, candid, capable**.

## Brand Voice

Headlines are direct and inventory-specific; CTAs name the exact operation; microcopy states the resulting system behavior.

Examples: “Count less. Know more.” and “Record sale — inventory updates immediately.”

## Wordmark & Logo

The mark is a single **cobalt inventory index tab**: a thick vertical bar locked against a compact rectangular notch, suggesting both a shelf divider and the checked edge of a record. The wordmark uses custom-spaced DM Sans capitals with a mono “/” separator.

## Signature Brand Color

**Index Cobalt — #2453FF**

## Style Decisions

- Entry surfaces use a visible cobalt index tab, mono metadata, and a register-like rule band rather than generic floating-card styling.
- Cobalt is a precise state and identity signal through tabs, rules, and register markers, not only a large action-button color.
- Background forms derive from shelf dividers, ledger rules, and enlarged index tabs rather than generic curves or technology motifs.
