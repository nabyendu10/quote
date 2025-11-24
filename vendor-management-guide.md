# Vendor Management Guide

## 📋 Overview
Complete guide for managing vendor logos in the quotation system with dynamic dropdown population.

## 🗂️ File Organization

### Directory Structure
```
assets/vendor-logo/
├── vendors-manifest.json    # List of available vendors
├── vendor1-logo.png        # Individual vendor logos
├── vendor2-logo.png
├── abc-company-logo.png
└── xyz-corp-logo.png
```

### Manifest File Format
**File**: `assets/vendor-logo/vendors-manifest.json`
```json
{
  "vendors": [
    "vendor1-logo.png",
    "vendor2-logo.png", 
    "abc-company-logo.png",
    "xyz-corp-logo.png"
  ]
}
```

## 🚀 Adding New Vendors

### Method 1: Manual Addition

1. **Add Logo File**
   ```
   assets/vendor-logo/new-vendor-logo.png
   ```

2. **Update Manifest**
   ```json
   {
     "vendors": [
       "vendor1-logo.png",
       "vendor2-logo.png",
       "new-vendor-logo.png"
     ]
   }
   ```

3. **Refresh Page** - Dropdown automatically updates

### Method 2: Batch Addition

1. **Add Multiple Files**
   ```
   assets/vendor-logo/supplier-a-logo.png
   assets/vendor-logo/supplier-b-logo.png
   assets/vendor-logo/partner-xyz-logo.png
   ```

2. **Update Manifest in Bulk**
   ```json
   {
     "vendors": [
       "vendor1-logo.png",
       "vendor2-logo.png",
       "supplier-a-logo.png",
       "supplier-b-logo.png", 
       "partner-xyz-logo.png"
     ]
   }
   ```

## 🎨 Logo Requirements

### File Specifications
- **Format**: PNG (recommended) or JPG
- **Size**: Recommended 300x300px minimum
- **Aspect Ratio**: Square or 16:9 for best results
- **Background**: Transparent PNG preferred
- **File Size**: Under 1MB for optimal loading

### Naming Convention
- **Pattern**: `{vendor-name}-logo.png`
- **Examples**:
  - `abc-corporation-logo.png` → "Abc Corporation"
  - `xyz-tech-logo.png` → "Xyz Tech"  
  - `supplier-123-logo.png` → "Supplier 123"

## 💻 Technical Implementation

### JavaScript Functions

#### Dynamic Loading
```javascript
// Load from manifest file
function loadVendorOptions() {
    fetch('assets/vendor-logo/vendors-manifest.json')
        .then(response => response.json())
        .then(data => {
            const vendors = data.vendors.map(filename => 
                filename.replace('-logo.png', '')
            );
            populateVendorDropdown(vendors);
        })
        .catch(error => {
            console.warn('Using fallback vendor list');
            // Use static fallback
        });
}
```

#### Selection Handling
```javascript
// Handle vendor selection
dropdown.addEventListener('change', function() {
    const selectedVendor = this.value;
    const imagePath = `assets/vendor-logo/${selectedVendor}-logo.png`;
    
    // Display selected vendor logo
    container.innerHTML = `<img src="${imagePath}" alt="${formatVendorName(selectedVendor)} Logo">`;
});
```

### CSS Styling
```css
/* Vendor dropdown styling */
#vendorDropdown {
    padding: 12px 20px;
    font-size: 16px;
    border: 2px solid #111;
    border-radius: 8px;
    background-color: white;
    min-width: 200px;
}

/* Vendor container styling */
#vendorContainer {
    width: 600px;
    height: 400px;
    border: 2px solid #111;
    margin: 20px auto;
    display: flex;
    justify-content: center;
    align-items: center;
}
```

## 🔧 Advanced Features

### Server-Side Integration

For automatic folder scanning, use server-side scripts:

#### PHP Example
```php
<?php
header('Content-Type: application/json');
$vendorDir = '../assets/vendor-logo/';
$vendors = [];

if (is_dir($vendorDir)) {
    $files = scandir($vendorDir);
    foreach ($files as $file) {
        if (pathinfo($file, PATHINFO_EXTENSION) === 'png' && 
            strpos($file, '-logo') !== false) {
            $vendors[] = $file;
        }
    }
}

echo json_encode(['vendors' => $vendors]);
?>
```

#### Node.js Example
```javascript
const fs = require('fs');
const path = require('path');

app.get('/api/vendors', (req, res) => {
    const vendorDir = path.join(__dirname, 'assets/vendor-logo');
    
    fs.readdir(vendorDir, (err, files) => {
        if (err) return res.status(500).json({ error: 'Cannot read directory' });
        
        const vendors = files.filter(file => 
            file.endsWith('-logo.png') || file.endsWith('-logo.jpg')
        );
        
        res.json({ vendors });
    });
});
```

### Error Handling
```javascript
// Handle missing logo files
img.onerror = function() {
    container.innerHTML = `
        <div style="color: red; padding: 20px; text-align: center;">
            Vendor logo not found: ${imagePath}
            <br><small>Please check file exists in assets/vendor-logo/</small>
        </div>
    `;
};
```

## 📊 Usage Analytics

### Tracking Vendor Selection
```javascript
// Track vendor usage
function trackVendorSelection(vendorName) {
    console.log(`Vendor selected: ${vendorName} at ${new Date().toISOString()}`);
    
    // Send to analytics (Google Analytics, custom endpoint, etc.)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'vendor_selected', {
            'vendor_name': vendorName,
            'timestamp': Date.now()
        });
    }
}
```

## 🛠️ Maintenance

### Regular Tasks

1. **Clean up unused logos**: Remove files not in manifest
2. **Optimize images**: Compress logos for faster loading
3. **Update manifest**: Keep vendors-manifest.json current
4. **Validate links**: Check for broken image paths
5. **Performance monitoring**: Track loading times

### Backup Strategy
```bash
# Backup vendor logos
cp -r assets/vendor-logo/ backups/vendor-logos-$(date +%Y%m%d)/

# Backup manifest
cp assets/vendor-logo/vendors-manifest.json backups/
```

## 🚨 Troubleshooting

### Common Issues

1. **Dropdown shows "Loading Vendors"**
   - Check `vendors-manifest.json` exists
   - Verify file permissions
   - Check console for fetch errors

2. **Logo not displaying**
   - Verify filename matches manifest entry
   - Check file exists in folder
   - Confirm image file is valid

3. **Dropdown empty**
   - Check manifest JSON syntax
   - Verify fallback list in JavaScript
   - Check network requests in dev tools

### Debug Mode
```javascript
// Enable debug logging
const DEBUG_VENDORS = true;

if (DEBUG_VENDORS) {
    console.log('Available vendors:', vendors);
    console.log('Selected vendor:', selectedVendor);
    console.log('Image path:', imagePath);
}
```

This comprehensive vendor system provides scalable logo management! 🎉