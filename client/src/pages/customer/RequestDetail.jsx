import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { customerService } from '../../services/index';
import { downloadPdf } from '../../utils/downloadPdf';
import { StatusBadge, Spinner, EmptyState } from '../../components/ui';
import { ArrowLeft, Car, CreditCard, FileText, Clock, ExternalLink, ChevronDown, ChevronUp, Camera, Download, AlertCircle } from 'lucide-react';

// Temiz, İskandinav Tarzı Bilgi Satırı
function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex justify-between items-center py-3 border-b border-zinc-100 last:border-0">
      <span className="text-sm font-medium text-zinc-400">{label}</span>
      <span className="text-sm font-semibold text-zinc-900 text-right max-w-[65%] truncate md:whitespace-normal">{value}</span>
    </div>
  );
}

// Yeni Minimalist Ödeme Kartı
function PaymentCard({ payment }) {
  if (!payment) return null;
  return (
    <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 space-y-2.5 shadow-sm text-left">
      <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-2 mb-1">
        <CreditCard size={15} className="text-zinc-400" />
        Ödeme Detayları
      </h3>
      <InfoRow label="Ödeme Yöntemi" value="Kredi Kartı" />
      <InfoRow label="İşlem Tutarı" value={`${Number(payment.amount).toLocaleString('tr-TR')} ₺`} />
      <div className="flex justify-between items-center py-2.5">
        <span className="text-sm font-medium text-zinc-400">Ödeme Durumu</span>
        <StatusBadge status={payment.status} />
      </div>
    </div>
  );
}

// Akordeon Tarzı Ekspertiz Kategorisi Bölümü
function CategorySection({ categoryName, answers }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-white border border-zinc-200/80 rounded-2xl overflow-hidden shadow-sm text-left">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-zinc-50 border-b border-zinc-100 transition-colors hover:bg-zinc-100/50"
      >
        <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider">{categoryName}</span>
        {open ? <ChevronUp size={15} className="text-zinc-500" strokeWidth={2.5} /> : <ChevronDown size={15} className="text-zinc-500" strokeWidth={2.5} />}
      </button>
      {open && (
        <div className="divide-y divide-zinc-100 px-5">
          {answers.map((a) => (
            <div key={a.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <p className="text-sm font-medium text-zinc-700 max-w-xl">{a.question?.question_text}</p>
              <div className="flex items-center gap-2 shrink-0">
                {a.selected_option && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-zinc-900 text-white">
                    {a.selected_option.option_text}
                  </span>
                )}
                {a.open_text && (
                  <p className="text-xs font-medium text-zinc-400 bg-zinc-50 px-2.5 py-1 rounded-lg border border-zinc-100">
                    {a.open_text}
                  </p>
                )}
                {!a.selected_option && !a.open_text && (
                  <span className="text-xs text-zinc-300 font-medium italic">Belirtilmedi</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Premium Rapor Detay Kartı
function ReportCard({ report, requestId }) {
  if (!report) return (
    <div className="bg-white border-2 border-dashed border-zinc-200 rounded-2xl p-10 text-center select-none">
      <Clock size={32} className="text-zinc-300 mx-auto mb-3" />
      <p className="text-sm font-bold text-zinc-800 uppercase tracking-wide">Raporunuz Hazırlanıyor</p>
      <p className="text-xs font-medium text-zinc-400 mt-1 max-w-xs mx-auto">Atanan ekspertiz uzmanı araç başında incelemeyi tamamladığında rapor burada belirecektir.</p>
    </div>
  );

  const grouped = {};
  report.answers?.forEach((a) => {
    const catName = a.question?.category?.name || 'Genel Kontroller';
    if (!grouped[catName]) grouped[catName] = [];
    grouped[catName].push(a);
  });

  return (
    <div className="space-y-6">
      {/* Şık Geçerlilik Uyarı Bandı */}
      <div className="bg-amber-50/50 border border-amber-200/60 rounded-xl px-4 py-3.5 flex items-center gap-2.5 text-xs font-medium text-amber-800 text-left">
        <AlertCircle size={16} className="shrink-0 text-amber-600" />
        <span>Bu rapor <strong>{new Date(report.created_at).toLocaleDateString('tr-TR')}</strong> tarihinde düzenlenmiştir. Aracın anlık durumunu yansıtlamaktadır.</span>
      </div>

      {/* Referans Görseldeki Tam Genişlikte Şık Rapor İndirme Butonu */}
      <button
        onClick={() => downloadPdf(`/customer/requests/${requestId}/pdf`, `rapor-${requestId}.pdf`)}
        className="w-full inline-flex items-center justify-center gap-2 bg-[#ffe119] hover:bg-zinc-900 text-zinc-900 hover:text-white font-bold text-sm py-4 rounded-xl shadow-sm border border-amber-400/20 transition-all duration-300 active:scale-[0.99]"
      >
        <Download size={16} strokeWidth={2.5} /> 
        <span>Raporu PDF Olarak İndir</span>
      </button>

      {/* Detaylı Araç Künyesi */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-sm text-left">
        <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-2 mb-4">
          <Car size={15} className="text-zinc-400" /> Ekspertiz Yapılan Araç
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-8">
          <InfoRow label="Plaka Numarası" value={report.plate} />
          <InfoRow label="Şasi Numarası" value={report.chassis_no || 'Belirtilmedi'} />
          <InfoRow label="Marka / Model" value={report.brand && report.model ? `${report.brand} ${report.model}` : null} />
          <InfoRow label="Model Yılı" value={report.year} />
          <InfoRow label="Gövde Rengi" value={report.color} />
          <InfoRow label="Şanzıman Tipi" value={report.transmission} />
          <InfoRow label="Motor Hacmi" value={report.engine_cc ? `${report.engine_cc} cc` : null} />
          <InfoRow label="Kilometre Verisi" value={report.km ? `${Number(report.km).toLocaleString('tr-TR')} km` : null} />
        </div>
      </div>

      {/* Dinamik Ekspertiz Sonuç Akordeonları */}
      {Object.keys(grouped).length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-1 text-left">Detaylı İnceleme Bulguları</h3>
          {Object.entries(grouped).map(([catName, answers]) => (
            <CategorySection key={catName} categoryName={catName} answers={answers} />
          ))}
        </div>
      )}

      {/* Usta Değerlendirme Yorumu */}
      {report.master_note && (
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-sm text-left">
          <p className="text-xs font-bold text-zinc-800 uppercase tracking-wider mb-2.5">Uzman Kanaati ve Genel Yorum</p>
          <p className="text-sm text-zinc-600 font-medium leading-relaxed bg-zinc-50 p-4 rounded-xl border border-zinc-100">{report.master_note}</p>
        </div>
      )}

      {/* Fotoğraf Galerisi Grid Yapısı */}
      {report.photos?.length > 0 && (
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-sm text-left">
          <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-2 mb-4">
            <Camera size={15} className="text-zinc-400" />
            İnceleme Esnasında Çekilen Fotoğraflar
            <span className="text-xs font-mono font-medium text-zinc-400 lowercase tracking-normal">({report.photos.length} adet)</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {report.photos.map((p) => (
              <a key={p.id} href={`http://localhost:3001${p.url}`} target="_blank" rel="noreferrer" className="relative aspect-square rounded-xl overflow-hidden bg-zinc-50 border border-zinc-100 group shadow-sm block">
                <img src={`http://localhost:3001${p.url}`} alt="" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CustomerRequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['customer-request', id],
    queryFn: () => customerService.getRequest(id),
  });

  const request = data?.data?.data;

  if (isLoading) return (
    <div className="w-full space-y-4 text-left">
      <button onClick={() => navigate('/musteri')} className="p-2.5 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 rounded-xl transition-all border border-zinc-200/60"><ArrowLeft size={18} strokeWidth={2.5} /></button>
      <div className="py-12"><Spinner /></div>
    </div>
  );

  if (error || !request) return (
    <div className="w-full space-y-4 text-left">
      <button onClick={() => navigate('/musteri')} className="p-2.5 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 rounded-xl transition-all border border-zinc-200/60"><ArrowLeft size={18} strokeWidth={2.5} /></button>
      <EmptyState icon={FileText} title="Talep kaydı bulunamadı" description="Aradığınız ekspertiz talebi sistemde mevcut olmayabilir veya silinmiş olabilir." />
    </div>
  );

  const activeAssignment = request.Assignments?.[0];
  const report = activeAssignment?.Report;

  return (
    <div className="w-full space-y-6 font-sans">
      
      {/* Üst Header Barı */}
      <div className="flex items-center gap-4 border-b border-zinc-100 pb-4 text-left">
        <button 
          onClick={() => navigate('/musteri')} 
          className="p-2.5 bg-zinc-50 hover:bg-[#ffe119] text-zinc-700 hover:text-zinc-900 rounded-xl transition-all border border-zinc-200/60 active:scale-95 shadow-sm"
        >
          <ArrowLeft size={18} strokeWidth={2.5} />
        </button>
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-mono font-bold text-zinc-400 tracking-wider uppercase">İŞLEM DETAYI</span>
          <h1 className="text-base font-bold text-zinc-900 uppercase tracking-tight mt-0.5">#{request.id} nolu talep</h1>
        </div>
        <StatusBadge status={request.status} />
      </div>

      {/* Talep/Giriş Bilgileri */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-sm text-left">
        <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-2 mb-4">
          <Car size={15} className="text-zinc-400" /> İlk Başvuru Bilgileri
        </h3>
        {request.entry_type === 'link' ? (
          <>
            <InfoRow label="Giriş Metodu" value="İlan Linki ile Talep" />
            {request.listing_url && (
              <div className="flex justify-between items-center py-3 border-b border-zinc-100">
                <span className="text-sm font-medium text-zinc-400">Hedef Araç İlanı</span>
                <a 
                  href={request.listing_url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center gap-1 bg-zinc-900 text-white font-bold text-xs uppercase tracking-wider px-3 py-1.5 rounded-lg hover:bg-[#ffe119] hover:text-zinc-900 transition-colors"
                >
                  İlanı İncele <ExternalLink size={12} strokeWidth={2.5} />
                </a>
              </div>
            )}
          </>
        ) : (
          <>
            <InfoRow label="Marka" value={request.brand} />
            <InfoRow label="Model Detayı" value={request.model} />
            <InfoRow label="Model Yılı" value={request.year} />
            <InfoRow label="Araç Sahibi (Satıcı)" value={request.seller_name} />
            <InfoRow label="Satıcı İletişim" value={request.seller_phone} />
          </>
        )}
        <InfoRow label="Hizmet Verilecek İl" value={request.City?.name} />
        
        {/* Özel Müşteri Notu Alanı */}
        {request.customer_note && (
          <div className="pt-4 border-t border-zinc-50 mt-2">
            <p className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider mb-2">Uzmana İlettiğiniz Notunuz</p>
            <div className="bg-zinc-50 rounded-xl px-4 py-3 border border-zinc-100">
              <p className="text-sm text-zinc-600 font-medium leading-relaxed">{request.customer_note}</p>
            </div>
          </div>
        )}
      </div>

      {/* Ödeme Kartı */}
      <PaymentCard payment={request.Payment} />

      {/* Can alıcı Ekspertiz Rapor Gövdesi */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-1 text-left">Nihai Ekspertiz Raporu</h3>
        <ReportCard report={report} requestId={request.id} />
      </div>
    </div>
  );
}