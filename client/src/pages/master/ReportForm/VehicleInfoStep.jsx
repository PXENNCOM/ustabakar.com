import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { commonService } from '../../../services/index';

const COLORS = [
  'Beyaz', 'Siyah', 'Gri', 'Gümüş', 'Kırmızı', 'Mavi',
  'Lacivert', 'Yeşil', 'Sarı', 'Turuncu', 'Kahverengi', 'Bej',
  'Bordo', 'Mor', 'Altın', 'Şampanya',
];

function FieldLabel({ children, required }) {
  return (
    <label className="block text-[11px] font-black text-[#1A2238] uppercase tracking-widest mb-2">
      {children} {required && <span className="text-red-500">*</span>}
    </label>
  );
}

function TextInput({ value, onChange, placeholder, className = '', ...props }) {
  return (
    <input
      className={`w-full bg-zinc-50 border-2 border-zinc-100 font-bold text-sm text-[#1A2238] px-4 py-3.5 rounded-xl focus:bg-white focus:border-[#ffe119] outline-none transition-all ${className}`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      {...props}
    />
  );
}

function SelectInput({ value, onChange, children, disabled }) {
  return (
    <select
      className={`w-full bg-zinc-50 border-2 border-zinc-100 font-bold text-sm text-[#1A2238] px-4 py-3.5 rounded-xl focus:bg-white focus:border-[#ffe119] outline-none transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed`}
      value={value}
      onChange={onChange}
      disabled={disabled}
    >
      {children}
    </select>
  );
}

export default function VehicleInfoStep({ form, onChange, errors }) {
  // Markalar — her zaman çekilir
  const { data: brandsData, isLoading: brandsLoading } = useQuery({
    queryKey: ['vehicle-brands'],
    queryFn: () => commonService.getBrands(),
    staleTime: 10 * 60 * 1000,
  });

  // Modeller — marka seçilince
  const { data: modelsData, isLoading: modelsLoading } = useQuery({
    queryKey: ['vehicle-models', form.brand_marka_kodu],
    queryFn: () => commonService.getModelsByBrand(form.brand_marka_kodu),
    enabled: !!form.brand_marka_kodu,
    staleTime: 10 * 60 * 1000,
  });

  // Yıllar — model seçilince
  const { data: yearsData, isLoading: yearsLoading } = useQuery({
    queryKey: ['vehicle-years', form.model_model_kodu],
    queryFn: () => commonService.getYearsByModel(form.model_model_kodu),
    enabled: !!form.model_model_kodu,
    staleTime: 10 * 60 * 1000,
  });

  const brands = brandsData?.data?.data || [];
  const models = modelsData?.data?.data || [];
  const years = yearsData?.data?.data || [];

  const handleBrandChange = (e) => {
    const selected = brands.find((b) => b.id === parseInt(e.target.value));
    // Marka değişince model ve yılı sıfırla
    onChange('brand_id', selected?.id ?? '');
    onChange('brand_marka_kodu', selected?.marka_kodu ?? '');
    onChange('brand', selected?.adi ?? '');
    onChange('model_id', '');
    onChange('model_model_kodu', '');
    onChange('model', '');
    onChange('year_id', '');
    onChange('year', '');
  };

  const handleModelChange = (e) => {
    const selected = models.find((m) => m.id === parseInt(e.target.value));
    // Model değişince yılı sıfırla
    onChange('model_id', selected?.id ?? '');
    onChange('model_model_kodu', selected?.model_kodu ?? '');
    onChange('model', selected?.adi ?? '');
    onChange('year_id', '');
    onChange('year', '');
  };

  const handleYearChange = (e) => {
    const selected = years.find((y) => y.id === parseInt(e.target.value));
    onChange('year_id', selected?.id ?? '');
    onChange('year', selected?.adi ?? '');
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-100 pb-3">
        <h2 className="text-base font-black text-[#1A2238] uppercase tracking-tight">Araç Tescil Bilgileri</h2>
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mt-1">
          Ruhsata ve araca göre temel bilgileri doğrulayın
        </p>
      </div>

      {/* PLAKA */}
      <div>
        <FieldLabel required>PLAKA</FieldLabel>
        <input
          className={`w-full bg-zinc-50 border-2 font-black text-lg tracking-widest text-[#1A2238] px-4 py-3.5 rounded-xl uppercase focus:bg-white focus:border-[#ffe119] outline-none transition-all ${
            errors.plate ? 'border-red-500 bg-red-50/20' : 'border-zinc-100'
          }`}
          placeholder="34 ABC 123"
          value={form.plate}
          onChange={(e) => onChange('plate', e.target.value.toUpperCase())}
        />
        {errors.plate && (
          <p className="mt-1.5 text-xs font-bold text-red-500 uppercase tracking-wide">{errors.plate}</p>
        )}
      </div>

      {/* ŞASİ */}
      <div>
        <FieldLabel>ŞASİ NUMARASI (OPSİYONEL)</FieldLabel>
        <TextInput
          className="font-mono"
          placeholder="WVWZZZ1KZ..."
          value={form.chassis_no}
          onChange={(e) => onChange('chassis_no', e.target.value.toUpperCase())}
        />
      </div>

      {/* MARKA */}
      <div>
        <FieldLabel>MARKA</FieldLabel>
        <SelectInput
          value={form.brand_id || ''}
          onChange={handleBrandChange}
          disabled={brandsLoading}
        >
          <option value="">{brandsLoading ? 'Yükleniyor...' : 'Marka seçin'}</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>{b.adi}</option>
          ))}
        </SelectInput>
      </div>

      {/* MODEL */}
      <div>
        <FieldLabel>MODEL</FieldLabel>
        <SelectInput
          value={form.model_id || ''}
          onChange={handleModelChange}
          disabled={!form.brand_marka_kodu || modelsLoading}
        >
          <option value="">
            {!form.brand_marka_kodu
              ? 'Önce marka seçin'
              : modelsLoading
              ? 'Yükleniyor...'
              : 'Model seçin'}
          </option>
          {models.map((m) => (
            <option key={m.id} value={m.id}>{m.adi}</option>
          ))}
        </SelectInput>
      </div>

      {/* MODEL YILI */}
      <div>
        <FieldLabel>MODEL YILI</FieldLabel>
        <SelectInput
          value={form.year_id || ''}
          onChange={handleYearChange}
          disabled={!form.model_model_kodu || yearsLoading}
        >
          <option value="">
            {!form.model_model_kodu
              ? 'Önce model seçin'
              : yearsLoading
              ? 'Yükleniyor...'
              : 'Yıl seçin'}
          </option>
          {years.map((y) => (
            <option key={y.id} value={y.id}>{y.adi}</option>
          ))}
        </SelectInput>
      </div>

      {/* RENK */}
      <div>
        <FieldLabel>RENK</FieldLabel>
        <SelectInput value={form.color} onChange={(e) => onChange('color', e.target.value)}>
          <option value="">Renk seçin</option>
          {COLORS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </SelectInput>
      </div>

      {/* KM + MOTOR HACMİ */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>KİLOMETRE</FieldLabel>
          <TextInput
            placeholder="85000"
            inputMode="numeric"
            value={form.km}
            onChange={(e) => onChange('km', e.target.value)}
          />
        </div>
        <div>
          <FieldLabel>MOTOR HACMİ (CC)</FieldLabel>
          <TextInput
            placeholder="1600"
            inputMode="numeric"
            value={form.engine_cc}
            onChange={(e) => onChange('engine_cc', e.target.value)}
          />
        </div>
      </div>

      {/* ŞANZIMAN */}
      <div>
        <FieldLabel>ŞANZIMAN TİPİ</FieldLabel>
        <SelectInput value={form.transmission} onChange={(e) => onChange('transmission', e.target.value)}>
          <option value="">Seçiniz</option>
          <option value="Manuel">Manuel</option>
          <option value="Otomatik">Otomatik</option>
          <option value="Yarı Otomatik">Yarı Otomatik</option>
        </SelectInput>
      </div>
    </div>
  );
}