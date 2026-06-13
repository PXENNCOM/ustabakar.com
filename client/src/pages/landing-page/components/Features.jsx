import React from 'react';

const FeaturesSection = () => {
  // Sağ taraftaki 4 ana kartın yeni nesil modelinize göre düzenlenen verileri
  const features = [
    {
      id: 1,
      title: "81 İlde Freelance Ustalar",
      description: "Türkiye'nin neresinde olursanız olun, sarı sitede beğendiğiniz aracın en yakınındaki bağımsız ustaya tek tıkla ulaşın.",
      icon: (
        <svg className="w-6 h-6 text-[#1A2238]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
      )
    },
    {
      id: 2,
      title: "Yol ve Yemek Masrafı Yok",
      description: "Farklı şehirlerdeki araçları teker teker gezerek bütçenizi tüketmeyin. Bırakın usta arabanın ayağına gitsin, paranız cebinizde kalsın.",
      icon: (
        <svg className="w-6 h-6 text-[#1A2238]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
        </svg>
      )
    },
    {
      id: 3,
      title: "Düşük Maliyetli Ön Kontrol",
      description: "Büyük ekspertiz firmalarına fahiş ücretler ödemeden önce, yerel sanayi ustalarının tecrübesiyle aracı cüzi fiyatlara ilk süzgeçten geçirin.",
      icon: (
        <svg className="w-6 h-6 text-[#1A2238]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      )
    },
    {
      id: 4,
      title: "Ustalara Ek Gelir Modeli",
      description: "Büyük yedek parça ve aracı firmaların yüksek komisyonlarına inat, yerel sanayi esnafına doğrudan kazanç sağlayan adil bir teknoloji platformuyuz.",
      icon: (
        <svg className="w-6 h-6 text-[#1A2238]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
        </svg>
      )
    }
  ];

  return (
    <section className="w-full py-20 px-6 md:px-16 font-sans bg-[#FDFDFD]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* SOL ALAN: Başlık ve Açıklamalar */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-6 lg:sticky lg:top-10">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-mono">
            NEDEN BİZ?
          </span>
          
          <h2 className="text-3xl md:text-4xl font-black text-[#1A2238] tracking-tight leading-tight uppercase">
            Hantal Yapıları Unutun <br />
            <span className="bg-[#ffe119] text-[#1A2238] px-2 inline-block my-1 rounded-sm">Akıllı Kontrol</span>
          </h2>

          <div className="space-y-4 text-zinc-600 text-sm leading-relaxed">
            <div className="flex items-start space-x-3">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#ffe119] mt-2 shrink-0"></span>
              <p>
                Beğendiğiniz araç hangi şehirde olursa olsun, o ildeki profesyonel ve freelance ustalarımızla size tamamen tarafsız, şeffaf ve yerinde bir inceleme deneyimi sunarız.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#ffe119] mt-2 shrink-0"></span>
              <p>
                Büyük, hantal ve fahiş fiyatlı zincir ekspertiz firmalarının aksine, doğrudan ustayla alıcıyı buluşturarak maliyetleri minimuma indirir, zamandan maksimum tasarruf sağlarız.
              </p>
            </div>
          </div>

          {/* Kurumsal Detay Butonu */}
          <div className="pt-4">
            <button className="border-2 border-[#1A2238] text-[#1A2238] hover:bg-[#1A2238] hover:text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 text-sm tracking-wide uppercase">
              SİSTEM NASIL ÇALIŞIR?
            </button>
          </div>
        </div>

        {/* SAĞ ALAN: 2x2 Grid Özellik Kartları */}
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((item) => {
            const isSpecialCard = item.id === 2;

            return (
              <div 
                key={item.id} 
                className={`p-8 rounded-[24px] border transition-all duration-300 group flex flex-col justify-between ${
                  isSpecialCard 
                    ? 'bg-[#ffe119] border-[#ffe119] shadow-md hover:shadow-2xl' 
                    : 'bg-white border-zinc-100 shadow-sm hover:shadow-xl'
                }`}
              >
                <div>
                  {/* İkon Yuvarlağı */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${
                    isSpecialCard ? 'bg-white' : 'bg-[#ffe119]'
                  }`}>
                    {item.icon}
                  </div>
                  
                  {/* Başlık */}
                  <h3 className="text-xl font-black tracking-tight mb-3 text-[#1A2238]">
                    {item.title}
                  </h3>
                  
                  {/* Açıklama */}
                  <p className={`text-xs md:text-sm leading-relaxed font-medium ${
                    isSpecialCard ? 'text-[#1A2238]/90' : 'text-zinc-500'
                  }`}>
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;