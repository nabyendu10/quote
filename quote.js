document.addEventListener("DOMContentLoaded", function (){

// logo selection

document.getElementById("btnSta").addEventListener("click", function() {
    document.getElementById("logoContainer").innerHTML =
        '<img src="images/1.png" alt="STA Logo">';
});

document.getElementById("btnStaipl").addEventListener("click", function() {
    document.getElementById("logoContainer").innerHTML =
        '<img src="images/2.png" alt="STAIPL Logo">';
});


//offer type

let offerButtons = document.querySelectorAll(".offerBtn");
let display = document.getElementById("offerDisplay");

offerButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        offerButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        
        document.getElementById("offerType").textContent = btn.dataset.offer;
    });
});

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

//upload image

document.getElementById("imageUpload").addEventListener("change", function () {

    const file = this.files[0];
    const preview = document.getElementById("imagePreview");

    if (!file) {
        preview.style.display = "none";
        return;
    }

    // File size check (Max 2MB)
    if (file.size > 2 * 1024 * 1024) {
        alert("File is too large! Maximum size is 2MB.");
        this.value = "";
        preview.style.display = "none";
        return;
    }

    // File type check
    if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image file.");
        this.value = "";
        preview.style.display = "none";
        return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = function (e) {
        preview.src = e.target.result;
        preview.style.display = "block";
    };
    reader.readAsDataURL(file);
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

// body image uplaod 

const canvas = document.getElementById('myCanvas');
const fileInput = document.getElementById('fileInput');
const uploadButton = document.getElementById('uploadButton');

uploadButton.addEventListener('click', () => {
    const files = fileInput.files;

    if (files.length > 0) {
        const file = files[0]; // Get the first file
        const reader = new FileReader();

        reader.onload = (e) => {
            // Image data is now in e.target.result
            const img = new Image();
            img.onload = () => {
                // Draw the image onto the canvas
                canvas.width = img.width;
                canvas.height = img.height;
                canvas.getContext('2d').drawImage(img, 0, 0);
            };
            img.src = e.target.result;
        };

        reader.readAsDataURL(file);
    }
});









// Generate QUotation

document.getElementById("generateQuoteBtn").addEventListener("click", async () => {
  // helpers
  const escape = s => (s||'').toString().replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  // get small logo src (from #logoContainer img if user selected)
  function getSmallLogoSrc(){
    const img = document.querySelector('#logoContainer img');
    if (img && img.src) return img.src;
    // fallback relative path to your images folder
    return 'images/1.png';
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

  // Offer text & Page 2 center image
  const offerText = document.getElementById('offerDisplay') ? document.getElementById('offerDisplay').textContent.trim() : '';
  const page2ImageSrc = (document.getElementById('imagePreview') && document.getElementById('imagePreview').src) ? document.getElementById('imagePreview').src : '';

  // Project images (fileInput) - object URLs
  const projectFiles = Array.from(document.getElementById('fileInput').files || []);
  const projectURLs = projectFiles.map(f => URL.createObjectURL(f));

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
        <div class="center-img">${ page2ImageSrc ? `<img src="${page2ImageSrc}" alt="center">` : `<div style="color:#888">No Image</div>` }</div>
      </div>
      <div class="footer">
        <div>Purchaser: ${escape(purchaser || '')} &nbsp; | &nbsp; Quote No: ${escape(quoteNo)}</div>
        <div>Project Name: ${escape(projectName)} &nbsp; | &nbsp; Rev No: ${escape(revNo)} &nbsp; | &nbsp; Date: ${escape(quoteDate)}</div>
        <div>Page 2 / TOTAL</div>
      </div>
    </div>
  `;

  // PROJECT IMAGE PAGES (one page per project image)
  projectURLs.forEach((url, idx)=>{
    pagesHtml += `
      <div class="a4page page-project">
        <div class="header">
          <div class="left"><img class="logo-small" src="${getSmallLogoSrc()}" alt="logo"></div>
          <div class="center">Project Description</div>
          <div class="right">${headerRightHTML}</div>
        </div>
        <div class="content">
          <div class="img-block"><img src="${url}" alt="project-${idx}"></div>
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
  // Item pages start after page1,page2 and project images
  const itemStartPageIndex = 3 + projectURLs.length;
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

  // Now open preview.html in a new window and write the assembled HTML into it.
  const previewUrl = 'preview.html';
  const w = window.open(previewUrl, '_blank');

  // wait until preview window can be written into
  function writeWhenReady(){
    try{
      const doc = w.document;
      doc.open();
      doc.write(`
        <!doctype html><html><head>
        <meta charset="utf-8"><title>Preview</title>
        <link rel="stylesheet" href="preview.css">
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

}); // end generate button listener
// ---------- END: Clean Preview + PDF flow ----------