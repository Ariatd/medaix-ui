# Fixed Navbar/Sidebar TODO

## Task: Make Navbar and Sidebar Fixed (Stay in place when scrolling)

### Issue Identified
- DashboardLayout.tsx uses `sticky` positioning for header, causing it to scroll away
- The navbar elements (profile, notifications, theme toggle, search bar) should stay visible at all times

### Files Modified
1. `src/components/DashboardLayout.tsx` - Fixed header to be truly fixed

### Changes Made

1. **Changed root container structure**:
   - From: `min-h-screen` with default scroll
   - To: `h-screen overflow-hidden flex` (fixed viewport like AppLayout)

2. **Changed header from `sticky` to `fixed`**:
   - Old: `sticky top-0 z-20 h-16`
   - New: `fixed top-0 left-64 right-0 z-50 h-16`
   - Note: `left-64` accounts for the sidebar width

3. **Added `pt-16` padding to main content**:
   - Ensures content doesn't get hidden under the fixed header

4. **Made main content the only scrollable area**:
   - Old: `flex-1 w-full` (no scroll control)
   - New: `flex-1 overflow-y-auto w-full pt-16`

5. **Removed duplicate brand block**:
   - Removed the separate fixed logo block that was overlapping

### Before/After Comparison

**Before (scrolling issues):**
```
┌─────────┬────────────────────────────────────┐
│ Sidebar │ Header ← scrolls away with content │
├─────────┼────────────────────────────────────┤
│         │                                    │
│         │         Content Area               │
│         │                                    │
│         │         (scrolls)                  │
│         │                                    │
└─────────┴────────────────────────────────────┘
```

**After (fixed behavior):**
```
┌─────────┬────────────────────────────────────┐
│ Sidebar │ Header ← ALWAYS VISIBLE            │
├─────────┼────────────────────────────────────┤
│         │                                    │
│         │         Content Area               │
│         │                                    │
│         │         (scrolls)                  │
│         │                                    │
└─────────┴────────────────────────────────────┘
```

### Steps Completed
- [x] Analyze current layout structure
- [x] Identify AppLayout.tsx as reference (correct implementation)
- [x] Identify DashboardLayout.tsx issue (sticky header)
- [x] Create TODO.md with plan
- [x] Implement fix in DashboardLayout.tsx
  - [x] Fixed root container structure
  - [x] Changed header to fixed positioning
  - [x] Added proper padding to main content
  - [x] Made main content scrollable
  - [x] Removed unused imports (Logo, useNavigate)
- [x] Verify changes compile correctly

### Pages Affected
- Dashboard (/dashboard)
- Upload (/upload)
- History (/history)
- Profile (/profile)
- Settings (/settings)
- Results (/results/:id)

All these pages use DashboardLayout and will now have fixed navbar elements.

