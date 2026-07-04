import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { adminService, commonService } from '../../services/index';
import { Table, Pagination, StatusBadge, Spinner, EmptyState } from '../../components/ui';
import { FileText, Search, Eye, Filter, X, ChevronDown, ChevronUp, CreditCard } from 'lucide-react';

const statusOptions = [
  { value: '',                   label: 'Tümü',          color: 'bg-gray-100 text-gray-600' },
  { value: 'pending_payment',    label: 'Ödeme Bekliyor', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'pending_assignment', label: 'Usta Atanmadı',  color: 'bg-red-100 text-red-700' },
  { value: 'assigned',           label: 'Usta Atandı',    color: 'bg-blue-100 text-blue-700' },
  { value: 'completed',          label: 'Tamamlandı',     color: 'bg-green-100 text-green-700' },
  { value: 'cancelled',          label: 'İptal',          color: 'bg-gray-100 text-gray-500' },
];

const sortOptions = [
  { value: 'newest',      label: 'En Yeni' },
  { value: 'oldest',      label: 'En Eski' },
  { value: 'updated',     label: 'Son Güncellenen' },
  { value: 'amount_desc', label: 'Tutar (Yüksek → Düşük)' },
  { value: 'amount_asc',  label: 'Tutar (Düşük → Yüksek)' },
];

const EMPTY_FILTERS = {
  search:           '',
  status:           '',
  city_id:          '',
  entry_type:       '',
  date_from:        '',
  date_to:          '',
  sort:             'newest',
  package_id:       '',
  payment_status:   '',
  payment_method:   '',
  amount_min:       '',
  amount_max:       '',
  brand:            '',
  year_from:        '',
  year_to:          '',
  seller_search:    '',
  master_id:        '',
  has_photos:       '',
  has_report:       '',
  has_customer_note:'',
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

function FilterPanel({ filters, onChange, onReset, cities, packages, masters }) {
  const activeCount = Object.entries(filters)
    .filter(([k, v]) => k !== 'sort' && Boolean(v))
    .length;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-5">
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

      {/* Genel */}
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Genel</p>
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <div className="col-span-2 xl:col-span-1">
            <label className="text-xs font-medium text-gray-500 block mb-1">Müşteri Ara</label>
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input className="input pl-8 text-sm" placeholder="Ad, soyad, telefon..."
                value={filters.search} onChange={(e) => onChange('search', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Hizmet İli</label>
            <select className="input bg-white text-sm" value={filters.city_id} onChange={(e) => onChange('city_id', e.target.value)}>
              <option value="">Tüm İller</option>
              {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Talep Tipi</label>
            <select className="input bg-white text-sm" value={filters.entry_type} onChange={(e) => onChange('entry_type', e.target.value)}>
              <option value="">Tümü</option>
              <option value="link">İlan Linki</option>
              <option value="manual">Manuel Giriş</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Hizmet Paketi</label>
            <select className="input bg-white text-sm" value={filters.package_id} onChange={(e) => onChange('package_id', e.target.value)}>
              <option value="">Tüm Paketler</option>
              {packages.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Başlangıç Tarihi</label>
            <input type="date" className="input text-sm" value={filters.date_from} onChange={(e) => onChange('date_from', e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Bitiş Tarihi</label>
            <input type="date" className="input text-sm" value={filters.date_to} onChange={(e) => onChange('date_to', e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Müşteri Notu</label>
            <select className="input bg-white text-sm" value={filters.has_customer_note} onChange={(e) => onChange('has_customer_note', e.target.value)}>
              <option value="">Tümü</option>
              <option value="yes">Notu Var</option>
              <option value="no">Notu Yok</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Fotoğraf</label>
            <select className="input bg-white text-sm" value={filters.has_photos} onChange={(e) => onChange('has_photos', e.target.value)}>
              <option value="">Tümü</option>
              <option value="yes">Fotoğraf Var</option>
              <option value="no">Fotoğraf Yok</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Rapor Durumu</label>
            <select className="input bg-white text-sm" value={filters.has_report} onChange={(e) => onChange('has_report', e.target.value)}>
              <option value="">Tümü</option>
              <option value="yes">Rapor Yazılmış</option>
              <option value="no">Rapor Yazılmamış</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ödeme */}
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Ödeme</p>
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Ödeme Durumu</label>
            <select className="input bg-white text-sm" value={filters.payment_status} onChange={(e) => onChange('payment_status', e.target.value)}>
              <option value="">Tümü</option>
              <option value="pending">Bekliyor</option>
              <option value="paid">Ödendi</option>
              <option value="failed">Başarısız</option>
              <option value="refunded">İade Edildi</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Ödeme Yöntemi</label>
            <select className="input bg-white text-sm" value={filters.payment_method} onChange={(e) => onChange('payment_method', e.target.value)}>
              <option value="">Tümü</option>
              <option value="card">Kredi Kartı</option>
              <option value="transfer">Havale</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Min. Tutar (₺)</label>
            <input type="number" min="0" className="input text-sm" placeholder="0"
              value={filters.amount_min} onChange={(e) => onChange('amount_min', e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Max. Tutar (₺)</label>
            <input type="number" min="0" className="input text-sm" placeholder="—"
              value={filters.amount_max} onChange={(e) => onChange('amount_max', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Araç */}
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Araç (Manuel Girişler)</p>
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Marka</label>
            <input className="input text-sm" placeholder="Toyota, BMW..."
              value={filters.brand} onChange={(e) => onChange('brand', e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Min. Yıl</label>
            <input type="number" min="1990" max="2030" className="input text-sm" placeholder="2015"
              value={filters.year_from} onChange={(e) => onChange('year_from', e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Max. Yıl</label>
            <input type="number" min="1990" max="2030" className="input text-sm" placeholder="2024"
              value={filters.year_to} onChange={(e) => onChange('year_to', e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Satıcı Ara</label>
            <input className="input text-sm" placeholder="İsim veya telefon..."
              value={filters.seller_search} onChange={(e) => onChange('seller_search', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Usta */}
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Usta</p>
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Atanan Usta</label>
            <select className="input bg-white text-sm" value={filters.master_id} onChange={(e) => onChange('master_id', e.target.value)}>
              <option value="">Tüm Ustalar</option>
              {masters.map((m) => <option key={m.id} value={m.id}>{m.name} {m.surname}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

function RequestRow({ request, onDetail }) {
  const { id, Customer, brand, model, year, City, status, Payment, created_at, entry_type, Assignments } = request;
  const vehicleTitle = brand && model ? `${brand} ${model} ${year || ''}`.trim() : 'İlan Linki';
  const assignedMaster = Assignments?.[0]?.Master;

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
          <CreditCard size={12} className="text-gray-400" />
          {Payment?.method === 'card' ? 'Kart' : Payment?.method === 'transfer' ? 'Havale' : '—'}
        </div>
        {Payment?.amount && (
          <p className="text-xs font-semibold text-gray-900 mt-0.5">
            {Number(Payment.amount).toLocaleString('tr-TR')} ₺
          </p>
        )}
      </td>
      <td className="px-4 py-3">
        {assignedMaster ? (
          <p className="text-xs font-medium text-gray-700">{assignedMaster.name} {assignedMaster.surname}</p>
        ) : (
          <span className="text-xs text-gray-400">—</span>
        )}
      </td>
      <td className="px-4 py-3 text-xs text-gray-500">
        {new Date(created_at).toLocaleDateString('tr-TR')}
      </td>
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

  const activeFilterCount = Object.entries(filters)
    .filter(([k, v]) => k !== 'sort' && Boolean(v))
    .length;

  const { data, isLoading } = useQuery({
    queryKey: ['admin-requests', page, filters],
    queryFn:  () => adminService.getRequests({ page, limit: 20, ...filters }),
    keepPreviousData: true,
  });

  const { data: citiesData }   = useQuery({ queryKey: ['cities'],           queryFn: () => commonService.getCities() });
  const { data: packagesData } = useQuery({ queryKey: ['packages'],         queryFn: () => commonService.getPackages() });
  const { data: mastersData }  = useQuery({ queryKey: ['admin-masters-all'], queryFn: () => adminService.getMasters({ limit: 200, status: 'active' }) });

  const requests   = data?.data?.data?.items || [];
  const pagination = data?.data?.data?.pagination;
  const cities     = citiesData?.data?.data || [];
  const packages   = packagesData?.data?.data || [];
  const masters    = mastersData?.data?.data?.items || [];

  return (
    <div className="space-y-5">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Talepler</h1>
          {pagination && <p className="text-sm text-gray-500 mt-0.5">Toplam {pagination.total} talep</p>}
        </div>
        <div className="flex items-center gap-2">
          <select
            className="input bg-white text-sm font-medium text-gray-700 border-gray-200 rounded-xl px-3 py-2"
            value={filters.sort}
            onChange={(e) => onChange('sort', e.target.value)}
          >
            {sortOptions.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>

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
      </div>

      <StatusTabs value={filters.status} onChange={onChange} />

      {showFilters && (
        <FilterPanel
          filters={filters}
          onChange={onChange}
          onReset={onReset}
          cities={cities}
          packages={packages}
          masters={masters}
        />
      )}

      <div className="card overflow-hidden">
        {isLoading ? (
          <Spinner />
        ) : requests.length === 0 ? (
          <EmptyState icon={FileText} title="Talep bulunamadı" description="Filtrelerinizi değiştirmeyi deneyin" />
        ) : (
          <>
            <Table headers={['#', 'Müşteri', 'Araç / İl', 'Tip', 'Ödeme', 'Usta', 'Tarih', 'Durum', '']}>
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