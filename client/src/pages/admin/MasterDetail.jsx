import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../services/index';
import { StatusBadge, Spinner, EmptyState, ConfirmModal, Button } from '../../components/ui';
import toast from 'react-hot-toast';
import { ArrowLeft, User, CheckCircle, XCircle, Trash2, DollarSign, TrendingUp, MapPin, Wrench, Calendar, Phone, ClipboardList } from 'lucide-react';

const InfoRow = ({ label, value }) => !value ? null : (
  <div className="flex justify-between items-start py-2.5 border-b border-gray-50 last:border-0">
    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</span>
    <span className="text-sm font-semibold text-gray-900 text-right max-w-[60%]">{value}</span>
  </div>
);

const StatCard = ({ label, value, icon: Icon, bg }) => (
  <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-3">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>
      <Icon size={17} className="text-white" />
    </div>
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-base font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

export default function AdminMasterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [confirm, setConfirm] = useState({ open: false, action: null, title: '', message: '', variant: 'primary' });
  const [loading, setLoading] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-master', id],
    queryFn: () => adminService.getMaster(id),
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
    finally { setLoading(false); }
  };

  if (isLoading) return <div className="p-6"><Spinner /></div>;
  if (!master) return <EmptyState icon={User} title="Usta bulunamadı" />;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/ustalar')}
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-all"
        >
          <ArrowLeft size={17} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">{master.name} {master.surname}</h1>
          <p className="text-sm text-gray-400 mt-0.5">{master.phone}</p>
        </div>
        <StatusBadge status={master.status} />
      </div>

      {/* Hero banner */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 rounded-2xl p-6 text-white flex items-center gap-5">
        <div className="flex-1">
          <p className="font-bold text-lg">{master.name} {master.surname}</p>
          <div className="flex flex-wrap gap-3 mt-1.5">
            {master.expertise?.name && (
              <span className="flex items-center gap-1 text-xs text-gray-300">
                <Wrench size={11} /> {master.expertise.name}
              </span>
            )}
            {master.City?.name && (
              <span className="flex items-center gap-1 text-xs text-gray-300">
                <MapPin size={11} /> {master.City.name}{master.District?.name ? ` / ${master.District.name}` : ''}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-gray-300">
              <Calendar size={11} /> {new Date(master.created_at).toLocaleDateString('tr-TR')}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black">{master.completedCount || 0}</p>
          <p className="text-xs text-gray-400 mt-0.5">Tamamlanan İş</p>
        </div>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard label="Toplam Kazanç"   value={`${Number(master.totalEarning || 0).toLocaleString('tr-TR')} ₺`}   icon={TrendingUp}    bg="bg-blue-600" />
        <StatCard label="Bekleyen Ödeme"  value={`${Number(master.pendingEarning || 0).toLocaleString('tr-TR')} ₺`} icon={DollarSign}    bg="bg-yellow-500" />
        <StatCard label="Tamamlanan İş"   value={master.completedCount || 0}                                          icon={CheckCircle}   bg="bg-green-600" />
        <StatCard label="Kayıt Yöntemi"   value={master.registered_by === 'admin' ? 'Admin' : 'Başvuru'}              icon={ClipboardList} bg="bg-gray-500" />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Kişisel bilgiler */}
        <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <User size={15} className="text-gray-400" /> Kişisel Bilgiler
          </h3>
          <InfoRow label="Ad Soyad"   value={`${master.name} ${master.surname}`} />
          <InfoRow label="Telefon"    value={master.phone} />
          <InfoRow label="İl / İlçe"  value={[master.City?.name, master.District?.name].filter(Boolean).join(' / ')} />
          <InfoRow label="Uzmanlık"   value={master.expertise?.name} />
          <InfoRow label="Tecrübe"    value={master.experience} />
          <InfoRow label="Ekipman"    value={master.equipment} />
          <InfoRow label="Referans"   value={master.reference} />
          <InfoRow label="Kayıt"      value={new Date(master.created_at).toLocaleDateString('tr-TR')} />
        </div>

        {/* İşlemler */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-gray-900 mb-1">İşlemler</h3>

          {master.status === 'pending' && <>
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
          </>}

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
              'Ödeme Yapıldı', `${Number(master.pendingEarning).toLocaleString('tr-TR')} ₺ ödendi olarak işaretlenecek.`, 'primary'
            )}>
              <DollarSign size={14} /> Ödeme Yapıldı
            </Button>
          )}

          {master.status !== 'deleted' && (
            <>
              <div className="border-t border-gray-100 pt-3 mt-3" />
              <Button variant="danger" className="w-full" onClick={() => act(
                () => adminService.removeMaster(id).then(() => { toast.success('Kaldırıldı'); navigate('/admin/ustalar'); }),
                'Ustayı Sil', 'Bu işlem geri alınamaz. Devam etmek istiyor musunuz?', 'danger'
              )}>
                <Trash2 size={14} /> Sistemden Kaldır
              </Button>
            </>
          )}
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