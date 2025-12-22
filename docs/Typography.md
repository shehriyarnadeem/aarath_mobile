# Professional Typography System

## Overview

Our agricultural marketplace app now uses a professional, sharp, and impactful typography system designed for maximum readability and brand impact.

## Font Strategy

- **iOS**: SF Pro Display/Text (Apple's professional font system)
- **Android**: Roboto (Google's optimized font system)
- **Monospace**: SF Mono / Roboto Mono (for precise numerical data)

## Usage Guide

### Import Typography

```javascript
import { TYPOGRAPHY } from "../constants/Theme";
// OR for more specific control
import { TEXT_PRESETS, createTextStyle } from "../constants/Typography";
```

### Ready-to-Use Text Styles

#### Display Text (Maximum Impact)

```javascript
// Hero title - largest, most impactful
<Text style={[TYPOGRAPHY.textStyles.heroTitle, { color: colors.primary }]}>
  Pakistan Grain Marketplace
</Text>

// Page title - strong hierarchy
<Text style={[TYPOGRAPHY.textStyles.pageTitle, { color: colors.textPrimary }]}>
  Dashboard Overview
</Text>
```

#### Section Headers (Clean Impact)

```javascript
// Section titles
<Text style={[TYPOGRAPHY.textStyles.sectionTitle, { color: colors.white }]}>
  Featured Products
</Text>

// App title in header
<Text style={[TYPOGRAPHY.textStyles.appTitle, { color: colors.white }]}>
  Pakistan Grain Marketplace
</Text>
```

#### Body Text (Optimized Reading)

```javascript
// Large body text
<Text style={[TYPOGRAPHY.textStyles.bodyLarge, { color: colors.textPrimary }]}>
  Welcome to Pakistan's first agricultural marketplace
</Text>

// Medium body text (most common)
<Text style={[TYPOGRAPHY.textStyles.bodyMedium, { color: colors.textSecondary }]}>
  Connect with farmers and buyers across Pakistan
</Text>

// Small body text
<Text style={[TYPOGRAPHY.textStyles.bodySmall, { color: colors.textMuted }]}>
  Updated 2 hours ago
</Text>
```

#### Interface Elements (Sharp & Clear)

```javascript
// Button text
<Text style={[TYPOGRAPHY.textStyles.buttonText, { color: colors.white }]}>
  Learn More
</Text>

// Small button text
<Text style={[TYPOGRAPHY.textStyles.buttonTextSmall, { color: colors.primary }]}>
  See All
</Text>

// Tab text
<Text style={[TYPOGRAPHY.textStyles.tabText, { color: colors.textPrimary }]}>
  Category
</Text>

// Filter text
<Text style={[TYPOGRAPHY.textStyles.filterText, { color: colors.gray600 }]}>
  All Grains
</Text>
```

#### Numbers & Data (Precision Typography)

```javascript
// Price text (monospace for alignment)
<Text style={[TYPOGRAPHY.textStyles.priceText, { color: colors.primary }]}>
  Rs. 120/kg
</Text>

// Large price display
<Text style={[TYPOGRAPHY.textStyles.priceLarge, { color: colors.success }]}>
  Rs. 1,250
</Text>

// Data text (statistics, numbers)
<Text style={[TYPOGRAPHY.textStyles.dataText, { color: colors.textPrimary }]}>
  +2.5%
</Text>
```

### Text Shadows (Professional Depth)

```javascript
import { TEXT_SHADOWS } from '../constants/Typography';

// Subtle shadow
<Text style={[
  TYPOGRAPHY.textStyles.sectionTitle,
  TEXT_SHADOWS.subtle,
  { color: colors.white }
]}>
  Title with Shadow
</Text>

// Medium shadow
<Text style={[
  TYPOGRAPHY.textStyles.pageTitle,
  TEXT_SHADOWS.medium,
  { color: colors.white }
]}>
  Strong Title
</Text>

// Brand shadow (green tint)
<Text style={[
  TYPOGRAPHY.textStyles.heroTitle,
  TEXT_SHADOWS.brandShadow,
  { color: colors.primary }
]}>
  Brand Text
</Text>
```

### Custom Text Styles

```javascript
import { createTextStyle } from "../constants/Typography";

// Create custom variation
const customTitle = createTextStyle("sectionTitle", {
  fontSize: 22,
  letterSpacing: -0.3,
  color: colors.primary,
});

<Text style={customTitle}>Custom Title</Text>;
```

## Best Practices

### 1. Hierarchy

- Use `heroTitle` for main page headers
- Use `sectionTitle` for section headers
- Use `bodyMedium` for most content
- Use `caption` for secondary information

### 2. Colors with Typography

```javascript
// Headers on dark backgrounds
style={[TYPOGRAPHY.textStyles.sectionTitle, { color: colors.white }]}

// Body text variations
style={[TYPOGRAPHY.textStyles.bodyMedium, { color: colors.textPrimary }]}
style={[TYPOGRAPHY.textStyles.bodySmall, { color: colors.textSecondary }]}
style={[TYPOGRAPHY.textStyles.caption, { color: colors.textMuted }]}
```

### 3. Numbers and Prices

Always use monospace fonts for:

- Prices and currency
- Statistical data
- Numerical comparisons
- Percentage changes

```javascript
// Good - aligned and precise
<Text style={[TYPOGRAPHY.textStyles.priceText, { color: colors.primary }]}>
  Rs. 120.50
</Text>

// Good - data consistency
<Text style={[TYPOGRAPHY.textStyles.dataText, { color: colors.success }]}>
  +2.5%
</Text>
```

### 4. Button Text

```javascript
// Primary buttons - use buttonText
<TouchableOpacity style={styles.primaryButton}>
  <Text style={[TYPOGRAPHY.textStyles.buttonText, { color: colors.white }]}>
    Get Started
  </Text>
</TouchableOpacity>

// Secondary buttons - use buttonTextSmall
<TouchableOpacity style={styles.secondaryButton}>
  <Text style={[TYPOGRAPHY.textStyles.buttonTextSmall, { color: colors.primary }]}>
    Learn More
  </Text>
</TouchableOpacity>
```

## Typography Scale

| Style        | Size | Weight | Use Case                   |
| ------------ | ---- | ------ | -------------------------- |
| heroTitle    | 36px | 900    | Hero sections, main titles |
| pageTitle    | 28px | 800    | Page headers               |
| sectionTitle | 20px | 700    | Section headers            |
| appTitle     | 24px | 800    | App header title           |
| heading1     | 24px | 700    | Major headings             |
| heading2     | 18px | 600    | Minor headings             |
| bodyLarge    | 16px | 400    | Large body text            |
| bodyMedium   | 14px | 400    | Standard body text         |
| bodySmall    | 12px | 400    | Small body text            |
| buttonText   | 16px | 600    | Button labels              |
| priceText    | 18px | 700    | Price displays             |
| dataText     | 14px | 600    | Numerical data             |

## Impact Guidelines

1. **Sharp**: Use tight letter-spacing for headers (-0.5 to -1.0)
2. **Professional**: Consistent font weights across similar elements
3. **Impactful**: Bold weights (700+) for important information
4. **Readable**: Proper line-heights and spacing for body text
5. **Precise**: Monospace fonts for all numerical data

## Platform Differences

The typography system automatically adapts to each platform:

- **iOS**: Uses SF Pro fonts for optimal iOS experience
- **Android**: Uses Roboto family for Material Design consistency
- **Fallback**: System fonts ensure compatibility

This ensures your app looks native and professional on every platform while maintaining consistent visual hierarchy and impact.
