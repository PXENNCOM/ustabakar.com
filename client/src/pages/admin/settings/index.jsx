import { useState } from 'react';
import { Settings, Package, ClipboardList, Wrench, Car } from 'lucide-react';
import GeneralSettings from './tabs/GeneralSettings';
import PackageManager  from './tabs/PackageManager';
import CategoryManager from './tabs/CategoryManager';
import ExpertiseManager from './tabs/ExpertiseManager';
import VehicleManager  from './tabs/VehicleManager';

const tabs = [
  { key: 'general',    label: 'Genel Ayarlar',      icon: Settings    },
  { key: 'packages',   label: 'Paketler',            icon: Package     },
  { key: 'categories', label: 'Rapor Kategorileri',  icon: ClipboardList },
  { key: 'expertises', label: 'Uzmanlık Alanları',   icon: Wrench      },
  { key: 'vehicles',   label: 'Araç Yönetimi',       icon: Car         },
];

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sistem Ayarları</h1>
        <p className="text-sm text-gray-500 mt-1">Platform genelindeki ayarları buradan yönetin</p>
      </div>

      {/* Tab bar */}
      <div className="border-b border-gray-200">
        <div className="flex gap-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all -mb-px ${
                activeTab === t.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <t.icon size={15} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* İçerik */}
      <div className="card p-6">
        {activeTab === 'general'    && <GeneralSettings />}
        {activeTab === 'packages'   && <PackageManager />}
        {activeTab === 'categories' && <CategoryManager />}
        {activeTab === 'expertises' && <ExpertiseManager />}
        {activeTab === 'vehicles'   && <VehicleManager />}
      </div>
    </div>
  );
}
