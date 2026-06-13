import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../services/index';
import { Spinner, EmptyState } from '../../components/ui';
import { ArrowLeft, FileText, Car, User, Camera, ClipboardList, Download, ChevronDown, ChevronUp, CheckCircle, MessageSquare, AlertTriangle } from 'lucide-react';
import { downloadPdf } from '../../utils/downloadPdf';

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex justify-between items-start py-2.5 border-b border-gray-100 last:border-0">
      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</span>
      <span className="text-sm font-semibold text-gray-900 text-right max-w-[60%]">{value}</span>
    </div>
  );
}

function AnswerItem({ answer }) {
  const hasOption = !!answer.selected_option;
  const hasText = !!answer.open_text;

  return (
    <div className="flex items-start gap-4 py-3 border-b border-gray-50 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-600 leading-relaxed">{answer.question?.question_text}</p>
      </div>
      <div className="flex-shrink-0 flex flex-col items-end gap-1">
        {hasOption && (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100">
            <CheckCircle size={11} />
            {answer.selected_option.option_text}
          </span>
        )}
        {hasText && (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-50 text-gray-700 text-xs font-medium rounded-full border border-gray-200 max-w-48 truncate">
            <MessageSquare size={11} className="flex-shrink-0" />
            {answer.open_text}
          </span>
        )}
        {!hasOption && !hasText && (
          <span className="text-xs text-gray-300 italic">—</span>
        )}
      </div>
    </div>
  );
}

function CategoryAccordion({ catName, answers, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const answeredCount = answers.filter(a => a.selected_option || a.open_text).length;
  const total = answers.length;

  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${open ? 'border-blue-200 shadow-sm' : 'border-gray-200'}`}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between px-5 py-4 text-left transition-colors ${open ? 'bg-blue-50' : 'bg-white hover:bg-gray-50'}`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${open ? 'bg-blue-600' : 'bg-gray-100'}`}>
            <ClipboardList size={15} className={open ? 'text-white' : 'text-gray-400'} />
          </div>
          <div className="text-left">
            <p className={`text-sm font-semibold ${open ? 'text-blue-700' : 'text-gray-900'}`}>{catName}</p>
            <p className="text-xs text-gray-400 mt-0.5">{answeredCount} / {total} cevaplandı</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-16 bg-gray-200 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all ${answeredCount === total ? 'bg-green-500' : 'bg-blue-500'}`}
              style={{ width: `${(answeredCount / total) * 100}%` }}
            />
          </div>
          {open
            ? <ChevronUp size={16} className="text-blue-400" />
            : <ChevronDown size={16} className="text-gray-400" />
          }
        </div>
      </button>

      {open && (
        <div className="px-5 bg-white divide-y divide-gray-50">
          {answers.map((a) => <AnswerItem key={a.id} answer={a} />)}
        </div>
      )}
    </div>
  );
}

export default function AdminReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-report', id],
    queryFn: () => adminService.getReport(id),
  });

  const report    = data?.data?.data;
  const assignment = report?.Assignment;
  const request   = assignment?.Request;
  const master    = assignment?.Master;
  const customer  = request?.Customer;

  // Cevapları kategoriye göre grupla
  const grouped = {};
  report?.answers?.forEach((a) => {
    const catName = a.question?.category?.name || 'Genel';
    if (!grouped[catName]) grouped[catName] = [];
    grouped[catName].push(a);
  });

  const totalAnswered = report?.answers?.filter(a => a.selected_option || a.open_text).length || 0;
  const totalQuestions = report?.answers?.length || 0;

  if (isLoading) return (
    <div>
      <button onClick={() => navigate('/admin/raporlar')} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4 text-sm font-medium">
        <ArrowLeft size={18} /> Geri
      </button>
      <Spinner />
    </div>
  );

  if (!report) return (
    <div>
      <button onClick={() => navigate('/admin/raporlar')} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4 text-sm font-medium">
        <ArrowLeft size={18} /> Geri
      </button>
      <EmptyState icon={FileText} title="Rapor bulunamadı" />
    </div>
  );

  return (
    <div className=" space-y-6">

      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/raporlar')}
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-all"
        >
          <ArrowLeft size={17} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">Rapor #{report.id}</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {new Date(report.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <button
          onClick={() => downloadPdf(`/admin/reports/${id}/pdf`, `rapor-${id}.pdf`)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          <Download size={15} /> PDF İndir
        </button>
      </div>

      {/* Özet banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-5 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-xs font-medium uppercase tracking-wider mb-1">Plaka</p>
            <p className="text-3xl font-black tracking-widest">{report.plate}</p>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-xs font-medium uppercase tracking-wider mb-1">Tamamlanma</p>
            <p className="text-2xl font-bold">{totalAnswered}/{totalQuestions}</p>
            <p className="text-blue-200 text-xs mt-0.5">soru cevaplandı</p>
          </div>
        </div>
        {(report.brand || report.model) && (
          <div className="mt-4 pt-4 border-t border-white/20 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Car size={14} className="text-blue-200" />
              <span className="text-sm font-semibold">{[report.brand, report.model, report.year].filter(Boolean).join(' ')}</span>
            </div>
            {report.km && (
              <span className="text-blue-200 text-sm">{Number(report.km).toLocaleString('tr-TR')} km</span>
            )}
          </div>
        )}
      </div>

      {/* Geçerlilik uyarısı */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
        <AlertTriangle size={15} className="text-amber-500 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-amber-700 leading-relaxed">
          Bu rapor <strong>{new Date(report.created_at).toLocaleDateString('tr-TR')}</strong> tarihinde hazırlanmıştır. Araçta sonradan meydana gelen değişiklikleri kapsamaz ve güncel durumu yansıtmayabilir.
        </p>
      </div>

      {/* Taraflar */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
              <User size={13} className="text-blue-600" />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ekspertiz Uzmanı</span>
          </div>
          <p className="text-sm font-bold text-gray-900">{master?.name} {master?.surname}</p>
          <p className="text-xs text-gray-400">{master?.phone}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center">
              <User size={13} className="text-green-600" />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Alıcı</span>
          </div>
          <p className="text-sm font-bold text-gray-900">{customer?.name} {customer?.surname}</p>
          <p className="text-xs text-gray-400">{customer?.phone}</p>
        </div>
      </div>

      {/* Araç bilgileri */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-4">
          <Car size={15} className="text-gray-400" /> Araç Tescil Bilgileri
        </h3>
        <div className="grid grid-cols-2 gap-x-8">
          <div>
            <InfoRow label="Plaka"       value={report.plate} />
            <InfoRow label="Şasi No"     value={report.chassis_no} />
            <InfoRow label="Marka"       value={report.brand} />
            <InfoRow label="Model"       value={report.model} />
            <InfoRow label="Yıl"         value={report.year} />
          </div>
          <div>
            <InfoRow label="Renk"        value={report.color} />
            <InfoRow label="Şanzıman"    value={report.transmission} />
            <InfoRow label="Motor"       value={report.engine_cc ? `${report.engine_cc} cc` : null} />
            <InfoRow label="Kilometre"   value={report.km ? `${Number(report.km).toLocaleString('tr-TR')} km` : null} />
          </div>
        </div>
      </div>

      {/* Ekspertiz accordion */}
      {Object.keys(grouped).length > 0 && (
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900">
            <ClipboardList size={15} className="text-gray-400" />
            Ekspertiz Sonuçları
            <span className="text-xs font-normal text-gray-400">({Object.keys(grouped).length} kategori)</span>
          </h3>
          {Object.entries(grouped).map(([catName, answers], i) => (
            <CategoryAccordion
              key={catName}
              catName={catName}
              answers={answers}
              defaultOpen={i === 0}
            />
          ))}
        </div>
      )}

      {/* Usta notu */}
      {report.master_note && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3">
            <MessageSquare size={15} className="text-gray-400" /> Uzman Notu
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">{report.master_note}</p>
        </div>
      )}

      {/* Fotoğraflar */}
      {report.photos?.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-4">
            <Camera size={15} className="text-gray-400" />
            Araç Fotoğrafları
            <span className="text-xs font-normal text-gray-400">({report.photos.length} adet)</span>
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {report.photos.map((p) => (
              <a key={p.id} href={`${(import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace('/api', '')}${p.url}`} target="_blank" rel="noreferrer" className="group">
                <img
                  src={`${(import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace('/api', '')}${p.url}`}
                  alt=""
                  className="w-full aspect-square object-cover rounded-lg group-hover:opacity-90 transition-opacity"
                />
              </a>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}