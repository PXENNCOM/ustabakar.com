import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../store/AuthContext';
import { authService } from '../../../services/auth.service';
import OtpVerify from '../../../components/auth/OtpVerify';
import toast from 'react-hot-toast';
import { Phone, ArrowRight } from 'lucide-react';

export default function CustomerLogin() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [phone,   setPhone]   = useState('');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [otp,     setOtp]     = useState(null); // Kod gönderildiyse: { resendIn }

  const sendCode = async () => {
    const res = await authService.sendOtp({ phone, purpose: 'customer_login' });
    return res.data.data?.resend_in ?? 60;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone.trim()) { setError('Telefon numarası zorunludur'); return; }
    if (!/^[0-9]{10,11}$/.test(phone)) { setError('Geçerli bir telefon numarası girin'); return; }

    setLoading(true);
    try {
      const resendIn = await sendCode();
      setOtp({ resendIn });
      toast.success('Doğrulama kodu gönderildi');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Kod gönderilemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (code) => {
    try {
      const res = await authService.customerLogin({ phone, code });
      const { token, customer } = res.data.data;
      login(token, { ...customer, role: 'customer' });
      toast.success('Giriş başarılı!');
      navigate('/musteri');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Giriş yapılamadı');
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 antialiased">
      <div className="w-full max-w-md">

        {/* Logo & Başlık Alanı */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Usta Bakar</h1>
          <p className="text-xs text-gray-400 mt-1 font-medium">
            {otp ? 'SMS ile gelen kodu girin' : 'Telefon numaranızla giriş yapın'}
          </p>
        </div>

        {/* İnce Çerçeveli Sade Kart */}
        <div className="border border-gray-100 rounded-2xl p-2 sm:p-4 space-y-6">
          {otp ? (
            <OtpVerify
              phone={phone}
              resendIn={otp.resendIn}
              onVerify={handleVerify}
              onResend={sendCode}
              onBack={() => setOtp(null)}
              submitLabel="Giriş Yap"
            />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Telefon Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Telefon Numarası
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    className={`w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border rounded-xl text-gray-900 text-sm outline-none transition-all focus:ring-2 placeholder:text-gray-400 ${
                      error
                        ? 'border-red-500 focus:ring-red-100'
                        : 'border-gray-200 focus:border-[#ffe119] focus:ring-[#ffe119]/20'
                    }`}
                    placeholder="05XXXXXXXXX"
                    value={phone}
                    onChange={e => { setPhone(e.target.value.replace(/\D/g, '')); setError(''); }}
                    maxLength={11}
                    inputMode="tel"
                    autoComplete="tel"
                  />
                </div>
                {error && <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>}
              </div>

              {/* Bilgi Notu (Açık gri soft tema) */}
              <div className="flex items-start gap-2.5 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                <Phone size={14} className="text-gray-400 mt-0.5 shrink-0" />
                <p className="text-xs text-gray-500 font-normal leading-relaxed">
                  Numaranıza SMS doğrulama kodu gönderilecektir.
                </p>
              </div>

              {/* Kod Gönder Butonu */}
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
                  <>Kod Gönder <ArrowRight size={16} /></>
                )}
              </button>
            </form>
          )}

          {/* Kayıt Ol Linki */}
          <p className="text-center text-xs text-gray-400 font-medium pt-4 border-t border-gray-50">
            Hesabınız yok mu?{' '}
            <Link
              to="/kayit"
              className="font-semibold transition-colors hover:opacity-80 ml-1"
              style={{ color: '#dcb800' }}
            >
              Kayıt Ol
            </Link>
          </p>
        </div>

        {/* Usta Girişine Yönlendirme */}
        <p className="text-center text-xs text-gray-400 mt-6 font-medium">
          Usta mısınız?{' '}
          <Link to="/usta/giris" className="text-gray-600 font-semibold hover:text-gray-900 transition-colors ml-1">
            Usta Girişi →
          </Link>
        </p>

      </div>
    </div>
  );
}