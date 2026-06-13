module.exports = function photoPages({ photoBase64, report, date }) {
  if (!photoBase64 || !photoBase64.length) return '';

  const pages = [];
  // Sayfada dikey yığılmayı engellemek için ideal SaaS basım adedi 4 olarak güncellendi
  const chunkSize = 4; 
  let currentPageIndex = 0;

  for (let i = 0; i < photoBase64.length; i += chunkSize) {
    currentPageIndex++;
    const chunk = photoBase64.slice(i, i + chunkSize);
    pages.push(`
  <div class="page">
    <div class="page-header">
      <div class="header-logo">Usta<span>bakar</span></div>
      <div class="header-title">Araç Görselleri Raporu</div>
    </div>
    
    <div class="page-content">
      <div class="section-title">Fotoğraflar (${i + 1}–${Math.min(i + chunkSize, photoBase64.length)} / ${photoBase64.length})</div>
      <div class="photos-grid">
        ${chunk.map((src) => `
          <div class="photo-container">
            <img class="photo" src="${src}" />
          </div>
        `).join('')}
      </div>
    </div>
    
    <div class="page-footer">
      <span>Rapor No: #${report.id} • Galeri Bölümü</span>
      <span>Ek Ekran Raporu</span>
    </div>
  </div>`);
  }

  return pages.join('');
};