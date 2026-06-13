import { useQueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../services/index';
import { Table, Pagination, StatusBadge, Spinner, EmptyState, ConfirmModal } from '../../components/ui';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ClipboardList, CheckCircle, XCircle, Eye } from 'lucide-react';

function ApplicationRow({ master, onApprove, onReject, onDetail }) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <p className="text-sm font-medium text-gray-900">{master.name} {master.surname}</p>
        <p className="text-xs text-gray-400">{master.phone}</p>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{master.City?.name}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{master.expertise?.name || '-'}</td>
      <td className="px-4 py-3 text-sm text-gray-500">{new Date(master.created_at).toLocaleDateString('tr-TR')}</td>
      <td className="px-4 py-3 text-sm text-gray-500">{master.registered_by === 'admin' ? 'Admin' : 'Uygulama'}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onApprove(master)}
            className="flex items-center gap-1 text-green-600 hover:text-green-700 text-sm font-medium"
          >
            <CheckCircle size={14} /> Onayla
          </button>
          <span className="text-gray-200">|</span>
          <button
            onClick={() => onReject(master)}
            className="flex items-center gap-1 text-red-500 hover:text-red-600 text-sm font-medium"
          >
            <XCircle size={14} /> Reddet
          </button>
          <span className="text-gray-200">|</span>
          <button
            onClick={() => onDetail(master.id)}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            <Eye size={14} /> Detay
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function AdminApplications() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState({ open: false, master: null, type: null });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-applications', page],
    queryFn: () => adminService.getApplications({ page, limit: 20 }),
    keepPreviousData: true,
  });

  const masters = data?.data?.data?.items || [];
  const pagination = data?.data?.data?.pagination;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      if (confirm.type === 'approve') {
        await adminService.approveMaster(confirm.master.id);
        toast.success('Başvuru onaylandı');
      } else {
        await adminService.rejectMaster(confirm.master.id);
        toast.success('Başvuru reddedildi');
      }
      queryClient.invalidateQueries(['admin-applications']);
      setConfirm({ open: false, master: null, type: null });
    } catch {
      toast.error('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Usta Başvuruları</h1>
        {pagination && <p className="text-sm text-gray-500 mt-0.5">Toplam {pagination.total} bekleyen başvuru</p>}
      </div>

      <div className="card overflow-hidden">
        {isLoading ? (
          <Spinner />
        ) : masters.length === 0 ? (
          <EmptyState icon={ClipboardList} title="Bekleyen başvuru yok" description="Tüm başvurular işlendi" />
        ) : (
          <>
            <Table headers={['Ad Soyad', 'İl', 'Uzmanlık', 'Başvuru Tarihi', 'Kayıt Yöntemi', 'İşlemler']}>
              {masters.map((m) => (
                <ApplicationRow
                  key={m.id}
                  master={m}
                  onApprove={(master) => setConfirm({ open: true, master, type: 'approve' })}
                  onReject={(master) => setConfirm({ open: true, master, type: 'reject' })}
                  onDetail={(id) => navigate(`/admin/ustalar/${id}`)}
                />
              ))}
            </Table>
            {pagination && <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />}
          </>
        )}
      </div>

      <ConfirmModal
        open={confirm.open}
        onClose={() => setConfirm({ open: false, master: null, type: null })}
        onConfirm={handleConfirm}
        title={confirm.type === 'approve' ? 'Başvuruyu Onayla' : 'Başvuruyu Reddet'}
        message={
          confirm.type === 'approve'
            ? `${confirm.master?.name} ${confirm.master?.surname} adlı ustanın başvurusunu onaylamak istiyor musunuz?`
            : `${confirm.master?.name} ${confirm.master?.surname} adlı ustanın başvurusunu reddetmek istiyor musunuz?`
        }
        confirmText={confirm.type === 'approve' ? 'Onayla' : 'Reddet'}
        confirmVariant={confirm.type === 'approve' ? 'success' : 'danger'}
        loading={loading}
      />
    </div>
  );
}