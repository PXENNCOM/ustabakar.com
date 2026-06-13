import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { masterService } from '../../services/index';
import { StatusBadge, Spinner, EmptyState } from '../../components/ui';
import { Car, ChevronRight, CheckCircle, Clock, MapPin, Award } from 'lucide-react';

// Aktif görev kartı - Tam genişlikte premium bento kart stili
function ActiveAssignmentCard({ assignment, onClick }) {
  const req = assignment.Request;
  const title = req.brand && req.model
    ? `${req.brand} ${req.model} ${req.year || ''}`.trim()
    : 'İlan Linki ile Talep';

  return (
    <div className="w-full bg-[#1A2238] rounded-2xl p-6 md:p-8 text-white border border-zinc-800 shadow-[0_15px_30px_rgba(26,34,56,0.25)] relative overflow-hidden group">
      {/* Arka plan parlama efekti */}
      <div className="absolute -right-10 -top-10 w-60 h-60 bg-[#ffe119]/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#ffe119] animate-pulse"></span>
          <span className="text-[#ffe119] text-[10px] font-black uppercase tracking-widest font-mono">
            AKSIYON BEKLEYEN GÖREV
          </span>
        </div>
        <span className="bg-white/10 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md">
          DEVAM EDİYOR
        </span>
      </div>

      <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-2 text-white">{title}</h3>
      
      <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-bold uppercase tracking-wider mb-8">
        <MapPin size={14} className="text-[#ffe119]" />
        <span>{req.City?.name}</span>
      </div>

      {/* Sitenin ana buton kalıbıyla eşleşen tam genişlikteki buton */}
      <button
        onClick={onClick}
        className="w-full bg-[#ffe119] text-[#1A2238] font-black uppercase tracking-wider text-xs rounded-xl py-4 flex items-center justify-center gap-2 hover:bg-white hover:text-[#1A2238] transition-all duration-300 transform active:scale-[0.99] group"
      >
        <span>Göreve Başla / Detaylar</span>
        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"></path>
        </svg>
      </button>
    </div>
  );
}

// Geçmiş görev kartı - Tam genişlikte temiz, keskin ve kurumsal satır
function HistoryCard({ assignment, onClick }) {
  const req = assignment.Request;
  const title = req?.brand && req?.model
    ? `${req.brand} ${req.model} ${req.year || ''}`.trim()
    : 'Araç Talebi';

  return (
    <button
      onClick={onClick}
      className="w-full bg-white border border-zinc-100 rounded-xl p-5 flex items-center gap-4 hover:border-[#1A2238] hover:shadow-md transition-all text-left group"
    >
      <div className="w-12 h-12 bg-[#ffe119]/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-[#ffe119]/20">
        <CheckCircle size={20} className="text-[#1A2238]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-black text-[#1A2238] uppercase tracking-tight truncate">{title}</p>
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mt-1 flex items-center gap-1.5">
          <span>{req?.City?.name}</span>
          <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
          <span>{new Date(assignment.completed_at).toLocaleDateString('tr-TR')}</span>
        </p>
      </div>
      <ChevronRight size={16} className="text-zinc-300 group-hover:text-[#1A2238] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
    </button>
  );
}

export default function MasterHome() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: activeData, isLoading: activeLoading } = useQuery({
    queryKey: ['master-active-assignment'],
    queryFn: () => masterService.getActiveAssignment(),
    refetchInterval: 30000,
  });

  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ['master-assignment-history'],
    queryFn: () => masterService.getAssignmentHistory({ limit: 5 }),
  });

  const activeAssignment = activeData?.data?.data;
  const history = historyData?.data?.data?.items || [];

  return (
    // HİZALAMA KİLİDİ: w-full yapıldı, tüm harici dolgular (px-4, md:px-16, py-6) temizlendi.
    <div className="w-full space-y-8 font-sans">
      
      {/* Üst Karşılama Alanı - Tam Genişlikte Profil Barı */}
      <div className="w-full flex items-center justify-between bg-zinc-50 border border-zinc-100 p-6 rounded-2xl">
        <div>
          <span className="text-[10px] font-mono font-black text-zinc-400 tracking-widest uppercase block">
            GÜVENİLİR USTA PANELİ
          </span>
          <h1 className="text-xl md:text-2xl font-black text-[#1A2238] uppercase tracking-tight mt-0.5">
            {user?.name} {user?.surname} 👋
          </h1>
        </div>
        <div className="w-12 h-12 rounded-xl bg-[#1A2238] flex items-center justify-center text-[#ffe119] shadow-sm">
          <Award size={22} />
        </div>
      </div>

      {/* Aktif görev alanı */}
      <div className="w-full space-y-3">
        <span className="text-[10px] font-mono font-black text-zinc-400 tracking-widest uppercase block px-1">
          MEVCUT DURUM
        </span>
        {activeLoading ? (
          <div className="w-full py-12 flex justify-center"><Spinner /></div>
        ) : activeAssignment ? (
          <ActiveAssignmentCard
            assignment={activeAssignment}
            onClick={() => navigate(`/usta/gorev/${activeAssignment.id}`)}
          />
        ) : (
          <div className="w-full bg-white border-2 border-dashed border-zinc-200 rounded-2xl p-10 text-center select-none">
            <Clock size={36} className="text-zinc-300 mx-auto mb-3" />
            <p className="text-sm font-black text-[#1A2238] uppercase tracking-wider">Aktif göreviniz bulunmuyor</p>
            <p className="text-xs font-medium text-zinc-400 mt-1.5 max-w-md mx-auto">Sistem üzerinden yeni bir araç inceleme görevi atandığında burada listelenecektir.</p>
          </div>
        )}
      </div>

      {/* Geçmiş görevler alanı */}
      <div className="w-full space-y-4">
        <div className="w-full flex items-center justify-between border-b border-zinc-100 pb-2 px-1">
          <h2 className="text-xs font-mono font-black text-zinc-400 tracking-widest uppercase">
            GEÇMİŞ GÖREVLERİNİZ
          </h2>
          {history.length > 0 && (
            <span className="text-[10px] font-mono font-black bg-zinc-100 text-[#1A2238] px-2.5 py-1 rounded-md">
              {history.length} GÖREV
            </span>
          )}
        </div>

        {historyLoading ? (
          <div className="w-full py-12 flex justify-center"><Spinner /></div>
        ) : history.length === 0 ? (
          <div className="w-full bg-white border border-zinc-100 rounded-2xl p-10">
            <EmptyState
              icon={Car}
              title="Henüz tamamlanan görev yok"
              description="Müşteriler için tamamladığınız araç ön kontrol raporları burada listelenecektir."
            />
          </div>
        ) : (
          <div className="w-full space-y-3">
            {history.map((a) => (
              <HistoryCard
                key={a.id}
                assignment={a}
                onClick={() => navigate(`/usta/gorev/${a.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}