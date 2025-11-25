// Global variables and functions
let uploadedImages = []; // Store image data
let imageIdCounter = 0;

// Helper function to get images for quotation generation
function getUploadedImages() {
    return uploadedImages.map(img => img.src);
}

// Logo selection functions
function getSelectedLogo() {
    const container = document.getElementById('logoContainer');
    return container ? container.dataset.selectedLogo : '';
}

function setSelectedLogo(logoName) {
    const dropdown = document.getElementById('logoDropdown');
    if (dropdown) {
        dropdown.value = logoName;
        dropdown.dispatchEvent(new Event('change'));
    }
}

// Vendor selection functions
function getSelectedVendor() {
    const container = document.getElementById('vendorContainer');
    return container ? container.dataset.selectedVendor : '';
}

function setSelectedVendor(vendorName) {
    const dropdown = document.getElementById('vendorDropdown');
    if (dropdown) {
        dropdown.value = vendorName;
        dropdown.dispatchEvent(new Event('change'));
    }
}

document.addEventListener("DOMContentLoaded", function (){

// ========================================
// DROPDOWN LOGO SELECTION SYSTEM
// ========================================
// Automatically scans assets/sta-logo folder and creates dropdown options
// Naming Convention: {companyname}-logo.png

function initDropdownLogoSelection() {
    const dropdown = document.getElementById('logoDropdown');
    const container = document.getElementById('logoContainer');
    
    console.log('Initializing logo selection, dropdown found:', !!dropdown, 'container found:', !!container);
    
    if (!dropdown || !container) {
        console.error('Logo dropdown or container not found');
        return;
    }
    
    dropdown.addEventListener('change', function() {
        console.log('Logo dropdown changed to:', this.value);
        const selectedValue = this.value;
        
        if (!selectedValue) {
            // Clear container if no selection
            container.innerHTML = '';
            container.dataset.selectedLogo = '';
            return;
        }
        
        // Generate image path and display name
        const imagePath = `assets/sta-logo/${selectedValue}-logo.png`;
        const displayName = selectedValue.toUpperCase();
        
        // Update logo container
        container.innerHTML = `<img src="${imagePath}" alt="${displayName} Logo">`;
        
        // Store selected logo for later use
        container.dataset.selectedLogo = selectedValue;
        
        console.log(`Logo selected: ${displayName}`);
        
        // Add error handling for missing images
        const img = container.querySelector('img');
        img.onerror = function() {
            container.innerHTML = `<div style="color: red; padding: 20px; text-align: center;">Logo not found: ${imagePath}</div>`;
            console.error(`Logo image not found: ${imagePath}`);
        };
    });
}

// Initialize dropdown logo selection
initDropdownLogoSelection();

// ========================================
// VENDOR SELECTION SYSTEM
// ========================================
// Dynamically scans assets/vendor-logo folder and populates dropdown
// Naming Convention: {vendor-name}-logo.png

function initVendorSelection() {
    const dropdown = document.getElementById('vendorDropdown');
    const container = document.getElementById('vendorContainer');
    
    console.log('Initializing vendor selection, dropdown found:', !!dropdown, 'container found:', !!container);
    
    if (!dropdown || !container) {
        console.error('Vendor dropdown or container not found');
        return;
    }
    
    // Simulate loading vendor files (in real scenario, you'd fetch from server)
    loadVendorOptions();
    
    dropdown.addEventListener('change', function() {
        console.log('Vendor dropdown changed to:', this.value);
        const selectedValue = this.value;
        const customUploadSection = document.getElementById('customVendorUpload');
        
        if (!selectedValue) {
            // Clear container if no selection
            container.innerHTML = '';
            container.dataset.selectedVendor = '';
            if (customUploadSection) customUploadSection.style.display = 'none';
            return;
        }
        
        // Check if 'Other' option is selected
        if (selectedValue === 'other') {
            // Show custom upload section
            if (customUploadSection) {
                customUploadSection.style.display = 'block';
            }
            container.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">Please upload a custom vendor logo</div>';
            container.dataset.selectedVendor = 'custom';
            return;
        }
        
        // Hide custom upload section for predefined vendors
        if (customUploadSection) {
            customUploadSection.style.display = 'none';
        }
        
        // Generate image path and display name
        const imagePath = `assets/vendor-logo/${selectedValue}-logo.png`;
        const displayName = selectedValue.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        
        // Update vendor container
        container.innerHTML = `<img src="${imagePath}" alt="${displayName} Logo">`;
        
        // Store selected vendor for later use
        container.dataset.selectedVendor = selectedValue;
        
        console.log(`Vendor selected: ${displayName}`);
        
        // Add error handling for missing images
        const img = container.querySelector('img');
        img.onerror = function() {
            container.innerHTML = `<div style="color: red; padding: 20px; text-align: center;">Vendor logo not found: ${imagePath}</div>`;
            console.error(`Vendor logo not found: ${imagePath}`);
        };
    });
}

// Load vendor options dynamically from manifest file
function loadVendorOptions() {
    const dropdown = document.getElementById('vendorDropdown');
    if (!dropdown) return;
    
    // Try to load from manifest file first
    console.log('Fetching vendors manifest...');
    fetch('assets/vendor-logo/vendors-manifest.json')
        .then(response => {
            console.log('Manifest fetch response status:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('Manifest data loaded:', data);
            populateVendorDropdown(data.vendors);
        })
        .catch(error => {
            console.warn('Vendors manifest not found, using static list:', error);
            // Fallback to static list
            const vendors = [
                {id: 'rockwell-automation', name: 'Rockwell Automation', filename: 'rockwell-automation-logo.png'},
                {id: 'other', name: 'Other (Upload Custom Logo)', filename: null}
            ];
            populateVendorDropdown(vendors);
        });
}

// Populate vendor dropdown with options
function populateVendorDropdown(vendors) {
    const dropdown = document.getElementById('vendorDropdown');
    if (!dropdown) {
        console.error('Dropdown not found in populateVendorDropdown');
        return;
    }
    
    console.log('Populating dropdown with vendors:', vendors);
    
    // Clear loading option
    dropdown.innerHTML = '<option value="">-- Select Vendor --</option>';
    
    // Add vendor options
    vendors.forEach(vendor => {
        const option = document.createElement('option');
        option.value = vendor.id;
        option.textContent = vendor.name;
        dropdown.appendChild(option);
        console.log(`Added vendor option: ${vendor.name} (${vendor.id})`);
    });
    
    console.log(`Loaded ${vendors.length} vendor options`);
}

// Format vendor name for display
function formatVendorName(vendorName) {
    return vendorName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Initialize vendor selection
initVendorSelection();

// Handle custom vendor logo upload
const uploadCustomVendorBtn = document.getElementById('uploadCustomVendorBtn');
const customVendorLogoInput = document.getElementById('customVendorLogo');
const vendorContainer = document.getElementById('vendorContainer');

if (uploadCustomVendorBtn && customVendorLogoInput && vendorContainer) {
    uploadCustomVendorBtn.addEventListener('click', function() {
        const file = customVendorLogoInput.files[0];
        
        if (!file) {
            alert('Please select a logo file first');
            return;
        }
        
        // Validate file size (2MB max)
        if (file.size > 2 * 1024 * 1024) {
            alert('File size exceeds 2MB. Please choose a smaller file.');
            return;
        }
        
        // Validate file type
        const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
        if (!validTypes.includes(file.type)) {
            alert('Invalid file type. Please upload PNG, JPG, or SVG files only.');
            return;
        }
        
        // Read and display the uploaded image
        const reader = new FileReader();
        reader.onload = function(e) {
            vendorContainer.innerHTML = `<img src="${e.target.result}" alt="Custom Vendor Logo">`;
            vendorContainer.dataset.selectedVendor = 'custom';
            vendorContainer.dataset.customLogo = e.target.result;
            console.log('Custom vendor logo uploaded successfully');
        };
        reader.readAsDataURL(file);
    });
}


// Offer type handling - using contenteditable divs
// No buttons needed as users type directly into offer lines

// ========================================
// BODY-BOX EXCEL PASTE FUNCTIONALITY
// ========================================
const bodyContent = document.getElementById('bodyContent');

if (bodyContent) {
    bodyContent.addEventListener('paste', function(e) {
        e.preventDefault();
        
        // Get pasted data
        const clipboardData = e.clipboardData || window.clipboardData;
        const pastedData = clipboardData.getData('text/html') || clipboardData.getData('text/plain');
        
        // Check if data contains tab-separated values (Excel format)
        const plainText = clipboardData.getData('text/plain');
        
        if (plainText && plainText.includes('\t')) {
            // Excel data detected - convert to HTML table
            const htmlTable = excelToHtmlTable(plainText);
            document.execCommand('insertHTML', false, htmlTable);
        } else if (pastedData) {
            // Regular HTML or text paste
            // Clean up the HTML to keep only safe tags
            const cleanedHtml = cleanPastedHtml(pastedData);
            document.execCommand('insertHTML', false, cleanedHtml);
        }
    });
}

// Convert Excel tab-separated data to HTML table
function excelToHtmlTable(data) {
    const rows = data.trim().split('\n');
    let html = '<table>';
    
    rows.forEach((row, index) => {
        const cells = row.split('\t');
        html += '<tr>';
        
        cells.forEach(cell => {
            // Use th for first row (header), td for others
            const tag = index === 0 ? 'th' : 'td';
            html += `<${tag}>${cell.trim()}</${tag}>`;
        });
        
        html += '</tr>';
    });
    
    html += '</table>';
    return html;
}

// Clean pasted HTML to keep only safe formatting
function cleanPastedHtml(html) {
    // Create a temporary div to parse HTML
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    // Remove script tags and other dangerous elements
    const scripts = temp.querySelectorAll('script, style, link');
    scripts.forEach(el => el.remove());
    
    // Get the cleaned HTML
    return temp.innerHTML;
}

// offer table

const addRevisionBtn = document.getElementById("addRevisionBtn");
const revBox = document.getElementById("revBox");

if (addRevisionBtn && revBox) {
    addRevisionBtn.addEventListener("click", function () {
        const newLine = document.createElement("div");
        newLine.textContent = "Revised date:";
        newLine.contentEditable = "true";
        revBox.appendChild(newLine);
    });
}

// ========================================
// MULTIPLE IMAGE UPLOAD WITH REORDERING
// ========================================

document.getElementById("imageUpload").addEventListener("change", function () {
    const files = Array.from(this.files);
    
    if (files.length === 0) return;
    
    files.forEach(file => {
        // File size check (Max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert(`File "${file.name}" is too large! Maximum size is 2MB.`);
            return;
        }
        
        // File type check
        if (!file.type.startsWith("image/")) {
            alert(`File "${file.name}" is not a valid image.`);
            return;
        }
        
        // Create image object
        const imageData = {
            id: ++imageIdCounter,
            file: file,
            name: file.name,
            size: file.size
        };
        
        // Read file and add to array
        const reader = new FileReader();
        reader.onload = function (e) {
            imageData.src = e.target.result;
            uploadedImages.push(imageData);
            renderImages();
        };
        reader.readAsDataURL(file);
    });
    
    // Clear input for next selection
    this.value = "";
});

function renderImages() {
    const container = document.getElementById("imageContainer");
    container.innerHTML = "";
    
    uploadedImages.forEach((imageData, index) => {
        const imageCard = document.createElement("div");
        imageCard.className = "image-card";
        imageCard.draggable = true;
        imageCard.dataset.imageId = imageData.id;
        
        imageCard.innerHTML = `
            <div class="image-preview">
                <img src="${imageData.src}" alt="${imageData.name}">
            </div>
            <div class="image-info">
                <div class="image-name">${imageData.name}</div>
                <div class="image-size">${(imageData.size / 1024).toFixed(1)} KB</div>
                <div class="image-position">Position: ${index + 1}</div>
            </div>
            <div class="image-controls">
                <button class="move-btn move-up" ${index === 0 ? 'disabled' : ''}>↑</button>
                <button class="move-btn move-down" ${index === uploadedImages.length - 1 ? 'disabled' : ''}>↓</button>
                <button class="remove-btn">✕</button>
            </div>
        `;
        
        // Add event listeners
        addImageEventListeners(imageCard, imageData.id, index);
        container.appendChild(imageCard);
    });
    
    // Update image count display
    updateImageCount();
}

function addImageEventListeners(card, imageId, index) {
    // Remove button
    card.querySelector('.remove-btn').addEventListener('click', () => {
        removeImage(imageId);
    });
    
    // Move up button
    card.querySelector('.move-up').addEventListener('click', () => {
        moveImage(index, index - 1);
    });
    
    // Move down button
    card.querySelector('.move-down').addEventListener('click', () => {
        moveImage(index, index + 1);
    });
    
    // Drag and drop
    card.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', imageId);
        card.classList.add('dragging');
    });
    
    card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
    });
    
    card.addEventListener('dragover', (e) => {
        e.preventDefault();
        card.classList.add('drag-over');
    });
    
    card.addEventListener('dragleave', () => {
        card.classList.remove('drag-over');
    });
    
    card.addEventListener('drop', (e) => {
        e.preventDefault();
        card.classList.remove('drag-over');
        
        const draggedId = parseInt(e.dataTransfer.getData('text/plain'));
        const draggedIndex = uploadedImages.findIndex(img => img.id === draggedId);
        const targetIndex = index;
        
        if (draggedIndex !== targetIndex) {
            moveImage(draggedIndex, targetIndex);
        }
    });
}

function removeImage(imageId) {
    uploadedImages = uploadedImages.filter(img => img.id !== imageId);
    renderImages();
}

function moveImage(fromIndex, toIndex) {
    if (toIndex < 0 || toIndex >= uploadedImages.length) return;
    
    const [movedImage] = uploadedImages.splice(fromIndex, 1);
    uploadedImages.splice(toIndex, 0, movedImage);
    renderImages();
}

function updateImageCount() {
    const uploadArea = document.querySelector('.upload-area h2');
    const count = uploadedImages.length;
    uploadArea.textContent = `Upload Images: ${count > 0 ? `(${count} selected)` : ''}`;
}

// Clear all images
document.getElementById('clearAllImages').addEventListener('click', () => {
    if (uploadedImages.length === 0) return;
    
    if (confirm(`Remove all ${uploadedImages.length} images?`)) {
        uploadedImages = [];
        renderImages();
    }
});


// Add Revision Button

// document.getElementById('addRevisionBtn').addEventListener('click', function() {
//     const rightCol = this.parentElement;
//     const newRevisionDiv = document.createElement('div');
//     newRevisionDiv.classList.add('line');
//     newRevisionDiv.innerHTML = `
//         <label>Revised Date:</label>
//         <input type="date">
//     `;
//     rightCol.insertBefore(newRevisionDiv, this);
// });


// TABLE MANAGEMENT

  const table = document.querySelector(".table-container table");
  const tbody = table ? table.querySelector("tbody") : null;
  const addRowBtn = document.getElementById("addRowBtn");
  const clearTableBtn = document.getElementById("clearTableBtn");

  if (!tbody) return;

  function refreshSerialNumbers() {
    const rows = tbody.querySelectorAll("tr");
    rows.forEach((row, index) => {
      const slCell = row.cells[0];
      if (slCell) {
        slCell.textContent = index + 1;
        slCell.contentEditable = "false";
      }
    });
  }

  function createRow() {
    const tr = document.createElement("tr");
    const headerCount = table.querySelectorAll("th").length;

    const slCell = document.createElement("td");
    slCell.contentEditable = "false";
    tr.appendChild(slCell);

    for (let i = 1; i < headerCount - 1; i++) {
      const td = document.createElement("td");
      td.contentEditable = "true";
      tr.appendChild(td);
    }

    const delCell = document.createElement("td");
    delCell.contentEditable = "false";

    const delBtn = document.createElement("button");
    delBtn.className = "delete-row-btn";
    delBtn.textContent = "🗑️";

    delCell.appendChild(delBtn);
    tr.appendChild(delCell);

    return tr;
  }

  addRowBtn.addEventListener("click", function (e) {
    e.preventDefault();
    tbody.appendChild(createRow());
    refreshSerialNumbers();
    updateGrandTotal();
  });

  clearTableBtn.addEventListener("click", function (e) {
    e.preventDefault();

    if (!confirm("Are you sure you want to clear the table?")) return;

    tbody.innerHTML = "";
    tbody.appendChild(createRow());
    refreshSerialNumbers();
    updateGrandTotal();
  });

  tbody.addEventListener("click", function (e) {
    const delBtn = e.target.closest(".delete-row-btn");
    const row = e.target.closest("tr");

    if (!row) return;

    if (delBtn || e.target.cellIndex === row.cells.length - 1) {
      row.remove();
      refreshSerialNumbers();
      updateGrandTotal();

      if (tbody.querySelectorAll("tr").length === 0) {
        tbody.appendChild(createRow());
        refreshSerialNumbers();
        updateGrandTotal();
      }
    }
  });

  document.addEventListener("input", function (e) {
    const row = e.target.closest("tr");
    if (!row) return;

    const cells = row.querySelectorAll("td");

    const qty = parseFloat(cells[4].textContent) || 0;
    const listPrice = parseFloat(cells[6].textContent) || 0;
    const maxDiscount = parseFloat(cells[7].textContent) || 0;
    let discount = parseFloat(cells[9].textContent) || 0;

    if (discount > maxDiscount) {
      discount = maxDiscount;
      cells[9].textContent = discount;
    }

    const unitPrice = listPrice * (1 - maxDiscount / 100);
    cells[8].textContent = unitPrice.toFixed(2);

    const finalUnitPrice = unitPrice * (1 - discount / 100);
    const total = qty * finalUnitPrice;
    cells[10].textContent = total.toFixed(2);

    updateGrandTotal();
  });

  // TAXABLE AMOUNT (No old total cell)

  function updateGrandTotal() {
    const totalCells = tbody.querySelectorAll("tr td:nth-child(11)");

    let taxableAmount = 0;
    totalCells.forEach((td) => {
      taxableAmount += parseFloat(td.textContent) || 0;
    });

    document.getElementById("gstTaxable").textContent = taxableAmount.toFixed(2);

    updateGST();
  }

  // GST CALCULATION

  function updateGST() {
    let taxable = parseFloat(document.getElementById("gstTaxable").textContent) || 0;
    let gstRate = parseFloat(document.getElementById("gstRate").value) || 0;
    let isInter = document.getElementById("isInterState").checked;

    let sgst = 0, cgst = 0, igst = 0;
    if (isInter) {
      igst = taxable * (gstRate / 100);
  
    } else {
      sgst = taxable * (gstRate / 200);
      cgst = taxable * (gstRate / 200);
    }

    let totalGST = sgst + cgst + igst;

    document.getElementById("sgstAmount").textContent = sgst.toFixed(2);
    document.getElementById("cgstAmount").textContent = cgst.toFixed(2);
    document.getElementById("igstAmount").textContent = igst.toFixed(2);
    document.getElementById("totalGST").textContent = totalGST.toFixed(2);
    document.getElementById("grandTotalWithGST").textContent =
      (taxable + totalGST).toFixed(2);
  }

  document.getElementById("gstRate").addEventListener("input", updateGST);
  document.getElementById("isInterState").addEventListener("change", updateGST);
  document.addEventListener("input", updateGST);

  refreshSerialNumbers();
  updateGrandTotal();
});


// Price Terms and Condition:

let subRowCount = 0;

document.getElementById("addSubRowBtn").addEventListener("click", function () {

    subRowCount++;

    const letter = String.fromCharCode(64 + subRowCount); // A, B, C...

    const newRow = document.createElement("tr");
    newRow.classList.add("sub-row");

    newRow.innerHTML = `
        <td class="sn">1${letter}</td>
        <td contenteditable="true"></td>
        <td contenteditable="true"></td>
        <td style="width:40px; text-align:center;">
            <button class="delete-subrow-btn">🗑️</button>
        </td>
    `;

    document.getElementById("subRows").appendChild(newRow);

    attachDeleteHandlers();
});

function attachDeleteHandlers() {
    document.querySelectorAll(".delete-subrow-btn").forEach(btn => {
        btn.onclick = function () {
            this.closest("tr").remove();
            renumberSubRows();
        };
    });
}

function renumberSubRows() {
    const rows = document.querySelectorAll("#subRows tr");
    subRowCount = rows.length;

    rows.forEach((row, index) => {
        const letter = String.fromCharCode(65 + index); // A, B, C...
        row.querySelector(".sn").textContent = "1" + letter;
    });
}

// Image upload is now handled by the multiple image upload system above
// Canvas functionality removed as images are handled differently

// ========================================
// GENERATE QUOTATION
// ========================================
document.getElementById("generateQuoteBtn").addEventListener("click", async () => {
  try {
    console.log("Generate Quotation button clicked!");
    
    // helpers
    const escape = s => (s||'').toString().replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  // get small logo src (from dropdown selection)
  function getSmallLogoSrc(){
    const selectedLogo = getSelectedLogo();
    if (selectedLogo) {
      return `assets/sta-logo/${selectedLogo}-logo.png`;
    }
    // fallback to first available logo
    return 'assets/sta-logo/sta-logo.png';
  }

  // get vendor logo src (from dropdown selection)
  function getVendorLogoSrc(){
    const selectedVendor = getSelectedVendor();
    if (selectedVendor) {
      return `assets/vendor-logo/${selectedVendor}-logo.png`;
    }
    return null; // No vendor selected
  }

  // Read header right lines (fixed as per your instruction)
  const headerRightHTML = `
    <div>www.startrackautomation.in</div>
    <div>8101274497</div>
    <div>startrackautomation@gmail.com</div>
  `;

  // Footer fields: attempt to read if there are inputs / placeholders
  const purchaser = (document.querySelector('.company-info-box .value') ? document.querySelector('.company-info-box .value').textContent.trim() : '') || '';
  // Try to read Quote No / Rev / Project / Date from page (if you later add fields give them ids: quoteNo, revNo, projectName, quoteDate)
  const quoteNo = (document.getElementById('quoteNo') && document.getElementById('quoteNo').value) ? document.getElementById('quoteNo').value : '';
  const revNo = (document.getElementById('revNo') && document.getElementById('revNo').value) ? document.getElementById('revNo').value : '';
  const projectName = (document.getElementById('projectName') && document.getElementById('projectName').value) ? document.getElementById('projectName').value : '';
  const quoteDate = (document.getElementById('quoteDate') && document.getElementById('quoteDate').value) ? document.getElementById('quoteDate').value : '';

  // Offer text from offer lines
  const offerLines = [
    document.getElementById('line1')?.textContent?.trim() || '',
    document.getElementById('line2')?.textContent?.trim() || '',
    document.getElementById('line3')?.textContent?.trim() || '',
    document.getElementById('line4')?.textContent?.trim() || ''
  ].filter(line => line.length > 0);
  const offerText = offerLines.join(' - ');
  
  // Format offer lines for better display
  function formatOfferLines() {
    const lines = offerLines.map((line, index) => {
      const labels = ['Offer Type', 'Type of Work', 'Description', 'Company Name'];
      return `<div class="offer-line-item">
        <span class="offer-label">${labels[index] || 'Details'}:</span>
        <span class="offer-value">${escape(line)}</span>
      </div>`;
    });
    return lines.join('');
  }
  
  // Get uploaded project images
  const uploadedImageSrcs = getUploadedImages(); // Get array of image sources
  
  console.log("Offer text:", offerText);
  console.log("Uploaded images:", uploadedImageSrcs.length);
  console.log("Selected logo:", getSelectedLogo());

  // BUILD CLEAN ITEM TABLE DATA (sanitize)
  // We will read rows from your visible table, but ignore any buttons and contenteditable attributes.
  function buildCleanTableRows(){
    const table = document.querySelector('.table-container .table-action table');
    if (!table) return {theadHtml:'', itemRowsData: [], gstHtml: ''};
    
    // get header labels (exclude last column which has buttons)
    const ths = Array.from(table.querySelectorAll('thead th'));
    const headerTexts = ths.slice(0, -1).map(th => th.textContent.trim()); // Remove last column (button column)
    
    // Get item rows (not in gstSection)
    const allTbodyRows = Array.from(table.querySelectorAll('tbody')).flatMap(tb => Array.from(tb.querySelectorAll('tr')));
    const gstSection = document.getElementById('gstSection');
    const itemRows = allTbodyRows.filter(tr => !gstSection || !gstSection.contains(tr));

    // map rows to text cells (exclude last column which has delete button)
    const itemRowsData = itemRows.map(tr => {
      const cells = Array.from(tr.querySelectorAll('td'));
      return cells.slice(0, -1).map(td => td.textContent ? td.textContent.trim() : ''); // Remove last column
    });

    // Build a clean thead HTML
    const theadHtml = '<thead><tr>' + headerTexts.map(h => `<th>${escape(h)}</th>`).join('') + '</tr></thead>';

    // Build GST section HTML
    let gstHtml = '';
    if (gstSection) {
      const gstRows = Array.from(gstSection.querySelectorAll('tr'));
      gstHtml = '<tbody class="gst-section-pdf">';
      gstRows.forEach(tr => {
        const cells = Array.from(tr.querySelectorAll('td'));
        if (cells.length > 0) {
          // Get the label cell
          const labelCell = cells[0];
          const labelText = labelCell.textContent.trim();
          
          // Get value cell
          const valueCell = cells[1];
          let valueText = '';
          
          if (valueCell) {
            // Check if it contains input
            const input = valueCell.querySelector('input');
            if (input) {
              valueText = input.value || '';
            } else {
              valueText = valueCell.textContent.trim();
            }
          }
          
          // Calculate colspan for half width
          const totalCols = headerTexts.length;
          const labelColspan = Math.floor(totalCols / 2);
          const valueColspan = totalCols - labelColspan;
          
          gstHtml += `<tr>
            <td colspan="${labelColspan}" class="gst-label">${escape(labelText)}</td>
            <td colspan="${valueColspan}" class="gst-value">${escape(valueText)}</td>
          </tr>`;
        }
      });
      gstHtml += '</tbody>';
    }

    return { theadHtml, itemRowsData, gstHtml };
  }

  const { theadHtml, itemRowsData, gstHtml } = buildCleanTableRows();

  // PAGINATE table rows into pages - assume approx N rows per page
  // Using a fixed rows-per-page is simpler and effective: (depends on your font size; 18 is a good default)
  const rowsPerPage = 18;
  const tablePagesHtml = [];
  for (let i=0;i<itemRowsData.length;i+=rowsPerPage){
    const chunk = itemRowsData.slice(i,i+rowsPerPage);
    const tbodyHtml = chunk.map(row => '<tr>' + row.map(cell => `<td>${escape(cell)}</td>`).join('') + '</tr>').join('');
    
    // Add GST section only to the last page
    const isLastPage = (i + rowsPerPage >= itemRowsData.length);
    const gstSectionHtml = isLastPage ? gstHtml : '';
    
    const pageTable = `<table class="clean-table">${theadHtml}<tbody>${tbodyHtml}</tbody>${gstSectionHtml}</table>`;
    tablePagesHtml.push(pageTable);
  }
  // If no item rows exist, produce one table with just GST section
  if (tablePagesHtml.length === 0){
    tablePagesHtml.push(`<table class="clean-table">${theadHtml}<tbody><tr><td colspan="${itemRowsData[0]?.length || 11}">(No items)</td></tr></tbody>${gstHtml}</table>`);
  }

  // PRICE SCHEDULE HTML (clean)
  const priceTableNode = document.getElementById('priceTable');
  let priceHtml = '';
  if (priceTableNode){
    // sanitize price table: take only text cells, exclude button cells
    const rows = Array.from(priceTableNode.querySelectorAll('tr')).map(r=>{
      const tds = Array.from(r.querySelectorAll('td,th'));
      // Filter out cells that contain buttons
      const filteredTds = tds.filter(td => !td.querySelector('button'));
      return '<tr>' + filteredTds.map(td=>`<td>${escape(td.textContent.trim())}</td>`).join('') + '</tr>';
    }).join('');
    priceHtml = `<table class="clean-table"><tbody>${rows}</tbody></table>`;
  } else {
    priceHtml = `<div>(No price schedule)</div>`;
  }

  // COMPANY DETAILS (clean table format)
  function formatCompanyDetails() {
    const companyNode = document.querySelector('.company-info-box');
    if (!companyNode) return '<div>No company details available</div>';
    
    const rows = Array.from(companyNode.querySelectorAll('tr'));
    const tableRows = rows.map(row => {
      const cells = Array.from(row.querySelectorAll('td'));
      if (cells.length >= 3) {
        const label = cells[0].textContent.trim();
        const value = cells[2].textContent.trim();
        return `<tr>
          <td class="company-label">${escape(label)}</td>
          <td class="company-colon">:</td>
          <td class="company-value">${escape(value)}</td>
        </tr>`;
      }
      return '';
    }).filter(row => row.length > 0).join('');
    
    return `<table class="company-details-table">
      <tbody>${tableRows}</tbody>
    </table>`;
  }
  
  const companyHtml = formatCompanyDetails();

  // Get project details content
  function getProjectDetailsContent() {
    const projectDetailsNode = document.querySelector('.table-box');
    let projectDetailsHtml = '';
    if (projectDetailsNode) {
      // Extract and clean project details
      const rows = Array.from(projectDetailsNode.querySelectorAll('.row .cell'));
      const leftContent = rows[0] ? rows[0].textContent.trim() : '';
      const rightContent = rows[1] ? rows[1].textContent.trim() : '';
      
      projectDetailsHtml = `
        <div class="project-details">
          <div class="project-left">
            <div class="project-content">${escape(leftContent)}</div>
          </div>
          <div class="project-right">
            <div class="project-content">${escape(rightContent)}</div>
          </div>
        </div>
      `;
    }
    return projectDetailsHtml;
  }

  // Build pages HTML string
  let pagesHtml = '';
  let pageCounter = 1;

  // PAGE 1 - NEW LAYOUT: Exact format from image
  
  // Get offer lines content
  function getOfferLinesContent() {
    const line1 = document.getElementById('line1');
    const line2 = document.getElementById('line2');
    const line3 = document.getElementById('line3');
    const line4 = document.getElementById('line4');
    const line5 = document.getElementById('line5');
    
    return {
      offerType: line1 ? line1.textContent.trim() : 'Technical Offer',
      typeOfWork: line2 ? line2.textContent.trim() : '',
      description: line3 ? line3.textContent.trim() : 'For',
      companyName: line4 ? line4.textContent.trim() : '',
      address: line5 ? line5.textContent.trim() : ''
    };
  }
  
  // Get project details from table
  function getProjectDetailsFormatted() {
    const projectDetailsNode = document.querySelector('.table-box');
    if (!projectDetailsNode) return { leftContent: '', rightContent: '' };
    
    const rows = Array.from(projectDetailsNode.querySelectorAll('.row'));
    if (rows.length === 0) return { leftContent: '', rightContent: '' };
    
    const row = rows[0];
    const cells = Array.from(row.querySelectorAll('.cell'));
    
    if (cells.length < 2) return { leftContent: '', rightContent: '' };
    
    const leftCell = cells[0];
    const rightCell = cells[1];
    
    // Get left content - remove excessive line breaks
    const leftContent = leftCell.innerHTML
      .replace(/<div[^>]*>/g, '\n')
      .replace(/<\/div>/g, '')
      .replace(/<br\s*\/?>/g, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/\n\s*\n/g, '\n')
      .trim();
    
    // Get right content (excluding button only, keep all revised dates)
    const rightClone = rightCell.cloneNode(true);
    const button = rightClone.querySelector('#addRevisionBtn');
    if (button) button.remove();
    
    const rightContent = rightClone.innerHTML
      .replace(/<div[^>]*>/g, '\n')
      .replace(/<\/div>/g, '')
      .replace(/<br\s*\/?>/g, '\n')
      .replace(/<button[^>]*>.*?<\/button>/g, '')
      .replace(/<[^>]+>/g, '')
      .replace(/\n\s*\n/g, '\n')
      .trim();
    
    return { leftContent, rightContent };
  }
  
  const offerData = getOfferLinesContent();
  const projectData = getProjectDetailsFormatted();
  
  pagesHtml += `
    <div class="a4page page-cover">
      <div class="cover-content">
        <!-- Logo at top -->
        <div class="cover-logo">
          <img src="${getSmallLogoSrc()}" alt="Company Logo">
        </div>
        
        <!-- Offer Type Title -->
        <div class="cover-title">${escape(offerData.offerType)}</div>
        
        <!-- Type of Work -->
        <div class="cover-work-type">${escape(offerData.typeOfWork)}</div>
        
        <!-- For -->
        <div class="cover-for">${escape(offerData.description)}</div>
        
        <!-- Company Name -->
        <div class="cover-company">${escape(offerData.companyName)}</div>
        
        <!-- Address -->
        ${offerData.address ? `<div class="cover-address">${escape(offerData.address)}</div>` : ''}
        
        <!-- Project Details Table -->
        <div class="cover-details-table">
          <table>
            <tr>
              <td class="details-left">
                ${projectData.leftContent.split('\n').map(line => escape(line)).join('<br>')}
              </td>
              <td class="details-right">
                ${projectData.rightContent.split('\n').map(line => escape(line)).join('<br>')}
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  `;
  pageCounter++;

  // VENDOR IMAGE PAGE (if vendor is selected, show before project images)
  const vendorLogoSrc = getVendorLogoSrc();
  if (vendorLogoSrc) {
    pagesHtml += `
      <div class="a4page page-vendor">
        <div class="header">
          <div class="left"><img class="logo-small" src="${getSmallLogoSrc()}" alt="logo"></div>
          <div class="center"></div>
          <div class="right">${headerRightHTML}</div>
        </div>
        <div class="content">
          <h2 class="page-main-title">Vendor Details</h2>
          <div class="vendor-block"><img src="${vendorLogoSrc}" alt="vendor-logo"></div>
        </div>
        <div class="footer">
          <div>Purchaser: ${escape(purchaser || '')} &nbsp; | &nbsp; Quote No: ${escape(quoteNo)}</div>
          <div>Project Name: ${escape(projectName)} &nbsp; | &nbsp; Date: ${escape(quoteDate)}</div>
          <div>Page ${pageCounter} / TOTAL</div>
        </div>
      </div>
    `;
    pageCounter++;
  }

  // PROJECT DESCRIPTION IMAGE PAGES (one page per uploaded image - full page each)
  uploadedImageSrcs.forEach((imageSrc, idx)=>{
    pagesHtml += `
      <div class="a4page page-project">
        <div class="header">
          <div class="left"><img class="logo-small" src="${getSmallLogoSrc()}" alt="logo"></div>
          <div class="center"></div>
          <div class="right">${headerRightHTML}</div>
        </div>
        <div class="content">
          <h2 class="page-main-title">Project Description - Image ${idx + 1}</h2>
          <div class="img-block"><img src="${imageSrc}" alt="project-image-${idx + 1}"></div>
        </div>
        <div class="footer">
          <div>Purchaser: ${escape(purchaser || '')} &nbsp; | &nbsp; Quote No: ${escape(quoteNo)}</div>
          <div>Project Name: ${escape(projectName)} &nbsp; | &nbsp; Date: ${escape(quoteDate)}</div>
          <div>Page ${pageCounter} / TOTAL</div>
        </div>
      </div>
    `;
    pageCounter++;
  });

  // BOM SECTION PAGE (if content exists)
  const bomContent = document.getElementById('bodyContent');
  if (bomContent && bomContent.innerHTML.trim() && bomContent.textContent.trim()) {
    const bomHtml = bomContent.innerHTML;
    pagesHtml += `
      <div class="a4page page-bom">
        <div class="header">
          <div class="left"><img class="logo-small" src="${getSmallLogoSrc()}" alt="logo"></div>
          <div class="center"></div>
          <div class="right">${headerRightHTML}</div>
        </div>
        <div class="content">
          <h2 class="page-main-title">BOM (Bill of Materials)</h2>
          <div class="bom-content">
            ${bomHtml}
          </div>
        </div>
        <div class="footer">
          <div>Purchaser: ${escape(purchaser || '')} &nbsp; | &nbsp; Quote No: ${escape(quoteNo)}</div>
          <div>Project Name: ${escape(projectName)} &nbsp; | &nbsp; Date: ${escape(quoteDate)}</div>
          <div>Page ${pageCounter} / TOTAL</div>
        </div>
      </div>
    `;
    pageCounter++;
  }

  // ITEM TABLE PAGES (each section on separate pages)
  tablePagesHtml.forEach((tblHtml, idx)=>{
    pagesHtml += `
      <div class="a4page page-table">
        <div class="header">
          <div class="left"><img class="logo-small" src="${getSmallLogoSrc()}" alt="logo"></div>
          <div class="center">Item List ${tablePagesHtml.length > 1 ? `(Page ${idx + 1} of ${tablePagesHtml.length})` : ''}</div>
          <div class="right">${headerRightHTML}</div>
        </div>
        <div class="content">
          <div style="width:100%;height:100%;overflow:hidden">
            ${tblHtml}
          </div>
        </div>
        <div class="footer">
          <div>Purchaser: ${escape(purchaser || '')} &nbsp; | &nbsp; Quote No: ${escape(quoteNo)}</div>
          <div>Project Name: ${escape(projectName)} &nbsp; | &nbsp; Date: ${escape(quoteDate)}</div>
          <div>Page ${pageCounter} / TOTAL</div>
        </div>
      </div>
    `;
    pageCounter++;
  });

  // PRICE SCHEDULE & TERMS PAGE (dedicated page)
  pagesHtml += `
    <div class="a4page page-price-schedule">
      <div class="header">
        <div class="left"><img class="logo-small" src="${getSmallLogoSrc()}" alt="logo"></div>
        <div class="center">Price Schedule & Commercial Terms</div>
        <div class="right">${headerRightHTML}</div>
      </div>
      <div class="content">
        <div class="price-section">
          <h2>Price Schedule with Commercial Terms and Conditions</h2>
          ${priceHtml}
        </div>
      </div>
      <div class="footer">
        <div>Purchaser: ${escape(purchaser || '')} &nbsp; | &nbsp; Quote No: ${escape(quoteNo)}</div>
        <div>Project: ${escape(projectName)} &nbsp; | &nbsp; Date: ${escape(quoteDate)}</div>
        <div>Page ${pageCounter} / TOTAL</div>
      </div>
    </div>
  `;
  pageCounter++;

  // COMPANY DETAILS PAGE (dedicated page)
  pagesHtml += `
    <div class="a4page page-company-details">
      <div class="header">
        <div class="left"><img class="logo-small" src="${getSmallLogoSrc()}" alt="logo"></div>
        <div class="center">Company Information</div>
        <div class="right">${headerRightHTML}</div>
      </div>
      <div class="content">
        <div class="company-section">
          <h2>Company Details</h2>
          <div class="company-details-container">
            ${companyHtml}
          </div>
        </div>
      </div>
      <div class="footer">
        <div>Purchaser: ${escape(purchaser || '')} &nbsp; | &nbsp; Quote No: ${escape(quoteNo)}</div>
        <div>Project: ${escape(projectName)} &nbsp; | &nbsp; Date: ${escape(quoteDate)}</div>
        <div>Page ${pageCounter} / TOTAL</div>
      </div>
    </div>
  `;

  // Now open quote-preview.html in a new window and write the assembled HTML into it.
  const previewUrl = 'quote-preview.html';
  const w = window.open(previewUrl, '_blank');

  // wait until preview window can be written into
  function writeWhenReady(){
    try{
      const doc = w.document;
      doc.open();
      doc.write(`
        <!doctype html><html><head>
        <meta charset="utf-8"><title>Preview</title>
        <link rel="stylesheet" href="quote-preview.css">
        <link rel="stylesheet" href="quote.css">
        <style>
          .page-control {
            position: absolute;
            top: 5px;
            right: 5px;
            background: rgba(255, 255, 255, 0.9);
            padding: 5px 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 12px;
            z-index: 10;
            display: flex;
            align-items: center;
            gap: 5px;
          }
          .page-control input[type="checkbox"] {
            cursor: pointer;
          }
          .page-control label {
            cursor: pointer;
            user-select: none;
          }
          .a4page {
            position: relative;
          }
          .a4page.excluded {
            opacity: 0.4;
            filter: grayscale(1);
          }
        </style>
        </head>
        <body>
          <div class="topbar">
            <div class="title">Quotation — Preview</div>
            <div class="controls preview-actions">
              <button id="selectAllBtn">Select All</button>
              <button id="deselectAllBtn">Deselect All</button>
              <button id="downloadPdfBtn">Download PDF</button>
              <button id="closeBtn">Close</button>
            </div>
          </div>
          <div id="pagesContainer" class="preview-wrap">
            ${pagesHtml}
          </div>

          <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
          <script>
            // replace TOTAL and update page counts now that DOM exists
            (function(){
              const pages = Array.from(document.querySelectorAll('.a4page'));
              const total = pages.length;
              
              // Add checkboxes to each page
              pages.forEach((p, idx)=>{
                // Add checkbox control
                const controlDiv = document.createElement('div');
                controlDiv.className = 'page-control';
                controlDiv.innerHTML = \`
                  <input type="checkbox" id="page-\${idx}" checked>
                  <label for="page-\${idx}">Include in PDF</label>
                \`;
                p.appendChild(controlDiv);
                
                // Add event listener to toggle page visibility
                const checkbox = controlDiv.querySelector('input');
                checkbox.addEventListener('change', function() {
                  if (this.checked) {
                    p.classList.remove('excluded');
                  } else {
                    p.classList.add('excluded');
                  }
                });
                
                // replace any "TOTAL" placeholders in footers
                const foot = p.querySelector('.footer');
                if (foot) {
                  foot.innerHTML = foot.innerHTML.replace('/ TOTAL','/ ' + total);
                  // also replace Page ... if they contain 'Page X / TOTAL' template
                  foot.innerHTML = foot.innerHTML.replace(/Page\\s*(\\d+)\\s*\\/\\s*TOTAL/g, 'Page ' + (idx+1) + ' / ' + total);
                }
              });

              // Select/Deselect All buttons
              document.getElementById('selectAllBtn').addEventListener('click', ()=> {
                pages.forEach((p, idx) => {
                  const checkbox = document.getElementById(\`page-\${idx}\`);
                  checkbox.checked = true;
                  p.classList.remove('excluded');
                });
              });

              document.getElementById('deselectAllBtn').addEventListener('click', ()=> {
                pages.forEach((p, idx) => {
                  const checkbox = document.getElementById(\`page-\${idx}\`);
                  checkbox.checked = false;
                  p.classList.add('excluded');
                });
              });

              document.getElementById('closeBtn').addEventListener('click', ()=> window.close());
              document.getElementById('downloadPdfBtn').addEventListener('click', async function(){
                this.disabled = true; this.textContent = 'Building PDF...';
                try{
                  await buildPDF();
                }catch(e){ alert('PDF error: '+e); console.error(e); }
                this.disabled = false; this.textContent = 'Download PDF';
              });

              async function buildPDF(){
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF('p','mm','a4');
                
                // Get only checked pages
                const selectedPages = pages.filter((p, idx) => {
                  const checkbox = document.getElementById(\`page-\${idx}\`);
                  return checkbox && checkbox.checked;
                });
                
                if (selectedPages.length === 0) {
                  alert('Please select at least one page to include in the PDF');
                  return;
                }
                
                // Helper function to prepare images without compression
                function prepareImage(imgSrc) {
                  return new Promise((resolve) => {
                    const img = new Image();
                    img.onload = function() {
                      // Use original image without compression
                      resolve(imgSrc);
                    };
                    img.onerror = function() {
                      resolve(imgSrc); // Fallback to original even if load fails
                    };
                    img.src = imgSrc;
                  });
                }
                
                // Use html2canvas for complex pages with high quality
                async function renderPageToCanvas(page) {
                  const canvas = await html2canvas(page, { 
                    scale: 1.5,  // Higher scale for better quality
                    useCORS: true, 
                    backgroundColor: '#ffffff',
                    logging: false,
                    allowTaint: true,
                    removeContainer: false,
                    imageTimeout: 0,
                    width: page.offsetWidth,
                    height: page.offsetHeight,
                    onclone: function(clonedDoc) {
                      // Clean up interactive elements but maintain visual quality
                      const buttons = clonedDoc.querySelectorAll('button, input, .delete-btn, .add-btn');
                      buttons.forEach(btn => btn.style.display = 'none');
                    }
                  });
                  
                  // Use PNG for better quality (no compression)
                  return canvas.toDataURL('image/png');
                }
                
                try {
                  for (let i = 0; i < selectedPages.length; i++) {
                    const page = selectedPages[i];
                    
                    if (i > 0) pdf.addPage();
                    
                    // Get page type for different handling
                    const isLogoPage = page.classList.contains('page-logo-only');
                    const isProjectPage = page.classList.contains('page-project');
                    const isVendorPage = page.classList.contains('page-vendor');
                    
                    if (isLogoPage) {
                      // Handle logo page with direct image insertion - no compression
                      const logoImg = page.querySelector('img');
                      if (logoImg && logoImg.src) {
                        const logoSrc = await prepareImage(logoImg.src);
                        // Center the logo with original quality
                        pdf.addImage(logoSrc, 'PNG', 60, 100, 90, 60);
                      }
                      
                      // Add minimal text
                      pdf.setFontSize(8);
                      pdf.setTextColor(150);
                      pdf.text('Page 1', 105, 280, { align: 'center' });
                      
                    } else if (isProjectPage) {
                      // Handle project image pages with direct image insertion - no compression
                      const projectImg = page.querySelector('.img-block img');
                      if (projectImg && projectImg.src) {
                        const imageSrc = await prepareImage(projectImg.src);
                        
                        // Add header
                        pdf.setFontSize(16);
                        pdf.setTextColor(44, 85, 48);
                        const headerText = page.querySelector('.header .center').textContent;
                        pdf.text(headerText, 105, 20, { align: 'center' });
                        
                        // Add image (centered, large) with original quality
                        pdf.addImage(imageSrc, 'PNG', 20, 30, 170, 200);
                        
                        // Add footer
                        pdf.setFontSize(8);
                        pdf.setTextColor(100);
                        const footerText = page.querySelector('.footer').textContent.trim();
                        pdf.text(footerText, 105, 280, { align: 'center' });
                      }
                      
                    } else if (isVendorPage) {
                      // Handle vendor image pages with direct image insertion - no compression
                      const vendorImg = page.querySelector('.vendor-block img');
                      if (vendorImg && vendorImg.src) {
                        const vendorSrc = await prepareImage(vendorImg.src);
                        
                        // Add header
                        pdf.setFontSize(16);
                        pdf.setTextColor(44, 85, 48);
                        const headerText = page.querySelector('.header .center').textContent;
                        pdf.text(headerText, 105, 20, { align: 'center' });
                        
                        // Add vendor image (centered, large) with original quality
                        pdf.addImage(vendorSrc, 'PNG', 40, 60, 130, 120);
                        
                        // Add footer
                        pdf.setFontSize(8);
                        pdf.setTextColor(100);
                        const footerText = page.querySelector('.footer').textContent.trim();
                        pdf.text(footerText, 105, 280, { align: 'center' });
                      }
                      
                    } else {
                      // For other pages, use canvas with high quality
                      const imgData = await renderPageToCanvas(page);
                      
                      const imgWidth = 210;
                      const imgHeight = 297; // Fixed A4 height to prevent aspect ratio issues
                      
                      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
                    }
                  }
                } catch (error) {
                  console.error('PDF generation error:', error);
                  alert('Error generating PDF. Please try again.');
                  return;
                }
                
                pdf.save('quotation.pdf');
              }
            })();
          </script>
        </body></html>
      `);
      doc.close();
    }catch(err){
      setTimeout(writeWhenReady, 150);
    }
  }
  writeWhenReady();

  } catch (error) {
    console.error("Error generating quotation:", error);
    alert("Error generating quotation: " + error.message + ". Check console for details.");
  }
});