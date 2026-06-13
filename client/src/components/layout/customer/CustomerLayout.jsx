import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

const whatsappUrl = `https://wa.me/905000000000?text=${encodeURIComponent('Merhaba Usta Bakar, bir konu hakkında destek almak istiyorum.')}`;

export default function CustomerLayout() {
  return (
    <div className="min-h-screen antialiased flex flex-col bg-white text-stone-900 relative">

      {/* HEADER KAPSAYICISI: w-full yapıldı, usta paneliyle aynı max-w ve padding değerlerine eşitlendi */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12">
        <Header />
      </div>

      {/* ANA İÇERİK KAPSAYICISI: Üstteki Header ile milimetrik hizada durması için aynı kalıba alındı */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 py-8">
        <Outlet />
      </main>

      {/* WhatsApp */}
      <div className="fixed bottom-6 right-6 z-50">
        <a 
          href={whatsappUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center justify-center w-12 h-12 bg-[#25D366] hover:bg-[#1ebe5d] active:scale-90 rounded-2xl shadow-xl shadow-emerald-500/20 transition-all duration-300 group relative" 
          title="WhatsApp Destek"
        >
          <span className="absolute inset-0 rounded-2xl bg-[#25D366]/30 animate-ping pointer-events-none group-hover:opacity-0 transition-opacity" />
          <svg viewBox="0 0 32 32" width="22" height="22" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.675 4.8 1.849 6.789L2 30l7.424-1.818A13.94 13.94 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.455a11.41 11.41 0 0 1-5.826-1.597l-.418-.248-4.406 1.08 1.105-4.028-.272-.43A11.41 11.41 0 0 1 4.545 16C4.545 9.617 9.617 4.545 16 4.545S27.455 9.617 27.455 16 22.383 27.455 16 27.455zm6.266-8.545c-.344-.172-2.034-1.003-2.348-1.117-.315-.115-.544-.172-.773.172-.229.343-.888 1.117-1.089 1.346-.2.229-.4.258-.744.086-.344-.172-1.452-.535-2.767-1.708-1.022-.913-1.712-2.04-1.913-2.384-.2-.343-.021-.529.15-.7.155-.153.344-.4.516-.6.172-.2.229-.344.344-.572.115-.229.057-.43-.029-.601-.086-.172-.773-1.863-1.06-2.549-.278-.668-.562-.577-.773-.588l-.658-.011c-.229 0-.6.086-.914.43s-1.202 1.174-1.202 2.863 1.23 3.322 1.402 3.55c.171.229 2.42 3.694 5.864 5.183.82.354 1.46.565 1.959.723.823.261 1.572.224 2.164.136.66-.099 2.034-.832 2.32-1.635.287-.803.287-1.49.2-1.635-.085-.143-.314-.229-.658-.4z"/>
          </svg>
        </a>
      </div>

      <Footer />

    </div>
  );
}