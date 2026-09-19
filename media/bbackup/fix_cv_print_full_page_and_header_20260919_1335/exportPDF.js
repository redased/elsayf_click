import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

/**
 * Télécharge un PDF haute résolution A4 direct sans passer par les boîtes d'impression
 * Calibré exactement à 210mm x 297mm (Norme internationale ISO 216 A4)
 * Utilise le moteur de rendu SVG natif du navigateur (supporte 100% du CSS moderne : lab, oklch, grid, flex)
 */
export async function downloadDirectPDF(elementId, fileName = 'CV_Elsayf.pdf') {
  const element = document.getElementById(elementId);
  if (!element) {
    alert('Élément de CV introuvable.');
    return false;
  }

  // Sauvegarder les styles de prévisualisation (zoom, ombres)
  const originalTransform = element.style.transform;
  const originalTransition = element.style.transition;
  const originalBoxShadow = element.style.boxShadow;

  element.style.transform = 'none';
  element.style.transition = 'none';
  element.style.boxShadow = 'none';

  try {
    // Rendu haute fidélité x2 (environ 1588x2246 px pour A4 à 2x)
    const dataUrl = await toPng(element, {
      quality: 0.98,
      pixelRatio: 2,
      cacheBust: true,
      backgroundColor: '#ffffff',
    });

    // Créer le document PDF aux dimensions A4 exactes
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    // 210mm de large, 297mm de haut, démarre à (0, 0)
    pdf.addImage(dataUrl, 'PNG', 0, 0, 210, 297, undefined, 'FAST');
    pdf.save(fileName);
    return true;
  } catch (err) {
    console.error('Erreur génération PDF direct:', err);
    // En cas d'erreur de rendu direct, basculer sur l'impression isolée
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
  // Positionnée hors champ visible SANS la masquer par opacity:0.01 ou display:none
  // pour que le moteur d'impression Chromium / Edge ne la rende pas blanche
  iframe.style.position = 'fixed';
  iframe.style.left = '-9999px';
  iframe.style.top = '0';
  iframe.style.width = '210mm';
  iframe.style.height = '297mm';
  iframe.style.border = 'none';
  iframe.style.opacity = '1';
  iframe.style.visibility = 'visible';
  iframe.style.zIndex = '-9999';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    window.print();
    return;
  }

  // Récupérer toutes les feuilles de styles Tailwind et polices
  // en filtrant les styles parents qui masquent body * pour éviter de blanchir l'iframe
  let stylesHtml = '';
  document.querySelectorAll('link[rel="stylesheet"], style').forEach((node) => {
    if (node.tagName === 'STYLE' && (node.textContent.includes('visibility: hidden') || node.textContent.includes('body *'))) {
      return;
    }
    stylesHtml += node.outerHTML;
  });

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="utf-8">
      <base href="${typeof window !== 'undefined' ? window.location.origin : ''}/">
      <title>${title}</title>
      ${stylesHtml}
      <style>
        @page {
          size: 210mm 297mm !important;
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
          min-height: 297mm !important;
          background: #ffffff !important;
          color: #000000 !important;
          visibility: visible !important;
          opacity: 1 !important;
          overflow: visible !important;
        }
        /* GARANTIE FORMELLE : Visibilité et opacité totales sur l'ensemble de l'arbre DOM */
        body, body *, #cv-printable-area, #cv-printable-area *, #cv-clean-wrapper, #cv-clean-wrapper * {
          visibility: visible !important;
          opacity: 1 !important;
        }
        #cv-printable-area, #cv-clean-wrapper {
          width: 210mm !important;
          min-height: 297mm !important;
          margin: 0 !important;
          padding: 0 !important;
          transform: none !important;
          border: none !important;
          box-shadow: none !important;
          background: #ffffff !important;
          overflow: visible !important;
          position: static !important;
        }
        #cv-printable-area > div, #cv-clean-wrapper > div {
          transform: none !important;
          margin: 0 !important;
          box-shadow: none !important;
          border-radius: 0 !important;
        }
      </style>
    </head>
    <body>
      <div id="cv-printable-area" class="cv-clean-wrapper">
        ${element.innerHTML}
      </div>
    </body>
    </html>
  `);
  doc.close();

  // Déclencher l'impression dès que les polices et ressources sont prêtes
  const doPrint = () => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (e) {
      console.warn('Erreur print iframe, bascule sur window.print:', e);
      window.print();
    }
  };

  if (iframe.contentWindow?.document?.fonts) {
    iframe.contentWindow.document.fonts.ready.then(() => {
      setTimeout(doPrint, 250);
    }).catch(() => {
      setTimeout(doPrint, 350);
    });
  } else {
    setTimeout(doPrint, 350);
  }
}
