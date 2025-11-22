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

// Function to get selected logo (for external use)
function getSelectedLogo() {
    const container = document.getElementById('logoContainer');
    return container ? container.dataset.selectedLogo : '';
}

// Function to programmatically set logo
function setSelectedLogo(logoName) {
    const dropdown = document.getElementById('logoDropdown');
    if (dropdown) {
        dropdown.value = logoName;
        dropdown.dispatchEvent(new Event('change'));
    }
}

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
        
        if (!selectedValue) {
            // Clear container if no selection
            container.innerHTML = '';
            container.dataset.selectedVendor = '';
            return;
        }
        
        // Generate image path and display name
        const imagePath = `assets/vendor-logo/${selectedValue}-logo.png`;
        const displayName = selectedValue.toUpperCase();
        
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
                {id: 'vendor1', name: 'Tech Solutions Ltd', filename: 'vendor1-logo.png'},
                {id: 'vendor2', name: 'Global Systems Inc', filename: 'vendor2-logo.png'},
                {id: 'vendor3', name: 'Advanced Engineering Co', filename: 'vendor3-logo.png'}
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

// Get selected vendor (for external use)
function getSelectedVendor() {
    const container = document.getElementById('vendorContainer');
    return container ? container.dataset.selectedVendor : '';
}

// Set vendor programmatically
function setSelectedVendor(vendorName) {
    const dropdown = document.getElementById('vendorDropdown');
    if (dropdown) {
        dropdown.value = vendorName;
        dropdown.dispatchEvent(new Event('change'));
    }
}

// Initialize vendor selection
initVendorSelection();


// Offer type handling - using contenteditable divs
// No buttons needed as users type directly into offer lines

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

let uploadedImages = []; // Store image data
let imageIdCounter = 0;

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

// Helper function to get images for quotation generation
function getUploadedImages() {
    return uploadedImages.map(img => img.src);
}


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
  
  // Get uploaded project images
  const uploadedImageSrcs = getUploadedImages(); // Get array of image sources
  
  console.log("Offer text:", offerText);
  console.log("Uploaded images:", uploadedImageSrcs.length);
  console.log("Selected logo:", getSelectedLogo());

  // BUILD CLEAN ITEM TABLE DATA (sanitize)
  // We will read rows from your visible table, but ignore any buttons and contenteditable attributes.
  function buildCleanTableRows(){
    const table = document.querySelector('.table-container .table-action table');
    if (!table) return {theadHtml:'', pages: []};
    // get header labels
    const ths = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());
    // collect all tbody rows (combine firstRow + itemRows + gstSection ignoring gst rows)
    // Identify the actual item rows by selecting tbody rows that are not in #gstSection
    const allTbodyRows = Array.from(table.querySelectorAll('tbody')).flatMap(tb => Array.from(tb.querySelectorAll('tr')));
    const gstSection = document.getElementById('gstSection');
    const itemRows = allTbodyRows.filter(tr => !gstSection || !gstSection.contains(tr));

    // map rows to text cells
    const rowsData = itemRows.map(tr => {
      const cells = Array.from(tr.querySelectorAll('td')).map(td => {
        // read text only (ignore buttons)
        return td.textContent ? td.textContent.trim() : '';
      });
      return cells;
    });

    // Build a clean thead HTML
    const theadHtml = '<thead><tr>' + ths.map(h => `<th>${escape(h)}</th>`).join('') + '</tr></thead>';

    return { theadHtml, rowsData };
  }

  const { theadHtml, rowsData } = buildCleanTableRows();

  // PAGINATE table rows into pages - assume approx N rows per page
  // Using a fixed rows-per-page is simpler and effective: (depends on your font size; 18 is a good default)
  const rowsPerPage = 18;
  const tablePagesHtml = [];
  for (let i=0;i<rowsData.length;i+=rowsPerPage){
    const chunk = rowsData.slice(i,i+rowsPerPage);
    const tbodyHtml = chunk.map(row => '<tr>' + row.map(cell => `<td>${escape(cell)}</td>`).join('') + '</tr>').join('');
    const pageTable = `<table class="clean-table">${theadHtml}<tbody>${tbodyHtml}</tbody></table>`;
    tablePagesHtml.push(pageTable);
  }
  // If no item rows exist, produce one empty empty table page to keep flow
  if (tablePagesHtml.length === 0){
    tablePagesHtml.push(`<table class="clean-table">${theadHtml}<tbody><tr><td colspan="${(theadHtml.match(/<th/g)||[]).length}">(No items)</td></tr></tbody></table>`);
  }

  // PRICE SCHEDULE HTML (clean)
  const priceTableNode = document.getElementById('priceTable');
  let priceHtml = '';
  if (priceTableNode){
    // sanitize price table: take only text cells
    const rows = Array.from(priceTableNode.querySelectorAll('tr')).map(r=>{
      const tds = Array.from(r.querySelectorAll('td,th'));
      return '<tr>' + tds.map(td=>`<td>${escape(td.textContent.trim())}</td>`).join('') + '</tr>';
    }).join('');
    priceHtml = `<table class="clean-table"><tbody>${rows}</tbody></table>`;
  } else {
    priceHtml = `<div>(No price schedule)</div>`;
  }

  // COMPANY DETAILS (clean)
  const companyNode = document.querySelector('.company-info-box');
  const companyHtml = companyNode ? `<div style="font-size:12px;line-height:1.4">${escape(companyNode.textContent.trim())}</div>` : '';

  // Build pages HTML string
  let pagesHtml = '';

  // PAGE 1 - big logo only (centered)
  pagesHtml += `
    <div class="a4page page-logo-only">
      <div class="header" style="visibility:hidden"></div>
      <div class="content">
        <img src="${getSmallLogoSrc()}" alt="logo">
      </div>
      <div class="footer" style="visibility:hidden"></div>
    </div>
  `;

  // PAGE 2 - offer + center image + header/footer
  pagesHtml += `
    <div class="a4page page-offer">
      <div class="header">
        <div class="left"><img class="logo-small" src="${getSmallLogoSrc()}" alt="logo"></div>
        <div class="center">Quotation</div>
        <div class="right">${headerRightHTML}</div>
      </div>
      <div class="content">
        <div class="offer-title">${escape(offerText)}</div>
        <div class="center-img">${ uploadedImageSrcs.length > 0 ? `<img src="${uploadedImageSrcs[0]}" alt="main-image">` : `<div style="color:#888">No Image</div>` }</div>
      </div>
      <div class="footer">
        <div>Purchaser: ${escape(purchaser || '')} &nbsp; | &nbsp; Quote No: ${escape(quoteNo)}</div>
        <div>Project Name: ${escape(projectName)} &nbsp; | &nbsp; Rev No: ${escape(revNo)} &nbsp; | &nbsp; Date: ${escape(quoteDate)}</div>
        <div>Page 2 / TOTAL</div>
      </div>
    </div>
  `;

  // UPLOADED IMAGE PAGES (one page per uploaded image, starting from second image if multiple)
  const additionalImages = uploadedImageSrcs.slice(1); // Skip first image (used in page 2)
  additionalImages.forEach((imageSrc, idx)=>{
    pagesHtml += `
      <div class="a4page page-project">
        <div class="header">
          <div class="left"><img class="logo-small" src="${getSmallLogoSrc()}" alt="logo"></div>
          <div class="center">Project Description</div>
          <div class="right">${headerRightHTML}</div>
        </div>
        <div class="content">
          <div class="img-block"><img src="${imageSrc}" alt="uploaded-image-${idx + 2}"></div>
        </div>
        <div class="footer">
          <div>Purchaser: ${escape(purchaser || '')} &nbsp; | &nbsp; Quote No: ${escape(quoteNo)}</div>
          <div>Project Name: ${escape(projectName)} &nbsp; | &nbsp; Date: ${escape(quoteDate)}</div>
          <div>Page ${3 + idx} / TOTAL</div>
        </div>
      </div>
    `;
  });

  // ITEM TABLE PAGES (we already created tablePagesHtml chunks)
  // Item pages start after page1,page2 and uploaded images (excluding first image used in page 2)
  const itemStartPageIndex = 3 + additionalImages.length;
  tablePagesHtml.forEach((tblHtml, idx)=>{
    const pageNumber = itemStartPageIndex + idx;
    pagesHtml += `
      <div class="a4page page-table">
        <div class="header">
          <div class="left"><img class="logo-small" src="${getSmallLogoSrc()}" alt="logo"></div>
          <div class="center">Item List</div>
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
          <div>Page ${pageNumber} / TOTAL</div>
        </div>
      </div>
    `;
  });

  // Price schedule page (single)
  const pricePageIndex = itemStartPageIndex + tablePagesHtml.length;
  pagesHtml += `
    <div class="a4page page-fulltext">
      <div class="header">
        <div class="left"><img class="logo-small" src="${getSmallLogoSrc()}" alt="logo"></div>
        <div class="center">Price Schedule & Terms</div>
        <div class="right">${headerRightHTML}</div>
      </div>
      <div class="content">
        ${priceHtml}
      </div>
      <div class="footer">
        <div>Purchaser: ${escape(purchaser || '')} &nbsp; | &nbsp; Quote No: ${escape(quoteNo)}</div>
        <div>Project: ${escape(projectName)} &nbsp; | &nbsp; Date: ${escape(quoteDate)}</div>
        <div>Page ${pricePageIndex} / TOTAL</div>
      </div>
    </div>
  `;

  // Company details page (final)
  const companyPageIndex = pricePageIndex + 1;
  pagesHtml += `
    <div class="a4page page-fulltext">
      <div class="header">
        <div class="left"><img class="logo-small" src="${getSmallLogoSrc()}" alt="logo"></div>
        <div class="center">Company Details</div>
        <div class="right">${headerRightHTML}</div>
      </div>
      <div class="content">
        ${companyHtml}
      </div>
      <div class="footer">
        <div>Purchaser: ${escape(purchaser || '')} &nbsp; | &nbsp; Quote No: ${escape(quoteNo)}</div>
        <div>Project: ${escape(projectName)} &nbsp; | &nbsp; Date: ${escape(quoteDate)}</div>
        <div>Page ${companyPageIndex} / TOTAL</div>
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
        </head>
        <body>
          <div class="topbar">
            <div class="title">Quotation — Preview</div>
            <div class="controls preview-actions">
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
              pages.forEach((p, idx)=>{
                // replace any "TOTAL" placeholders in footers
                const foot = p.querySelector('.footer');
                if (foot) foot.innerHTML = foot.innerHTML.replace('/ TOTAL','/ ' + total);
                // also replace Page ... if they contain 'Page X / TOTAL' template
                if (foot) {
                  foot.innerHTML = foot.innerHTML.replace(/Page \\s*(\\d+)\\s*\\/\\s*TOTAL/, 'Page ' + (idx+1) + ' / ' + total);
                }
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
                for (let i=0;i<pages.length;i++){
                  const page = pages[i];
                  // render the page separately
                  const canvas = await html2canvas(page, { scale: 2, useCORS:true, backgroundColor:'#ffffff' });
                  const imgData = canvas.toDataURL('image/png');
                  const imgWidth = 210;
                  const imgHeight = (canvas.height * imgWidth) / canvas.width;
                  if (i > 0) pdf.addPage();
                  pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
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