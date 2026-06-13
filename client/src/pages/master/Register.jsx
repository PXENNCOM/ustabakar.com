import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { authService } from '../../services/auth.service';
import { commonService } from '../../services/index';
import toast from 'react-hot-toast';
import { Button } from '../../components/ui';
import { ArrowLeft, ArrowRight, Phone, MapPin, Wrench } from 'lucide-react';

// Adım göstergesi (#ffe119 renkli)
function StepIndicator({ step, total }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div 
          key={i} 
          className="h-1 rounded-full flex-1 transition-all duration-300"
          style={{ backgroundColor: i < step ? '#ffe119' : '#f3f4f6' }}
        />
      ))}
    </div>
  );
}

// Kişisel bilgiler adımı
function PersonalStep({ form, onChange, errors }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Kişisel Bilgiler</h2>
        <p className="text-xs text-gray-400 mt-0.5">Lütfen tüm iletişim bilgilerinizi eksiksiz girin.</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Ad</label>
          <input 
            className={`w-full px-4 py-2.5 bg-gray-50/50 border ${errors.name ? 'border-red-500 focus:ring-red-100' : 'border-gray-200 focus:border-[#ffe119]'}`} 
            className={`w-full px-4 py-2.5 bg-gray-50/50 border ${errors.name ? 'border-red-500' : 'border-gray-200 focus:border-[#ffe119]'} rounded-xl text-gray-900 text-sm outline-none transition-all focus:ring-2 focus:ring-[#ffe119]/20`}
            placeholder="Ahmet" 
            value={form.name} 
            onChange={(e) => onChange('name', e.target.value)} 
          />
          {errors.name && <p className="mt-1 text-xs text-red-500 font-medium">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Soyad</label>
          <input 
            className={`w-full px-4 py-2.5 bg-gray-50/50 border ${errors.surname ? 'border-red-500' : 'border-gray-200 focus:border-[#ffe119]'} rounded-xl text-gray-900 text-sm outline-none transition-all focus:ring-2 focus:ring-[#ffe119]/20`} 
            placeholder="Yılmaz" 
            value={form.surname} 
            onChange={(e) => onChange('surname', e.target.value)} 
          />
          {errors.surname && <p className="mt-1 text-xs text-red-500 font-medium">{errors.surname}</p>}
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">TC Kimlik No</label>
        <input 
          className={`w-full px-4 py-2.5 bg-gray-50/50 border ${errors.tc ? 'border-red-500' : 'border-gray-200 focus:border-[#ffe119]'} rounded-xl text-gray-900 text-sm outline-none transition-all focus:ring-2 focus:ring-[#ffe119]/20`} 
          placeholder="12345678901" 
          inputMode="numeric" 
          maxLength={11} 
          value={form.tc} 
          onChange={(e) => onChange('tc', e.target.value)} 
        />
        {errors.tc && <p className="mt-1 text-xs text-red-500 font-medium">{errors.tc}</p>}
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Telefon Numarası</label>
        <div className="relative">
          <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            className={`w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border ${errors.phone ? 'border-red-500' : 'border-gray-200 focus:border-[#ffe119]'} rounded-xl text-gray-900 text-sm outline-none transition-all focus:ring-2 focus:ring-[#ffe119]/20`} 
            placeholder="05XX XXX XX XX" 
            inputMode="tel" 
            maxLength={11} 
            value={form.phone} 
            onChange={(e) => onChange('phone', e.target.value)} 
          />
        </div>
        {errors.phone && <p className="mt-1 text-xs text-red-500 font-medium">{errors.phone}</p>}
      </div>
    </div>
  );
}

// Konum & uzmanlık adımı
function LocationStep({ form, onChange, errors, cities, expertises }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Konum & Uzmanlık</h2>
        <p className="text-xs text-gray-400 mt-0.5 font-normal">Hizmet verdiğiniz bölgeyi ve ana uzmanlığınızı seçin.</p>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">İl</label>
        <div className="relative">
          <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <select 
            className={`w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border ${errors.city_id ? 'border-red-500' : 'border-gray-200 focus:border-[#ffe119]'} rounded-xl text-gray-900 text-sm outline-none transition-all focus:ring-2 focus:ring-[#ffe119]/20 appearance-none`} 
            value={form.city_id} 
            onChange={(e) => onChange('city_id', e.target.value)}
          >
            <option value="">İl seçin</option>
            {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        {errors.city_id && <p className="mt-1 text-xs text-red-500 font-medium">{errors.city_id}</p>}
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">İlçe</label>
        <input
          className={`w-full px-4 py-2.5 bg-gray-50/50 border ${errors.district_name ? 'border-red-500' : 'border-gray-200 focus:border-[#ffe119]'} rounded-xl text-gray-900 text-sm outline-none transition-all focus:ring-2 focus:ring-[#ffe119]/20`}
          placeholder="İlçe adını yazın"
          value={form.district_name}
          onChange={(e) => onChange('district_name', e.target.value)}
        />
        {errors.district_name && <p className="mt-1 text-xs text-red-500 font-medium">{errors.district_name}</p>}
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Uzmanlık Alanı</label>
        <select 
          className={`w-full px-4 py-2.5 bg-gray-50/50 border ${errors.expertise_id ? 'border-red-500' : 'border-gray-200 focus:border-[#ffe119]'} rounded-xl text-gray-900 text-sm outline-none transition-all focus:ring-2 focus:ring-[#ffe119]/20 appearance-none`} 
          value={form.expertise_id} 
          onChange={(e) => onChange('expertise_id', e.target.value)}
        >
          <option value="">Uzmanlık seçin</option>
          {expertises.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
        {errors.expertise_id && <p className="mt-1 text-xs text-red-500 font-medium">{errors.expertise_id}</p>}
      </div>
    </div>
  );
}

// Deneyim adımı
function ExperienceStep({ form, onChange, errors }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Deneyim & Ekipman</h2>
        <p className="text-xs text-gray-400 mt-0.5">Lütfen başvurunuzun onaylanması için tüm detayları eksiksiz doldurun.</p>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">İş Tecrübesi</label>
        <textarea 
          rows={3} 
          className={`w-full px-4 py-2.5 bg-gray-50/50 border ${errors.experience ? 'border-red-500' : 'border-gray-200 focus:border-[#ffe119]'} rounded-xl text-gray-900 text-sm outline-none transition-all focus:ring-2 focus:ring-[#ffe119]/20 resize-none`} 
          placeholder="Kaç yıldır bu işi yapıyorsunuz, hangi firmalarda çalıştınız..." 
          value={form.experience} 
          onChange={(e) => onChange('experience', e.target.value)} 
        />
        {errors.experience && <p className="mt-1 text-xs text-red-500 font-medium">{errors.experience}</p>}
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Sahip Olduğunuz Ekipmanlar</label>
        <textarea 
          rows={3} 
          className={`w-full px-4 py-2.5 bg-gray-50/50 border ${errors.equipment ? 'border-red-500' : 'border-gray-200 focus:border-[#ffe119]'} rounded-xl text-gray-900 text-sm outline-none transition-all focus:ring-2 focus:ring-[#ffe119]/20 resize-none`} 
          placeholder="OBD cihazı, boya kalınlık ölçer, endoskop kamera..." 
          value={form.equipment} 
          onChange={(e) => onChange('equipment', e.target.value)} 
        />
        {errors.equipment && <p className="mt-1 text-xs text-red-500 font-medium">{errors.equipment}</p>}
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Referans</label>
        <textarea 
          rows={2} 
          className={`w-full px-4 py-2.5 bg-gray-50/50 border ${errors.reference ? 'border-red-500' : 'border-gray-200 focus:border-[#ffe119]'} rounded-xl text-gray-900 text-sm outline-none transition-all focus:ring-2 focus:ring-[#ffe119]/20 resize-none`} 
          placeholder="Referans verebileceğiniz kişi veya firmalar..." 
          value={form.reference} 
          onChange={(e) => onChange('reference', e.target.value)} 
        />
        {errors.reference && <p className="mt-1 text-xs text-red-500 font-medium">{errors.reference}</p>}
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Ustalık Belgesi</label>
        <input 
          type="file" 
          accept="image/*,application/pdf" 
          className={`w-full px-4 py-2 bg-gray-50/50 border ${errors.certificate ? 'border-red-500' : 'border-gray-200'} text-gray-500 text-xs rounded-xl outline-none file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-800 hover:file:bg-gray-200 cursor-pointer`} 
          onChange={(e) => onChange('certificate', e.target.files[0])} 
        />
        {errors.certificate && <p className="mt-1 text-xs text-red-500 font-medium">{errors.certificate}</p>}
      </div>
    </div>
  );
}

export default function MasterRegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const totalSteps = 3;

  const [form, setForm] = useState({
    name: '', surname: '', tc: '', phone: '',
    city_id: '', district_name: '', expertise_id: '',
    experience: '', equipment: '', reference: '', certificate: null,
  });

  const onChange = (field, value) => {
    if (field === 'city_id') {
      setForm((f) => ({ ...f, city_id: value, district_id: '' }));
    } else {
      setForm((f) => ({ ...f, [field]: value }));
    }
    if (errors[field]) setErrors((e) => ({ ...e, [field]: '' }));
  };

  const { data: citiesData } = useQuery({ queryKey: ['cities'], queryFn: () => commonService.getCities() });
  const { data: expertisesData } = useQuery({ queryKey: ['expertises'], queryFn: () => commonService.getExpertises() });

  const cities = citiesData?.data?.data || [];
  const expertises = expertisesData?.data?.data || [];

  const validateStep = () => {
    const errs = {};
    
    // Adım 1 Doğrulamaları
    if (step === 1) {
      if (!form.name.trim()) errs.name = 'Ad zorunludur';
      if (!form.surname.trim()) errs.surname = 'Soyad zorunludur';
      if (!form.tc.trim()) errs.tc = 'TC Kimlik No zorunludur';
      else if (!/^[0-9]{11}$/.test(form.tc.trim())) errs.tc = 'Geçerli bir TC Kimlik No girin (11 hane)';
      if (!form.phone.trim()) errs.phone = 'Telefon zorunludur';
      else if (!/^[0-9]{10,11}$/.test(form.phone.replace(/\s/g, ''))) errs.phone = 'Geçerli bir telefon girin';
    }
    
    // Adım 2 Doğrulamaları
    if (step === 2) {
      if (!form.city_id) errs.city_id = 'İl zorunludur';
      if (!form.district_name.trim()) errs.district_name = 'İlçe zorunludur';
      if (!form.expertise_id) errs.expertise_id = 'Uzmanlık alanı zorunludur';
    }

    // Adım 3 Doğrulamaları
    if (step === 3) {
      if (!form.experience.trim()) errs.experience = 'İş tecrübesi alanı zorunludur';
      if (!form.equipment.trim()) errs.equipment = 'Ekipman bilgisi zorunludur';
      if (!form.reference.trim()) errs.reference = 'Referans zorunludur';
      if (!form.certificate) errs.certificate = 'Ustalık belgesi zorunludur';
    }

    if (Object.keys(errs).length) { setErrors(errs); return false; }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < totalSteps) setStep((s) => s + 1);
    else handleSubmit();
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('surname', form.surname);
      fd.append('phone', form.phone);
      fd.append('tc', form.tc);
      fd.append('city_id', form.city_id);
      fd.append('district_name', form.district_name);
      fd.append('expertise_id', form.expertise_id);
      fd.append('experience', form.experience);
      fd.append('equipment', form.equipment);
      fd.append('reference', form.reference);
      fd.append('certificate', form.certificate);

      await authService.masterRegister(fd);
      toast.success('Başvurunuz alındı! Ekibimiz sizi inceleyip onaylayacak.');
      navigate('/usta/giris');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 antialiased">
      <div className="w-full max-w-md">
        
        {/* Logo & Başlık Alanı */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Usta Başvurusu</h1>
          <p className="text-xs text-gray-400 mt-1 font-medium">Adım {step} / {totalSteps}</p>
        </div>

        {/* İnce Çerçeveli Sade Form Kartı */}
        <div className="border border-gray-100 rounded-2xl p-2 sm:p-4">
          <StepIndicator step={step} total={totalSteps} />

          {step === 1 && <PersonalStep form={form} onChange={onChange} errors={errors} />}
          {step === 2 && <LocationStep form={form} onChange={onChange} errors={errors} cities={cities} expertises={expertises} />}
          {step === 3 && <ExperienceStep form={form} onChange={onChange} errors={errors} />}

          {/* Aksiyon Butonları */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <Button 
                variant="outline" 
                className="flex-1 justify-center gap-2 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl py-3 text-sm font-medium" 
                onClick={() => setStep((s) => s - 1)}
              >
                <ArrowLeft size={16} /> Geri
              </Button>
            )}
            <button 
              disabled={loading}
              onClick={handleNext}
              className="flex-1 inline-flex items-center justify-center gap-2 font-semibold text-sm rounded-xl py-3 transition-colors disabled:opacity-50 text-gray-900 shadow-sm"
              style={{ backgroundColor: '#ffe119' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ecd015'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffe119'}
            >
              {step === totalSteps ? 'Başvuruyu Gönder' : 'Devam Et'} 
              <ArrowRight size={16} />
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6 font-medium">
            Zaten hesabınız var mı? 
            <Link 
              to="/usta/giris" 
              className="font-semibold transition-colors hover:opacity-80 ml-1"
              style={{ color: '#dcb800' }}
            >
              Giriş Yap
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}