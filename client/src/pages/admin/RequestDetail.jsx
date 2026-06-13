import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../services/index';
import { StatusBadge, Spinner, EmptyState, Modal, Button } from '../../components/ui';
import toast from 'react-hot-toast';
import {
  ArrowLeft, Car, User, CreditCard, Building2, UserCheck,
  X, ExternalLink, FileText, AlertCircle, CheckCircle, Phone
} from 'lucide-react';

const InfoRow = ({ label, value }) => !value ? null : (
  <div className="flex justify-between items-start py-2.5 border-b border-gray-50 last:border-0">
    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</span>
    <span className="text-sm font-semibold text-gray-900 text-right max-w-[60%]">{value}</span>
  </div>
);

function PaymentSection({ payment }) {
  if (!payment) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
      <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
        <CreditCard size={15} className="text-gray-400" /> Ödeme Bilgileri
      </h3>
      <InfoRow label="Yöntem" value="Kredi Kartı" />
      <InfoRow label="Tutar" value={`${Number(payment.amount).toLocaleString('tr-TR')} ₺`} />
      <div className="flex justify-between items-center py-2.5">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Durum</span>
        <StatusBadge status={payment.status} />
      </div>
    </div>
  );
}

function AssignmentSection({ request }) {
  const queryClient = useQueryClient();
  const [masterModalOpen, setMasterModalOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [selectedMaster, setSelectedMaster] = useState(null);
  const [loading, setLoading] = useState(false);

  const { data: mastersData } = useQuery({
    queryKey: ['admin-masters-by-city', request?.city_id],
    queryFn: () => adminService.getMasters({ city_id: request?.city_id, status: 'active', limit: 50 }),
    enabled: masterModalOpen,
  });

  const masters = mastersData?.data?.data?.items || [];
  const activeAssignment = request?.Assignments?.find(a => a.status === 'active');
  const canAssign = request?.Payment?.status === 'approved' && !activeAssignment;

  const assign = async () => {
    if (!selectedMaster) { toast.error('Usta seçin'); return; }
    setLoading(true);
    try {
      await adminService.assignMaster(request.id, selectedMaster.id);
      toast.success('Usta atandı');
      setMasterModalOpen(false);
      setSelectedMaster(null);
      queryClient.invalidateQueries(['admin-request', String(request.id)]);
    } catch { toast.error('Hata oluştu'); }
    finally { setLoading(false); }
  };

  const cancelAssignment = async () => {
    setLoading(true);
    try {
      await adminService.cancelAssignment(request.id, cancelReason);
      toast.success('Görev iptal edildi');
      setCancelOpen(false);
      queryClient.invalidateQueries(['admin-request', String(request.id)]);
    } catch { toast.error('Hata oluştu'); }
    finally { setLoading(false); }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
      <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
        <UserCheck size={15} className="text-gray-400" /> Usta Atama
      </h3>

      {activeAssignment ? (
        <div className="space-y-3">
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
            <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider mb-1">Atanan Usta</p>
            <p className="text-sm font-bold text-blue-900">{activeAssignment.Master?.name} {activeAssignment.Master?.surname}</p>
            <p className="text-xs text-blue-500 mt-0.5 flex items-center gap-1"><Phone size={10} /> {activeAssignment.Master?.phone}</p>
          </div>
          <Button variant="danger" size="sm" className="w-full" onClick={() => setCancelOpen(true)}>
            <X size={14} /> Görevi İptal Et
          </Button>
        </div>
      ) : canAssign ? (
        <Button variant="primary" className="w-full" onClick={() => setMasterModalOpen(true)}>
          <UserCheck size={14} /> Usta Ata
        </Button>
      ) : (
        <div className="bg-gray-50 rounded-xl px-4 py-3 text-xs text-gray-500">
          {request?.Payment?.status !== 'approved'
            ? '⚠️ Ödeme onaylanmadan usta atanamaz'
            : 'Bu talep usta ataması için uygun değil'}
        </div>
      )}

      <Modal open={masterModalOpen} onClose={() => setMasterModalOpen(false)} title="Usta Seç" size="md">
        <div className="space-y-3">
          <p className="text-sm text-gray-500">{request?.City?.name} ilindeki aktif ustalar</p>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {masters.length === 0
              ? <p className="text-center text-gray-400 py-6 text-sm">Bu ilde aktif usta bulunamadı</p>
              : masters.map((m) => (
                <button key={m.id} onClick={() => setSelectedMaster(m)}
                  className={`w-full text-left border-2 rounded-xl px-4 py-3 transition-all ${selectedMaster?.id === m.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <p className="text-sm font-semibold text-gray-900">{m.name} {m.surname}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{m.District?.name} · {m.expertise?.name}</p>
                </button>
              ))
            }
          </div>
          <div className="flex gap-2 pt-1">
            <Button variant="outline" className="flex-1" onClick={() => setMasterModalOpen(false)}>İptal</Button>
            <Button variant="primary" className="flex-1" onClick={assign} loading={loading}>Ata</Button>
          </div>
        </div>
      </Modal>

      <Modal open={cancelOpen} onClose={() => setCancelOpen(false)} title="Görevi İptal Et" size="sm">
        <div className="space-y-4">
          <textarea rows={3} className="input resize-none" placeholder="İptal sebebi (opsiyonel)..." value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} />
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setCancelOpen(false)}>Vazgeç</Button>
            <Button variant="danger" className="flex-1" onClick={cancelAssignment} loading={loading}>İptal Et</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function AdminRequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-request', id],
    queryFn: () => adminService.getRequest(id),
  });

  const request = data?.data?.data;

  if (isLoading) return <div className="p-6"><Spinner /></div>;
  if (!request) return <EmptyState icon={FileText} title="Talep bulunamadı" />;

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/talepler')}
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:border-gray-300 transition-all">
          <ArrowLeft size={17} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">Talep #{request.id}</h1>
          <p className="text-sm text-gray-400 mt-0.5">{new Date(request.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <StatusBadge status={request.status} />
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Sol kolon */}
        <div className="col-span-2 space-y-4">

          {/* Araç bilgileri */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-4">
              <Car size={15} className="text-gray-400" /> Araç Bilgileri
            </h3>
            {request.entry_type === 'link' ? (
              <>
                <InfoRow label="Tip" value="İlan Linki" />
                {request.listing_url && (
                  <div className="flex justify-between items-center py-2.5 border-b border-gray-50">
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">İlan</span>
                    <a href={request.listing_url} target="_blank" rel="noreferrer" className="text-blue-600 text-sm flex items-center gap-1 hover:underline">
                      Görüntüle <ExternalLink size={12} />
                    </a>
                  </div>
                )}
              </>
            ) : (
              <>
                <InfoRow label="Marka"   value={request.brand} />
                <InfoRow label="Model"   value={request.model} />
                <InfoRow label="Yıl"     value={request.year} />
                <InfoRow label="Satıcı"  value={request.seller_name} />
                <InfoRow label="Tel"     value={request.seller_phone} />
              </>
            )}
            <InfoRow label="Hizmet İli" value={request.City?.name} />
            {request.customer_note && (
              <div className="mt-3 bg-yellow-50 border border-yellow-100 rounded-xl px-4 py-3 flex items-start gap-2">
                <AlertCircle size={14} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-yellow-800">{request.customer_note}</p>
              </div>
            )}
          </div>

          {/* Ödeme */}
          <PaymentSection payment={request.Payment} requestId={request.id} />

          {/* Rapor */}
          {request.Assignments?.[0]?.Report && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-3">
                <FileText size={15} className="text-gray-400" /> Rapor
              </h3>
              <Button variant="outline" className="w-full" onClick={() => navigate(`/admin/raporlar/${request.Assignments[0].Report.id}`)}>
                Raporu Görüntüle
              </Button>
            </div>
          )}
        </div>

        {/* Sağ kolon */}
        <div className="space-y-4">
          {/* Alıcı */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-4">
              <User size={15} className="text-gray-400" /> Alıcı
            </h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center font-bold text-blue-600">
                {request.Customer?.name?.[0]}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{request.Customer?.name} {request.Customer?.surname}</p>
                <p className="text-xs text-gray-400 mt-0.5">{request.Customer?.phone}</p>
              </div>
            </div>
          </div>

          {/* Usta atama */}
          <AssignmentSection request={request} />
        </div>
      </div>
    </div>
  );
}