import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../../../services/index';
import { Button, Modal } from '../../../../components/ui';
import toast from 'react-hot-toast';
import { Package, Edit2, X, Check, Plus } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';

function CategorySelector({ selectedIds, onToggle, categories }) {
  return (
    <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-xl p-3">
      {categories.length === 0 && <p className="text-xs text-gray-400 text-center py-2">Henüz kategori eklenmedi</p>}
      {categories.map((cat) => (
        <button key={cat.id} type="button" onClick={() => onToggle(cat.id)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all text-left ${selectedIds.includes(cat.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${selectedIds.includes(cat.id) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
            {selectedIds.includes(cat.id) && <Check size={10} className="text-white" />}
          </div>
          <span className={`text-sm font-medium ${selectedIds.includes(cat.id) ? 'text-blue-700' : 'text-gray-700'}`}>{cat.name}</span>
        </button>
      ))}
    </div>
  );
}

export default function PackageManager() {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editingPkg, setEditingPkg] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', category_ids: [] });
  const [editForm, setEditForm] = useState({ name: '', description: '', price: '', category_ids: [] });

  const { data } = useQuery({ queryKey: ['admin-packages'], queryFn: () => adminService.getPackages() });
  const { data: catsData } = useQuery({ queryKey: ['admin-categories'], queryFn: () => adminService.getCategories() });

  const packages  = data?.data?.data || [];
  const categories = catsData?.data?.data || [];

  const toggleCategory = (catId, isEdit = false) => {
    const setter = isEdit ? setEditForm : setForm;
    setter((f) => ({
      ...f,
      category_ids: f.category_ids.includes(catId)
        ? f.category_ids.filter((id) => id !== catId)
        : [...f.category_ids, catId],
    }));
  };

  const openEdit = (pkg) => {
    setEditingPkg(pkg);
    setEditForm({
      name: pkg.name, description: pkg.description || '', price: pkg.price,
      category_ids: pkg.categories?.map((pc) => pc.category_id) || [],
    });
    setEditModal(true);
  };

  const addPackage = async () => {
    if (!form.name || !form.price) { toast.error('Ad ve fiyat zorunludur'); return; }
    setLoading(true);
    try {
      await adminService.createPackage({ name: form.name, description: form.description, price: parseFloat(form.price), category_ids: form.category_ids });
      toast.success('Paket eklendi');
      setForm({ name: '', description: '', price: '', category_ids: [] });
      setModal(false);
      queryClient.invalidateQueries(['admin-packages']);
    } catch { toast.error('Hata oluştu'); }
    finally { setLoading(false); }
  };

  const updatePackage = async () => {
    if (!editForm.name || !editForm.price) { toast.error('Ad ve fiyat zorunludur'); return; }
    setLoading(true);
    try {
      await adminService.updatePackage(editingPkg.id, { name: editForm.name, description: editForm.description, price: parseFloat(editForm.price), category_ids: editForm.category_ids });
      toast.success('Paket güncellendi');
      setEditModal(false);
      queryClient.invalidateQueries(['admin-packages']);
    } catch { toast.error('Hata oluştu'); }
    finally { setLoading(false); }
  };

  const toggleActive = async (pkg) => {
    try {
      await adminService.updatePackage(pkg.id, { is_active: !pkg.is_active });
      toast.success(pkg.is_active ? 'Pasife alındı' : 'Aktif edildi');
      queryClient.invalidateQueries(['admin-packages']);
    } catch { toast.error('Hata oluştu'); }
  };

  return (
    <div>
      <SectionHeader icon={Package} title="Servis Paketleri" description="Müşterilere sunulan hizmet paketleri ve fiyatları"
        action={<Button variant="primary" size="sm" onClick={() => setModal(true)}><Plus size={14} /> Yeni Paket</Button>}
      />

      <div className="space-y-3">
        {packages.length === 0 && <div className="text-center py-10 text-gray-400 text-sm">Henüz paket eklenmedi</div>}
        {packages.map((pkg) => (
          <div key={pkg.id} className={`border rounded-xl px-4 py-4 transition-colors ${pkg.is_active ? 'border-gray-200 hover:border-gray-300' : 'border-gray-100 bg-gray-50 opacity-60'}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${pkg.is_active ? 'bg-blue-50' : 'bg-gray-100'}`}>
                  <Package size={16} className={pkg.is_active ? 'text-blue-600' : 'text-gray-400'} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900">{pkg.name}</p>
                    {!pkg.is_active && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-500 font-medium">Pasif</span>}
                  </div>
                  {pkg.description && <p className="text-xs text-gray-400 mt-0.5">{pkg.description}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-base font-bold text-blue-600">{Number(pkg.price).toLocaleString('tr-TR')} ₺</span>
                <button onClick={() => openEdit(pkg)} className="w-8 h-8 bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-gray-400 rounded-lg flex items-center justify-center transition-colors">
                  <Edit2 size={14} />
                </button>
                <button onClick={() => toggleActive(pkg)} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${pkg.is_active ? 'bg-yellow-50 hover:bg-yellow-100 text-yellow-600' : 'bg-green-50 hover:bg-green-100 text-green-600'}`}>
                  {pkg.is_active ? <X size={14} /> : <Check size={14} />}
                </button>
                <button onClick={() => setDeleteConfirm(pkg)} className="w-8 h-8 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg flex items-center justify-center transition-colors">
                  <X size={14} />
                </button>
              </div>
            </div>
            {pkg.categories?.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-1.5">
                {pkg.categories.map((pc) => (
                  <span key={pc.id} className="inline-flex items-center px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">{pc.category?.name}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Yeni Paket Ekle" size="md">
        <div className="space-y-4">
          <div><label className="label">Paket Adı</label><input className="input" placeholder="Tam Ekspertiz" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></div>
          <div><label className="label">Açıklama <span className="text-gray-400 font-normal">(opsiyonel)</span></label><input className="input" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} /></div>
          <div><label className="label">Fiyat (₺)</label><input className="input" placeholder="1500" inputMode="numeric" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} /></div>
          <div>
            <label className="label">Dahil Edilecek Kategoriler</label>
            <CategorySelector selectedIds={form.category_ids} onToggle={(id) => toggleCategory(id, false)} categories={categories} />
            {form.category_ids.length > 0 && <p className="text-xs text-blue-600 mt-1.5 font-medium">{form.category_ids.length} kategori seçildi</p>}
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setModal(false)}>İptal</Button>
            <Button variant="primary" className="flex-1" onClick={addPackage} loading={loading}>Paketi Oluştur</Button>
          </div>
        </div>
      </Modal>

      <Modal open={editModal} onClose={() => setEditModal(false)} title="Paketi Düzenle" size="md">
        <div className="space-y-4">
          <div><label className="label">Paket Adı</label><input className="input" value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} /></div>
          <div><label className="label">Açıklama</label><input className="input" value={editForm.description} onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))} /></div>
          <div><label className="label">Fiyat (₺)</label><input className="input" inputMode="numeric" value={editForm.price} onChange={(e) => setEditForm((f) => ({ ...f, price: e.target.value }))} /></div>
          <div>
            <label className="label">Dahil Edilecek Kategoriler</label>
            <CategorySelector selectedIds={editForm.category_ids} onToggle={(id) => toggleCategory(id, true)} categories={categories} />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setEditModal(false)}>İptal</Button>
            <Button variant="primary" className="flex-1" onClick={updatePackage} loading={loading}>Güncelle</Button>
          </div>
        </div>
      </Modal>

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Paketi Sil</h3>
            <p className="text-sm text-gray-500"><span className="font-medium text-gray-900">{deleteConfirm.name}</span> paketini silmek istiyor musunuz?</p>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirm(null)}>İptal</Button>
              <Button variant="danger" className="flex-1" onClick={async () => {
                await adminService.updatePackage(deleteConfirm.id, { is_active: false });
                toast.success('Paket silindi');
                setDeleteConfirm(null);
                queryClient.invalidateQueries(['admin-packages']);
              }}>Sil</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
