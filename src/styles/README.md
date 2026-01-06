# CSS Architecture Documentation

## Overview

This directory contains the separated CSS component files for the application, following a maintainable architecture pattern. All styles follow the **Argentine Flag Color Theme** (#74ACDF celeste, #FFFFFF white, #0033A0 blue).

## File Structure

```
src/
├── styles.css                 # Main entry point with imports and CSS variables
└── styles/
    ├── datepicker.css        # Calendar and datepicker components
    ├── dropdown.css          # Select and dropdown components
    ├── form-controls.css     # Input, textarea, number inputs
    ├── buttons.css           # Button components and variants
    ├── messages.css          # Alert, toast, and message components
    └── sidebar.css           # Sidebar, overlay menu, and mobile navigation
```

## Design System

### Color Palette (Argentine Theme)
- **Celeste**: `#74ACDF` - Primary brand color
- **Blue**: `#0033A0` - Dark accent color
- **White**: `#FFFFFF` - Base background

### Typography
- **Compact size**: `0.8125rem` (13px) - Default for most elements
- **Small size**: `0.75rem` (12px) - Labels, captions
- **Medium size**: `0.875rem` (14px) - Emphasis text
- **Large size**: `1rem` (16px) - Headings

### Spacing Scale
- **XS**: `0.25rem` (4px)
- **SM**: `0.5rem` (8px)
- **MD**: `1rem` (16px)
- **LG**: `1.5rem` (24px)
- **XL**: `2rem` (32px)

### Border Radius
- **SM**: `4px` - Small elements
- **MD**: `6px` - Inputs, buttons
- **LG**: `8px` - Cards, panels
- **XL**: `12px` - Modals, large containers

## Component Files

### 1. datepicker.css
Comprehensive styling for all calendar and datepicker components.

**Components Styled:**
- `.p-datepicker-panel` - Main calendar container
- `.p-datepicker-header` - Header with gradient background
- `.p-datepicker-calendar` - Calendar grid
- `.p-timepicker` - Time picker integration
- `.p-datepicker-buttonbar` - Action buttons

**Key Features:**
- White panel with shadow and rounded corners
- Gradient header (#74ACDF → #5B9BD5)
- Hover effects on dates
- Today indicator with celeste background
- Selected day with blue gradient

### 2. dropdown.css
Global styling for select and dropdown overlays.

**Components Styled:**
- `.p-select-overlay` / `.p-dropdown-panel` - Overlay panels
- `.p-select-option` / `.p-dropdown-item` - Menu items
- `.p-select` / `.p-dropdown` - Input trigger
- `.p-select-filter` - Filter input

**Key Features:**
- White overlays with proper z-index
- Hover states with celeste tint
- Selected items with gradient background
- Proper chevron alignment

### 3. form-controls.css
Consistent styling for all form inputs.

**Components Styled:**
- `.p-inputtext` - Text inputs
- `.p-inputnumber` - Number inputs with spinners
- `textarea` - Text areas
- `.p-inputgroup` - Input groups with addons

**Key Features:**
- Compact height: `2.5rem`
- Font size: `0.8125rem`
- Focus state with celeste border and shadow
- Invalid state with red border
- Disabled state with gray background

### 4. buttons.css
Comprehensive button styling with variants.

**Button Types:**
- **Primary**: Celeste to blue gradient (default)
- **Success**: Green gradient
- **Warning**: Orange gradient
- **Danger**: Red gradient
- **Secondary**: Gray solid
- **Outlined**: Transparent with border
- **Text**: Transparent without border

**Key Features:**
- Hover elevation effect
- Active press animation
- Icon button variants
- Size variants (sm, md, lg)
- Disabled state

### 5. messages.css
Alert and notification styling.

**Components Styled:**
- `.p-message` - Inline messages
- `.p-toast` - Toast notifications
- `.p-inline-message` - Small inline alerts

**Message Types:**
- **Success**: Green (#10b981)
- **Info**: Blue (#3b82f6)
- **Warning**: Orange (#f59e0b)
- **Error**: Red (#ef4444)

**Key Features:**
- White backgrounds with colored borders
- Icon styling and spacing
- Dismissible close buttons
- Toast positioning and animations

## Usage Guidelines

### Adding New Styles

1. **Identify the component category**: Determine which file the styles belong to
2. **Follow naming conventions**: Use PrimeNG class names when applicable
3. **Maintain consistency**: Use existing color variables and spacing
4. **Add comments**: Document complex selectors or special cases

### Creating New Component Files

If you need to add a new category:

1. Create file in `src/styles/` directory
2. Add proper header comment with description
3. Import in `styles.css`:
   ```css
   @import './styles/your-new-file.css';
   ```
4. Update this README with documentation

### CSS Variables

Use the defined CSS variables in `styles.css`:

```css
/* Example usage */
.my-component {
  color: var(--color-celeste);
  background: var(--gradient-celeste-blue);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
}
```

## Best Practices

1. **Use !important sparingly**: Only when overriding PrimeNG default styles
2. **Keep specificity low**: Avoid deeply nested selectors
3. **Mobile-first**: Add responsive breakpoints when needed
4. **Test across components**: Ensure changes don't break existing styles
5. **Document complex rules**: Add comments for non-obvious implementations
6. **Follow Argentine theme**: Always use the defined color palette

## Maintenance

### Regular Tasks
- Review and remove unused styles
- Consolidate duplicate rules
- Update documentation when adding features
- Test styles across all browsers
- Optimize for performance

### Known Issues
None currently documented.

## Related Files
- `angular.json` - Includes styles.css in build configuration
- Component `.ts` files - May contain component-specific overrides
- `tsconfig.json` - TypeScript configuration

## Version History
- **v1.0** (2025-01-XX): Initial architecture implementation with separated CSS files
