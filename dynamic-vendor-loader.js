// ========================================
// DYNAMIC VENDOR LOADER (Advanced Version)
// ========================================
// This function would scan the assets/vendor-logo folder dynamically
// Note: In browsers, you cannot directly read folder contents due to security restrictions
// This is a server-side approach or requires a manifest file

// Option 1: Using a manifest file approach
function loadVendorsFromManifest() {
    // Create a vendors-manifest.json file with list of available vendors
    fetch('assets/vendor-logo/vendors-manifest.json')
        .then(response => response.json())
        .then(vendors => {
            populateVendorDropdown(vendors);
        })
        .catch(error => {
            console.warn('Vendors manifest not found, using fallback list');
            loadVendorOptions(); // Use static list as fallback
        });
}

// Option 2: Server-side directory listing (PHP example)
function loadVendorsFromServer() {
    fetch('api/get-vendors.php')
        .then(response => response.json())
        .then(vendors => {
            populateVendorDropdown(vendors);
        })
        .catch(error => {
            console.error('Failed to load vendors from server:', error);
            loadVendorOptions(); // Use static list as fallback
        });
}

// Populate dropdown with vendor list
function populateVendorDropdown(vendors) {
    const dropdown = document.getElementById('vendorDropdown');
    if (!dropdown) return;
    
    // Clear existing options
    dropdown.innerHTML = '<option value="">-- Select Vendor --</option>';
    
    // Add vendor options
    vendors.forEach(vendor => {
        const option = document.createElement('option');
        option.value = vendor.replace('-logo.png', '');
        option.textContent = formatVendorName(vendor.replace('-logo.png', ''));
        dropdown.appendChild(option);
    });
}

// Example vendors-manifest.json structure:
/*
{
    "vendors": [
        "vendor1-logo.png",
        "vendor2-logo.png", 
        "vendor3-logo.png",
        "abc-company-logo.png",
        "xyz-corp-logo.png"
    ]
}
*/

// Example PHP script (get-vendors.php):
/*
<?php
header('Content-Type: application/json');
$vendorDir = '../assets/vendor-logo/';
$vendors = [];

if (is_dir($vendorDir)) {
    $files = scandir($vendorDir);
    foreach ($files as $file) {
        if (pathinfo($file, PATHINFO_EXTENSION) === 'png' && strpos($file, '-logo') !== false) {
            $vendors[] = str_replace('-logo.png', '', $file);
        }
    }
}

echo json_encode($vendors);
?>
*/