import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { adminService, commonService } from '../../services/index';
import { Table, Pagination, StatusBadge, Spinner, EmptyState } from '../../components/ui';
import { Users, Search, Eye, Filter, X, ChevronDown, ChevronUp, Plus } from 'lucide-react';

const statusOptions = [
  { value: '', label: 'Tüm Durumlar' },
  { value: 'active', label: 'Aktif' },
  { value: 'passive', label: 'Pasif' },
  { value: 'pending', label: 'Onay Bekliyor' },
  { value: 'rejected', label: 'Reddedildi' },
];

const EMPTY_FILTERS = {
  search: '',
  status: '',
  city_id: '',
  expertise_id: '',
  registered_by: '',
  date_from: '',
  date_to: '',
};

function FilterPanel({ filters, onChange, onReset, cities, expertises }) {
  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-gray-500" />
          <span className="text-sm font-semibold text-gray-700">Filtreler</span>
          {activeCount > 0 && (
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{activeCount}</span>
          )}
        </div>
        {activeCount > 0 && (
          <button onClick={onReset} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-medium">
            <X size={12} /> Filtreleri Temizle
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {/* Arama */}
        <div className="col-span-2 xl:col-span-1">
          <label className="text-xs font-medium text-gray-500 block mb-1">İsim / Telefon</label>
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="input pl-8 text-sm"
              placeholder="Ara..."
              value={filters.search}
              onChange={(e) => onChange('search', e.target.value)}
            />
          </div>
        </div>

        {/* Durum */}
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">Durum</label>
          <select className="input bg-white text-sm" value={filters.status} onChange={(e) => onChange('status', e.target.value)}>
            {statusOptions.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        {/* İl */}
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">İl</label>
          <select className="input bg-white text-sm" value={filters.city_id} onChange={(e) => onChange('city_id', e.target.value)}>
            <option value="">Tüm İller</option>
            {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {/* Uzmanlık */}
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">Uzmanlık</label>
          <select className="input bg-white text-sm" value={filters.expertise_id} onChange={(e) => onChange('expertise_id', e.target.value)}>
            <option value="">Tüm Uzmanlıklar</option>
            {expertises.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        </div>

        {/* Kayıt Yöntemi */}
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">Kayıt Yöntemi</label>
          <select className="input bg-white text-sm" value={filters.registered_by} onChange={(e) => onChange('registered_by', e.target.value)}>
            <option value="">Tümü</option>
            <option value="admin">Admin Tarafından</option>
            <option value="app">Başvuru</option>
          </select>
        </div>

        {/* Tarih aralığı */}
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">Kayıt Başlangıç</label>
          <input type="date" className="input text-sm" value={filters.date_from} onChange={(e) => onChange('date_from', e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">Kayıt Bitiş</label>
          <input type="date" className="input text-sm" value={filters.date_to} onChange={(e) => onChange('date_to', e.target.value)} />
        </div>
      </div>
    </div>
  );
}

function MasterRow({ master, onDetail }) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <p className="text-sm font-semibold text-gray-900">{master.name} {master.surname}</p>
        <p className="text-xs text-gray-400 mt-0.5">{master.phone}</p>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{master.City?.name || '—'}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{master.expertise?.name || '—'}</td>
      <td className="px-4 py-3">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
          master.registered_by === 'admin'
            ? 'bg-purple-100 text-purple-700'
            : 'bg-gray-100 text-gray-600'
        }`}>
          {master.registered_by === 'admin' ? 'Admin' : 'Başvuru'}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">
        {new Date(master.created_at).toLocaleDateString('tr-TR')}
      </td>
      <td className="px-4 py-3"><StatusBadge status={master.status} /></td>
      <td className="px-4 py-3">
        <button onClick={() => onDetail(master.id)} className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
          <Eye size={14} /> Detay
        </button>
      </td>
    </tr>
  );
}

export default function AdminMasters() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const onChange = (field, value) => {
    setFilters((f) => ({ ...f, [field]: value }));
    setPage(1);
  };

  const onReset = () => {
    setFilters(EMPTY_FILTERS);
    setPage(1);
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const { data, isLoading } = useQuery({
    queryKey: ['admin-masters', page, filters],
    queryFn: () => adminService.getMasters({ page, limit: 20, ...filters }),
    keepPreviousData: true,
  });

  const { data: citiesData } = useQuery({
    queryKey: ['cities'],
    queryFn: () => commonService.getCities(),
  });

  const { data: expertisesData } = useQuery({
    queryKey: ['admin-expertises'],
    queryFn: () => adminService.getExpertises(),
  });

  const masters    = data?.data?.data?.items || [];
  const pagination = data?.data?.data?.pagination;
  const cities     = citiesData?.data?.data || [];
  const expertises = expertisesData?.data?.data || [];

  return (
    <div className="space-y-5">
      {/* Başlık */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Ustalar</h1>
          {pagination && <p className="text-sm text-gray-500 mt-0.5">Toplam {pagination.total} usta</p>}
        </div>
        <div className="flex items-center gap-2">
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
          <button
            onClick={() => navigate('/admin/basvurular')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-xl transition-colors"
          >
            <Plus size={15} /> Başvurular
          </button>
        </div>
      </div>

      {/* Filtre paneli */}
      {showFilters && (
        <FilterPanel
          filters={filters}
          onChange={onChange}
          onReset={onReset}
          cities={cities}
          expertises={expertises}
        />
      )}

      {/* Tablo */}
      <div className="card overflow-hidden">
        {isLoading ? (
          <Spinner />
        ) : masters.length === 0 ? (
          <EmptyState icon={Users} title="Usta bulunamadı" description="Filtrelerinizi değiştirmeyi deneyin" />
        ) : (
          <>
            <Table headers={['Ad Soyad', 'İl', 'Uzmanlık', 'Kayıt Yöntemi', 'Kayıt Tarihi', 'Durum', '']}>
              {masters.map((m) => (
                <MasterRow key={m.id} master={m} onDetail={(id) => navigate(`/admin/ustalar/${id}`)} />
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