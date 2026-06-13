import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { adminService, commonService } from '../../services/index';
import { Table, Pagination, StatusBadge, Spinner, EmptyState } from '../../components/ui';
import { FileText, Search, Eye, Filter, X, ChevronDown, ChevronUp, CreditCard } from 'lucide-react';

const statusOptions = [
  { value: '', label: 'Tümü', color: 'bg-gray-100 text-gray-600' },
  { value: 'pending_assignment', label: 'Usta Atanmadı', color: 'bg-red-100 text-red-700' },
  { value: 'assigned', label: 'Usta Atandı', color: 'bg-blue-100 text-blue-700' },
  { value: 'completed', label: 'Tamamlandı', color: 'bg-green-100 text-green-700' },
];


const EMPTY_FILTERS = {
  search: '',
  status: '',
  city_id: '',
  entry_type: '',
  date_from: '',
  date_to: '',
};

function StatusTabs({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {statusOptions.map((s) => (
        <button
          key={s.value}
          onClick={() => onChange('status', value === s.value ? '' : s.value)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
            value === s.value
              ? `${s.color} border-transparent shadow-sm scale-105`
              : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
          }`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}

function FilterPanel({ filters, onChange, onReset, cities }) {
  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-gray-500" />
          <span className="text-sm font-semibold text-gray-700">Gelişmiş Filtreler</span>
          {activeCount > 0 && (
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{activeCount}</span>
          )}
        </div>
        {activeCount > 0 && (
          <button onClick={onReset} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-medium">
            <X size={12} /> Temizle
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {/* Arama */}
        <div className="col-span-2 xl:col-span-1">
          <label className="text-xs font-medium text-gray-500 block mb-1">Alıcı / Araç</label>
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="input pl-8 text-sm" placeholder="Ad, soyad veya araç..." value={filters.search} onChange={(e) => onChange('search', e.target.value)} />
          </div>
        </div>

        {/* İl */}
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">Hizmet İli</label>
          <select className="input bg-white text-sm" value={filters.city_id} onChange={(e) => onChange('city_id', e.target.value)}>
            <option value="">Tüm İller</option>
            {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {/* Giriş tipi */}
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">Talep Tipi</label>
          <select className="input bg-white text-sm" value={filters.entry_type} onChange={(e) => onChange('entry_type', e.target.value)}>
            <option value="">Tümü</option>
            <option value="link">İlan Linki</option>
            <option value="manual">Manuel Giriş</option>
          </select>
        </div>

        {/* Tarih */}
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">Başlangıç Tarihi</label>
          <input type="date" className="input text-sm" value={filters.date_from} onChange={(e) => onChange('date_from', e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">Bitiş Tarihi</label>
          <input type="date" className="input text-sm" value={filters.date_to} onChange={(e) => onChange('date_to', e.target.value)} />
        </div>
      </div>
    </div>
  );
}

function RequestRow({ request, onDetail }) {
  const { id, Customer, brand, model, year, listing_url, City, status, Payment, created_at, entry_type } = request;
  const vehicleTitle = brand && model ? `${brand} ${model} ${year || ''}`.trim() : 'İlan Linki';

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 text-sm font-bold text-gray-500">#{id}</td>
      <td className="px-4 py-3">
        <p className="text-sm font-semibold text-gray-900">{Customer?.name} {Customer?.surname}</p>
        <p className="text-xs text-gray-400 mt-0.5">{Customer?.phone}</p>
      </td>
      <td className="px-4 py-3">
        <p className="text-sm font-medium text-gray-900">{vehicleTitle}</p>
        <p className="text-xs text-gray-400 mt-0.5">{City?.name}</p>
      </td>
      <td className="px-4 py-3">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
          entry_type === 'link' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
        }`}>
          {entry_type === 'link' ? 'İlan Linki' : 'Manuel'}
        </span>
      </td>
      <td className="px-4 py-3">
  <div className="flex items-center gap-1 text-xs text-gray-600">
    <CreditCard size={12} className="text-gray-400" /> Kart
  </div>
  {Payment?.amount && (
    <p className="text-xs font-semibold text-gray-900 mt-0.5">{Number(Payment.amount).toLocaleString('tr-TR')} ₺</p>
  )}
</td>
      <td className="px-4 py-3 text-xs text-gray-500">{new Date(created_at).toLocaleDateString('tr-TR')}</td>
      <td className="px-4 py-3"><StatusBadge status={status} /></td>
      <td className="px-4 py-3">
        <button onClick={() => onDetail(id)} className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
          <Eye size={14} /> Detay
        </button>
      </td>
    </tr>
  );
}

export default function AdminRequests() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const onChange = (field, value) => {
    setFilters((f) => ({ ...f, [field]: value }));
    setPage(1);
  };

  const onReset = () => { setFilters(EMPTY_FILTERS); setPage(1); };
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const { data, isLoading } = useQuery({
    queryKey: ['admin-requests', page, filters],
    queryFn: () => adminService.getRequests({ page, limit: 20, ...filters }),
    keepPreviousData: true,
  });

  const { data: citiesData } = useQuery({
    queryKey: ['cities'],
    queryFn: () => commonService.getCities(),
  });

  const requests  = data?.data?.data?.items || [];
  const pagination = data?.data?.data?.pagination;
  const cities    = citiesData?.data?.data || [];

  return (
    <div className="space-y-5">

      {/* Başlık */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Talepler</h1>
          {pagination && <p className="text-sm text-gray-500 mt-0.5">Toplam {pagination.total} talep</p>}
        </div>
        <button
          onClick={() => setShowFilters((s) => !s)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
            showFilters || activeFilterCount > 0
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
          }`}
        >
          <Filter size={15} />
          Filtrele
          {activeFilterCount > 0 && (
            <span className="bg-white text-blue-600 text-xs font-bold px-1.5 py-0.5 rounded-full">{activeFilterCount}</span>
          )}
          {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Hızlı durum filtreleri */}
      <StatusTabs value={filters.status} onChange={onChange} />

      {/* Gelişmiş filtreler */}
      {showFilters && (
        <FilterPanel filters={filters} onChange={onChange} onReset={onReset} cities={cities} />
      )}

      {/* Tablo */}
      <div className="card overflow-hidden">
        {isLoading ? (
          <Spinner />
        ) : requests.length === 0 ? (
          <EmptyState icon={FileText} title="Talep bulunamadı" description="Filtrelerinizi değiştirmeyi deneyin" />
        ) : (
          <>
            <Table headers={['#', 'Alıcı', 'Araç / İl', 'Tip', 'Ödeme', 'Tarih', 'Durum', '']}>
              {requests.map((r) => (
                <RequestRow key={r.id} request={r} onDetail={(id) => navigate(`/admin/talepler/${id}`)} />
              ))}
            </Table>
            {pagination && (
              <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />
            )}
          </>
        )}
      </div>
    </div>
  );
}