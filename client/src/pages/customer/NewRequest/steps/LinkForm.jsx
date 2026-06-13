import { MapPin, Link as LinkIcon, ChevronDown } from 'lucide-react';

export default function LinkForm({ form, onChange, errors, cities }) {
  return (
    <div className="space-y-5 text-left">
      <div className="border-b border-zinc-50 pb-2">
        <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-zinc-400">AŞAMA 02</span>
        <h2 className="text-base font-bold text-zinc-900 tracking-tight mt-0.5">İlan Bağlantı Detayı</h2>
      </div>

      {/* İl Seçimi */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Usta Aranacak Hedef İl</label>
        <div className="relative">
          <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          <select
            style={{ appearance: 'none' }}
            className={`w-full pl-9 pr-9 py-3.5 text-sm font-semibold text-zinc-800 bg-zinc-50 border-2 rounded-xl outline-none transition-all cursor-pointer ${
              errors.city_id ? 'border-red-400 focus:bg-white' : 'border-zinc-100 focus:border-[#ffe119] focus:bg-white'
            }`}
            value={form.city_id}
            onChange={(e) => onChange('city_id', e.target.value)}
          >
            <option value="">İnceleme ilini seçiniz</option>
            {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        {errors.city_id && <p className="text-xs font-bold text-red-500 uppercase mt-1 tracking-wide">{errors.city_id}</p>}
      </div>

      {/* İlan Linki */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Araç İlan Linki</label>
        <div className="relative">
          <LinkIcon size={14} className="absolute left-3.5 top-4 text-zinc-400 pointer-events-none" />
          <textarea
            rows={3}
            style={{ resize: 'none' }}
            placeholder="https://www.sahibinden.com/ilan/..."
            className={`w-full pl-9 pr-4 py-3.5 text-sm font-semibold text-zinc-800 bg-zinc-50 border-2 rounded-xl outline-none transition-all ${
              errors.listing_url ? 'border-red-400 focus:bg-white' : 'border-zinc-100 focus:border-[#ffe119] focus:bg-white'
            }`}
            value={form.listing_url}
            onChange={(e) => onChange('listing_url', e.target.value)}
          />
        </div>
        {errors.listing_url && <p className="text-xs font-bold text-red-500 uppercase mt-1 tracking-wide">{errors.listing_url}</p>}
      </div>

      {/* Ek Not */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Uzmana Özel Notunuz (Opsiyonel)</label>
        <textarea
          rows={3}
          style={{ resize: 'none' }}
          placeholder="Örn: Özellikle sol kapıdaki çiziğe ve motor sesine dikkat edilmesini rica ederim."
          className="w-full px-4 py-3.5 text-sm font-semibold text-zinc-800 bg-zinc-50 border-2 border-zinc-100 rounded-xl outline-none transition-all focus:border-[#ffe119] focus:bg-white"
          value={form.customer_note}
          onChange={(e) => onChange('customer_note', e.target.value)}
        />
      </div>
    </div>
  );
}