import { useState } from 'react';
import { createPortal } from 'react-dom';
import { LifeBuoy, Send, X, ChevronDown } from 'lucide-react';

const CATEGORIES = [
  { value: 'general',   label: 'Genel Soru / Bilgi' },
  { value: 'payment',   label: 'Ödeme ve İade İşlemleri' },
  { value: 'expert',    label: 'Atanan Uzman / Randevu Sorunu' },
  { value: 'technical', label: 'Sistem / Teknik Hata' },
];

const Label = ({ children }) => (
  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-1.5">
    {children}
  </label>
);

function ModalContent({ onClose }) {
  const [category, setCategory] = useState('general');
  const [message,  setMessage]  = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onClose();
      alert('Destek talebiniz alındı. En kısa sürede dönüş yapıyoruz.');
    }, 1000);
  };

  return (
    // fixed ve items-start kalıbıyla üst sızmalar tamamen kapatıldı
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto pt-10 md:pt-24">
      <div className="fixed inset-0 bg-[#0A0314]/75 backdrop-blur-sm transition-opacity duration-300" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-md my-auto rounded-[24px] overflow-hidden shadow-2xl border border-zinc-100 animate-fadeIn z-10 flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-zinc-50 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <LifeBuoy size={16} className="text-[#1A2238]" strokeWidth={2.5} />
            <h3 className="text-sm font-black text-[#1A2238] uppercase tracking-wider">Destek Talebi</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl text-zinc-400 hover:text-[#1A2238] hover:bg-zinc-200/60 transition-all font-bold text-sm">
            <X size={15} strokeWidth={2.5} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-left">
          <div>
            <Label>Konu Kategorisi</Label>
            <div className="relative">
              <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none z-10" strokeWidth={2.5} />
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                style={{ appearance: 'none' }}
                className="w-full pl-4 pr-9 py-3.5 text-sm font-bold text-[#1A2238] bg-zinc-50 border-2 border-zinc-100 rounded-xl outline-none transition-all cursor-pointer focus:bg-white focus:border-[#ffe119]"
              >
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label>Mesajınız</Label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Yaşadığınız durumu detaylıca buraya yazın..."
              className="w-full bg-zinc-50 border-2 border-zinc-100 font-medium text-sm text-[#1A2238] p-4 rounded-xl resize-none focus:bg-white focus:border-[#ffe119] outline-none transition-all"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100">
            <button type="button" onClick={onClose} className="px-5 py-3 border-2 border-zinc-200 text-[#1A2238] font-black text-xs uppercase tracking-widest rounded-xl hover:bg-zinc-50 transition-all">
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3.5 bg-[#1A2238] hover:bg-[#ffe119] text-white hover:text-[#1A2238] disabled:opacity-50 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 shadow-md flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <><Send size={13} strokeWidth={2.5} /> <span>Gönder</span></>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SupportModal({ onClose }) {
  return createPortal(<ModalContent onClose={onClose} />, document.body);
}