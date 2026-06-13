import { useState } from 'react';
import WelcomeHero   from './WelcomeHero';
import SupportModal from './SupportModal';
import RequestsPanel from './RequestsPanel';
import FaqSection    from './FaqSection.jsx';

export default function CustomerHome() {
  const [supportOpen, setSupportOpen] = useState(false);

  return (
    // Hizalama dengesi için w-full yapıldı, harici padding'ler kaldırıldı
    <div className="w-full space-y-8 animate-fade-in relative text-zinc-950">
      
      {/* 1 — Karşılama ve Harita Alanı */}
      <WelcomeHero onSupportClick={() => setSupportOpen(true)} />
      
      {supportOpen && <SupportModal onClose={() => setSupportOpen(false)} />}

      {/* 2 — Talepler Paneli (Tam Genişlik) */}
      <RequestsPanel />

      {/* 3 — Sık Sorulan Sorular */}
      <FaqSection />

    </div>
  );
}