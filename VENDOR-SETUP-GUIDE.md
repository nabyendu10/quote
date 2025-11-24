# Vendor Selection System - Setup Guide

## Current Setup

The vendor system is now configured with **Rockwell Automation** as the primary vendor and an **"Other (Upload Custom Logo)"** option for custom logos.

## How to Add More Vendors in the Future

### Step 1: Add Vendor Logo Image
1. Place your vendor logo image in the `assets/vendor-logo/` folder
2. Name it following this pattern: `vendor-name-logo.png`
   - Example: `rockwell-automation-logo.png`
   - Use lowercase letters
   - Replace spaces with hyphens (-)

### Step 2: Update vendors-manifest.json
Open `assets/vendor-logo/vendors-manifest.json` and add a new entry:

```json
{
  "vendors": [
    {
      "id": "rockwell-automation",
      "name": "Rockwell Automation",
      "filename": "rockwell-automation-logo.png"
    },
    {
      "id": "siemens",
      "name": "Siemens",
      "filename": "siemens-logo.png"
    },
    {
      "id": "schneider-electric",
      "name": "Schneider Electric", 
      "filename": "schneider-electric-logo.png"
    },
    {
      "id": "other",
      "name": "Other (Upload Custom Logo)",
      "filename": null
    }
  ]
}
```

**Important:** Always keep the "other" option as the last entry in the list.

### Step 3: That's It!
The dropdown will automatically populate with your new vendors. No code changes needed!

## Features

✅ **Dropdown Selection**: Choose from predefined vendors
✅ **Custom Upload**: Upload custom vendor logos (max 2MB, PNG/JPG/SVG)
✅ **Future-Ready**: Easy to add more vendors by updating JSON file
✅ **Error Handling**: Shows error if vendor logo is missing
✅ **Validation**: File size and type validation for uploads

## File Structure

```
assets/
  vendor-logo/
    vendors-manifest.json          ← Update this to add vendors
    rockwell-automation-logo.png   ← Add new vendor logos here
    siemens-logo.png              
    schneider-electric-logo.png
```

## Custom Upload Feature

When users select "Other (Upload Custom Logo)":
1. An upload section appears
2. Users can select their own logo file
3. File is validated (max 2MB, PNG/JPG/SVG only)
4. Logo displays immediately after upload
5. Logo data is stored for use in quote generation

## Tips

- Use high-quality logos (recommended: 500x400px or similar aspect ratio)
- PNG format with transparent background works best
- Keep file sizes reasonable (under 500KB recommended)
- Use descriptive vendor IDs (lowercase, hyphenated)
