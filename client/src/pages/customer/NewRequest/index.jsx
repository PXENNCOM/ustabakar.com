import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { customerService, commonService } from '../../../services/index';
import toast from 'react-hot-toast';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import StepIndicator from './StepIndicator';
import EntryTypeStep from './steps/EntryTypeStep';
import LinkForm from './steps/LinkForm';
import ManualForm from './steps/ManualForm';
import PaymentStep from './steps/PaymentStep';

const TOTAL_STEPS = 3;

const INITIAL_FORM = {
  entry_type: '',
  city_id: '',
  listing_url: '',
  brand_id: '',
  model_id: '',
  year_id: '',
  brand: '',
  model: '',
  year: '',
  seller_name: '',
  seller_phone: '',
  customer_note: '',
  package_id: '',
  payment_method: '',
};

export default function CustomerNewRequest() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState(INITIAL_FORM);

  const onChange = (field, value) => {
    if (field === 'brand_id') {
      setForm((f) => ({ ...f, brand_id: value, model_id: '', year_id: '', model: '', year: '' }));
    } else if (field === 'model_id') {
      setForm((f) => ({ ...f, model_id: value, year_id: '', year: '' }));
    } else {
      setForm((f) => ({ ...f, [field]: value }));
    }
    if (errors[field]) setErrors((e) => ({ ...e, [field]: '' }));
  };

  const { data: citiesData } = useQuery({ queryKey: ['cities'], queryFn: () => commonService.getCities() });
  const { data: packagesData } = useQuery({ queryKey: ['packages'], queryFn: () => commonService.getPackages() });

  const cities = citiesData?.data?.data || [];
  const packages = packagesData?.data?.data || [];

  const validateStep = () => {
    if (step === 1) {
      if (!form.entry_type) { toast.error('Lütfen bir ilerleme seçeneği belirleyin'); return false; }
      return true;
    }
    if (step === 2) {
      const errs = {};
      if (!form.city_id) errs.city_id = 'İl seçimi zorunludur';
      if (form.entry_type === 'link' && !form.listing_url.trim()) errs.listing_url = 'İlan linki girilmesi zorunludur';
      if (form.entry_type === 'manual' && !form.brand_id) errs.brand_id = 'Marka seçimi zorunludur';
      if (form.entry_type === 'manual' && !form.model_id) errs.model_id = 'Model seçimi zorunludur';
      if (Object.keys(errs).length) { setErrors(errs); return false; }
      return true;
    }
    if (step === 3) {
      const errs = {};
      if (!form.package_id) errs.package_id = 'Paket seçimi yapılması zorunludur';
      if (!form.payment_method) errs.payment_method = 'Ödeme yöntemi zorunludur';
      if (Object.keys(errs).length) { setErrors(errs); return false; }
      return true;
    }
    return true;
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1);
    else navigate('/musteri');
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < TOTAL_STEPS) { setStep((s) => s + 1); return; }
    handleSubmit();
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
      await customerService.createRequest(fd);
      toast.success('Talebiniz başarıyla oluşturuldu!');
      navigate('/musteri');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Teknik bir sorun oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6 font-sans text-left">
      {/* Üst Bar */}
      <div className="flex items-center gap-4 border-b border-zinc-100 pb-4">
        <button
          onClick={handleBack}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-50 border border-zinc-200/60 text-zinc-600 hover:bg-[#ffe119] hover:text-zinc-900 transition-all active:scale-95 shadow-sm"
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
        </button>
        <div>
          <h1 className="text-base font-bold text-zinc-900 tracking-tight">Yeni İnceleme Talebi</h1>
          <p className="text-xs font-semibold text-zinc-400 mt-0.5">Aşama {step} / {TOTAL_STEPS}</p>
        </div>
      </div>

      <StepIndicator step={step} total={TOTAL_STEPS} />

      {/* Form Gövdesi */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-sm">
        {step === 1 && <EntryTypeStep value={form.entry_type} onChange={(v) => onChange('entry_type', v)} />}
        {step === 2 && form.entry_type === 'link' && <LinkForm form={form} onChange={onChange} errors={errors} cities={cities} />}
        {step === 2 && form.entry_type === 'manual' && <ManualForm form={form} onChange={onChange} errors={errors} cities={cities} />}
        {step === 3 && <PaymentStep form={form} onChange={onChange} errors={errors} packages={packages} />}
      </div>

      {/* Büyük Premium Alt İlerleme Butonu */}
      <button
        onClick={handleNext}
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 bg-[#ffe119] hover:bg-zinc-900 text-zinc-900 hover:text-white disabled:opacity-50 font-bold text-sm py-4 rounded-xl border border-amber-400/20 shadow-sm transition-all duration-300 active:scale-[0.99]"
      >
        {loading ? (
          <span className="w-5 h-5 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <span>{step === TOTAL_STEPS ? 'Talebi Onayla ve Oluştur' : 'Devam Et'}</span>
            <ArrowRight size={16} strokeWidth={2.5} />
          </>
        )}
      </button>
    </div>
  );
}