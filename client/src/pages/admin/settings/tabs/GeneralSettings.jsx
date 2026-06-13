import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../../../services/index';
import { Spinner } from '../../../../components/ui';
import { Settings } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import SettingRow from '../components/SettingRow';

export default function GeneralSettings() {
  const queryClient = useQueryClient();

  const { data: settingsData, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: () => adminService.getSettings(),
  });

  const settings = settingsData?.data?.data || {};

  const handleSave = async (key, value) => {
    await adminService.updateSetting(key, value);
    queryClient.invalidateQueries(['admin-settings']);
  };

  return (
    <div>
      <SectionHeader
        icon={Settings}
        title="Genel Ayarlar"
        description="Platformun temel işleyişini etkileyen ayarlar"
      />
      {isLoading ? <Spinner /> : (
        <div>
          <div className="grid grid-cols-12 pb-2 mb-1">
            <span className="col-span-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Ayar</span>
            <span className="col-span-7 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Değer</span>
          </div>
          <SettingRow label="Hizmet Ücreti" settingKey="service_price" value={settings.service_price} onSave={handleSave} hint="Müşteriden alınan toplam tutar (₺)" />
          <SettingRow label="Komisyon Oranı" settingKey="commission_rate" value={settings.commission_rate} onSave={handleSave} hint="Platformun aldığı pay (%)" />
          <SettingRow label="Şirket IBAN" settingKey="company_iban" value={settings.company_iban} onSave={handleSave} hint="Havale/EFT ödemeleri için" />
          <SettingRow label="Hesap Adı" settingKey="company_account_name" value={settings.company_account_name} onSave={handleSave} hint="Banka hesabının adı" />
          <SettingRow label="Min. Rapor Fotoğrafı" settingKey="report_min_photos" value={settings.report_min_photos} onSave={handleSave} hint="Ustanın yüklemesi gereken minimum fotoğraf" />
          <SettingRow label="Max. Rapor Fotoğrafı" settingKey="report_max_photos" value={settings.report_max_photos} onSave={handleSave} hint="Maksimum yüklenebilir fotoğraf sayısı" />
        </div>
      )}
    </div>
  );
}
