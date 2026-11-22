import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { ArrowLeft, ArrowRight, MessageSquare } from 'lucide-react';

// 5321234567 / 05321234567 → 0532 123 45 67
const formatPhone = (value) => {
  let d = String(value || '').replace(/\D/g, '');
  if (d.length === 12 && d.startsWith('90')) d = d.slice(2);
  if (d.length === 11 && d.startsWith('0')) d = d.slice(1);
  if (d.length !== 10) return value;
  return `0${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6, 8)} ${d.slice(8)}`;
};

/**
 * SMS doğrulama kodu adımı.
 * onVerify: async (code) => true (başarılı) | false (hatalı, kutu temizlenir)
 * onResend: async () => yeni bekleme süresi (sn); hata olursa throw etmeli
 */
export default function OtpVerify({
  phone,
  resendIn = 60,
  onVerify,
  onResend,
  onBack,
  submitLabel = 'Doğrula',
  backLabel = 'Numarayı değiştir',
}) {
  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(resendIn);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRef = useRef(null);
  const busy = useRef(false);

  useEffect(() => { inputRef.current?.focus(); }, []);

  // Tekrar gönder geri sayımı
  useEffect(() => {
    if (timer <= 0) return undefined;
    const t = setTimeout(() => setTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  const verify = async (value) => {
    if (value.length !== 6 || busy.current) return;
    busy.current = true;
    setVerifying(true);
    const ok = await onVerify(value);
    busy.current = false;
    setVerifying(false);
    if (!ok) {
      setCode('');
      inputRef.current?.focus();
    }
  };

  // 6 hane girilince (veya SMS'ten otomatik doldurulunca) kendiliğinden doğrular
  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
    if (value.length === 6) verify(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    verify(code);
  };

  const handleResend = async () => {
    if (timer > 0 || resending) return;
    setResending(true);
    try {
      const next = await onResend();
      toast.success('Yeni kod gönderildi');
      setCode('');
      setTimer(typeof next === 'number' ? next : 60);
      inputRef.current?.focus();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Kod gönderilemedi');
    } finally {
      setResending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Bilgi Notu */}
      <div className="flex items-start gap-2.5 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
        <MessageSquare size={14} className="text-gray-400 mt-0.5 shrink-0" />
        <p className="text-xs text-gray-500 font-normal leading-relaxed">
          <span className="font-semibold text-gray-700">{formatPhone(phone)}</span> numarasına gönderilen 6 haneli kodu girin.
        </p>
      </div>

      {/* Kod Input */}
      <div>
        <label htmlFor="otp-code" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
          Doğrulama Kodu
        </label>
        <input
          id="otp-code"
          ref={inputRef}
          className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 text-xl font-semibold text-center tracking-[0.5em] outline-none transition-all focus:ring-2 focus:border-[#ffe119] focus:ring-[#ffe119]/20 placeholder:text-gray-300"
          placeholder="••••••"
          value={code}
          onChange={handleChange}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          readOnly={verifying}
        />
      </div>

      {/* Doğrula Butonu */}
      <button
        type="submit"
        disabled={verifying || code.length !== 6}
        className="w-full flex items-center justify-center gap-2 font-semibold text-sm rounded-xl py-3 transition-colors disabled:opacity-50 text-gray-900 shadow-sm"
        style={{ backgroundColor: '#ffe119' }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ecd015'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffe119'}
      >
        {verifying ? (
          <span className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
        ) : (
          <>{submitLabel} <ArrowRight size={16} /></>
        )}
      </button>

      {/* Geri / Tekrar Gönder */}
      <div className="flex items-center justify-between text-xs font-medium">
        <button
          type="button"
          onClick={onBack}
          disabled={verifying}
          className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-900 transition-colors disabled:opacity-50"
        >
          <ArrowLeft size={14} /> {backLabel}
        </button>
        <button
          type="button"
          onClick={handleResend}
          disabled={timer > 0 || resending || verifying}
          className="font-semibold transition-colors hover:opacity-80 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:opacity-100"
          style={timer > 0 || resending ? undefined : { color: '#dcb800' }}
        >
          {resending ? 'Gönderiliyor...' : timer > 0 ? `Tekrar gönder (${timer} sn)` : 'Kodu tekrar gönder'}
        </button>
      </div>
    </form>
  );
}