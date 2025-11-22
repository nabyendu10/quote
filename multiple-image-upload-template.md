# Multiple Image Upload System Template

## 📋 Overview
A comprehensive image upload system that supports multiple file selection, drag-and-drop reordering, and individual image management with preview functionality.

## 🎯 Features

### ✅ Multiple File Upload
- Select multiple images at once
- Add more images to existing collection
- Support for common image formats (JPG, PNG, GIF, WebP)
- File size validation (2MB per image)

### ✅ Image Management
- **Preview**: Thumbnail preview of each uploaded image
- **Remove**: Delete individual images from collection
- **Reorder**: Change sequence using buttons or drag-and-drop
- **Information**: Display file name, size, and position

### ✅ User Interface
- **Visual Feedback**: Hover effects and drag indicators
- **Responsive Design**: Adapts to different screen sizes
- **Clear All**: Batch remove all images
- **Counter**: Shows number of selected images

## 🚀 Implementation

### HTML Structure
```html
<div class="upload-area">
    <h2>Upload Images:</h2>
    <input type="file" id="imageUpload" accept="image/*" multiple>
    <h6>(Max size: 2MB per image | Multiple files supported)</h6>
    <button id="clearAllImages" class="clear-btn">Clear All Images</button>
</div>
<div class="preview-area">
    <div id="imageContainer" class="image-container">
        <!-- Images will be dynamically added here -->
    </div>
</div>
```

### Key CSS Classes
```css
.image-container          /* Flex container for image cards */
.image-card              /* Individual image wrapper */
.image-preview           /* Image thumbnail container */
.image-info              /* File information display */
.image-controls          /* Action buttons container */
.move-btn               /* Reorder buttons */
.remove-btn             /* Delete button */
.dragging               /* Drag state styling */
.drag-over              /* Drop target highlighting */
```

## 🔧 JavaScript API

### Core Functions

#### `renderImages()`
Re-renders all images in the container with current order and controls.

#### `addImageEventListeners(card, imageId, index)`
Attaches all event handlers to an image card:
- Remove button click
- Move up/down buttons
- Drag and drop functionality

#### `removeImage(imageId)`
Removes an image from the collection by ID.

#### `moveImage(fromIndex, toIndex)`
Moves an image from one position to another.

#### `getUploadedImages()`
Returns array of image sources in current order for external use.

### Data Structure
```javascript
let uploadedImages = [
    {
        id: 1,           // Unique identifier
        file: File,      // Original file object
        name: "img.jpg", // File name
        size: 1024000,   // File size in bytes
        src: "data:..."  // Base64 data URL
    }
];
```

## 🎨 Styling Features

### Visual States
- **Default**: Clean card layout with subtle shadow
- **Hover**: Elevated appearance with increased shadow
- **Dragging**: Semi-transparent with rotation effect
- **Drop Target**: Blue border and background highlight

### Button States
- **Move buttons**: Disabled when at list boundaries
- **Remove button**: Red color with hover effect
- **File input**: Dashed border with blue accent

### Responsive Design
- **Flex Layout**: Automatic wrapping for different screen sizes
- **Card Sizing**: Consistent dimensions with content adaptation
- **Gap Management**: Proper spacing between elements

## 📱 User Experience

### Interaction Methods

#### File Selection
1. **Click** input field to open file dialog
2. **Select multiple** images using Ctrl/Cmd+click
3. **Add more** images without losing existing ones

#### Reordering
1. **Button Method**: Use ↑/↓ arrows to move images
2. **Drag & Drop**: Drag image cards to desired positions
3. **Visual Feedback**: Real-time position indicators

#### Management
1. **Individual Remove**: ✕ button on each image
2. **Bulk Clear**: "Clear All Images" button with confirmation
3. **Information Display**: File name, size, and position

### Validation & Feedback
- **File Size**: 2MB limit with specific error messages
- **File Type**: Image format validation
- **Visual States**: Clear indication of actions and states
- **Confirmation**: Prompts for destructive actions

## 🔄 Integration with Quotation System

### Quotation Generation
- **First Image**: Used as main image in quotation page 2
- **Additional Images**: Each gets its own page in sequence
- **Ordering**: Respects user-defined sequence
- **Fallback**: Graceful handling when no images present

### Template Usage
```javascript
// Get images for quotation
const imageArray = getUploadedImages();

// Use first image for main display
const mainImage = imageArray[0] || null;

// Use remaining images for additional pages
const additionalImages = imageArray.slice(1);
```

## 🛠️ Customization Options

### File Validation
```javascript
// Modify size limit
if (file.size > 5 * 1024 * 1024) { // 5MB limit

// Add format restrictions
const allowedTypes = ['image/jpeg', 'image/png'];
if (!allowedTypes.includes(file.type)) {
```

### UI Styling
```css
/* Customize card appearance */
.image-card {
    min-width: 300px;    /* Larger cards */
    border-radius: 12px; /* More rounded corners */
}

/* Change color scheme */
.move-btn {
    background-color: #28a745; /* Green buttons */
}
```

### Behavior Modifications
```javascript
// Auto-save functionality
function renderImages() {
    // ... existing code ...
    localStorage.setItem('savedImages', JSON.stringify(uploadedImages));
}

// Load saved images on page load
function loadSavedImages() {
    const saved = localStorage.getItem('savedImages');
    if (saved) {
        uploadedImages = JSON.parse(saved);
        renderImages();
    }
}
```

## 🔍 Advanced Features

### Keyboard Navigation
- **Tab**: Navigate between controls
- **Enter/Space**: Activate focused buttons
- **Escape**: Cancel drag operations

### Accessibility
- **Alt text**: Descriptive image alternatives
- **ARIA labels**: Screen reader support
- **Focus management**: Proper tab order
- **High contrast**: Visible focus indicators

### Performance Optimization
- **Lazy loading**: Only render visible images
- **Memory management**: Cleanup unused resources
- **Debounced updates**: Prevent excessive re-renders

This template provides a complete, production-ready image management system! 🎉