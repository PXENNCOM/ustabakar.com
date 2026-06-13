import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { adminService, commonService } from '../../services/index';
import { Table, Pagination, Spinner, EmptyState } from '../../components/ui';
import { BarChart2, Eye, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';

function ReportRow({ report, onDetail }) {
  const assignment = report.Assignment;
  const request = assignment?.Request;
  const master = assignment?.Master;
  const customer = request?.Customer;

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 text-sm font-medium text-gray-900">#{report.id}</td>
      <td className="px-4 py-3">
        <p className="text-sm font-medium text-gray-900">{report.plate}</p>
        {report.chassis_no && <p className="text-xs text-gray-400">{report.chassis_no}</p>}
      </td>
      <td className="px-4 py-3">
        <p className="text-sm text-gray-900">
          {report.brand && report.model ? `${report.brand} ${report.model} ${report.year || ''}`.trim() : '-'}
        </p>
      </td>
      <td className="px-4 py-3">
        <p className="text-sm text-gray-900">{master?.name} {master?.surname}</p>
      </td>
      <td className="px-4 py-3">
        <p className="text-sm text-gray-900">{customer?.name} {customer?.surname}</p>
        <p className="text-xs text-gray-400">{customer?.phone}</p>
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">
        {new Date(report.created_at).toLocaleDateString('tr-TR')}
      </td>
      <td className="px-4 py-3">
        <button onClick={() => onDetail(report.id)} className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
          <Eye size={14} /> Görüntüle
        </button>
      </td>
    </tr>
  );
}

const EMPTY_FILTERS = {
  search: '',
  brand: '',
  model: '',
  city_id: '',
  customer_search: '',
  master_search: '',
  date_from: '',
  date_to: '',
};

function FilterPanel({ filters, onChange, onReset, cities }) {
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
        {/* Plaka / Şasi */}
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">Plaka / Şasi</label>
          <input className="input text-sm" placeholder="Ara..." value={filters.search} onChange={(e) => onChange('search', e.target.value)} />
        </div>

        {/* Marka */}
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">Marka</label>
          <input className="input text-sm" placeholder="Toyota, BMW..." value={filters.brand} onChange={(e) => onChange('brand', e.target.value)} />
        </div>

        {/* Model */}
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">Model</label>
          <input className="input text-sm" placeholder="Corolla, 320i..." value={filters.model} onChange={(e) => onChange('model', e.target.value)} />
        </div>

        {/* İl */}
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">İl</label>
          <select className="input bg-white text-sm" value={filters.city_id} onChange={(e) => onChange('city_id', e.target.value)}>
            <option value="">Tüm İller</option>
            {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {/* Alıcı */}
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">Alıcı</label>
          <input className="input text-sm" placeholder="Ad, soyad veya telefon..." value={filters.customer_search} onChange={(e) => onChange('customer_search', e.target.value)} />
        </div>

        {/* Usta */}
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">Usta</label>
          <input className="input text-sm" placeholder="Usta adı veya soyadı..." value={filters.master_search} onChange={(e) => onChange('master_search', e.target.value)} />
        </div>

        {/* Tarih aralığı */}
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

export default function AdminReports() {
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
    queryKey: ['admin-reports', page, filters],
    queryFn: () => adminService.getReports({ page, limit: 20, ...filters }),
    keepPreviousData: true,
  });

  const { data: citiesData } = useQuery({
    queryKey: ['cities'],
    queryFn: () => commonService.getCities(),
  });

  const reports    = data?.data?.data?.items || [];
  const pagination = data?.data?.data?.pagination;
  const cities     = citiesData?.data?.data || [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Raporlar</h1>
          {pagination && <p className="text-sm text-gray-500 mt-0.5">Toplam {pagination.total} rapor</p>}
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

      {showFilters && (
        <FilterPanel filters={filters} onChange={onChange} onReset={onReset} cities={cities} />
      )}

      <div className="card overflow-hidden">
        {isLoading ? (
          <Spinner />
        ) : reports.length === 0 ? (
          <EmptyState icon={BarChart2} title="Rapor bulunamadı" description="Filtrelerinizi değiştirmeyi deneyin" />
        ) : (
          <>
            <Table headers={['#', 'Plaka', 'Araç', 'Usta', 'Alıcı', 'Tarih', '']}>
              {reports.map((r) => (
                <ReportRow key={r.id} report={r} onDetail={(id) => navigate(`/admin/raporlar/${id}`)} />
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