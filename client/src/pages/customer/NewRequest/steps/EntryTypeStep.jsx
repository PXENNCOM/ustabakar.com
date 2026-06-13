import { Link as LinkIcon, Edit3, Check } from 'lucide-react';

const OPTIONS = [
  { value: 'link', icon: LinkIcon, title: 'İlan Linki Ekle', desc: 'sahibinden, arabam vb. ilan adresi' },
  { value: 'manual', icon: Edit3, title: 'Manuel Veri Gir', desc: 'Araç detaylarını kendiniz yazın' },
];

export default function EntryTypeStep({ value, onChange }) {
  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-50 pb-2">
        <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-zinc-400">AŞAMA 01</span>
        <h2 className="text-base font-bold text-zinc-900 tracking-tight mt-0.5">Veri Giriş Metodu</h2>
        <p className="text-xs text-zinc-400 mt-1">Sisteme aracı nasıl kaydetmek istersiniz?</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`relative flex flex-col items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200 group active:scale-[0.98] ${
                active ? 'border-[#ffe119] bg-zinc-50/50 shadow-sm' : 'border-zinc-200/80 bg-white hover:border-zinc-300'
              }`}
            >
              {active && (
                <span className="absolute top-4 right-4 w-5 h-5 bg-zinc-900 rounded-lg flex items-center justify-center shadow-sm">
                  <Check size={11} className="text-[#ffe119]" strokeWidth={3} />
                </span>
              )}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-200 ${
                active ? 'bg-[#ffe119] border-[#ffe119] text-zinc-900' : 'bg-zinc-50 border-zinc-100 text-zinc-400 group-hover:text-zinc-900'
              }`}>
                <Icon size={16} strokeWidth={2.2} />
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-900 uppercase tracking-tight">{opt.title}</p>
                <p className="text-xs font-medium text-zinc-400 mt-1 leading-relaxed">{opt.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}