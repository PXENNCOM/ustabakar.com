import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../services/index';
import { Table, Pagination, StatusBadge, Spinner, EmptyState, Modal, Button } from '../../components/ui';
import toast from 'react-hot-toast';
import { MessageSquare, Eye, CheckCircle } from 'lucide-react';

function TicketRow({ ticket, onDetail }) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 text-sm font-medium text-gray-900">#{ticket.id}</td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
          ticket.sender_type === 'master' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
        }`}>
          {ticket.sender_type === 'master' ? 'Usta' : 'Müşteri'}
        </span>
      </td>
      <td className="px-4 py-3">
        <p className="text-sm text-gray-900 truncate max-w-xs">{ticket.message}</p>
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">
        {new Date(ticket.created_at).toLocaleDateString('tr-TR')}
      </td>
      <td className="px-4 py-3"><StatusBadge status={ticket.status} /></td>
      <td className="px-4 py-3">
        <button onClick={() => onDetail(ticket)} className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
          <Eye size={14} /> İncele
        </button>
      </td>
    </tr>
  );
}

function TicketDetailModal({ ticket, open, onClose }) {
  const queryClient = useQueryClient();
  const [note, setNote] = useState(ticket?.admin_note || '');
  const [loading, setLoading] = useState(false);

  const handleClose = async () => {
    if (!note.trim()) { toast.error('Admin notu zorunludur'); return; }
    setLoading(true);
    try {
      await adminService.closeTicket(ticket.id, note);
      toast.success('Ticket kapatıldı');
      queryClient.invalidateQueries(['admin-tickets']);
      onClose();
    } catch {
      toast.error('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (!ticket) return null;

  return (
    <Modal open={open} onClose={onClose} title={`Ticket #${ticket.id}`} size="md">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
            ticket.sender_type === 'master' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
          }`}>
            {ticket.sender_type === 'master' ? 'Usta' : 'Müşteri'}
          </span>
          <StatusBadge status={ticket.status} />
          <span className="text-xs text-gray-400">{new Date(ticket.created_at).toLocaleDateString('tr-TR')}</span>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-1">Mesaj</p>
          <p className="text-sm text-gray-800 leading-relaxed">{ticket.message}</p>
        </div>

        {ticket.status === 'open' ? (
          <>
            <div>
              <label className="label">Admin Notu</label>
              <textarea
                rows={3}
                className="input resize-none"
                placeholder="Yapılan işlemi not edin..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={onClose}>İptal</Button>
              <Button variant="success" className="flex-1" onClick={handleClose} loading={loading}>
                <CheckCircle size={15} /> Tamamlandı Olarak Kapat
              </Button>
            </div>
          </>
        ) : (
          <div className="bg-green-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Admin Notu</p>
            <p className="text-sm text-gray-800">{ticket.admin_note || '-'}</p>
            <p className="text-xs text-gray-400 mt-2">
              Kapatılma: {ticket.closed_at ? new Date(ticket.closed_at).toLocaleDateString('tr-TR') : '-'}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default function AdminTickets() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ status: '', sender_type: '' });
  const [selected, setSelected] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-tickets', page, filters],
    queryFn: () => adminService.getTickets({ page, limit: 20, ...filters }),
    keepPreviousData: true,
  });

  const tickets = data?.data?.data?.items || [];
  const pagination = data?.data?.data?.pagination;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Tickets</h1>
        {pagination && <p className="text-sm text-gray-500 mt-0.5">Toplam {pagination.total} ticket</p>}
      </div>

      {/* Filtreler */}
      <div className="flex gap-3">
        <select className="input bg-white text-sm w-44" value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}>
          <option value="">Tüm Durumlar</option>
          <option value="open">Açık</option>
          <option value="closed">Kapatıldı</option>
        </select>
        <select className="input bg-white text-sm w-44" value={filters.sender_type} onChange={(e) => setFilters((f) => ({ ...f, sender_type: e.target.value }))}>
          <option value="">Tüm Göndericiler</option>
          <option value="master">Usta</option>
          <option value="customer">Müşteri</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        {isLoading ? (
          <Spinner />
        ) : tickets.length === 0 ? (
          <EmptyState icon={MessageSquare} title="Ticket bulunamadı" />
        ) : (
          <>
            <Table headers={['#', 'Gönderen', 'Mesaj', 'Tarih', 'Durum', '']}>
              {tickets.map((t) => (
                <TicketRow key={t.id} ticket={t} onDetail={(ticket) => setSelected(ticket)} />
              ))}
            </Table>
            {pagination && <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />}
          </>
        )}
      </div>

      <TicketDetailModal
        ticket={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}