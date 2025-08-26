document.addEventListener('DOMContentLoaded', function() {
    const downloadBtn = document.getElementById('downloadPdfBtn');
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            downloadExistingPDF();
        });
    }
});

function downloadExistingPDF() {
    const btn = document.getElementById('downloadPdfBtn');
    
    // Add loading state
    btn.classList.add('loading');
    btn.disabled = true;
    
    try {
        // Determine which PDF to download based on current page
        const currentPath = window.location.pathname;
        let pdfPath = '';
        let fileName = '';
        
        if (currentPath.includes('e-pilotship.html')) {
            pdfPath = '../PDF/E-Pilot-Ship-Specifications.pdf';
            fileName = 'E-Pilot-Ship-Specifications.pdf';
        } else if (currentPath.includes('e-tugpm3040e.html')) {
            pdfPath = '../PDF/PM3040E (1).pdf';
            fileName = 'PM3040E.pdf';
        } else if (currentPath.includes('e-tugpm3660hy.html')) {
            pdfPath = '../PDF/PM3660hy.pdf';
            fileName = 'PM3660hy.pdf';
        } else if (currentPath.includes('e-tugpm2925hy.html')) {
            pdfPath = '../PDF/PM2925hy.pdf';
            fileName = 'PM2925hy.pdf';
        } else if (currentPath.includes('e-tugpm2310hy.html')) {
            pdfPath = '../PDF/PM2310hy.pdf';
            fileName = 'PM2310hy.pdf';
        } else if (currentPath.includes('e-bargepm120e.html')) {
            pdfPath = '../PDF/PM120e.pdf';
            fileName = 'PM120e.pdf';
        } else if (currentPath.includes('e-bargepm120hyp.html')) {
            pdfPath = '../PDF/PM120hyp.pdf';
            fileName = 'PM120hyp.pdf';
        } else if (currentPath.includes('e-bargepm120hys.html')) {
            pdfPath = '../PDF/PM120hys.pdf';
            fileName = 'PM120hys.pdf';
        } else if (currentPath.includes('e-bargepm80be.html')) {
            pdfPath = '../PDF/PM80be.pdf';
            fileName = 'PM80BE.pdf';
        } else if (currentPath.includes('e-ctv26mhy.html')) {
            pdfPath = '../PDF/CTV26mhy.pdf';
            fileName = 'CTV 26m HY.pdf';
        } else if (currentPath.includes('e-ctv30mhy.html')) {
            pdfPath = '../PDF/CTV30mhy.pdf';
            fileName = 'CTV 26m HY.pdf';

        } else if (currentPath.includes('e-ferryeco20e.html')) {
            pdfPath = '../PDF/ECO20E.pdf';
            fileName = 'ECO20E.pdf';
        } else if (currentPath.includes('e-ferryeco38hy.html')) {
            pdfPath = '../PDF/ECO38HY.pdf';
            fileName = 'ECO38HY.pdf';

        } else if (currentPath.includes('azurecalculator.html')) {
        pdfPath = '../PDF/AzurE e-Ship Calculator Turtriol (1).pdf';
        fileName = 'AzurE e-Ship Calculator Turtriol.pdf';
        } else {
            // Default fallback
            pdfPath = '../PDF/E-Pilot-Ship-Specifications.pdf';
            fileName = 'Ship-Specifications.pdf';
            
        }
        
        // Create a temporary link element
        const link = document.createElement('a');
        
        // Set the path and filename dynamically
        link.href = pdfPath;
        link.download = fileName;
        
        // Hide the link
        link.style.display = 'none';
        
        // Add to DOM, click, then remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show success message (optional)
        showDownloadSuccess();
        
    } catch (error) {
        console.error('Error downloading PDF:', error);
        alert('Error downloading PDF. Please try again.');
    } finally {
        // Remove loading state after a short delay
        setTimeout(() => {
            btn.classList.remove('loading');
            btn.disabled = false;
        }, 1000);
    }
}

function showDownloadSuccess() {
    const btn = document.getElementById('downloadPdfBtn');
    const originalText = btn.innerHTML;
    
    // Temporarily show success message
    btn.innerHTML = `
        <svg class="download-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <polyline points="20,6 9,17 4,12" stroke="currentColor" stroke-width="2" fill="none"></polyline>
        </svg>
        Downloaded
    `;
    
    // Revert back to original text after 2 seconds
    setTimeout(() => {
        btn.innerHTML = originalText;
    }, 2000);
}