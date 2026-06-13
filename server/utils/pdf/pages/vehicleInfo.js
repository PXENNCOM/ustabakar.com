module.exports = function vehicleInfo({ report, master, customer, request, date }) {
  const row = (label, value) => value ? `
    <div class="info-item">
      <div class="info-label">${label}</div>
      <div class="info-value">${value}</div>
    </div>` : '';

  return `
  <div class="page">
    <div class="page-header">
      <div class="header-logo">Usta<span>bakar</span></div>
      <div class="header-title">Araç Teslim & Ön Ekspertiz Raporu</div>
    </div>
    
    <div class="page-content" style="padding-top: 8mm; padding-bottom: 8mm;">
      
      <div class="section-title">Rapor Bilgileri</div>
      <div className="info-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
        <div class="party-card">
          <div class="party-header">Operasyon Detayları</div>
          <div class="party-body" style="padding: 10px 14px; font-size: 12px;">
            <div style="display: flex; justify-content: space-between; py: 4px; margin-bottom: 6px;">
              <span style="color: #71717a; font-weight: 600;">Rapor No:</span>
              <span style="font-weight: 700; color: #1c1917;">#${report.id}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span style="color: #71717a; font-weight: 600;">Ekspertiz Tarihi:</span>
              <span style="font-weight: 700; color: #1c1917;">${date}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #71717a; font-weight: 600;">Hizmet Tipi:</span>
              <span style="font-weight: 800; color: #1A2238; letter-spacing: 0.5px;">ÖN EKSPERTİZ PAKETİ</span>
            </div>
          </div>
        </div>

        <div class="party-card">
          <div class="party-header">Süreç Tarafları</div>
          <div class="party-body" style="padding: 10px 14px; font-size: 12px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span style="color: #71717a; font-weight: 600;">Alıcı (Müşteri):</span>
              <span style="font-weight: 700; color: #1c1917;">${customer?.name || ''} ${customer?.surname || ''}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span style="color: #71717a; font-weight: 600;">Müşteri Tel:</span>
              <span style="font-weight: 700; color: #1c1917;">${customer?.phone || '—'}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #71717a; font-weight: 600;">Yetkili Personel:</span>
              <span style="font-weight: 700; color: #1c1917;">${master?.name || ''} ${master?.surname || ''} (Usta)</span>
            </div>
          </div>
        </div>
      </div>

      <div class="section-title">Araç Bilgileri</div>
      <div class="info-grid" style="margin-bottom: 20px;">
        <div class="info-item full">
          <div class="info-label">Araç Plakası</div>
          <div class="info-value plate">${report.plate}</div>
        </div>
        ${report.chassis_no ? `<div class="info-item full"><div class="info-label">Şasi Numarası</div><div class="info-value" style="font-family: monospace; font-size: 13px; letter-spacing: 0.5px;">${report.chassis_no}</div></div>` : ''}
        ${row('Marka / Model', report.brand && report.model ? `${report.brand} ${report.model}` : null)}
        ${row('Model Yılı', report.year)}
        ${row('Kilometre Verisi', report.km ? `${Number(report.km).toLocaleString('tr-TR')} km` : null)}
        ${row('Şanzıman Tipi', report.transmission)}
        ${row('Gövde Rengi', report.color)}
        ${row('Motor Hacmi', report.engine_cc ? `${report.engine_cc} cc` : null)}
      </div>

      ${report.master_note ? `
        <div class="section-title">Uzman Notu ve Genel Değerlendirme</div>
        <div class="note-box" style="margin-bottom: 20px; border-left: 4px solid #ffe119;">
          <div class="note-text" style="font-size: 12.5px;">${report.master_note}</div>
        </div>
      ` : ''}

      <div class="section-title">Ön Ekspertiz Hizmet Sözleşmesi ve Yasal Sorumluluk Sınırları</div>
      <div class="note-box" style="background: #fafafa; border: 1.5px solid #e4e4e7; padding: 12px; margin-bottom: 0;">
        <ol style="margin-left: 14px; font-size: 10px; color: #52525b; line-height: 1.5; font-weight: 500; text-align: justify;">
          <li style="margin-bottom: 4px;">Bu rapor, tarafların talebi üzerine ilgili aracın belirtilen tarih ve saatteki durumunu tespit eden bir <strong>Ön Ekspertiz</strong> raporudur. Satış veya tescil sözleşmesi niteliği taşımaz.</li>
          <li style="margin-bottom: 4px;">İncelemeyi gerçekleştiren uzman (Usta), aracı lifte kaldırmadan, motoru sökmeden ve parça dağıtımı yapmadan, tamamen fiziki gözlem, elektronik arıza tespit cihazı (OBD) ve saha tecrübesiyle ön kontrol gerçekleştirmektedir. Sökülmeden tespit edilemeyen gizli ayıplardan uzman veya platform sorumlu tutulamaz.</li>
          <li style="margin-bottom: 4px;">Rapor içeriğinde yer alan kilometre, donanım ve tescil verileri inceleme anında aracın gösterge panelinden ve ruhsatından okunan anlık verilerdir. Geçmişe dönük kilometre müdahaleleri veya beyan dışı parça değişimleri bu raporun sorumluluk kapsamında değildir.</li>
          <li style="margin-bottom: 4px;">İşbu hizmet bir <strong>Ön İnceleme</strong> danışmanlığı olup, raporun tanzim edildiği tarih ve kilometreden sonra araçta meydana gelebilecek mekanik, elektronik veya kozmetik aşınma, arıza ve modifikasyonlardan Ustalar veya <strong>ustabakar.com</strong> hiçbir şekilde hukuki veya cezai olarak sorumlu değildir.</li>
          <li style="margin-bottom: 4px;">Rapor sadece başvuru sahibi alıcının bilgilendirilmesi amacıyla üretilmiş olup, üçüncü şahıslara devredilemez, ticari bir alım-satım güvencesi veya garanti belgesi olarak mahkemelerde delil olarak öne sürülemez.</li>
        </ol>
      </div>

    </div>
    
    <div class="page-footer">
      <span>Rapor No: #${report.id} • İnceleme Özeti</span>
      <span>Sayfa 2</span>
    </div>
  </div>`;
};