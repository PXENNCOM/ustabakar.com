import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { masterService } from '../../services/index';
import { Spinner } from '../../components/ui';
import { DollarSign, Clock, CheckCircle } from 'lucide-react';

const FILTERS = [
  { key: 'this_month', label: 'BU AY' },
  { key: 'last_month', label: 'GEÇEN AY' },
  { key: 'all',        label: 'TÜMÜ' },
];

// ─── KPI CARD ─────────────────────────────────────────────────────────────────
function KpiCard({ label, value, dark, accent }) {
  if (dark) return (
    <div className="relative flex flex-col justify-between p-6 rounded-2xl bg-[#1A2238] border border-zinc-800 overflow-hidden shadow-sm">
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#ffe119]/10 rounded-full blur-2xl pointer-events-none" />
      <div className="relative z-10">
        <span className="text-[10px] font-mono font-black tracking-widest uppercase text-zinc-400">{label}</span>
        <p className="text-2xl md:text-3xl font-black text-[#ffe119] mt-2 leading-none tracking-tight">{value}</p>
      </div>
      <div className="relative z-10 mt-4 h-px w-full bg-zinc-800">
        <div className="h-px w-8 bg-[#ffe119]" />
      </div>
    </div>
  );

  if (accent) return (
    <div className="relative flex flex-col justify-between p-6 rounded-2xl bg-[#ffe119] border border-amber-300 overflow-hidden shadow-sm">
      <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/20 rounded-full pointer-events-none" />
      <div className="relative z-10">
        <span className="text-[10px] font-mono font-black tracking-widest uppercase text-[#1A2238]/60">{label}</span>
        <p className="text-2xl md:text-3xl font-black text-[#1A2238] mt-2 leading-none tracking-tight">{value}</p>
      </div>
      <div className="relative z-10 mt-4 h-px w-full bg-amber-300">
        <div className="h-px w-8 bg-[#1A2238]/30" />
      </div>
    </div>
  );

  return (
    <div className="relative flex flex-col justify-between p-6 rounded-2xl bg-white border border-zinc-100 overflow-hidden group hover:border-zinc-200 transition-all duration-200 shadow-sm">
      <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-zinc-50 rounded-full pointer-events-none" />
      <div className="relative z-10">
        <span className="text-[10px] font-mono font-black tracking-widest uppercase text-zinc-400">{label}</span>
        <p className="text-2xl md:text-3xl font-black text-[#1A2238] mt-2 leading-none tracking-tight">{value}</p>
      </div>
      <div className="relative z-10 mt-4 h-px w-full bg-zinc-100">
        <div className="h-px w-8 bg-zinc-300 group-hover:w-12 transition-all duration-300" />
      </div>
    </div>
  );
}

// ─── EARNING ROW ──────────────────────────────────────────────────────────────
function EarningRow({ earning }) {
  const req   = earning.Assignment?.Request;
  const title = req?.brand && req?.model
    ? `${req.brand} ${req.model} ${req.year || ''}`.trim()
    : 'İlan Linki ile Talep';
  const paid  = earning.status === 'paid';

  return (
    <div className="flex items-center gap-4 py-4 border-b border-zinc-100 last:border-0 group hover:bg-zinc-50/60 transition-colors px-2 rounded-xl">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border transition-colors ${
        paid ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-200'
      }`}>
        {paid ? <CheckCircle size={18} strokeWidth={2.5} /> : <Clock size={18} strokeWidth={2.5} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-black text-[#1A2238] uppercase tracking-tight truncate">{title}</p>
        <p className="text-[11px] font-mono font-bold text-zinc-400 uppercase mt-1">
          {new Date(earning.created_at).toLocaleDateString('tr-TR')}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-black text-[#1A2238] tracking-tight">
          {Number(earning.net_amount).toLocaleString('tr-TR')} ₺
        </p>
        <p className={`text-[10px] font-black uppercase tracking-wider mt-1 ${paid ? 'text-emerald-600' : 'text-amber-600'}`}>
          {paid ? 'Ödendi' : 'Bekliyor'}
        </p>
      </div>
    </div>
  );
}

// ─── MAIN BİLEŞEN ─────────────────────────────────────────────────────────────
export default function MasterEarnings() {
  const [filter, setFilter] = useState('this_month');

  const { data, isLoading } = useQuery({
    queryKey: ['master-earnings', filter],
    queryFn:  () => masterService.getEarnings({ filter }),
  });

  const result     = data?.data?.data;
  const earnings   = result?.items    || [];
  const totalNet   = result?.totalNet  || 0;
  const pendingNet = result?.pendingNet || 0;
  const paidNet    = totalNet - pendingNet;

  return (
    <div className="space-y-6 font-sans">

      {/* Üst Başlık Alanı */}
      <div className="border-b border-zinc-100 pb-4">
        <p className="text-[10px] font-mono font-black tracking-widest uppercase text-zinc-400">USTA PANELİ GÖSTERGELERİ</p>
        <h1 className="text-xl font-black text-[#1A2238] uppercase tracking-tight mt-0.5">KAZANÇLARIM VE RAPORLAR</h1>
      </div>

      {/* KPI Kartları - Bento Grid Uyumlu */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Toplam Hakediş" value={`${Number(totalNet).toLocaleString('tr-TR')} ₺`} dark />
        <KpiCard label="Hesaba Bekleyen" value={`${Number(pendingNet).toLocaleString('tr-TR')} ₺`} accent={pendingNet > 0} />
        <KpiCard label="Ödenen Nakit"    value={`${Number(paidNet).toLocaleString('tr-TR')} ₺`} />
        <KpiCard label="Tamamlanan İş"   value={earnings.length} />
      </div>

      {/* Filtreler - Modern Premium Navigasyon Tarzı */}
      <div className="w-full flex gap-2 bg-zinc-50 border border-zinc-100 p-1.5 rounded-xl max-w-md">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`flex-1 py-2.5 rounded-lg text-[11px] font-black tracking-wider transition-all duration-200 active:scale-[0.97] uppercase ${
              filter === f.key
                ? 'bg-[#1A2238] text-[#ffe119] shadow-sm'
                : 'text-zinc-400 hover:text-[#1A2238]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Liste Bölümü */}
      <div className="w-full bg-white border border-zinc-100 rounded-2xl px-5 py-2 shadow-sm">
        {isLoading ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : earnings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center select-none">
            <div className="w-14 h-14 bg-zinc-50 border border-zinc-100 rounded-2xl flex items-center justify-center mb-4 text-[#1A2238]">
              <DollarSign size={24} strokeWidth={2.5} />
            </div>
            <p className="text-sm font-black text-[#1A2238] uppercase tracking-wider">Seçilen dönemde kazanç yok</p>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mt-1.5">Tamamlayıp onaylattığınız inceleme görevleri burada listelenecektir.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-50">
            {earnings.map((e) => <EarningRow key={e.id} earning={e} />)}
          </div>
        )}
      </div>

    </div>
  );
}