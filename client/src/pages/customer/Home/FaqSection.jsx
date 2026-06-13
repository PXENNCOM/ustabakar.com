import { MapPin, Clock, ShieldCheck } from 'lucide-react';

const FAQ_ITEMS = [
  {
    icon: MapPin,
    q: 'İnceleme nerede yapılıyor?',
    a: 'Uzmanımız aracın bulunduğu konuma gelerek yerinde inceleme yapar. Galeri, satıcı adresi veya sanayide randevu ayarlanabilir.',
  },
  {
    icon: Clock,
    q: 'Ne kadar sürede sonuç alırım?',
    a: 'Uzman ataması genellikle 2–4 saat içinde gerçekleşir. İnceleme tamamlandıktan sonra ön kontrol raporu aynı gün panelinize iletilir.',
  },
  {
    icon: ShieldCheck,
    q: 'Ödeme güvenli mi?',
    a: 'Evet. Ödeme, inceleme süreci tamamlanmadan uzman havuz hesabına aktarılmaz. Randevu iptali durumunda kesintisiz tam iade yapılır.',
  },
];

export default function FaqSection() {
  return (
    <div className="py-6 font-sans text-left">

      {/* Header */}
      <div className="flex items-start justify-between border-b border-zinc-100 pb-3 mb-6">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-mono font-black tracking-widest uppercase text-zinc-400">
            HIZLI KILAVUZ VE DESTEK
          </span>
          <h3 className="text-base font-black text-[#1A2238] uppercase tracking-tight">
            Sık Sorulan Sorular
          </h3>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {FAQ_ITEMS.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="relative overflow-hidden bg-white border border-zinc-200 rounded-2xl p-6 flex flex-col gap-4 hover:border-[#ffe119] transition-all duration-300 shadow-sm"
            >
              {/* İkon Kutusu - Usta Bakar Sarısı Zemin */}
              <div className="w-10 h-10 rounded-xl bg-[#ffe119] flex items-center justify-center flex-shrink-0 text-[#1A2238]">
                <Icon size={18} strokeWidth={2.5} />
              </div>

              {/* Soru Metni - Net Kurumsal Okunaklı Siyah */}
              <p className="text-sm font-black text-[#1A2238] uppercase tracking-tight pr-6 leading-snug">
                {item.q}
              </p>

              {/* İnce Bölücü Çizgi */}
              <div className="w-8 h-[2px] bg-zinc-100" />

              {/* Cevap Metni */}
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide leading-relaxed flex-1">
                {item.a}
              </p>

              {/* Arka Plan Büyük Sayı Dekoru */}
              <span
                aria-hidden="true"
                className="absolute bottom-[-10px] right-3 text-[72px] font-black leading-none pointer-events-none select-none text-zinc-50 opacity-80"
              >
                0{i + 1}
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
}