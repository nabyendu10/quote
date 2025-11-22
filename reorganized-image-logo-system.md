# Reorganized Image and Logo System Template

## 📋 Overview
A clean separation of concerns where:
- **Logo Selection**: Company logo selection via dropdown from assets/sta-logo folder
- **Project Images**: Multiple image upload for project descriptions/details

## 🎯 System Architecture

### 🏢 Company Logo Selection
**Purpose**: Select company branding logo for quotation headers/footers
**Location**: Top section after navbar
**Method**: Dropdown selection from available logo files

### 🏭 Vendor Selection
**Purpose**: Select vendor/partner logo for quotations
**Location**: Below company logo selection
**Method**: Dynamic dropdown populated from assets/vendor-logo folder

#### Implementation
```html
<div class="logo-selection">
    <h2>Select Company Logo:</h2>
    <select id="logoDropdown">
        <option value="">-- Select Company --</option>
        <option value="sta">STA</option>
        <option value="staipl">STAIPL</option>
    </select>
</div>
<div id="logoContainer"></div>
```

#### File Structure
```
assets/
├── sta-logo/
│   ├── sta-logo.png
│   ├── staipl-logo.png
│   └── [companyname]-logo.png
└── vendor-logo/
    ├── vendors-manifest.json
    ├── vendor1-logo.png
    ├── vendor2-logo.png
    └── [vendor-name]-logo.png
```

#### Company Logo Implementation
```html
<div class="logo-selection">
    <h2>Select Company Logo:</h2>
    <select id="logoDropdown">
        <option value="">-- Select Company --</option>
        <option value="sta">STA</option>
        <option value="staipl">STAIPL</option>
    </select>
</div>
<div id="logoContainer"></div>
```

#### Vendor Selection Implementation  
```html
<div class="vendor-selection">
    <h2>Select Vendor:</h2>
    <select id="vendorDropdown">
        <option value="">-- Loading Vendors --</option>
    </select>
</div>
<div id="vendorContainer"></div>
```

#### Naming Conventions
**Company Logos:**
- **File**: `{companyname}-logo.png`
- **Option Value**: `{companyname}`
- **Display**: `{COMPANYNAME}` (uppercase)

**Vendor Logos:**
- **File**: `{vendor-name}-logo.png`
- **Option Value**: `{vendor-name}`
- **Display**: Formatted (e.g., "Vendor Name")
- **Manifest**: Listed in `vendors-manifest.json`

### 📸 Project Images Upload
**Purpose**: Upload multiple images for project descriptions
**Location**: "Project Description in Details" section
**Method**: Multiple file upload with drag-and-drop reordering

#### Implementation
```html
<div class="body-container">
    <h2>Project Description in Details:</h2>
    <div class="upload-area">
        <input type="file" id="imageUpload" accept="image/*" multiple>
        <h6>(Max size: 2MB per image | Multiple files supported)</h6>
        <button id="clearAllImages" class="clear-btn">Clear All Images</button>
    </div>
    <div class="preview-area">
        <div id="imageContainer" class="image-container">
            <!-- Dynamic image cards here -->
        </div>
    </div>
</div>
```

## 🔧 JavaScript API

### Logo Selection Functions

#### `initDropdownLogoSelection()`
Initializes the dropdown logo selection system with automatic image path generation.

#### `getSelectedLogo()`
Returns the selected company name (e.g., 'sta', 'staipl').
```javascript
const company = getSelectedLogo();
// Returns: 'sta' | 'staipl' | ''
```

#### `setSelectedLogo(logoName)`
Programmatically selects a logo.
```javascript
setSelectedLogo('sta'); // Selects STA logo
```

#### `getSmallLogoSrc()`
Returns the full path to selected logo for quotation generation.
```javascript
const logoPath = getSmallLogoSrc();
// Returns: 'assets/sta-logo/sta-logo.png'
```

### Vendor Selection Functions

#### `initVendorSelection()`
Initializes the vendor dropdown system with dynamic loading from manifest file.

#### `loadVendorOptions()`
Loads vendor options from `vendors-manifest.json` with fallback to static list.

#### `getSelectedVendor()`
Returns the selected vendor name.
```javascript
const vendor = getSelectedVendor();
// Returns: 'vendor1' | 'vendor2' | ''
```

#### `setSelectedVendor(vendorName)`
Programmatically selects a vendor.
```javascript
setSelectedVendor('vendor1'); // Selects Vendor1
```

#### `formatVendorName(vendorName)`
Formats vendor names for display (converts hyphenated to title case).
```javascript
formatVendorName('abc-company'); // Returns: "Abc Company"
```

### Project Images Functions (Unchanged)

#### `getUploadedImages()`
Returns array of uploaded project image sources.
```javascript
const projectImages = getUploadedImages();
// Returns: ['data:image/png;base64,...', ...]
```

#### `renderImages()`
Re-renders project images with management controls.

## 🎨 Styling

### Logo Dropdown Styling
```css
.logo-selection {
    text-align: center;
    margin: 20px 0;
}

#logoDropdown {
    padding: 12px 20px;
    font-size: 16px;
    border: 2px solid #0099ff;
    border-radius: 8px;
    background-color: white;
    transition: all 0.3s ease;
    min-width: 200px;
}

#logoDropdown:hover {
    border-color: #0077cc;
    box-shadow: 0 2px 8px rgba(0, 153, 255, 0.2);
}
```

### Project Images Styling (Existing)
- Card-based layout for image management
- Drag-and-drop visual indicators
- Responsive grid system

## 📝 Usage Workflow

### Adding New Company Logo

1. **Add Logo File**
   ```
   assets/sta-logo/newcompany-logo.png
   ```

2. **Update HTML Dropdown**
   ```html
   <option value="newcompany">New Company</option>
   ```

3. **Done!** The system automatically:
   - Generates correct file path
   - Handles display and storage
   - Includes in quotation generation

### Using in Quotation Generation

The system automatically:
- Uses selected logo for all quotation pages
- Falls back to default logo if none selected
- Maintains logo consistency across document
- Handles missing file errors gracefully

### Project Images Integration

The uploaded project images are used for:
- First image → Main image in quotation page 2
- Additional images → Individual pages in sequence
- Maintains user-defined order
- Supports reordering and management

## 🚀 Benefits of New Structure

### ✅ Clear Separation
- **Logo**: Company branding (single selection)
- **Images**: Project content (multiple upload)

### ✅ Scalability
- Easy to add new company logos
- Dropdown automatically handles new options
- No JavaScript changes needed for new logos

### ✅ User Experience
- Clear purpose for each section
- Intuitive dropdown selection
- Professional image management

### ✅ Maintainability
- Consistent file naming
- Centralized logo storage
- Error handling for missing files

### ✅ Integration
- Seamless quotation generation
- Proper fallback mechanisms
- Cross-section data sharing

## 🔄 Migration Notes

### Changes Made
1. **Logo Selection**: Buttons → Dropdown
2. **Image Upload**: Moved to project description
3. **File Structure**: `images/` → `assets/sta-logo/`
4. **JavaScript**: Modular functions for each system

### Backward Compatibility
- Quotation generation works with new system
- File paths automatically updated
- Error handling for missing assets

This reorganized structure provides clearer separation of concerns and better user experience! 🎉