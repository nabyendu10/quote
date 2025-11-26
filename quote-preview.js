(async function(){
  document.addEventListener('DOMContentLoaded', ()=>{
    const downloadBtn = document.getElementById('downloadPdfBtn');
    const closeBtn = document.getElementById('closeBtn');
    if(closeBtn) closeBtn.addEventListener('click', ()=> window.close());
    if(downloadBtn) downloadBtn.addEventListener('click', async ()=>{
      downloadBtn.disabled = true; downloadBtn.textContent = 'Building PDF...';
      try {
        await buildPDF();
      } catch(e){ alert('PDF failed: '+e); console.error(e); }
      downloadBtn.disabled = false; downloadBtn.textContent = 'Download PDF';
    });
  });

  async function buildPDF(){
    const pages = Array.from(document.querySelectorAll('.a4page'));
    if (!pages.length) { alert('No pages to export'); return; }
    
    // Small delay to ensure all content is rendered
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p','mm','a4');

    for (let i=0;i<pages.length;i++){
      const page = pages[i];
      
      // render each page separately at good resolution
      const canvas = await html2canvas(page, { 
        scale: 2,
        useCORS: true, 
        backgroundColor: '#ffffff',
        logging: false
      });
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    }
    pdf.save('quotation.pdf');
  }
})();