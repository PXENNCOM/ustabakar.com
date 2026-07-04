import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../store/AuthContext';
import { authService } from '../../../services/auth.service';
import { commonService } from '../../../services/index';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { User, Phone, MapPin, ArrowRight, Car } from 'lucide-react';

// Temiz ve minimal input sınıf yapısı (#ffe119 odaklı)
const inputClass = (err) =>
  `w-full px-4 py-2.5 bg-gray-50/50 border rounded-xl text-gray-900 text-sm outline-none transition-all focus:ring-2 placeholder:text-gray-400 ${
    err
      ? 'border-red-500 focus:ring-red-100'
      : 'border-gray-200 focus:border-[#ffe119] focus:ring-[#ffe119]/20'
  }`;

const FieldError = ({ msg }) =>
  msg ? <p className="mt-1 text-xs text-red-500 font-medium">{msg}</p> : null;

const Label = ({ children }) => (
  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
    {children}
  </label>
);

export default function CustomerRegister() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [loading, setLoading] = useState(false);
  // State'e kvkk ve agreement boolean değerleri eklendi
  const [form,    setForm]    = useState({ name: '', surname: '', phone: '', city_id: '', kvkk: false, agreement: false });
  const [errors,  setErrors]  = useState({});

  const { data: citiesData } = useQuery({
    queryKey: ['cities'],
    queryFn:  () => commonService.getCities(),
  });

  const PRIORITY_CITIES = ['İstanbul', 'Ankara', 'İzmir'];

  const cities = (() => {
    const all = citiesData?.data?.data || [];
    const priority = PRIORITY_CITIES
      .map(name => all.find(c => c.name === name))
      .filter(Boolean);
    const rest = all.filter(c => !PRIORITY_CITIES.includes(c.name));
    return [...priority, ...rest];
  })();

  const set = (field) => (e) => {
    // Checkbox veya normal input ayrımı için
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(er => ({ ...er, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim())    errs.name    = 'Ad zorunludur';
    if (!form.surname.trim()) errs.surname = 'Soyad zorunludur';
    if (!form.phone.trim())   errs.phone   = 'Telefon zorunludur';
    else if (!/^[0-9]{10,11}$/.test(form.phone.replace(/\s/g, ''))) errs.phone = 'Geçerli bir telefon girin';
    if (!form.city_id)        errs.city_id = 'İl seçimi zorunludur';
    
    // Sözleşme kontrolleri
    if (!form.kvkk)           errs.kvkk    = 'KVKK metnini onaylamalısınız';
    if (!form.agreement)      errs.agreement = 'Mesafeli satış sözleşmesini onaylamalısınız';
    
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      // API'ye gönderirken kvkk ve agreement alanlarını temizlemek isterseniz destructuring yapabilirsiniz
      const { kvkk, agreement, ...registerData } = form;
      const res = await authService.customerRegister(registerData);
      
      const { token, customer } = res.data.data;
      login(token, { ...customer, role: 'customer' });
      toast.success('Kayıt başarılı! Hoş geldiniz.');
      navigate('/musteri');
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
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Hesap Oluştur</h1>
          <p className="text-xs text-gray-400 mt-1 font-medium">Ön ekspertiz hizmetimizden yararlanın</p>
        </div>

        {/* İnce Çerçeveli Sade Form Kartı */}
        <div className="border border-gray-100 rounded-2xl p-2 sm:p-4 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Ad / Soyad */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Ad</Label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    className={`${inputClass(errors.name)} pl-10`}
                    placeholder="Ahmet"
                    value={form.name}
                    onChange={set('name')}
                  />
                </div>
                <FieldError msg={errors.name} />
              </div>
              <div>
                <Label>Soyad</Label>
                <input
                  className={inputClass(errors.surname)}
                  placeholder="Yılmaz"
                  value={form.surname}
                  onChange={set('surname')}
                />
                <FieldError msg={errors.surname} />
              </div>
            </div>

            {/* Telefon */}
            <div>
              <Label>Telefon Numarası</Label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  className={`${inputClass(errors.phone)} pl-10`}
                  placeholder="05XX XXX XX XX"
                  value={form.phone}
                  onChange={set('phone')}
                  maxLength={11}
                  inputMode="tel"
                />
              </div>
              <FieldError msg={errors.phone} />
            </div>

            {/* İl */}
            <div>
              <Label>İl</Label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select
                  className={`${inputClass(errors.city_id)} pl-10 appearance-none bg-gray-50/50`}
                  value={form.city_id}
                  onChange={set('city_id')}
                >
                  <option value="">İl seçin</option>
                  {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <FieldError msg={errors.city_id} />
            </div>

            {/* Bilgi Notu (Açık gri soft tema) */}
            <div className="flex items-start gap-2.5 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
              <Phone size={14} className="text-gray-400 mt-0.5 shrink-0" />
              <p className="text-xs text-gray-500 font-normal leading-relaxed">
                Numaranıza SMS doğrulama kodu gönderilecektir.
              </p>
            </div>

            {/* KVKK ve Sözleşme Onayları */}
            <div className="space-y-3 pt-2">
              {/* KVKK */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.kvkk}
                    onChange={set('kvkk')}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#ffe119] focus:ring-[#ffe119]/50 accent-[#ffe119]"
                  />
                  <span className="text-xs text-gray-500 leading-tight">
                    <Link to="/kvkk" target="_blank" className="font-semibold underline hover:text-gray-700">KVKK metnini</Link> okudum ve kabul ediyorum.
                  </span>
                </label>
                <FieldError msg={errors.kvkk} />
              </div>

              {/* Mesafeli Satış Sözleşmesi */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.agreement}
                    onChange={set('agreement')}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#ffe119] focus:ring-[#ffe119]/50 accent-[#ffe119]"
                  />
                  <span className="text-xs text-gray-500 leading-tight">
                    <Link to="/mesafeli-satis" target="_blank" className="font-semibold underline hover:text-gray-700">Mesafeli Satış Sözleşmesi</Link>'ni okudum ve onaylıyorum.
                  </span>
                </label>
                <FieldError msg={errors.agreement} />
              </div>
            </div>

            {/* Kayıt Ol Butonu */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 font-semibold text-sm rounded-xl py-3 transition-colors disabled:opacity-50 text-gray-900 shadow-sm"
              style={{ backgroundColor: '#ffe119' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ecd015'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffe119'}
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
              ) : (
                <>Kayıt Ol <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          {/* Giriş Yap Linki */}
          <p className="text-center text-xs text-gray-400 font-medium pt-4 border-t border-gray-50">
            Zaten hesabınız var mı?{' '}
            <Link 
              to="/giris" 
              className="font-semibold transition-colors hover:opacity-80 ml-1"
              style={{ color: '#dcb800' }}
            >
              Giriş Yap
            </Link>
          </p>
        </div>

        {/* Usta Başvurusu Yönlendirmesi */}
        <p className="text-center text-xs text-gray-400 mt-6 font-medium">
          Usta olarak başvurmak ister misin?{' '}
          <Link to="/usta/basvuru" className="text-gray-600 font-semibold hover:text-gray-900 transition-colors ml-1">
            Usta Başvurusu →
          </Link>
        </p>

      </div>
    </div>
  );
}