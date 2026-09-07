import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Télécharge un PDF vectoriel/haute résolution A4 direct sans passer par les boîtes d'impression
 * Calibré exactement à 210mm x 297mm (Norme internationale ISO 216 A4)
 */
export async function downloadDirectPDF(elementId, fileName = 'CV_Elsayf.pdf') {
  const element = document.getElementById(elementId);
  if (!element) {
    alert('Élément de CV introuvable.');
    return false;
  }

  // Sauvegarder le transform original pour ne pas le déformer pendant la capture
  const originalTransform = element.style.transform;
  const originalTransition = element.style.transition;
  const originalBoxShadow = element.style.boxShadow;
  
  element.style.transform = 'none';
  element.style.transition = 'none';
  element.style.boxShadow = 'none';

  try {
    // Rendu haute fidélité avec scale 2 pour une netteté cristalline
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      scrollX: 0,
      scrollY: 0,
      windowWidth: 794, // 210mm à 96 DPI
      windowHeight: 1123, // 297mm à 96 DPI
    });

    const imgData = canvas.toDataURL('image/png');

    // Créer le document PDF aux dimensions A4 exactes
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    // 210mm de large, 297mm de haut, démarre à x=0, y=0 (couvre 100% de la feuille sans marge)
    pdf.addImage(imgData, 'PNG', 0, 0, 210, 297, undefined, 'FAST');
    pdf.save(fileName);
    return true;
  } catch (err) {
    console.error('Erreur génération PDF:', err);
    alert("Erreur lors de la création du PDF direct. L'impression du navigateur va s'ouvrir comme alternative.");
    printViaIsolatedIframe(elementId, fileName.replace(/\.pdf$/, ''));
    return false;
  } finally {
    element.style.transform = originalTransform;
    element.style.transition = originalTransition;
    element.style.boxShadow = originalBoxShadow;
  }
}

/**
 * Impression via iframe isolée : élimine 100% des interférences du layout parent (Navbar, main pt-20, etc.)
 */
export function printViaIsolatedIframe(elementId, title = 'CV Elsayf') {
  const element = document.getElementById(elementId);
  if (!element) {
    window.print();
    return;
  }

  // Supprimer tout ancien iframe d'impression
  const existingIframe = document.getElementById('cv-isolated-print-frame');
  if (existingIframe) existingIframe.remove();

  const iframe = document.createElement('iframe');
  iframe.id = 'cv-isolated-print-frame';
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.style.zIndex = '-9999';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    window.print();
    return;
  }

  // Récupérer toutes les feuilles de styles Tailwind et polices
  let stylesHtml = '';
  document.querySelectorAll('link[rel="stylesheet"], style').forEach((node) => {
    stylesHtml += node.outerHTML;
  });

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      ${stylesHtml}
      <style>
        @page {
          size: A4 portrait !important;
          margin: 0mm !important;
        }
        *, *::before, *::after {
          box-sizing: border-box !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          width: 210mm !important;
          height: 297mm !important;
          min-height: 297mm !important;
          max-height: 297mm !important;
          background: #ffffff !important;
          color: #000000 !important;
          overflow: hidden !important;
        }
        #cv-clean-wrapper {
          width: 210mm !important;
          height: 297mm !important;
          min-height: 297mm !important;
          max-height: 297mm !important;
          margin: 0 !important;
          padding: 0 !important;
          transform: none !important;
          border: none !important;
          box-shadow: none !important;
          background: #ffffff !important;
          overflow: hidden !important;
        }
        #cv-clean-wrapper > div {
          transform: none !important;
          margin: 0 !important;
          box-shadow: none !important;
          border-radius: 0 !important;
        }
      </style>
    </head>
    <body>
      <div id="cv-clean-wrapper">
        ${element.innerHTML}
      </div>
    </body>
    </html>
  `);
  doc.close();

  setTimeout(() => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
  }, 450);
}
