/**
 * Ustabakar PDF Raporlama Modülü - Kapanış ve Güvence Sayfası
 * * Personel Onay / İmza kutusu kaldırılarak tamamen metinsel doğrulama modeline geçilmiştir.
 */

module.exports = function finalPage({ report, master, date }) {
  // Sistem operasyon kodu simüle ediliyor
  const currentYear = new Date(report.created_at).getFullYear();
  const operationCode = `OP-${currentYear}-${report.id}`;

  return `
  <div class="page" style="position: relative; justify-content: space-between; padding: 20mm; font-family: sans-serif; background: #ffffff;">
    
    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 5px; background: #1A2238;"></div>
    
    <div style="width: 100%; display: flex; flex-direction: column; gap: 30px;">
      
      <div style="border-b: 1px solid #e4e4e7; padding-bottom: 16px; border-bottom: 1px solid #e4e4e7;">
        <span style="font-size: 10px; font-weight: 700; color: #71717a; text-transform: uppercase; letter-spacing: 2px; display: block; margin-bottom: 4px;">OPERASYONEL SÜREÇ SONU</span>
        <h2 style="font-size: 22px; font-weight: 800; color: #1A2238; text-transform: uppercase; letter-spacing: -0.5px;">Ekspertiz Onay ve Kapanış Protokolü</h2>
      </div>

      <div style="background: #fafafa; border: 1px solid #e4e4e7; border-radius: 12px; padding: 20px;">
        <p style="font-size: 13px; color: #44403c; font-weight: 500; line-height: 1.6; text-align: justify;">
          İşbu doküman, başvuru sahibi tarafından ustabakar.com sistemi üzerinden girilen ilan/araç verileri doğrultusunda, sahada görevlendirilen uzman personelin fiziki incelemeleri neticesinde tanzim edilmiştir. İnceleme sürecinde aracın tescilli mekanik aksamları, kaporta-boya durumu ve elektronik beyin modülleri (OBD) usta gözüyle analiz edilerek kayıt altına alınmıştır.
        </p>
      </div>

      <div style="margin-top: 10mm;">
        <div style="font-size: 11px; font-weight: 800; color: #1A2238; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 14px;">Kayıt Altına Alan Personel Bilgileri</div>
        
        <div style="border: 1px solid #e4e4e7; border-radius: 12px; padding: 16px; font-size: 12px; line-height: 2;">
          <div style="display: flex; justify-content: space-between; border-b: 1px solid #f4f4f5; padding-bottom: 6px; margin-bottom: 6px; border-bottom: 1px solid #f4f4f5;">
            <span style="color: #71717a; font-weight: 600;">İnceleyen Uzman:</span>
            <span style="font-weight: 700; color: #1c1917; text-transform: uppercase;">${master?.name || ''} ${master?.surname || 'Uzman Usta'}</span>
          </div>
          <div style="display: flex; justify-content: space-between; border-b: 1px solid #f4f4f5; padding-bottom: 6px; margin-bottom: 6px; border-bottom: 1px solid #f4f4f5;">
            <span style="color: #71717a; font-weight: 600;">Sistem Sicil Kodu:</span>
            <span style="font-weight: 700; color: #1c1917; font-family: monospace;">${operationCode}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #71717a; font-weight: 600;">Evrak Onay Tarihi:</span>
            <span style="font-weight: 700; color: #1c1917;">${date}</span>
          </div>
        </div>
      </div>

    </div>

    <div style="margin-top: auto; border-top: 1px solid #e4e4e7; padding-top: 16px;">
      <p style="font-size: 9.5px; color: #71717a; line-height: 1.6; text-align: justify; font-weight: 500;">
        <strong>YASAL BEYANAT VE YÜKÜMLÜLÜK SINIRI:</strong> İşbu kontrol evrakı bir garanti belgesi veya sigorta poliçesi niteliğinde değildir. İncelemeyi yapan uzman, motoru indirmeden, kaporta parçalarını sökmeden ve araç üzerinde demonte işlemler yapmadan fiziki ve teknolojik gözlem yeteneğiyle ön kontrol yapmıştır. Raporun tanzim edildiği an haricindeki zaman dilimlerinde araçta oluşabilecek aşınma, kaza veya mekanik/elektronik arızalardan uzman usta veya ustabakar platformu hiçbir hukuki sorumluluk kabul etmez. Taraflar bu şartları kabul etmiş sayılır.
      </p>
      
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 14px; font-size: 10px; font-weight: 700; color: #1A2238;">
        <span>ustabakar.com</span>
        <span style="color: #a1a1aa; font-weight: 500;">İletişim: iletisim@ustabakar.com</span>
        <span style="font-family: monospace;">Ref: #${report.id}</span>
      </div>
    </div>

  </div>`;
};