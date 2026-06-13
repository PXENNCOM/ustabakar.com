module.exports = function categoryPages({ grouped, report, date }) {
  let pageCounter = 2; // Künyeden sonra devam eden dinamik sayfa numarası için
  
  return Object.entries(grouped).map(([catName, answers]) => {
    pageCounter++;
    return `
    <div class="page">
      <div class="page-header">
        <div class="header-logo">Usta<span>bakar</span></div>
        <div class="header-title">${catName} Bulguları</div>
      </div>
      
      <div class="page-content">
        <div class="section-title">${catName} Detay İncelemesi</div>
        <div class="answers-list">
          ${answers.map((a, i) => `
            <div class="answer-row ${i % 2 === 0 ? 'even' : ''}">
              <div class="answer-q">${a.question?.question_text || ''}</div>
              <div class="answer-v">
                ${a.selected_option ? `<span class="badge">${a.selected_option.option_text}</span>` : ''}
                ${a.open_text ? `<span class="open-text">${a.open_text}</span>` : ''}
                ${!a.selected_option && !a.open_text ? `<span class="no-answer">—</span>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="page-footer">
        <span>Rapor #${report.id} · ${catName}</span>
        <span>Sayfa ${pageCounter}</span>
      </div>
    </div>`;
  }).join('');
};