import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../../../services/index';
import { Button } from '../../../../components/ui';
import toast from 'react-hot-toast';
import { Wrench, Plus } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';

export default function ExpertiseManager() {
  const queryClient = useQueryClient();
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(false);

  const { data } = useQuery({ queryKey: ['admin-expertises'], queryFn: () => adminService.getExpertises() });
  const expertises = data?.data?.data || [];

  const add = async () => {
    if (!newName.trim()) return;
    setLoading(true);
    try {
      await adminService.createExpertise({ name: newName });
      toast.success('Eklendi');
      setNewName('');
      queryClient.invalidateQueries(['admin-expertises']);
    } catch { toast.error('Hata oluştu'); }
    finally { setLoading(false); }
  };

  const toggle = async (exp) => {
    try {
      await adminService.updateExpertise(exp.id, { is_active: !exp.is_active });
      queryClient.invalidateQueries(['admin-expertises']);
    } catch { toast.error('Hata oluştu'); }
  };

  return (
    <div>
      <SectionHeader icon={Wrench} title="Uzmanlık Alanları" description="Usta başvurularında gösterilen uzmanlık seçenekleri" />
      <div className="flex gap-2 mb-4">
        <input className="input text-sm flex-1" placeholder="Yeni uzmanlık alanı..."
          value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} />
        <Button variant="primary" size="sm" onClick={add} loading={loading}><Plus size={14} /> Ekle</Button>
      </div>
      <div className="space-y-2">
        {expertises.map((exp) => (
          <div key={exp.id} className="flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3 hover:border-gray-300 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                <Wrench size={14} className="text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-900">{exp.name}</p>
            </div>
            <button onClick={() => toggle(exp)}
              className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${exp.is_active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
              {exp.is_active ? 'Aktif' : 'Pasif'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
