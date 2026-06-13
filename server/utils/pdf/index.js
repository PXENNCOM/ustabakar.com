const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const fetchReportData = require('./fetchReportData');
const generateHtml = require('./generateHtml');

async function buildPhotoBase64(photos) {
  const result = [];
  for (const photo of photos || []) {
    try {
      const filePath = path.join(__dirname, '../../uploads', photo.url.replace('/uploads/', ''));
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath);
        const ext = path.extname(filePath).slice(1).toLowerCase();
        const mime = ext === 'jpg' ? 'jpeg' : ext;
        result.push(`data:image/${mime};base64,${data.toString('base64')}`);
      }
    } catch { }
  }
  return result;
}

function groupAnswers(answers) {
  const grouped = {};
  (answers || []).forEach((a) => {
    const catName = a.question?.category?.name || 'Genel';
    if (!grouped[catName]) grouped[catName] = [];
    grouped[catName].push(a);
  });
  return grouped;
}

module.exports = async function generateReportPdf(reportId) {
  const report = await fetchReportData(reportId);
  if (!report) return null;

  const assignment = report.Assignment;
  const master = assignment?.Master;
  const request = assignment?.Request;
  const customer = request?.Customer;

  const date = new Date(report.created_at).toLocaleDateString('tr-TR', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  const grouped = groupAnswers(report.answers);
  const photoBase64 = await buildPhotoBase64(report.photos);

  const html = generateHtml({ report, master, customer, request, grouped, photoBase64, date });

  // HTML'i test için kaydet
  const testHtmlPath = path.join(__dirname, '../../test-report.html');
  fs.writeFileSync(testHtmlPath, html);
  console.log('HTML kaydedildi:', testHtmlPath);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'domcontentloaded' });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });

    console.log('PDF boyutu:', pdf.length, 'bytes');
    return pdf;
  } finally {
    await browser.close();
  }
};