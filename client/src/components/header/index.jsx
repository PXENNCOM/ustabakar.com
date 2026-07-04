import React, { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full font-sans top-0 z-50 bg-white border-b border-zinc-100">
      <div className="max-w-8xl mx-auto px-6 md:px-16 py-5 flex items-center justify-between">
        
        {/* SOL ALAN: LOGO */}
        <div className="flex-shrink-0">
          <a href="/" className="block">
            <img 
              src="assets/logo.png" 
              alt="OtoBakar Logo" 
              className="h-12 md:h-14 w-auto object-contain" 
            />
          </a>
        </div>

        {/* ORTA ALAN: TAMAMEN BOŞALTIK */}
        <div className="hidden md:flex flex-grow" />

        {/* SAĞ ALAN: MASAÜSTÜ AKSİYONLAR VE SADECE KURUMSAL LİNKİ */}
        <div className="hidden md:flex items-center space-x-8">
          
          {/* Giriş Kısmının Yanındaki Tek Link: KURUMSAL */}
          <a href="/kurumsal" className="text-xs font-black text-[#1A2238] tracking-widest uppercase hover:text-[#ffe119] transition-colors">
            KURUMSAL
          </a>

          <span className="w-1.5 h-1.5 rounded-full bg-zinc-200"></span>

          {/* Giriş / Üye Ol */}
          <div className="flex items-center space-x-4 text-xs font-black text-[#1A2238]/80 uppercase tracking-widest">
            <a href="/giris" className="hover:text-[#1A2238] transition-colors">GİRİŞ YAP</a>
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-200"></span>
            <a href="/kayit" className="hover:text-[#1A2238] transition-colors">ÜYE OL</a>
          </div>

          {/* Usta Başvuru Butonu */}
          <a href="/usta/basvuru">
            <button className="inline-flex items-center space-x-2 bg-[#ffe119] text-[#1A2238] hover:bg-[#1A2238] hover:text-white font-black px-6 py-3.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 group text-xs tracking-widest uppercase">
              <span>USTA BAŞVURU</span>
              <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"></path>
              </svg>
            </button>
          </a>
        </div>

        {/* MOBİL MENÜ TETİKLEYİCİ */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="text-[#1A2238] p-2 rounded-xl hover:bg-zinc-50 border border-zinc-100 transition-all active:scale-95"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
            )}
          </button>
        </div>
      </div>

      {/* MOBİL PANEL: SADECE GEREKLİ ALANLAR KALDI */}
      {isMenuOpen && (
        <div className="md:hidden w-full bg-white border-t border-zinc-100 px-6 py-8 space-y-6 animate-fadeIn">
          
          {/* Mobil Menü Linki */}
          <div className="space-y-3">
            <a href="/kurumsal" className="block w-full p-4 bg-zinc-50 border border-zinc-100 rounded-xl font-black text-xs text-[#1A2238] uppercase tracking-wider text-center">
              KURUMSAL REHBER & İLETİŞİM
            </a>
          </div>

          <div className="w-full h-px bg-zinc-100" />

          {/* Mobil Giriş / Kayıt */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <a href="/giris" className="py-3.5 border-2 border-[#1A2238] rounded-xl font-black text-xs text-[#1A2238] uppercase tracking-wider transition-colors hover:bg-[#1A2238] hover:text-white">
              GİRİŞ YAP
            </a>
            <a href="/kayit" className="py-3.5 bg-zinc-100 rounded-xl font-black text-xs text-[#1A2238] uppercase tracking-wider">
              ÜYE OL
            </a>
          </div>

          {/* Mobil Usta Başvuru Butonu */}
          <div className="pt-2">
            <a href="/usta/basvuru" className="block w-full">
              <button className="w-full flex items-center justify-center space-x-2 bg-[#ffe119] text-[#1A2238] font-black px-6 py-4 rounded-xl text-xs tracking-widest uppercase shadow-md active:scale-[0.98] transition-transform">
                <span>USTA BAŞVURU</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"></path></svg>
              </button>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;