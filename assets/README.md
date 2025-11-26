# Assets Folder

## Logo Instructions

Please place your logo file here with the name `logo.png` for the splash screen to work properly.

### Requirements:

- **File name**: `logo.png` (or update the require path in SplashScreen.js)
- **Recommended size**: 512x512 pixels or higher (square format)
- **Format**: PNG with transparent background preferred
- **Style**: Should match your brand colors (green agricultural theme)

### Alternative formats supported:

- `logo.jpg` / `logo.jpeg`
- `logo.svg` (with react-native-svg if installed)

### Current usage:

The logo is used in:

- `src/screens/SplashScreen.js` - Main splash screen logo

### To use a different filename:

Update the require path in SplashScreen.js:

```javascript
source={require('../../assets/your-logo-name.png')}
```
