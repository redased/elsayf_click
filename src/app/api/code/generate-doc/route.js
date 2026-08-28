import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

// Helper to generate Excel Uint8Array
function generateExcelBuffer(data) {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "Rapport Ventes");
    return XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
}

// Helper to generate styled Excel HTML Uint8Array
function generateExcelHtmlBuffer(data, styles) {
    const headerBg = styles?.headerBg || '#065f46';
    const headerColor = styles?.headerColor || '#ffffff';
    const rowStriping = styles?.rowStriping !== false;
    const highlightRows = styles?.highlightRows || [];

    const getRowStyle = (row, rIdx) => {
        if (rIdx === 0) {
            return `background-color: ${headerBg}; color: ${headerColor}; font-weight: bold;`;
        }
        
        // Highlight rows
        if (highlightRows && Array.isArray(highlightRows)) {
            for (const cond of highlightRows) {
                const colIdx = data[0].indexOf(cond.column);
                if (colIdx !== -1) {
                    const cellValStr = String(row[colIdx]).replace(/[\sDA%]/g, '');
                    const cellNum = Number(cellValStr);
                    const condVal = Number(cond.value);
                    
                    let match = false;
                    if (!isNaN(cellNum) && !isNaN(condVal)) {
                        if (cond.operator === '>') match = cellNum > condVal;
                        else if (cond.operator === '<') match = cellNum < condVal;
                        else if (cond.operator === '==') match = cellNum === condVal;
                        else if (cond.operator === '>=') match = cellNum >= condVal;
                        else if (cond.operator === '<=') match = cellNum <= condVal;
                    } else {
                        const strCell = String(row[colIdx]).trim().toLowerCase();
                        const strCond = String(cond.value).trim().toLowerCase();
                        if (cond.operator === '==') match = strCell === strCond;
                    }
                    
                    if (match) {
                        return `background-color: ${cond.bg || '#fef2f2'}; color: ${cond.color || '#991b1b'};`;
                    }
                }
            }
        }
        
        if (rowStriping && rIdx % 2 === 0) {
            return `background-color: #f9fafb;`;
        }
        return '';
    };

    let tableHtml = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<style>
  body { font-family: Arial, sans-serif; }
  table { border-collapse: collapse; width: 100%; margin-top: 10px; }
  th, td { border: 1px solid #d1d5db; padding: 8.5px; text-align: left; font-size: 10pt; }
</style>
</head>
<body>
  <table>
    <thead>
      <tr style="${getRowStyle(data[0], 0)}">
        ${data[0].map(cell => `<th style="border: 1px solid #d1d5db; padding: 8.5px;">${cell}</th>`).join('')}
      </tr>
    </thead>
    <tbody>
      ${data.slice(1).map((row, rIdx) => `
      <tr style="${getRowStyle(row, rIdx + 1)}">
        ${row.map(cell => `<td style="border: 1px solid #d1d5db; padding: 8.5px;">${cell}</td>`).join('')}
      </tr>`).join('')}
    </tbody>
  </table>
</body>
</html>`;

    return new TextEncoder().encode(tableHtml);
}

// Helper to generate Word HTML template Uint8Array
function generateWordBuffer(title, notes, tableData) {
    const htmlDoc = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset="utf-8">
<style>
body { font-family: 'Segoe UI', Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333; }
h1 { color: #1e3a8a; font-size: 22pt; border-b: 2px solid #1e3a8a; padding-bottom: 8px; margin-bottom: 20px; font-family: sans-serif; }
h2 { color: #2563eb; font-size: 16pt; margin-top: 25px; font-family: sans-serif; }
p { font-size: 11pt; margin-bottom: 12px; }
table { width: 100%; border-collapse: collapse; margin-top: 15px; }
th, td { border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 10pt; }
th { background-color: #f3f4f6; font-weight: bold; color: #111; }
.accent-box { background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; border-radius: 4px; margin: 20px 0; font-family: sans-serif; }
.footer { font-size: 9pt; color: #777; text-align: center; margin-top: 50px; border-top: 1px solid #eee; padding-top: 10px; }
</style>
</head>
<body>
<h1>${title}</h1>
<p>Ce document est généré de manière entièrement automatique par le script Python d'automatisation bureautique.</p>

<div class="accent-box">
  <strong>Note importante :</strong> ${notes}
</div>

<h2>Tableau récapitulatif des performances</h2>
<table>
  <thead>
    <tr>
      ${(tableData[0] || []).map(cell => `<th>${cell}</th>`).join('')}
    </tr>
  </thead>
  <tbody>
    ${tableData.slice(1).map(row => `
    <tr>
      ${row.map(cell => `<td>${cell}</td>`).join('')}
    </tr>`).join('')}
  </tbody>
</table>

<div class="footer">
  Fin du rapport d'automatisation d'El Sayf.
</div>
</body>
</html>`;

    return new TextEncoder().encode(htmlDoc);
}

const DEFAULT_EXCEL_DATA = [
    ["Région", "Ventes (Unités)", "Chiffre d'Affaires (DA)", "Satisfaction (%)"],
    ["Alger", 120, 144000, 94],
    ["Oran", 85, 102000, 89],
    ["Constantine", 72, 86400, 91],
    ["Annaba", 54, 64800, 87],
    ["Setif", 63, 75600, 90]
];

const DEFAULT_WORD_TITLE = "Rapport de Progrès - Formation El Sayf";
const DEFAULT_WORD_NOTES = "Ce document récapitule les données récoltées lors du TP pratique d'automatisation. Il est entièrement modifiable sous Microsoft Word.";
const DEFAULT_WORD_TABLE = [
    ["Étudiant", "Filière", "Note de TP (sur 20)", "Heures d'étude"],
    ["Alice", "Sciences", "15", "24"],
    ["Bob", "Lettres", "11", "10"],
    ["Charlie", "Médecine", "18", "45"],
    ["David", "Sciences", "14", "18"]
];

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') || 'excel';

        if (type === 'excel') {
            const buf = generateExcelBuffer(DEFAULT_EXCEL_DATA);
            return new Response(buf, {
                headers: {
                    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'Content-Disposition': 'attachment; filename="rapport_etudiants.xlsx"',
                    'Cache-Control': 'no-store, max-age=0'
                }
            });
        }

        if (type === 'word') {
            const buf = generateWordBuffer(DEFAULT_WORD_TITLE, DEFAULT_WORD_NOTES, DEFAULT_WORD_TABLE);
            return new Response(buf, {
                headers: {
                    'Content-Type': 'application/msword',
                    'Content-Disposition': 'attachment; filename="rapport_progres.doc"',
                    'Cache-Control': 'no-store, max-age=0'
                }
            });
        }

        return NextResponse.json({ error: 'Unsupported document type' }, { status: 400 });
    } catch (error) {
        console.error('[generate-doc GET]', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') || 'excel';
        
        let body = {};
        const contentType = request.headers.get('content-type') || '';
        
        if (contentType.includes('application/json')) {
            body = await request.json();
        } else {
            // Support form submissions (url-encoded or multipart)
            const formData = await request.formData();
            const payloadStr = formData.get('payload');
            if (payloadStr) {
                body = JSON.parse(payloadStr);
            }
        }

        if (type === 'excel') {
            const data = body.data || DEFAULT_EXCEL_DATA;
            const styles = body.styles;
            
            if (styles) {
                // Return styled HTML buffer for Excel
                const buf = generateExcelHtmlBuffer(data, styles);
                return new Response(buf, {
                    headers: {
                        'Content-Type': 'application/vnd.ms-excel',
                        'Content-Disposition': 'attachment; filename="rapport_analyse.xls"',
                        'Cache-Control': 'no-store, max-age=0'
                    }
                });
            } else {
                // Fallback to standard SheetJS binary xlsx
                const buf = generateExcelBuffer(data);
                return new Response(buf, {
                    headers: {
                        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        'Content-Disposition': 'attachment; filename="rapport_etudiants.xlsx"',
                        'Cache-Control': 'no-store, max-age=0'
                    }
                });
            }
        }

        if (type === 'word') {
            const title = body.title || DEFAULT_WORD_TITLE;
            const notes = body.notes || DEFAULT_WORD_NOTES;
            const tableData = body.tableData || DEFAULT_WORD_TABLE;
            const buf = generateWordBuffer(title, notes, tableData);
            return new Response(buf, {
                headers: {
                    'Content-Type': 'application/msword',
                    'Content-Disposition': 'attachment; filename="rapport_progres.doc"',
                    'Cache-Control': 'no-store, max-age=0'
                }
            });
        }

        return NextResponse.json({ error: 'Unsupported document type' }, { status: 400 });
    } catch (error) {
        console.error('[generate-doc POST]', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
