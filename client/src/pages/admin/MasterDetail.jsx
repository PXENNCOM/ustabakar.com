import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../services/index';
import { StatusBadge, Spinner, EmptyState, ConfirmModal, Button } from '../../components/ui';
import toast from 'react-hot-toast';
import {
  ArrowLeft, User, CheckCircle, XCircle, Trash2, DollarSign,
  TrendingUp, MapPin, Wrench, Calendar, Phone, ClipboardList,
  Award, Clock, AlertTriangle, Star, Activity, FileText,
  ExternalLink, Image, ShieldCheck, Briefcase,
} from 'lucide-react';

// ── Yardımcı bileşenler ──────────────────────────────────────────────────────

const InfoRow = ({ label, value, mono }) => !value ? null : (
  <div className="flex justify-between items-start py-2.5 border-b border-gray-50 last:border-0">
    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</span>
    <span className={`text-sm font-semibold text-gray-900 text-right max-w-[60%] ${mono ? 'font-mono' : ''}`}>{value}</span>
  </div>
);

const StatCard = ({ label, value, sub, icon: Icon, color }) => {
  const colors = {
    blue:   'bg-blue-50 text-blue-600',
    green:  'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red:    'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
    gray:   'bg-gray-100 text-gray-500',
  };
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${colors[color] || colors.gray}`}>
        <Icon size={16} />
      </div>
      <p className="text-xl font-black text-gray-900 leading-none">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      <p className="text-xs font-medium text-gray-400 mt-1">{label}</p>
    </div>
  );
};

function CompletionBar({ rate }) {
  const color = rate >= 80 ? 'bg-green-500' : rate >= 50 ? 'bg-yellow-400' : 'bg-red-400';
  const textColor = rate >= 80 ? 'text-green-600' : rate >= 50 ? 'text-yellow-600' : 'text-red-500';
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-medium text-gray-500">Tamamlanma Oranı</span>
        <span className={`text-sm font-black ${textColor}`}>%{rate}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${rate}%` }} />
      </div>
    </div>
  );
}

function AssignmentRow({ a }) {
  const statusMap = {
    completed:   { label: 'Tamamlandı', cls: 'bg-green-100 text-green-700' },
    cancelled:   { label: 'İptal',      cls: 'bg-red-100 text-red-600' },
    active:      { label: 'Aktif',      cls: 'bg-blue-100 text-blue-700' },
    in_progress: { label: 'Devam Ediyor', cls: 'bg-yellow-100 text-yellow-700' },
  };
  const s = statusMap[a.status] || { label: a.status, cls: 'bg-gray-100 text-gray-500' };
  const vehicle = a.Request?.brand && a.Request?.model
    ? `${a.Request.brand} ${a.Request.model} ${a.Request.year || ''}`.trim()
    : `Talep #${a.request_id}`;

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <div>
        <p className="text-sm font-semibold text-gray-900">{vehicle}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {a.Request?.City?.name || '—'} · {new Date(a.created_at).toLocaleDateString('tr-TR')}
        </p>
      </div>
      <div className="flex items-center gap-3">
        {a.Earning?.net_amount && (
          <span className="text-sm font-bold text-gray-700">
            {Number(a.Earning.net_amount).toLocaleString('tr-TR')} ₺
          </span>
        )}
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.cls}`}>{s.label}</span>
      </div>
    </div>
  );
}

// ── Ana bileşen ──────────────────────────────────────────────────────────────

export default function AdminMasterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [confirm, setConfirm] = useState({ open: false, action: null, title: '', message: '', variant: 'primary' });
  const [loading, setLoading] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-master', id],
    queryFn:  () => adminService.getMaster(id),
  });

  const master = data?.data?.data;

  const act = (action, title, message, variant = 'primary') =>
    setConfirm({ open: true, action, title, message, variant });

  const handleAction = async () => {
    setLoading(true);
    try {
      await confirm.action();
      queryClient.invalidateQueries(['admin-master', id]);
      queryClient.invalidateQueries(['admin-masters']);
      setConfirm((c) => ({ ...c, open: false }));
    } catch { toast.error('Bir hata oluştu'); }
    finally   { setLoading(false); }
  };

  if (isLoading) return <div className="p-6"><Spinner /></div>;
  if (!master)   return <EmptyState icon={User} title="Usta bulunamadı" />;

  const completionRate = master.completionRate ?? 0;
  const maskedTc = master.tc
    ? `${master.tc.slice(0, 3)}****${master.tc.slice(-3)}`
    : null;

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/ustalar')}
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-all"
        >
          <ArrowLeft size={17} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-gray-900 truncate">{master.name} {master.surname}</h1>
          <p className="text-sm text-gray-400 mt-0.5">{master.phone}</p>
        </div>
        <StatusBadge status={master.status} />
      </div>

      {/* ── Profil Hero ── */}
      <div className="bg-gray-900 rounded-2xl p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center">

        {/* Bilgiler */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-2 mb-2">
            {master.expertise?.name && (
              <span className="flex items-center gap-1 text-xs text-gray-300 bg-white/10 px-2.5 py-1 rounded-lg">
                <Wrench size={11} /> {master.expertise.name}
              </span>
            )}
            {master.City?.name && (
              <span className="flex items-center gap-1 text-xs text-gray-300 bg-white/10 px-2.5 py-1 rounded-lg">
                <MapPin size={11} /> {master.City.name}{master.District?.name ? ` / ${master.District.name}` : ''}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-gray-300 bg-white/10 px-2.5 py-1 rounded-lg">
              <Calendar size={11} /> {master.activeDays ?? '—'} gündür sistemde
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-300 bg-white/10 px-2.5 py-1 rounded-lg">
              <ClipboardList size={11} /> {master.registered_by === 'admin' ? 'Admin kaydı' : 'Başvuru'}
            </span>
          </div>

          {/* Tamamlanma oranı */}
          <div className="mt-3 max-w-xs">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">Tamamlanma oranı</span>
              <span className="text-white font-bold">%{completionRate}</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${completionRate >= 80 ? 'bg-green-400' : completionRate >= 50 ? 'bg-yellow-400' : 'bg-red-400'}`}
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Kazanç özeti */}
        <div className="shrink-0 text-right border-t sm:border-t-0 sm:border-l border-white/10 pt-4 sm:pt-0 sm:pl-6 w-full sm:w-auto">
          <p className="text-3xl font-black text-[#ffe119]">
            {Number(master.totalEarning || 0).toLocaleString('tr-TR')} ₺
          </p>
          <p className="text-xs text-gray-400 mt-0.5">Toplam Kazanç</p>
          {master.monthlyAvg > 0 && (
            <p className="text-sm text-gray-300 mt-1 font-semibold">
              ~{Number(master.monthlyAvg).toLocaleString('tr-TR', { maximumFractionDigits: 0 })} ₺ / ay
            </p>
          )}
        </div>
      </div>

      {/* ── Stat Kartları ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard label="Tamamlanan İş"    value={master.completedCount ?? 0}         icon={CheckCircle}   color="green" />
        <StatCard label="İptal İş"         value={master.cancelledCount ?? 0}         icon={AlertTriangle} color="red" />
        <StatCard label="Aktif İş"         value={master.activeAssignmentCount ?? 0}  icon={Activity}      color="blue" />
        <StatCard label="Bekleyen Ödeme"
          value={`${Number(master.pendingEarning || 0).toLocaleString('tr-TR')} ₺`}
          icon={DollarSign} color="yellow"
        />
      </div>

      {/* ── Ana İçerik ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Sol: Kişisel Bilgiler + Sertifika */}
        <div className="xl:col-span-2 space-y-5">

          {/* Kişisel Bilgiler */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User size={15} className="text-gray-400" /> Kişisel Bilgiler
            </h3>
            <InfoRow label="Ad Soyad"    value={`${master.name} ${master.surname}`} />
            <InfoRow label="Telefon"     value={master.phone} />
            <InfoRow label="TC Kimlik"   value={maskedTc} mono />
            <InfoRow label="Telefon Doğrulama" value={master.phone_verified ? '✓ Doğrulandı' : '✗ Doğrulanmadı'} />
            <InfoRow label="İl / İlçe"   value={[master.City?.name, master.District?.name].filter(Boolean).join(' / ')} />
            <InfoRow label="Uzmanlık"    value={master.expertise?.name} />
            <InfoRow label="Tecrübe"     value={master.experience} />
            <InfoRow label="Ekipman"     value={master.equipment} />
            <InfoRow label="Referans"    value={master.reference} />
            <InfoRow label="Kayıt Tarihi" value={new Date(master.created_at).toLocaleDateString('tr-TR')} />
          </div>

          {/* Sertifika & Fotoğraf */}
          {(master.certificate_url || master.profile_photo_url) && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award size={15} className="text-gray-400" /> Belgeler
              </h3>
              <div className="flex flex-wrap gap-3">
                {master.profile_photo_url && (
                  <a href={master.profile_photo_url} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
                    <Image size={13} /> Profil Fotoğrafı <ExternalLink size={11} />
                  </a>
                )}
                {master.certificate_url && (
                  <a href={master.certificate_url} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 text-xs font-semibold text-green-600 hover:text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-100">
                    <ShieldCheck size={13} /> Sertifika <ExternalLink size={11} />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Son İşler */}
          {master.recentAssignments?.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase size={15} className="text-gray-400" /> Son İşler
              </h3>
              <div>
                {master.recentAssignments.map((a) => (
                  <AssignmentRow key={a.id} a={a} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sağ: İşlemler */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-gray-900">İşlemler</h3>

            {master.status === 'pending' && (
              <>
                <Button variant="success" className="w-full" onClick={() => act(
                  () => adminService.approveMaster(id).then(() => toast.success('Usta onaylandı')),
                  'Ustayı Onayla', 'Bu ustayı onaylamak istiyor musunuz?', 'success'
                )}>
                  <CheckCircle size={14} /> Onayla
                </Button>
                <Button variant="danger" className="w-full" onClick={() => act(
                  () => adminService.rejectMaster(id).then(() => toast.success('Reddedildi')),
                  'Başvuruyu Reddet', 'Bu başvuruyu reddetmek istiyor musunuz?', 'danger'
                )}>
                  <XCircle size={14} /> Reddet
                </Button>
              </>
            )}

            {master.status === 'active' && (
              <Button variant="secondary" className="w-full" onClick={() => act(
                () => adminService.deactivateMaster(id).then(() => toast.success('Pasife alındı')),
                'Pasife Al', 'Ustayı pasife almak istiyor musunuz?', 'danger'
              )}>
                <XCircle size={14} /> Pasife Al
              </Button>
            )}

            {master.status === 'passive' && (
              <Button variant="success" className="w-full" onClick={() => act(
                () => adminService.activateMaster(id).then(() => toast.success('Aktif edildi')),
                'Aktif Et', 'Ustayı tekrar aktif etmek istiyor musunuz?', 'success'
              )}>
                <CheckCircle size={14} /> Aktif Et
              </Button>
            )}

            {master.pendingEarning > 0 && (
              <Button variant="primary" className="w-full" onClick={() => act(
                () => adminService.markMasterPaid(id).then(() => toast.success('İşaretlendi')),
                'Ödeme Yapıldı',
                `${Number(master.pendingEarning).toLocaleString('tr-TR')} ₺ ödendi olarak işaretlenecek.`,
                'primary'
              )}>
                <DollarSign size={14} /> Ödeme Yapıldı
              </Button>
            )}

            {master.status !== 'deleted' && (
              <>
                <div className="border-t border-gray-100 pt-3" />
                <Button variant="danger" className="w-full" onClick={() => act(
                  () => adminService.removeMaster(id).then(() => { toast.success('Kaldırıldı'); navigate('/admin/ustalar'); }),
                  'Ustayı Sil', 'Bu işlem geri alınamaz. Devam etmek istiyor musunuz?', 'danger'
                )}>
                  <Trash2 size={14} /> Sistemden Kaldır
                </Button>
              </>
            )}
          </div>

          {/* Özet Kartı */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-2">
            <p className="text-[10px] font-mono font-bold tracking-widest uppercase text-gray-400 mb-3">Performans Özeti</p>
            <CompletionBar rate={completionRate} />
            <div className="pt-2 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Toplam İş</span>
                <span className="font-bold text-gray-900">{(master.completedCount ?? 0) + (master.cancelledCount ?? 0)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Aktif İş</span>
                <span className="font-bold text-gray-900">{master.activeAssignmentCount ?? 0}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Aylık Ortalama</span>
                <span className="font-bold text-gray-900">
                  {Number(master.monthlyAvg || 0).toLocaleString('tr-TR', { maximumFractionDigits: 0 })} ₺
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Sistemde</span>
                <span className="font-bold text-gray-900">{master.activeDays ?? '—'} gün</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={confirm.open}
        onClose={() => setConfirm((c) => ({ ...c, open: false }))}
        onConfirm={handleAction}
        title={confirm.title}
        message={confirm.message}
        confirmVariant={confirm.variant}
        loading={loading}
      />
    </div>
  );
}