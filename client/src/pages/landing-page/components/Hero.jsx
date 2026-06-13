import React, { useState } from 'react';

const HeroSection = () => {
  const slides = [
    {
      id: 1,
      imgUrl: "assets/otobakar.png", 
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  return (
    <section className="w-full min-h-[650px] flex items-center justify-center px-6 py-16 md:px-16 font-sans">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* SOL ALAN: Vurucu PM Stratejisi Metinleri */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-8 text-left">
          <div className="flex items-center space-x-2">
            <span className="w-8 h-[2px] bg-[#ffe119]"></span>
            <span className="text-[#1A2238] text-xs font-bold tracking-widest font-mono">
              YENİ NESİL MOBİL EKSPERTİZ
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-[#1A2238] tracking-tight leading-[1.15] uppercase">
            BAŞKA ŞEHİRDEKİ <br />
            ARACA BOŞUNA <br />
            {/* Yol masrafı ve bütçe vurgusunu doğrudan sarı alanda patlatıyoruz */}
            <span className="bg-[#ffe119] text-[#1A2238] px-2 inline-block my-1 rounded-sm">PARA HARCAMA</span> <br />
            USTAN YERİNDE BAKSIN
          </h1>

          <p className="text-zinc-500 text-sm md:text-base font-medium leading-relaxed max-w-lg">
            Konya'da veya Samsun'da araç mı beğendiniz? Yol, yemek ve ekspertiz masrafı yapıp riske girmeyin. Türkiye'nin her yerindeki freelance ağımızdan bir usta, sizin yerinize aracın başına gitsin; bütçenizi ve zamanınızı koruyun.
          </p>

          {/* Aksiyon Butonu - Doğrudan Çözüme Çağrı */}
          <div>
            <button className="inline-flex items-center space-x-3 bg-[#ffe119] text-[#1A2238] hover:bg-[#1A2238] hover:text-white font-black px-8 py-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 group">
              <span className="text-sm tracking-wider uppercase">Aracı İnceleyecek Usta Bul</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* SAĞ ALAN: Resimli Premium Kart ve Aktif Slider Kontrolleri */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-end space-y-6">
          
          {/* Ana Kart */}
          <div className="relative w-full aspect-[16/10] max-w-[640px] bg-[#0A0314] rounded-[32px] p-8 md:p-12 shadow-2xl overflow-hidden flex flex-col justify-between group">
            
            {/* Arka Plandaki Görsel Alanı */}
            <div className="absolute inset-0 z-0 transition-all duration-700 ease-in-out transform scale-100 group-hover:scale-105">
              <img 
                src={slides[currentIndex].imgUrl} 
                alt="Güvenilir Usta Kontrolü" 
                className="w-full h-full object-cover"
              />
            </div>      
          </div>

          {/* Slider Kontrolleri */}
          <div className="w-full max-w-[640px] flex items-center justify-between px-4">
            <div className="flex space-x-3">
              <button 
                onClick={prevSlide}
                className="w-12 h-12 rounded-full border border-zinc-200 bg-white flex items-center justify-center text-[#1A2238] hover:bg-[#ffe119] hover:border-[#ffe119] shadow-sm transition-all duration-200 font-bold"
              >
                &#8592;
              </button>
              <button 
                onClick={nextSlide}
                className="w-12 h-12 rounded-full bg-[#1A2238] flex items-center justify-center text-white hover:bg-[#ffe119] hover:text-[#1A2238] shadow-md transition-all duration-200 font-bold"
              >
                &#8594;
              </button>
            </div>
            
            {/* Dinamik Sayfa Sayacı */}
            <div className="text-sm font-mono font-bold tracking-widest text-zinc-800">
              <span className="text-[#1A2238] bg-[#ffe119] px-1.5 py-0.5 rounded-sm">0{currentIndex + 1}</span>
              <span className="text-zinc-300 mx-2">/</span>
              <span className="text-zinc-400">0{slides.length}</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default HeroSection;