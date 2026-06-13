import { useQuery } from '@tanstack/react-query';
import { commonService } from '../../../../services/index';
import { MapPin, ChevronDown } from 'lucide-react';

const selectCls = (err) =>
  `w-full px-4 py-3.5 text-sm font-semibold text-zinc-800 bg-zinc-50 border-2 rounded-xl outline-none transition-all cursor-pointer ${
    err ? 'border-red-400 focus:bg-white' : 'border-zinc-100 focus:border-[#ffe119] focus:bg-white'
  }`;

const inputCls = (err) =>
  `w-full px-4 py-3.5 text-sm font-semibold text-zinc-800 bg-zinc-50 border-2 rounded-xl outline-none transition-all ${
    err ? 'border-red-400 focus:bg-white' : 'border-zinc-100 focus:border-[#ffe119] focus:bg-white'
  }`;

const Label = ({ children }) => (
  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">{children}</label>
);

const FieldError = ({ msg }) =>
  msg ? <p className="text-xs font-bold text-red-500 uppercase mt-1 tracking-wide">{msg}</p> : null;

export default function ManualForm({ form, onChange, errors, cities }) {
  const { data: brandsData } = useQuery({ queryKey: ['brands'], queryFn: () => commonService.getBrands() });
  
  const brands = brandsData?.data?.data || [];

  return (
    <div className="space-y-5 text-left">
      <div className="border-b border-zinc-50 pb-2">
        <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-zinc-400">AŞAMA 02</span>
        <h2 className="text-base font-bold text-zinc-900 tracking-tight mt-0.5">Araç Detay Formu</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Araç Markası</Label>
          <div className="relative">
            <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            <select
              style={{ appearance: 'none' }}
              className={selectCls(errors.brand_id)}
              value={form.brand_id}
              onChange={(e) => {
                const selected = brands.find((b) => b.id === parseInt(e.target.value));
                onChange('brand_id', e.target.value);
                onChange('brand', selected?.adi || '');
              }}
            >
              <option value="">Marka seçiniz</option>
              {brands.map((b) => <option key={b.id} value={b.id}>{b.adi}</option>)}
            </select>
          </div>
          <FieldError msg={errors.brand_id} />
        </div>

        <div>
          <Label>Model Adı</Label>
          <input className={inputCls(errors.model_id)} placeholder="Örn: Corolla / C-Ceed" value={form.model} onChange={(e) => onChange('model', e.target.value)} />
          <FieldError msg={errors.model_id} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Model Yılı</Label>
          <input className={inputCls(false)} placeholder="Örn: 2018" inputMode="numeric" maxLength={4} value={form.year} onChange={(e) => onChange('year', e.target.value)} />
        </div>
        <div>
          <Label>Usta Aranacak İl</Label>
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
              <option value="">İl seçiniz</option>
              {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <FieldError msg={errors.city_id} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Satıcı Adı Soyadı</Label>
          <input className={inputCls(false)} placeholder="İletiş kurulacak kişi" value={form.seller_name} onChange={(e) => onChange('seller_name', e.target.value)} />
        </div>
        <div>
          <Label>Satıcı Telefon Numarası</Label>
          <input className={inputCls(false)} placeholder="05XX XXX XX XX" inputMode="tel" maxLength={11} value={form.seller_phone} onChange={(e) => onChange('seller_phone', e.target.value)} />
        </div>
      </div>

      <div>
        <Label>Ek Not (Opsiyonel)</Label>
        <textarea
          rows={3}
          style={{ resize: 'none' }}
          className="w-full px-4 py-3.5 text-sm font-semibold text-zinc-800 bg-zinc-50 border-2 border-zinc-100 rounded-xl outline-none transition-all focus:border-[#ffe119] focus:bg-white"
          placeholder="Özellikle incelenmesini istediğiniz noktalar..."
          value={form.customer_note}
          onChange={(e) => onChange('customer_note', e.target.value)}
        />
      </div>
    </div>
  );
}