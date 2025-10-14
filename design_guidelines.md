# Asset Management System - Design Guidelines

## Design Approach

**Selected Framework**: Hybrid Design System approach inspired by Fluent Design and Carbon Design System - optimized for data-heavy enterprise applications where clarity, efficiency, and consistent patterns drive user productivity.

**Core Principles**:
- Information clarity over visual flourish
- Efficient workflows with minimal cognitive load
- Consistent, predictable interaction patterns
- Professional, trustworthy aesthetic

---

## Color Palette

### Light Mode
- **Background**: 0 0% 98% (primary surface)
- **Surface**: 0 0% 100% (cards, panels)
- **Surface Secondary**: 210 20% 98% (subtle backgrounds)
- **Border**: 220 13% 91%
- **Primary**: 221 83% 53% (blue for actions)
- **Primary Hover**: 221 83% 45%
- **Text Primary**: 222 47% 11%
- **Text Secondary**: 215 16% 47%
- **Success**: 142 71% 45%
- **Warning**: 38 92% 50%
- **Error**: 0 84% 60%
- **Info**: 199 89% 48%

### Dark Mode
- **Background**: 222 47% 11%
- **Surface**: 217 33% 17%
- **Surface Secondary**: 215 25% 20%
- **Border**: 217 19% 27%
- **Primary**: 217 91% 60%
- **Primary Hover**: 217 91% 70%
- **Text Primary**: 210 20% 98%
- **Text Secondary**: 217 10% 64%

---

## Typography

**Font Families**:
- Primary: 'Inter' (body, UI elements)
- Monospace: 'JetBrains Mono' (IDs, serial numbers, technical data)

**Type Scale**:
- **Headings**: 
  - H1: 2rem (32px), font-weight 700 - Page titles
  - H2: 1.5rem (24px), font-weight 600 - Section headers
  - H3: 1.25rem (20px), font-weight 600 - Card headers
  - H4: 1.125rem (18px), font-weight 600 - Subsection labels
- **Body**: 
  - Base: 0.875rem (14px), font-weight 400
  - Large: 1rem (16px), font-weight 400
  - Small: 0.75rem (12px), font-weight 400
- **Labels**: 0.75rem (12px), font-weight 500, uppercase tracking-wide
- **Monospace**: 0.813rem (13px) for technical identifiers

---

## Layout System

**Spacing Primitives**: Use Tailwind units of 1, 2, 4, 6, 8, 12, 16 for consistent rhythm
- Component padding: p-4 to p-6
- Section spacing: space-y-6 to space-y-8
- Card gaps: gap-4 to gap-6
- Page margins: px-4 to px-8, py-6 to py-8

**Container Strategy**:
- Dashboard: max-w-7xl mx-auto (1280px)
- Forms/Modals: max-w-2xl (672px)
- Data Tables: Full-width containers with horizontal scroll

**Grid Patterns**:
- Dashboard widgets: grid-cols-1 md:grid-cols-2 lg:grid-cols-4
- Form layouts: grid-cols-1 md:grid-cols-2 with gap-4
- Asset cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3

---

## Component Library

### Navigation
- **Sidebar Navigation**: Fixed left sidebar (256px wide) with collapsible sections
  - Active state: background primary with 10% opacity, left border accent
  - Icons: 20px, aligned left with 12px right margin
  - Compact mode: 64px wide, icon-only with tooltips

### Data Tables
- **Header**: Sticky headers with sort indicators, subtle background (surface secondary)
- **Rows**: Alternating row backgrounds (surface vs transparent), 48px height
- **Cells**: Left-aligned text, right-aligned numbers, 16px horizontal padding
- **Actions**: Compact icon buttons (edit, delete) in rightmost column
- **Pagination**: Bottom-aligned with page numbers, prev/next buttons, items per page selector
- **Filters**: Top-aligned filter bar with dropdowns, search input, clear button

### Forms
- **Input Fields**: 
  - Height: 40px, rounded corners (6px)
  - Border: 1px solid border color, focus: 2px primary ring
  - Label: Above input, 12px font-size, 8px bottom margin
  - Error state: Red border with error message below (12px, error color)
- **Select Dropdowns**: Match input styling with chevron icon
- **Date Pickers**: Calendar overlay with month/year navigation
- **Toggle Switches**: 44px width, 24px height for status fields
- **Buttons**:
  - Primary: Solid background primary, white text, 40px height
  - Secondary: Border outline, primary text
  - Danger: Solid background error color
  - All: 6px border-radius, 16px horizontal padding

### Dashboard Widgets
- **Stat Cards**: 
  - White/surface background with subtle border
  - Large number (2.5rem) with label below
  - Optional icon (32px) top-right corner
  - Trend indicator (arrow + percentage) in accent color
- **Chart Containers**: 
  - 16:9 aspect ratio for bar/line charts
  - Recharts library with brand color palette
  - Clean grid lines, axis labels in text-secondary

### Modals & Overlays
- **Modal**: Centered overlay with backdrop (black 50% opacity)
  - Max-width: 600px for forms, 900px for data views
  - Header with title + close button, content area, footer with actions
- **Confirmation Dialogs**: Compact 400px width with warning icon, message, action buttons
- **Toast Notifications**: Top-right positioned, 4s auto-dismiss
  - Success/Error/Info variants with left accent border (4px)

### Search & Filters
- **Search Bar**: 
  - Full-width input with search icon prefix
  - Debounced input (300ms) with loading indicator
  - Clear button appears when text entered
- **Filter Pills**: 
  - Rounded full badges showing active filters
  - Close icon to remove individual filter
  - "Clear all" text button

---

## Interaction Patterns

### Asset Assignment Flow
1. Click "Assign Asset" button in asset row
2. Modal opens with employee dropdown (showing active employees only)
3. Optional notes textarea
4. Primary "Assign" button with loading state
5. Success toast + table refresh

### Status Updates
- Status badges with distinct colors:
  - Available: Success green background
  - Assigned: Info blue background  
  - Under Repair: Warning amber background
  - Retired: Gray background
- Condition badges follow similar pattern

### Pagination & Infinite Scroll
- Tables: Standard pagination (10, 25, 50, 100 items per page)
- Cards: Load more button at bottom
- Always show total count: "Showing 1-10 of 243 assets"

---

## Animations

**Minimal, purposeful motion only**:
- Table row hover: Subtle background color transition (150ms)
- Modal entry/exit: Fade + scale (200ms ease-out)
- Button interactions: Built-in state changes only
- Filter collapse/expand: Height transition (200ms)
- Loading spinners: Subtle rotation for async operations

No decorative animations, scroll effects, or page transitions.

---

## Images & Icons

**Icons**: Use Heroicons (outline variant) via CDN
- Navigation: 20px icons
- Buttons: 16px icons  
- Table actions: 18px icons
- Dashboard widgets: 32px decorative icons

**Images**: Not applicable for this utility application. Focus on data visualization through charts and tables.

**Asset Thumbnails**: If asset photos needed, use 64x64px rounded thumbnails in table view, expandable to lightbox modal.