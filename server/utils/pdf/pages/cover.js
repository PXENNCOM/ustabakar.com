module.exports = function cover({ report, date }) {
  return `
  <div class="page cover" style="position: relative;">
    <div class="cover-accent-bar"></div>
    
    <div class="cover-content" style="width: 100%;">
      <div class="cover-logo">
        <div class="cover-logo-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A2238" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
            <circle cx="7" cy="17" r="2"/>
            <path d="M9 17h6"/>
            <circle cx="17" cy="17" r="2"/>
          </svg>
        </div>
        <div class="cover-logo-text">Usta<span>bakar</span></div>
      </div>
      
      <div class="cover-badge">Ekspertiz Raporu</div>
      <div class="cover-report-title">Dijital Ön Kontrol<br/>Mekanik Raporu</div>
      <div class="cover-plate">${report.plate}</div>
      
      <div class="cover-meta-grid">
        ${report.brand && report.model ? `
          <div class="cover-meta-item">
            <div class="cover-meta-label">Araç Detayı</div>
            <div class="cover-meta-value">${report.brand} ${report.model}</div>
          </div>
        ` : ''}
        ${report.year ? `
          <div class="cover-meta-item">
            <div class="cover-meta-label">Model Yılı</div>
            <div class="cover-meta-value">${report.year}</div>
          </div>
        ` : ''}
        ${report.km ? `
          <div class="cover-meta-item">
            <div class="cover-meta-label">Kilometre Kaydı</div>
            <div class="cover-meta-value">${Number(report.km).toLocaleString('tr-TR')} km</div>
          </div>
        ` : ''}
        <div class="cover-meta-item">
          <div class="cover-meta-label">Rapor Numarası</div>
          <div class="cover-meta-value">#${report.id}</div>
        </div>
      </div>
    </div>

    <div style="position: absolute; right: 20mm; bottom: 32mm; width: 130px; height: 130px; border: 3.5px dashed rgba(26,34,56,0.18); border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; transform: rotate(-8deg); select-none; pointer-events: none; background: rgba(255,255,255,0.4); backdrop-blur-sm: 2px;">
      <span style="font-size: 9px; font-weight: 800; color: #1A2238; letter-spacing: 1.2px; opacity: 0.7;">USTABAKAR</span>
      <span style="font-size: 11px; font-weight: 900; color: #ffe119; background: #1A2238; padding: 3px 8px; border-radius: 5px; margin: 5px 0; letter-spacing: 0.5px; box-shadow: 0 2px 4px rgba(26,34,56,0.1);">ONAYLANDI</span>
      <span style="font-size: 9px; font-weight: 700; color: #71717a; font-family: monospace;">ID: OP-${report.id}</span>
    </div>
    
    <div class="cover-footer">
      GİZLİDİR • İşbu ekspertiz ön raporu <strong>${date}</strong> tarihinde düzenlenmiştir. Düzenlendiği an haricindeki zamanlarda aracın durumundaki aşınma ve değişikliklerden platformumuz sorumlu tutulamaz.
    </div>
  </div>`;
};