import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { customerService } from '../../../services/index';
import { StatusBadge, Spinner } from '../../../components/ui';
import {
  ChevronRight, Car, CheckCircle, Clock, Layers,
  Search, Shield, FileText,
} from 'lucide-react';

const ACTIVE_STATUSES = ['pending_payment', 'pending_receipt', 'pending_assignment', 'assigned'];
const DONE_STATUSES   = ['completed', 'cancelled', 'rejected'];

const HOW_STEPS = [
  { icon: Search,   title: 'Talep Oluştur',  desc: 'Aracın markasını, modelini ya da ilan linkini girerek talebini oluştur.' },
  { icon: Shield,   title: 'Uzman Ataması',  desc: 'Bölgendeki deneyimli ekspertiz uzmanı talebine atanır ve seninle iletişime geçer.' },
  { icon: FileText, title: 'Raporu Al',      desc: 'İnceleme tamamlanınca detaylı PDF rapor e-postana ve paneline iletir.' },
];

// ─── KPI CARD ─────────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, dark = false, accent = false }) {
  if (dark) {
    return (
      <div className="relative flex flex-col justify-between p-6 rounded-2xl bg-[#1A2238] border border-zinc-800 overflow-hidden shadow-sm">
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#ffe119]/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <span className="text-[10px] font-mono font-black tracking-widest uppercase text-zinc-400">{label}</span>
          <p className="text-3xl font-black text-[#ffe119] mt-2 leading-none tracking-tight">{value}</p>
          {sub && <p className="text-[10px] font-mono font-black text-zinc-500 uppercase tracking-wider mt-2">{sub}</p>}
        </div>
        <div className="relative z-10 mt-4 h-px w-full bg-zinc-800">
          <div className="h-px w-8 bg-[#ffe119]" />
        </div>
      </div>
    );
  }

  if (accent) {
    return (
      <div className="relative flex flex-col justify-between p-6 rounded-2xl bg-[#ffe119] border border-amber-300 overflow-hidden shadow-sm">
        <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/20 rounded-full pointer-events-none" />
        <div className="relative z-10">
          <span className="text-[10px] font-mono font-black tracking-widest uppercase text-[#1A2238]/60">{label}</span>
          <p className="text-3xl font-black text-[#1A2238] mt-2 leading-none tracking-tight">{value}</p>
          {sub && <p className="text-[10px] font-mono font-black text-[#1A2238]/50 uppercase tracking-wider mt-2">{sub}</p>}
        </div>
        <div className="relative z-10 mt-4 h-px w-full bg-amber-300">
          <div className="h-px w-8 bg-[#1A2238]/30" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col justify-between p-6 rounded-2xl bg-white border border-zinc-100 overflow-hidden group hover:border-zinc-200 transition-all duration-200 shadow-sm">
      <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-zinc-50 rounded-full pointer-events-none" />
      <div className="relative z-10">
        <span className="text-[10px] font-mono font-black tracking-widest uppercase text-zinc-400">{label}</span>
        <p className="text-3xl font-black text-[#1A2238] mt-2 leading-none tracking-tight">{value}</p>
        {sub && <p className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-wider mt-2">{sub}</p>}
      </div>
      <div className="relative z-10 mt-4 h-px w-full bg-zinc-100">
        <div className="h-px w-8 bg-zinc-300 group-hover:w-12 transition-all duration-300" />
      </div>
    </div>
  );
}

// ─── REQUEST CARD ─────────────────────────────────────────────────────────────
function RequestCard({ request, onClick, muted = false }) {
  const { brand, model, year, listing_url, city, status, created_at } = request;
  const title = brand && model
    ? `${brand} ${model} ${year || ''}`.trim()
    : listing_url ? 'İlan Linki ile Talep' : 'Araç Talebi';

  return (
    <div
      onClick={onClick}
      className={`group flex items-center justify-between p-5 bg-white border border-zinc-100 rounded-2xl cursor-pointer transition-all duration-300 hover:border-[#ffe119] hover:shadow-md ${muted ? 'opacity-60' : ''}`}
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all duration-300 ${muted ? 'bg-zinc-50 text-zinc-400 border-zinc-100' : 'bg-zinc-50 text-[#1A2238] border-zinc-100 group-hover:bg-[#ffe119] group-hover:border-[#ffe119]'}`}>
          <Car size={18} strokeWidth={2.2} className="transition-transform duration-300 group-hover:scale-110" />
        </div>
        <div className="min-w-0 text-left">
          <h4 className="text-sm font-black text-[#1A2238] uppercase tracking-tight truncate group-hover:text-[#ffe119] transition-colors duration-200">
            {title}
          </h4>
          <div className="flex items-center gap-2 mt-1 text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
            <span>{city?.name || 'Konum Belirtilmedi'}</span>
            <span className="w-1 h-1 rounded-full bg-zinc-200" />
            <span>{new Date(created_at).toLocaleDateString('tr-TR')}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <StatusBadge status={status} />
        <ChevronRight size={16} className="text-zinc-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[#1A2238]" />
      </div>
    </div>
  );
}

// ─── SECTION TITLE ────────────────────────────────────────────────────────────
function SectionTitle({ icon: Icon, label, count }) {
  return (
    <div className="flex items-center justify-between mb-4 border-b border-zinc-50 pb-2 px-1">
      <div className="flex items-center gap-2">
        <h3 className="text-xs font-mono font-black text-zinc-400 tracking-widest uppercase">{label}</h3>
      </div>
      {count !== undefined && (
        <span className="text-[10px] font-mono font-black bg-zinc-100 text-[#1A2238] px-2.5 py-1 rounded-md uppercase">
          {count} AKTİF
        </span>
      )}
    </div>
  );
}

export default function RequestsPanel() {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['customer-requests'],
    queryFn:  () => customerService.getRequests({ limit: 50 }),
  });

  const allRequests  = data?.data?.data?.items || [];
  const activeReqs   = allRequests.filter(r => ACTIVE_STATUSES.includes(r.status));
  const doneReqs     = allRequests.filter(r => DONE_STATUSES.includes(r.status));
  const totalCount   = allRequests.length;
  const doneCount    = allRequests.filter(r => r.status === 'completed').length;
  const pendingCount = activeReqs.length;
  const isEmpty      = !isLoading && totalCount === 0;

  return (
    <div className="w-full space-y-6">
      
      {!isEmpty && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <KpiCard label="Toplam Talep" value={totalCount} sub="Sisteme Kayıtlı" />
          <KpiCard label="Tamamlanan" value={doneCount} sub="Raporlar Hazır" dark />
          <KpiCard label="İşlemdekiler" value={pendingCount} sub={pendingCount > 0 ? 'İnceleme Var' : 'Hepsi Tamam'} accent={pendingCount > 0} />
        </div>
      )}

      {!isEmpty && (
        <div className="w-full flex justify-between items-center bg-zinc-50 p-2 rounded-2xl border border-zinc-100">
          <span className="text-[10px] font-mono font-black text-zinc-400 pl-3 tracking-widest uppercase">İŞLEMLERİNİZ</span>
          <button
            onClick={() => navigate('/musteri/talepler')}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-black text-[#1A2238] bg-white border border-zinc-200 rounded-xl hover:border-[#ffe119] hover:bg-zinc-50 transition-all active:scale-95 shadow-sm uppercase tracking-wider"
          >
            <Layers size={13} />
            Tüm Talepleri Gör
          </button>
        </div>
      )}

      {isLoading && <div className="flex justify-center py-12"><Spinner /></div>}

      {!isLoading && (
        <div className="space-y-6">
          {activeReqs.length > 0 && (
            <div className="space-y-3">
              <SectionTitle label="Aktif Talepleriniz" count={activeReqs.length} />
              <div className="grid gap-3">
                {activeReqs.map(r => (
                  <RequestCard key={r.id} request={r} onClick={() => navigate(`/musteri/talepler/${r.id}`)} />
                ))}
              </div>
            </div>
          )}
          {doneReqs.length > 0 && (
            <div className="space-y-3">
              <SectionTitle label="Geçmiş İşlemler" />
              <div className="grid gap-3">
                {doneReqs.map(r => (
                  <RequestCard key={r.id} request={r} onClick={() => navigate(`/musteri/talepler/${r.id}`)} muted />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Boş Durum Kılavuzu - Koyu Lacivert ve Sarı Uyumlu */}
      {isEmpty && (
        <div className="bg-[#1A2238] border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-5 text-left">
          <h4 className="text-xs font-mono font-black text-[#ffe119] tracking-widest uppercase">Sistem Nasıl Çalışır?</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {HOW_STEPS.map((step, i) => (
              <div key={i} className="flex flex-col gap-4 items-start bg-zinc-900 border border-zinc-800 p-5 rounded-xl group hover:border-[#ffe119]/30 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-[#ffe119] text-[#1A2238] flex items-center justify-center shrink-0 group-hover:bg-white transition-colors shadow-sm">
                  <step.icon size={16} strokeWidth={2.5} />
                </div>
                <div>
                  <h5 className="text-sm font-black text-white uppercase tracking-tight">{step.title}</h5>
                  <p className="text-xs text-zinc-400 mt-2 leading-relaxed font-medium">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}