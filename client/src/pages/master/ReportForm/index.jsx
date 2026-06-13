import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { masterService, commonService } from '../../../services/index';
import { Spinner, ConfirmModal } from '../../../components/ui';
import toast from 'react-hot-toast';
import { ArrowLeft, ArrowRight, FileText } from 'lucide-react';

import VehicleInfoStep from './VehicleInfoStep';
import CategorySection from './CategorySection';
import PhotoStep from './PhotoStep';

const TOTAL_STEPS = 3;

const INITIAL_FORM = {
  plate: '',
  chassis_no: '',
  // Marka
  brand_id: '',
  brand_marka_kodu: '',
  brand: '',
  // Model
  model_id: '',
  model_model_kodu: '',
  model: '',
  // Yıl
  year_id: '',
  year: '',
  // Diğer
  color: '',
  km: '',
  engine_cc: '',
  transmission: '',
  master_note: '',
};

export default function MasterReportForm() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState(INITIAL_FORM);
  const [answers, setAnswers] = useState({});

  // Görev bilgisi
  const { data: assignmentData } = useQuery({
    queryKey: ['master-assignment', assignmentId],
    queryFn: () => masterService.getAssignment(assignmentId),
  });

  const packageId = assignmentData?.data?.data?.Request?.package?.id;

  // Soru kategorileri
  const { data: categoriesData, isLoading: catsLoading } = useQuery({
    queryKey: ['report-categories-with-questions', packageId],
    queryFn: () => commonService.getReportCategories(packageId),
    enabled: !!packageId,
  });

  const categories = categoriesData?.data?.data || [];

  const onChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: '' }));
  };

  const onAnswerChange = (questionId, field, value) => {
    setAnswers((a) => ({
      ...a,
      [questionId]: { ...a[questionId], [field]: value },
    }));
  };

  const validateStep = () => {
    if (step === 1) {
      if (!form.plate.trim()) {
        setErrors({ plate: 'Plaka alanı zorunludur' });
        return false;
      }
    }
    if (step === 3) {
      if (photos.length < 1) {
        toast.error('Sisteme rapor kaydedebilmek için en az 1 fotoğraf yüklemelisiniz');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
      window.scrollTo(0, 0);
    } else {
      setConfirmOpen(true);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((s) => s - 1);
    } else {
      navigate(`/usta/gorev/${assignmentId}`);
    }
  };

  const handleSubmit = async () => {
    setConfirmOpen(false);
    setLoading(true);
    try {
      const fd = new FormData();

      // Temel alanlar
      const submitFields = {
        plate: form.plate,
        chassis_no: form.chassis_no,
        brand_id: form.brand_id,
        model_id: form.model_id,
        year_id: form.year_id,
        color: form.color,
        km: form.km,
        engine_cc: form.engine_cc,
        transmission: form.transmission,
        master_note: form.master_note,
      };
      Object.entries(submitFields).forEach(([k, v]) => { if (v) fd.append(k, v); });

      // Cevaplar
      const answersArray = Object.entries(answers).map(([question_id, ans]) => ({
        question_id: parseInt(question_id),
        selected_option_id: ans.selected_option_id || null,
        open_text: ans.open_text || null,
      }));
      fd.append('answers', JSON.stringify(answersArray));

      // Fotoğraflar
      photos.forEach((photo) => fd.append('photos', photo));

      await masterService.submitReport(assignmentId, fd);
      toast.success('Ön kontrol raporu müşteriye başarıyla iletildi!');
      navigate('/usta');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Rapor gönderilirken teknik bir sorun oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">

      {/* Header */}
      <div className="flex items-center gap-4 border-b border-zinc-100 pb-4">
        <button
          onClick={handleBack}
          className="p-3 bg-zinc-50 hover:bg-[#ffe119] text-[#1A2238] rounded-xl transition-all active:scale-95 shadow-sm"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>
        <div>
          <span className="text-[10px] font-mono font-black text-zinc-400 tracking-widest uppercase block">
            ARAÇ EKSPERTİZ FORMU
          </span>
          <h1 className="text-lg font-black text-[#1A2238] uppercase tracking-tight mt-0.5">
            Rapor Veri Girişi
          </h1>
        </div>
      </div>

      {/* Adım Göstergesi */}
      <div className="space-y-2">
        <div className="flex justify-between items-center px-1">
          <span className="text-[10px] font-mono font-black text-[#1A2238] uppercase tracking-wider">
            Aşama İlerlemesi
          </span>
          <span className="text-[10px] font-mono font-black bg-[#1A2238] text-white px-2 py-0.5 rounded-md">
            ADIM {step} / {TOTAL_STEPS}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full flex-1 transition-all duration-300 ${
                i < step ? 'bg-[#ffe119] shadow-sm shadow-amber-200' : 'bg-zinc-100'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Adım İçerikleri */}
      <div className="w-full">
        {step === 1 && (
          <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm">
            <VehicleInfoStep form={form} onChange={onChange} errors={errors} />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div className="bg-[#1A2238] text-white rounded-2xl p-5 flex items-center justify-between shadow-md">
              <div>
                <p className="text-xs font-mono font-black text-[#ffe119] tracking-widest uppercase">
                  Ekspertiz Soru Formu
                </p>
                <p className="text-sm font-bold uppercase mt-1 tracking-tight">
                  Lütfen tüm mekanik ve kozmetik alanları işaretleyin
                </p>
              </div>
              <FileText size={24} className="text-[#ffe119] hidden sm:block" />
            </div>

            {catsLoading ? (
              <div className="py-12 flex justify-center"><Spinner /></div>
            ) : (
              categories
                .filter((c) => c.is_active)
                .map((cat) => (
                  <CategorySection
                    key={cat.id}
                    category={cat}
                    answers={answers}
                    onAnswerChange={onAnswerChange}
                  />
                ))
            )}

            <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm space-y-3">
              <label className="block text-[11px] font-black text-[#1A2238] uppercase tracking-widest">
                USTA GENEL DEĞERLENDİRME NOTU (OPSİYONEL)
              </label>
              <textarea
                rows={4}
                className="w-full bg-zinc-50 border-2 border-zinc-100 font-medium text-sm text-[#1A2238] p-4 rounded-xl resize-none focus:bg-white focus:border-[#ffe119] outline-none transition-all"
                placeholder="Araç genel durumu hakkında nihai yorumunuzu buraya yazın..."
                value={form.master_note}
                onChange={(e) => onChange('master_note', e.target.value)}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm">
            <PhotoStep
              photos={photos}
              onPhotosChange={setPhotos}
              minPhotos={5}
              maxPhotos={70}
            />
          </div>
        )}
      </div>

      {/* Ana Buton */}
      <button
        onClick={handleNext}
        disabled={loading}
        className="w-full bg-[#ffe119] hover:bg-[#1A2238] text-[#1A2238] hover:text-white disabled:opacity-50 font-black uppercase tracking-widest text-sm md:text-base rounded-xl py-5 flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_10px_30px_rgba(255,225,25,0.25)] hover:shadow-none group active:scale-[0.99]"
      >
        {loading ? (
          <span className="w-6 h-6 border-3 border-[#1A2238] border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <span>{step === TOTAL_STEPS ? 'Raporu Onayla ve Gönder' : 'Sonraki Adıma Geç'}</span>
            <ArrowRight size={18} strokeWidth={3} className="transform group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>

      {/* Onay Modalı */}
      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleSubmit}
        title="Raporu Müşteriye Gönder"
        message="Girilen veriler ve fotoğraflar doğrultusunda rapor oluşturulup araç alıcısına iletilecektir. Bu işlemden sonra değişiklik yapılamaz. Onaylıyor musunuz?"
        confirmText="Evet, Raporu İlet"
        loading={loading}
      />
    </div>
  );
}