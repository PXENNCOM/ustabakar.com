import React from 'react';

const ServiceCards = () => {
  const cardsData = [
    {
      id: 1,
      title: "ŞEHİR DIŞI ARABA STRESİNE SON",
      subtitle: "Yol ve Zaman Tasarrufu",
      description: "Sarı sitede beğendiğiniz araç başka bir şehirde mi? Sırf kontrol etmek için uçak/otobüs bileti alıp yüzlerce kilometre gitmeyin. Aracın bulunduğu ildeki yerel ve tarafsız usta ağımızla, siz oturduğunuz yerden kalkmadan ilk incelemeyi biz yapalım.",
      cardStyle: "bg-white border border-slate-100 shadow-sm",
      tagStyle: "bg-[#ffe119] text-[#1A2238]",
      lineStyle: "bg-[#ffe119]",
      textColor: "text-[#1A2238]",
      descColor: "text-slate-500",
      isImageLeft: true,
      imgUrl: "assets/img1.png" 
    },
    {
      id: 2,
      title: "FREELANCE USTA AĞI İLE HIZLI RAPOR",
      subtitle: "Güvenilir ve Cüzi Maliyet",
      description: "Türkiye'nin her il ve ilçesindeki bağımsız ustalarımız, talep ettiğiniz aracın yanına dakikalar içinde gider. Aracın motor sesini, kaportasını ve genel durumunu yerinde dinler; 'Bu araba alınır mı, beklentini karşılar mı?' sorusuna çok cüzi bir fiyata net yanıt verir.",
      cardStyle: "bg-gradient-to-br from-[#ffe119] via-[#ffd000] to-[#f5b800] shadow-sm border border-[#ffe119]/20",
      tagStyle: "bg-[#1A2238] text-white",
      lineStyle: "bg-[#1A2238]/30",
      textColor: "text-[#1A2238]",
      descColor: "text-[#1A2238]/90",
      isImageLeft: false,
      imgUrl: "assets/img2.png" 
    },
    {
      id: 3,
      title: "BOŞA GİDEN EKSPERTİZ ÜCRETLERİNİ SIFIRLAYIN",
      subtitle: "Ön Kontrol Avantajı",
      description: "Geleneksel ekspertiz firmalarının talep ettiği fahiş fiyatları ödemeden önce aracınızı bir ustaya gösterin. Ustanın yapacağı ön kontrol sayesinde, kusurlu araçlar için büyük bütçeler harcamaktan kurtulur, sadece gerçekten içinize sinen aracı satın alırsınız.",
      cardStyle: "bg-white border border-slate-100 shadow-sm",
      tagStyle: "bg-[#ffe119] text-[#1A2238]",
      lineStyle: "bg-[#ffe119]",
      textColor: "text-[#1A2238]",
      descColor: "text-slate-500",
      isImageLeft: false,
      imgUrl: "assets/img3.png" 
    }
  ];

  return (
    <section className="w-full bg-[#FCFCFD] py-16 px-4 sm:px-6 md:px-16 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {cardsData.map((card) => (
          <div
            key={card.id}
            className={`w-full rounded-[28px] overflow-hidden ${card.cardStyle} p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16 min-h-[280px] relative`}
          >
            
            {/* METİN ALANI */}
            <div className={`w-full lg:w-[50%] flex flex-col justify-center space-y-4 ${card.isImageLeft ? 'lg:order-2' : 'lg:order-1'}`}>
              <div className="space-y-2">
                {/* Küçük Üst Başlık / Tag */}
                <span className={`inline-block text-[10px] font-mono font-black uppercase tracking-widest px-2.5 py-1 rounded-md ${card.tagStyle}`}>
                  {card.subtitle}
                </span>
                
                {/* Ana Başlık */}
                <h2 className={`text-2xl md:text-3xl font-black tracking-tight uppercase leading-tight ${card.textColor}`}>
                  {card.title}
                </h2>
              </div>

              {/* Seperator Çizgisi */}
              <div className={`w-12 h-[2px] ${card.lineStyle}`} />

              {/* Açıklama Metni */}
              <p className={`text-xs md:text-sm leading-relaxed font-medium ${card.descColor}`}>
                {card.description}
              </p>
            </div>

            {/* RESİM ALANI */}
            <div className={`w-full lg:w-[45%] flex items-center justify-center relative ${card.isImageLeft ? 'lg:order-1' : 'lg:order-2'}`}>
              
              {/* Sabit arka plan parlaması */}
              <div className="absolute inset-0 m-auto w-64 h-64 bg-[#ffe119]/10 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

              {/* Görsel Kutusu ve Sabit Büyük Resim */}
              <div className="w-full max-w-[380px] md:max-w-[440px] h-[240px] lg:h-[280px] flex items-center justify-center select-none pointer-events-none relative z-10">
                <img 
                  src={card.imgUrl} 
                  alt={card.title} 
                  className="w-full h-full object-contain filter drop-shadow-[0_15px_15px_rgba(0,0,0,0.06)] transform scale-105 lg:scale-110" 
                />
              </div>

            </div>

          </div>
        ))}

      </div>
    </section>
  );
};

export default ServiceCards;