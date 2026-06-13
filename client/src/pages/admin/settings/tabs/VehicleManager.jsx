import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../../../services/index';
import { Spinner, Button } from '../../../../components/ui';
import toast from 'react-hot-toast';
import { Car, Plus, Edit2, Check, X } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';

export default function VehicleManager() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [newBrandName, setNewBrandName] = useState('');
  const [newModelName, setNewModelName] = useState('');
  const [newYear, setNewYear] = useState('');
  const [editingBrand, setEditingBrand] = useState(null);
  const [editingModel, setEditingModel] = useState(null);
  const [editVal, setEditVal] = useState('');
  const [loading, setLoading] = useState(false);

  const { data: brandsData, isLoading: brandsLoading } = useQuery({
    queryKey: ['admin-brands', search],
    queryFn: () => adminService.listBrands({ search }),
  });

  const { data: modelsData } = useQuery({
    queryKey: ['admin-models', selectedBrand?.marka_kodu],
    queryFn: () => adminService.listModels(selectedBrand.marka_kodu),
    enabled: !!selectedBrand,
  });

  const { data: yearsData } = useQuery({
    queryKey: ['admin-years', selectedModel?.model_kodu],
    queryFn: () => adminService.listYears(selectedModel.model_kodu),
    enabled: !!selectedModel,
  });

  const brands = brandsData?.data?.data || [];
  const models = modelsData?.data?.data || [];
  const years  = yearsData?.data?.data  || [];

  const addBrand = async () => {
    if (!newBrandName.trim()) return;
    setLoading(true);
    try {
      await adminService.createBrand({ adi: newBrandName });
      toast.success('Marka eklendi');
      setNewBrandName('');
      queryClient.invalidateQueries(['admin-brands']);
    } catch { toast.error('Hata oluştu'); }
    finally { setLoading(false); }
  };

  const saveBrand = async () => {
    setLoading(true);
    try {
      await adminService.updateBrand(editingBrand.id, { adi: editVal });
      toast.success('Marka güncellendi');
      setEditingBrand(null);
      queryClient.invalidateQueries(['admin-brands']);
    } catch { toast.error('Hata oluştu'); }
    finally { setLoading(false); }
  };

  const addModel = async () => {
    if (!newModelName.trim() || !selectedBrand) return;
    setLoading(true);
    try {
      await adminService.createModel(selectedBrand.marka_kodu, { adi: newModelName });
      toast.success('Model eklendi');
      setNewModelName('');
      queryClient.invalidateQueries(['admin-models', selectedBrand.marka_kodu]);
    } catch { toast.error('Hata oluştu'); }
    finally { setLoading(false); }
  };

  const saveModel = async () => {
    setLoading(true);
    try {
      await adminService.updateModel(editingModel.id, { adi: editVal });
      toast.success('Model güncellendi');
      setEditingModel(null);
      queryClient.invalidateQueries(['admin-models', selectedBrand?.marka_kodu]);
    } catch { toast.error('Hata oluştu'); }
    finally { setLoading(false); }
  };

  const addYear = async () => {
    if (!newYear.trim() || !selectedModel) return;
    setLoading(true);
    try {
      await adminService.createYear(selectedModel.model_kodu, { adi: newYear });
      toast.success('Yıl eklendi');
      setNewYear('');
      queryClient.invalidateQueries(['admin-years', selectedModel.model_kodu]);
    } catch { toast.error('Hata oluştu'); }
    finally { setLoading(false); }
  };

  const removeYear = async (yearId) => {
    try {
      await adminService.deleteYear(yearId);
      toast.success('Yıl silindi');
      queryClient.invalidateQueries(['admin-years', selectedModel?.model_kodu]);
    } catch { toast.error('Hata oluştu'); }
  };

  return (
    <div>
      <SectionHeader icon={Car} title="Araç Yönetimi" description="Marka, model ve yıl bilgilerini yönetin" />

      <div className="grid grid-cols-3 gap-4">
        {/* MARKALAR */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Markalar</p>
          </div>
          <div className="p-3 space-y-2">
            <input className="input text-sm" placeholder="Marka ara..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <div className="flex gap-2">
              <input className="input text-sm flex-1" placeholder="Yeni marka adı..." value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addBrand()} />
              <Button variant="primary" size="sm" onClick={addBrand} loading={loading}><Plus size={13} /></Button>
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto divide-y divide-gray-50">
            {brandsLoading ? <Spinner /> : brands.map((b) => (
              <div key={b.id}
                className={`flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors ${selectedBrand?.id === b.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                onClick={() => { setSelectedBrand(b); setSelectedModel(null); }}
              >
                {editingBrand?.id === b.id ? (
                  <div className="flex items-center gap-2 flex-1" onClick={(e) => e.stopPropagation()}>
                    <input className="input text-xs flex-1" value={editVal} onChange={(e) => setEditVal(e.target.value)} autoFocus />
                    <button onClick={saveBrand} className="text-green-600 hover:text-green-700"><Check size={13} /></button>
                    <button onClick={() => setEditingBrand(null)} className="text-gray-400 hover:text-gray-600"><X size={13} /></button>
                  </div>
                ) : (
                  <>
                    <span className={`text-xs font-medium truncate flex-1 ${selectedBrand?.id === b.id ? 'text-blue-700' : 'text-gray-700'}`}>{b.adi}</span>
                    <button onClick={(e) => { e.stopPropagation(); setEditingBrand(b); setEditVal(b.adi); }} className="text-gray-300 hover:text-blue-500 ml-2 flex-shrink-0">
                      <Edit2 size={12} />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* MODELLER */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              {selectedBrand ? `${selectedBrand.adi} Modelleri` : 'Modeller'}
            </p>
          </div>
          {selectedBrand ? (
            <>
              <div className="p-3">
                <div className="flex gap-2">
                  <input className="input text-sm flex-1" placeholder="Yeni model adı..." value={newModelName}
                    onChange={(e) => setNewModelName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addModel()} />
                  <Button variant="primary" size="sm" onClick={addModel} loading={loading}><Plus size={13} /></Button>
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto divide-y divide-gray-50">
                {models.map((m) => (
                  <div key={m.id}
                    className={`flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors ${selectedModel?.id === m.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                    onClick={() => setSelectedModel(m)}
                  >
                    {editingModel?.id === m.id ? (
                      <div className="flex items-center gap-2 flex-1" onClick={(e) => e.stopPropagation()}>
                        <input className="input text-xs flex-1" value={editVal} onChange={(e) => setEditVal(e.target.value)} autoFocus />
                        <button onClick={saveModel} className="text-green-600 hover:text-green-700"><Check size={13} /></button>
                        <button onClick={() => setEditingModel(null)} className="text-gray-400 hover:text-gray-600"><X size={13} /></button>
                      </div>
                    ) : (
                      <>
                        <span className={`text-xs font-medium truncate flex-1 ${selectedModel?.id === m.id ? 'text-blue-700' : 'text-gray-700'}`}>{m.adi}</span>
                        <button onClick={(e) => { e.stopPropagation(); setEditingModel(m); setEditVal(m.adi); }} className="text-gray-300 hover:text-blue-500 ml-2 flex-shrink-0">
                          <Edit2 size={12} />
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-gray-400 text-sm">Önce marka seçin</div>
          )}
        </div>

        {/* YILLAR */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              {selectedModel ? `${selectedModel.adi} Yılları` : 'Yıllar'}
            </p>
          </div>
          {selectedModel ? (
            <>
              <div className="p-3">
                <div className="flex gap-2">
                  <input className="input text-sm flex-1" placeholder="Yıl (örn: 2024)" value={newYear}
                    onChange={(e) => setNewYear(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addYear()}
                    inputMode="numeric" maxLength={4} />
                  <Button variant="primary" size="sm" onClick={addYear} loading={loading}><Plus size={13} /></Button>
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto divide-y divide-gray-50">
                {years.map((y) => (
                  <div key={y.id} className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50">
                    <span className="text-xs font-medium text-gray-700">{y.adi}</span>
                    <button onClick={() => removeYear(y.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-gray-400 text-sm">Önce model seçin</div>
          )}
        </div>
      </div>
    </div>
  );
}
