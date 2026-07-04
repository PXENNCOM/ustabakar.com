import React from 'react';

const İndex = () => {
  return (
    <footer className="w-full bg-white border-t border-zinc-100 font-sans pt-16 pb-8 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 pb-12 border-b border-zinc-100">
        
        {/* SOL ALAN: LOGO, MOTTO VE SOSYAL MEDYA */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          <div className="flex-shrink-0">
            <img 
              src="assets/logo.png" 
              alt="OtoBakar Logo" 
              className="h-12 w-auto object-contain" 
            />
          </div>
          <p className="text-zinc-500 text-xs md:text-sm leading-relaxed max-w-sm font-medium">
            TSE standartlarında, tarafsız ön ekspertiz çözümleri. Aklınızda soru işareti kalmasın.
          </p>
          
          {/* SOSYAL MEDYA İKONLARI */}
          <div className="flex items-center space-x-3 pt-2">
            {/* Instagram */}
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-[#1A2238] hover:bg-[#ffe119] transition-all group shadow-sm">
              <svg className="w-4 h-4 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>

            {/* Twitter (X) */}
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-[#1A2238] hover:bg-[#ffe119] transition-all group shadow-sm">
              <svg className="w-4 h-4 transform group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </svg>
            </a>

            {/* LinkedIn */}
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-[#1A2238] hover:bg-[#ffe119] transition-all group shadow-sm">
              <svg className="w-4 h-4 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
          </div>
        </div>

        {/* ORTA ALAN: HIZLI LİNKLER VE SÖZLEŞMELER */}
        <div className="lg:col-span-4 grid grid-cols-2 gap-6">
          {/* Menü */}
          <div className="flex flex-col space-y-4">
            <span className="text-[10px] font-mono font-black text-zinc-400 tracking-widest uppercase">KURUMSAL</span>
            <div className="flex flex-col space-y-2.5 text-xs font-black text-[#1A2238] tracking-wider uppercase">
              <a href="/kurumsal" className="hover:text-[#ffe119] transition-colors">HAKKIMIZDA</a>
              <a href="/kurumsal" className="hover:text-[#ffe119] transition-colors">İLETİŞİM</a>
              <a href="/usta/basvuru" className="hover:text-[#ffe119] transition-colors">USTA BAŞVURU</a>
            </div>
          </div>

          {/* Sözleşmeler */}
          <div className="flex flex-col space-y-4">
            <span className="text-[10px] font-mono font-black text-zinc-400 tracking-widest uppercase">SÖZLEŞMELER</span>
            <div className="flex flex-col space-y-2.5 text-xs font-black text-[#1A2238]/80 tracking-wider uppercase">
              <a href="/kurumsal" className="hover:text-[#ffe119] transition-colors leading-relaxed">KVKK SÖZLEŞMESİ</a>
              <a href="/kurumsal" className="hover:text-[#ffe119] transition-colors leading-relaxed">GİZLİLİK SÖZLEŞMESİ</a>
              <a href="/kurumsal" className="hover:text-[#ffe119] transition-colors leading-relaxed">MESAFELİ SATIŞ SÖZLEŞMESİ</a>
            </div>
          </div>
        </div>

        {/* SAĞ ALAN: PREMIUM DETAY KARTI */}
        <div className="lg:col-span-3 flex flex-col justify-between p-6 bg-zinc-50 border border-zinc-100 rounded-[24px]">
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-black text-zinc-400 tracking-widest uppercase block">DESTEK HATTI</span>
            <h4 className="text-lg font-black text-[#1A2238] tracking-tight">Bir sorunuz mu var?</h4>
            <p className="text-zinc-500 text-xs font-medium leading-relaxed">
              Uzman ekibimiz haftanın her günü sorularınızı yanıtlamaya hazır.
            </p>
          </div>
          <div className="pt-4">
            <a href="tel:+905356808141" className="inline-flex items-center space-x-2 text-xs font-black text-[#1A2238] bg-[#ffe119] px-4 py-3 rounded-xl shadow-sm hover:shadow-md transition-all">
              <span>+90 535 680 81 41</span>
            </a>
          </div>
        </div>

      </div>

      {/* ALT ALAN: COPYRIGHT VE ÖDEME LOGOLARI */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-[11px] font-mono font-bold text-zinc-400 tracking-wider uppercase">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div>
            © {new Date().getFullYear()} OTOBAKAR. TÜM HAKLARI SAKLIDIR.
          </div>
          <div className="hidden sm:flex items-center space-x-2">
            <span>MADE WITH PXENN</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffe119]"></span>
          </div>
        </div>
        
        {/* ÖDEME YÖNTEMLERİ LOGO BANDI */}
        <div className="flex items-center justify-center">
          <img 
            src="assets/logo_band_colored@3x kopyası.png" 
            alt="İyzico, Mastercard, Visa Ödeme Yöntemleri" 
            className="h-5 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
          />
        </div>
      </div>
    </footer>
  );
};

export default İndex;