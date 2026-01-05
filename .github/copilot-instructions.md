# Aarath Agricultural Marketplace - Development Rules

## 🎯 **Core Principles**

### **Domain Focus**

- ✅ Always maintain agricultural marketplace context
- ✅ Use farming/trading terminology (Hawala numbers, agricultural categories)
- ✅ Design for farmers, traders, and buyers
- ❌ Never use generic e-commerce patterns
- ❌ Don't ignore the agricultural business context

### **User Experience**

- ✅ Mobile-first design (farmers use mobile devices)
- ✅ Professional business interface (not consumer-focused)
- ✅ Clean, efficient workflows for busy traders
- ✅ Clear visual hierarchy and status indicators

---

## ♻️ **Component Reusability Rule**

### **MANDATORY: Design for Reuse**

- ✅ **ALWAYS** create reusable components when a pattern appears more than once
- ✅ Extract common UI patterns into `/components/common/` directory
- ✅ Use props to make components flexible and configurable
- ✅ Separate business logic from UI presentation
- ✅ Create generic components that work across multiple screens

### **Reusability Checklist**

Before creating a new component, ask:

1. ✅ Does this pattern exist elsewhere in the app?
2. ✅ Could this be used in other screens with minor modifications?
3. ✅ Can I make this generic by accepting props?
4. ✅ Should this be split into smaller, reusable pieces?

### **Component Types**

## 🌾 **Agricultural Categories Rule**

### **MANDATORY: Restricted Category List**

- ✅ **ONLY** use these five agricultural categories in the entire project:
  - `wheat` - Wheat products
  - `rice` - Rice products
  - `cotton` - Cotton products
  - `corn` - Corn products
  - `barley` - Barley products

- ❌ **NEVER** add, use, or allow any other categories
- ❌ **NEVER** use: pulses, vegetables, fruits, organic, livestock_feed, or any other category
- ✅ All dropdowns, forms, and validations must use only these five categories
- ✅ Backend and frontend must enforce this restriction

## 🌐 **Internationalization (i18n) Rule**

### **MANDATORY: No Hardcoded Text**

- ✅ **ALWAYS** use translation keys for all user-facing text
- ✅ Use `react-i18next` or equivalent i18n library for translations
- ✅ Support multiple languages (English, Urdu.)
- ❌ **NEVER** hardcode text directly in components
- ❌ **NEVER** use plain strings for labels, messages, or UI text

### **Translation Pattern**

## 🎨 **Theme & Styling Rules**

### **MANDATORY: Use Theme System**

```javascript
// ✅ ALWAYS DO THIS
import { useTheme } from "../../constants/Theme";

const Component = () => {
  const { COLORS, SIZES } = useTheme();

  return (
    <View style={{ backgroundColor: COLORS.background }}>
      <Text style={{ color: COLORS.textPrimary }}>Content</Text>
    </View>
  );
};
```

### **Color Rules**

- ✅ **ONLY** use theme colors: `COLORS.primary`, `COLORS.background`, etc.
- ✅ Agricultural green primary color scheme
- ✅ Professional white/gray surfaces for business use
- ❌ **NEVER** hardcode colors: `#22c55e`, `"red"`, etc.
- ❌ **NEVER** bypass the theme system

### **Spacing Rules**

- ✅ Use theme spacing: `SIZES.padding`, `SIZES.margin`
- ✅ Consistent card-based layouts with shadows
- ✅ Proper mobile touch targets (minimum 44px)
- ❌ Don't use arbitrary spacing values

---

## 📱 **Component Rules**

### **Component Structure**

```javascript
// ✅ STANDARD COMPONENT PATTERN
const ComponentName = ({ navigation, customProps }) => {
  const { COLORS, SIZES } = useTheme();

  // State and logic here

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: COLORS.background }]}
    >
      {/* Component JSX */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Use theme values in StyleSheet.create
  },
});

export default ComponentName;
```

### **Import Rules**

- ✅ **ALWAYS** import theme: `import { useTheme } from "../../constants/Theme";`
- ✅ Use Expo Vector Icons: `import { Ionicons } from '@expo/vector-icons';`
- ✅ Import React Native components: `import { View, Text, TouchableOpacity } from 'react-native';`
- ❌ **NEVER** use other icon libraries
- ❌ **NEVER** skip theme imports

---

## 🗃️ **Data & Schema Rules**

### **Product Schema Compliance**

```javascript
// ✅ ALWAYS match Prisma schema
const product = {
  id: "uuid",
  serialNumber: 123, // Unique integer (Hawala number)
  title: "Wheat Grade A", // Product title
  description: "High quality wheat...",
  category: "wheat", // Agricultural category
  quantity: 1000,
  unit: "kg", // kg, gram, ton, quintal
  images: ["url1", "url2"], // Array of strings
  price: 50000,
  priceType: "fixed", // fixed, negotiable, bulk, per_unit
  environment: "MARKETPLACE", // MARKETPLACE or AUCTION
};
```

### **Status Management Rules**

```javascript
// ✅ MANDATORY STATUS FLOW
Draft → "List in Marketplace" → Marketplace Environment
Marketplace: Active ↔ Inactive ↔ Out of Stock
Auction: Active ↔ On Hold → Sold

// ❌ NEVER ALLOW
Auction → Marketplace (backwards transition forbidden)
Direct Draft → Auction (must go through Marketplace first)
```

---

## 🧩 **UI Component Rules**

### **Dropdowns**

- ✅ **ONLY** use `react-native-element-dropdown`
- ❌ **NEVER** create custom dropdown modals
- ❌ **NEVER** use Picker or other dropdown libraries

```javascript
// ✅ CORRECT DROPDOWN USAGE
import { Dropdown } from "react-native-element-dropdown";

<Dropdown
  data={options}
  labelField="label"
  valueField="value"
  value={selectedValue}
  onChange={handleChange}
  style={[styles.dropdown, { borderColor: COLORS.border }]}
/>;
```

### **Cards & Layout**

- ✅ Use card-based layouts with shadows
- ✅ Rounded corners: 12-16px radius
- ✅ Proper elevation/shadows for depth
- ✅ Consistent padding using theme values

### **Status Indicators**

- ✅ Color-coded status badges
- ✅ Icons with status (checkmark, pause, warning, etc.)
- ✅ Clear visual hierarchy: Current status → Available changes

---

## 📂 **File & Folder Rules**

### **File Structure**

```
src/
├── components/
│   ├── marketplace/     ✅ Domain-specific components
│   ├── common/         ✅ Reusable UI components
│   └── forms/          ✅ Form-specific components
├── screens/
│   └── dashboard/      ✅ All main screens here
├── constants/
│   └── Theme.js        ✅ NEVER modify without consultation
├── navigation/         ✅ Navigation setup
└── context/           ✅ App-wide state management
```

### **Naming Conventions**

- ✅ PascalCase for components: `ProductCard.js`
- ✅ camelCase for functions: `handleStatusChange`
- ✅ UPPER_SNAKE_CASE for constants: `PRODUCT_STATUSES`
- ✅ Descriptive names: `isProductInAuction` not `isAuction`

---

## 🔄 **Navigation Rules**

### **Navigation Patterns**

```javascript
// ✅ CORRECT NAVIGATION
navigation.navigate("ProductEdit", {
  productId: product.id,
  product: product,
});

// ✅ PROPER SCREEN REGISTRATION
<Stack.Screen
  name="ProductEdit"
  component={ProductEdit}
  options={{
    presentation: "modal",
    headerTitle: "Edit Product",
  }}
/>;
```

### **Screen Communication**

- ✅ Pass necessary data through navigation params
- ✅ Use route.params for receiving data
- ✅ Handle undefined params gracefully
- ❌ Don't rely on global state for navigation data

---

## 📋 **Form & Input Rules**

### **Form Validation**

- ✅ Validate all required fields
- ✅ Show real-time error feedback
- ✅ Clear errors when user starts typing
- ✅ Prevent submission with validation errors

```javascript
// ✅ VALIDATION PATTERN
const [errors, setErrors] = useState({});

const validateForm = () => {
  const newErrors = {};
  if (!formData.title) newErrors.title = "Title is required";
  if (!formData.category) newErrors.category = "Category is required";
  return newErrors;
};
```

### **Input Components**

- ✅ Consistent styling across all inputs
- ✅ Proper keyboard types: `numeric` for numbers
- ✅ Clear labels and placeholders
- ✅ Error state styling

---

## 🚫 **NEVER DO**

### **Code Anti-Patterns**

- ❌ Hardcode colors, spacing, or dimensions
- ❌ Skip theme system usage
- ❌ Use console.log in production code
- ❌ Create custom dropdowns when library exists
- ❌ Ignore agricultural domain context
- ❌ Use generic business terminology
- ❌ Break established component patterns
- ❌ Skip error handling and validation
- ❌ Forget mobile-first responsive design
- ❌ Use complex state management for simple forms

### **Business Logic Violations**

- ❌ Allow backward transitions (Auction → Marketplace)
- ❌ Skip draft state for new products
- ❌ Ignore status transition rules
- ❌ Allow invalid agricultural categories
- ❌ Break the established user flow

---

## 🪝 **Hooks Usage Rule**

- ✅ Use React hooks (e.g., `useState`, `useEffect`, custom hooks) for managing state, side effects, and business logic when the feature workflow requires dynamic or interactive behavior
- ✅ Prefer custom hooks to encapsulate reusable logic across components
- ✅ Keep component code clean by extracting complex logic into hooks
- ❌ Do not use class components or lifecycle methods
- ❌ Avoid duplicating logic—extract to hooks when reused

## ✅ **ALWAYS DO**

### **Code Quality**

- ✅ Import and use `useTheme()` hook
- ✅ Follow established component patterns
- ✅ Use proper TypeScript/PropTypes when possible
- ✅ Handle loading and error states
- ✅ Implement proper form validation
- ✅ Use meaningful variable names
- ✅ Add helpful comments for complex business logic
- ✅ Test on mobile devices/simulators

### **Business Alignment**

- ✅ Maintain agricultural marketplace focus
- ✅ Use farming/trading terminology
- ✅ Follow product status lifecycle rules
- ✅ Design for professional business users
- ✅ Ensure mobile-optimized experiences
- ✅ Keep UI clean and efficient

---

## 🔧 **Development Workflow**

### **Before Coding**

1. ✅ Understand the agricultural business context
2. ✅ Check existing components for reusability
3. ✅ Plan status transitions and business logic
4. ✅ Consider mobile user experience

### **During Development**

1. ✅ Use theme system consistently
2. ✅ Follow established patterns
3. ✅ Test on mobile screen sizes
4. ✅ Implement proper error handling

### **Before Committing**

1. ✅ Remove console.log statements
2. ✅ Verify theme usage throughout
3. ✅ Test navigation flows
4. ✅ Check mobile responsiveness
5. ✅ Validate against business rules

---

## 🎯 **Success Criteria**

A component/screen is ready when it:

- ✅ Uses theme system for all colors and spacing
- ✅ Follows agricultural marketplace domain context
- ✅ Works perfectly on mobile devices
- ✅ Implements proper error handling
- ✅ Follows established component patterns
- ✅ Respects business logic rules
- ✅ Provides clear user feedback
- ✅ Maintains professional business aesthetic

---

---

## 🤝 **Platform Consistency Rule**

- ✅ All development must ensure full compatibility and consistent behavior on both iOS and Android platforms
- ✅ Follow platform-specific best practices for navigation, gestures, and UI feedback
- ✅ Test all features on both iOS and Android devices/simulators before merging
- ✅ Use cross-platform compatible libraries and APIs
- ❌ Never implement features that only work on one platform
- ❌ Avoid platform-specific UI unless absolutely necessary (and document exceptions)

## 📚 **Quick Reference**

### **Essential Imports**

```javascript
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useTheme } from "../../constants/Theme";
import { Ionicons } from "@expo/vector-icons";
```

### **Common Theme Usage**

```javascript
const { COLORS, SIZES } = useTheme();
```

### **Agricultural Categories**

```javascript
const categories = [
  "wheat",
  "rice",
  "cotton",
  "corn",
  "barley",
  "pulses",
  "vegetables",
  "fruits",
  "organic",
  "livestock_feed",
];
```

---

**Remember**: This is a professional agricultural business platform. Every decision should prioritize the needs of farmers, traders, and buyers in the agricultural marketplace. Keep it clean, efficient, and mobile-optimized! 🌾

**Last Updated**: [Current Date]  
**Version**: 1.0  
**Project**: Aarath Agricultural Marketplace Mobile App
