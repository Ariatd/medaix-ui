# Profile Page Layout Fix - TODO

## Task Summary
Fix Profile page layout by reorganizing cards into proper side-by-side layout without changing any functionality, data, or text.

## Current Layout Issue
- Avatar card is alone on left side
- All other cards are stacked vertically on the right side
- Right side of Avatar column is empty

## Required Layout

### ROW 1 (side by side):
- **LEFT**: "Upload Avatar" card (keep as is)
- **RIGHT**: Token Status card with:
  1. "Bonus Tokens Remaining" (8/15 tokens, 60% progress bar)
  2. "Daily Free Analyses" (2/3 used today, 66% progress bar)
  3. "Running low on tokens? Upgrade to Pro" link

### ROW 2 (below Row 1):
- **LEFT**: "CURRENT PLAN - Beginner Plan" card
- **RIGHT**: "PRO PLAN - Unlock Pro Features" card ($9.99/month, Upgrade Now button)

## Implementation Steps

- [x] 1. Restructure the main grid to use proper 2-column layout
- [x] 2. Move Avatar card to left column, keep as first item
- [x] 3. Move Current Plan card to left column, place below Avatar
- [x] 4. Move Token Status card to right column (includes Bonus + Daily + upgrade link)
- [x] 5. Move Pro Plan card to right column (below Token Status)
- [x] 6. Remove Profile Information section from layout (it's causing confusion)
- [ ] 7. Test responsive behavior on mobile (stacked) and desktop (side-by-side)

## Constraints
- DO NOT change any text, numbers, or functionality
- DO NOT touch any API calls or data logic
- ONLY change the CSS/layout structure
- Use flexbox or grid for side-by-side layout

