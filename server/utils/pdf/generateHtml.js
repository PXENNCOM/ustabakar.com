const cover = require('./pages/cover');
const vehicleInfo = require('./pages/vehicleInfo');
const categoryPages = require('./pages/categories');
const photoPages = require('./pages/photos');
const finalPage = require('./pages/finalPage');

const css = `
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background: #fff; color: #1c1917; -webkit-font-smoothing: antialiased; }

/* A4 Sayfa Yapısı Kilidi */
.page { width: 210mm; height: 296.8mm; page-break-after: always; page-break-inside: avoid; display: flex; flex-direction: column; overflow: hidden; background: #fff; }

/* KAPAK (Minimalist & SaaS Estetiği) */
.cover { background: #ffffff; justify-content: space-between; padding: 40mm 20mm 20mm 20mm; position: relative; }
.cover-accent-bar { position: absolute; top: 0; left: 0; width: 100%; height: 8px; bg-color: #ffe119; background: #ffe119; }
.cover-content { display: flex; flex-direction: column; align-items: flex-start; text-align: left; }
.cover-logo { display: flex; align-items: center; gap: 8px; margin-bottom: 40mm; }
.cover-logo-icon { width: 36px; height: 36px; background: #ffe119; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
.cover-logo-text { font-size: 20px; font-weight: 800; color: #1A2238; letter-spacing: -0.5px; }
.cover-logo-text span { color: #a1a1aa; font-weight: 400; }
.cover-badge { background: #1A2238; color: #ffe119; font-size: 10px; font-weight: 800; tracking-spacing: 2px; padding: 6px 12px; border-radius: 6px; text-transform: uppercase; margin-bottom: 6px; }
.cover-report-title { font-size: 38px; font-weight: 800; color: #1A2238; tracking-spacing: -1px; line-height: 1.1; margin-bottom: 24px; }
.cover-plate { border: 2px solid #1A2238; border-radius: 12px; padding: 10px 32px; font-size: 28px; font-weight: 800; letter-spacing: 4px; color: #1A2238; display: inline-block; margin-bottom: 36px; background: #fafafa; }
.cover-meta-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; width: 100%; max-w: 500px; }
.cover-meta-item { border-left: 3px solid #ffe119; padding-left: 14px; }
.cover-meta-label { font-size: 10px; color: #71717a; text-transform: uppercase; font-weight: 700; letter-spacing: 1px; margin-bottom: 4px; }
.cover-meta-value { font-size: 15px; font-weight: 700; color: #1c1917; }
.cover-footer { font-size: 11px; font-weight: 500; color: #71717a; border-top: 1px solid #e4e4e7; pt: 16px; padding-top: 16px; width: 100%; }

/* STANDART SAYFA ÜST / ALT ALANI */
.page-header { height: 20mm; padding: 0 20mm; display: flex; align-items: center; justify-content: space-between; border-b: 1px solid #e4e4e7; border-bottom: 1px solid #e4e4e7; background: #fafafa; }
.header-logo { font-size: 13px; font-weight: 800; color: #1A2238; }
.header-logo span { color: #a1a1aa; font-weight: 400; }
.header-title { font-size: 11px; font-weight: 700; color: #71717a; text-transform: uppercase; letter-spacing: 1px; }
.page-footer { height: 15mm; padding: 0 20mm; border-top: 1px solid #e4e4e7; display: flex; align-items: center; justify-content: space-between; font-size: 10px; font-weight: 600; color: #a1a1aa; background: #fafafa; }
.page-content { flex: 1; padding: 12mm 20mm; overflow: hidden; }

/* KÜNYE VE DETAYLAR */
.section-title { font-size: 12px; font-weight: 800; color: #1A2238; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
.section-title::before { content: ''; width: 4px; height: 14px; background: #ffe119; display: inline-block; border-radius: 2px; }
.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
.info-item { background: #ffffff; border: 1px solid #e4e4e7; border-radius: 10px; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; }
.info-item.full { grid-column: span 2; background: #fafafa; border-color: #e4e4e7; }
.info-label { font-size: 11px; font-weight: 700; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px; }
.info-value { font-size: 13px; font-weight: 700; color: #1c1917; }
.info-value.plate { font-size: 18px; letter-spacing: 2px; color: #1A2238; font-weight: 800; }
.parties-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
.party-card { border: 1px solid #e4e4e7; border-radius: 12px; overflow: hidden; background: #ffffff; }
.party-header { background: #fafafa; padding: 10px 16px; font-size: 11px; font-weight: 700; color: #1c1917; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #e4e4e7; }
.party-body { padding: 14px 16px; }
.party-name { font-size: 14px; font-weight: 700; color: #1c1917; }
.party-sub { font-size: 12px; color: #71717a; margin-top: 2px; font-weight: 500; }
.note-box { background: #fafafa; border: 1px solid #e4e4e7; border-radius: 12px; padding: 16px; margin-bottom: 20px; }
.note-text { font-size: 13px; color: #44403c; line-height: 1.6; font-weight: 500; }
.validity-box { background: #fffbeb; border: 1px solid #fef3c7; border-radius: 10px; padding: 12px 16px; font-size: 11px; font-weight: 600; color: #b45309; line-height: 1.5; }

/* SORULAR & BULGULAR */
.answers-list { display: flex; flex-direction: column; width: 100%; border: 1px solid #e4e4e7; border-radius: 14px; overflow: hidden; }
.answer-row { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 20px; padding: 14px 20px; border-bottom: 1px solid #e4e4e7; align-items: center; background: #fff; }
.answer-row:last-child { border-bottom: 0; }
.answer-row.even { background: #fafafa; }
.answer-q { font-size: 12px; font-weight: 600; color: #1c1917; line-height: 1.5; }
.answer-v { display: flex; justify-content: flex-end; align-items: center; }
.badge { background: #1A2238; color: #fff; font-size: 10px; font-weight: 700; padding: 4px 12px; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
.open-text { font-size: 12px; color: #44403c; font-weight: 600; text-align: right; }
.no-answer { font-size: 12px; color: #d4d4d8; font-weight: 500; }

/* FOTOĞRAF GALERİSİ */
.photos-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; height: 100%; align-content: start; }
.photo-container { width: 100%; aspect-ratio: 4/3; overflow: hidden; border-radius: 12px; border: 1px solid #e4e4e7; background: #fafafa; }
.photo { width: 100%; height: 100%; object-fit: cover; }
`;

module.exports = function generateHtml(data) {
  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<style>${css}</style>
</head>
<body>
  ${cover(data)}
  ${vehicleInfo(data)}
  ${categoryPages(data)}
  ${photoPages(data)}
  ${finalPage(data)}
</body>
</html>`;
};