import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { masterService } from '../../services/index';
import { downloadPdf } from '../../utils/downloadPdf';
import { StatusBadge, Spinner, EmptyState } from '../../components/ui';
import { ArrowLeft, Car, Phone, ExternalLink, FileText, AlertCircle, ClipboardList, Download, MapPin, Clock, ShieldCheck } from 'lucide-react';

// Kurumsal temaya uygun, temiz satır yapısı
function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex justify-between items-start py-4 border-b border-zinc-100 last:border-0">
      <span className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">{label}</span>
      <span className="text-sm font-black text-[#1A2238] uppercase tracking-tight text-right max-w-[60%]">{value}</span>
    </div>
  );
}

export default function MasterAssignmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['master-assignment', id],
    queryFn: () => masterService.getAssignment(id),
  });

  const assignment = data?.data?.data;
  const request = assignment?.Request;

  if (isLoading) return (
    <div className="w-full py-20 flex justify-center">
      <Spinner />
    </div>
  );

  if (!assignment) return (
    <div className="w-full">
      <button onClick={() => navigate('/usta')} className="p-2 hover:bg-zinc-100 rounded-xl mb-4 transition-all">
        <ArrowLeft size={20} className="text-[#1A2238]" />
      </button>
      <EmptyState icon={FileText} title="Görev bulunamadı" />
    </div>
  );

  return (
    <div className="space-y-6 font-sans">
      
      {/* Üst Header - Geri Butonu ve Başlık */}
      <div className="flex items-center gap-4 border-b border-zinc-100 pb-5">
        <button 
          onClick={() => navigate('/usta')} 
          className="p-3 bg-zinc-50 hover:bg-[#ffe119] text-[#1A2238] rounded-xl transition-all active:scale-95 shadow-sm"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-mono font-black text-zinc-400 tracking-[0.2em] uppercase">GÖREV DETAYI</span>
          <h1 className="text-lg font-black text-[#1A2238] uppercase tracking-tight">#{assignment.id} NOLU ATAMA</h1>
        </div>
        <StatusBadge status={assignment.status} />
      </div>

      {/* Görev Zaman Barı - Sarı Vurgulu */}
      <div className="bg-[#ffe119] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm shadow-amber-200/50">
        <div className="flex items-center gap-2.5 text-[11px] font-black text-[#1A2238] uppercase tracking-wider">
          <Clock size={16} strokeWidth={2.5} />
          <span>Atama Saati: {new Date(assignment.assigned_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-black text-[#1A2238] uppercase tracking-widest">
          <ShieldCheck size={16} strokeWidth={2.5} />
          <span>USTA BAKAR GÜVENCESİYLE</span>
        </div>
      </div>

      {/* Araç Bilgileri */}
      <div className="bg-white border border-zinc-100 rounded-2xl p-6">
        <h3 className="text-xs font-black text-[#1A2238] uppercase tracking-[0.15em] flex items-center gap-2 mb-6 opacity-40">
          <Car size={16} strokeWidth={2.5} /> ARAÇ BİLGİLERİ
        </h3>
        {request?.entry_type === 'link' ? (
          <>
            <InfoRow label="KAYIT TİPİ" value="İLAN LİNKİ" />
            {request?.listing_url && (
              <div className="flex justify-between items-center py-4 border-b border-zinc-100">
                <span className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">İLAN DETAYI</span>
                <a 
                  href={request.listing_url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="bg-[#1A2238] text-white font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-[#ffe119] hover:text-[#1A2238] transition-all"
                >
                  İLANI AÇ <ExternalLink size={12} strokeWidth={3} className="inline ml-1" />
                </a>
              </div>
            )}
          </>
        ) : (
          <>
            <InfoRow label="MARKA" value={request?.brand} />
            <InfoRow label="MODEL" value={request?.model} />
            <InfoRow label="MODEL YILI" value={request?.year} />
          </>
        )}
        
        <div className="flex justify-between items-center py-4 last:border-0">
          <span className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">HİZMET BÖLGESİ</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-[#1A2238] uppercase tracking-tight">{request?.City?.name}</span>
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(request?.City?.name + ' oto sanayi')}`}
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 flex items-center justify-center bg-zinc-50 text-[#1A2238] rounded-lg hover:bg-[#ffe119] transition-all"
            >
              <MapPin size={14} strokeWidth={2.5} />
            </a>
          </div>
        </div>
      </div>

      {/* Satıcı Bilgileri */}
      {(request?.seller_name || request?.seller_phone) && (
        <div className="bg-white border border-zinc-100 rounded-2xl p-6">
          <h3 className="text-xs font-black text-[#1A2238] uppercase tracking-[0.15em] flex items-center gap-2 mb-6 opacity-40">
            <Phone size={16} strokeWidth={2.5} /> SATICI İLETİŞİM
          </h3>
          <InfoRow label="İSİM SOYİSİM" value={request?.seller_name} />
          {request?.seller_phone && (
            <div className="flex justify-between items-center py-4">
              <span className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">TELEFON</span>
              <a
                href={`tel:${request.seller_phone}`}
                className="flex items-center gap-2 bg-[#ffe119] text-[#1A2238] px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#1A2238] hover:text-white transition-all shadow-sm"
              >
                <Phone size={14} strokeWidth={2.5} /> {request.seller_phone}
              </a>
            </div>
          )}
        </div>
      )}

      {/* Alıcı Notu - Hafif Sarı Transparan Arka Plan */}
      {request?.customer_note && (
        <div className="bg-[#ffe119]/10 border border-[#ffe119]/30 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle size={18} className="text-[#1A2238] mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <p className="text-[10px] font-black text-[#1A2238] uppercase tracking-[0.2em]">MÜŞTERİ ÖZEL NOTU</p>
              <p className="text-sm text-[#1A2238] leading-relaxed font-bold uppercase tracking-tight">{request.customer_note}</p>
              <div className="h-px bg-[#1A2238]/10 w-full my-2" />
              <p className="text-[10px] text-[#1A2238]/60 font-black uppercase tracking-widest">
                💡 LÜTFEN MÜŞTERİ TALEBİNE GÖRE İNCELEME YAPIN.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* İlan Fotoğrafları */}
      {request?.photos?.length > 0 && (
        <div className="bg-white border border-zinc-100 rounded-2xl p-6">
          <h3 className="text-xs font-black text-[#1A2238] uppercase tracking-[0.15em] mb-6 opacity-40">İLAN FOTOĞRAFLARI</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {request.photos.map((p) => (
              <div key={p.id} className="relative aspect-square rounded-xl overflow-hidden border border-zinc-50 bg-zinc-50 group">
                <img 
                  src={`${(import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace('/api', '')}${p.url}`} 
                  alt="" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alt Aksiyon Butonları */}
      <div className="w-full pt-4">
        {assignment.status === 'completed' ? (
          <div className="bg-zinc-900 rounded-2xl p-6 space-y-4">
            <div className="text-center">
              <p className="text-[#ffe119] font-black text-xs uppercase tracking-[0.2em]">BU GÖREV TAMAMLANDI</p>
              <p className="text-white/40 text-[10px] font-bold uppercase mt-1">RAPOR SİSTEME BAŞARIYLA İŞLENDİ</p>
            </div>
            <button
              onClick={() => downloadPdf(`/master/assignments/${id}/pdf`, `rapor-${id}.pdf`)}
              className="w-full flex items-center justify-center gap-3 bg-white text-[#1A2238] font-black text-xs uppercase tracking-widest py-4 rounded-xl hover:bg-[#ffe119] transition-all shadow-lg"
            >
              <Download size={18} strokeWidth={2.5} /> PDF RAPORUNU İNDİR
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate(`/usta/rapor/${assignment.id}`)}
            className="w-full bg-[#ffe119] hover:bg-[#1A2238] text-[#1A2238] hover:text-white font-black rounded-2xl py-5 flex items-center justify-center gap-3 transition-all shadow-[0_10px_20px_rgba(255,225,25,0.3)] hover:shadow-none text-xs uppercase tracking-[0.15em] group"
          >
            <ClipboardList size={20} strokeWidth={2.5} />
            RAPORU DOLDURMAYA BAŞLA
          </button>
        )}
      </div>
    </div>
  );
}