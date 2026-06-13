import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useQuery } from '@tanstack/react-query';
import { masterService } from '../../services/index';
import { Spinner } from '../../components/ui';
import toast from 'react-hot-toast';
import {
  User, Phone, MapPin, Briefcase, Calendar,
  CheckCircle, MessageSquare, Send, X, Wrench,
} from 'lucide-react';

// ==========================================
// ─── GÜNCELLEME TALEBİ MODALI ───
// ==========================================
function TicketModal({ onClose }) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) { toast.error('Mesaj alanı boş bırakılamaz'); return; }
    setLoading(true);
    try {
      await masterService.createTicket(message);
      toast.success('Güncelleme talebiniz merkez ekibimize iletildi');
      setMessage('');
      onClose();
    } catch {
      toast.error('Talep gönderilirken teknik bir sorun oluştu');
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto pt-10 md:pt-24">
      <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm transition-opacity duration-300" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md my-auto rounded-xl overflow-hidden shadow-xl border border-zinc-200/60 animate-fadeIn z-10 flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 bg-zinc-50 border-b border-zinc-100 border-l-4 border-l-[#ffe119] select-none">
          <div className="flex items-center gap-2">
            <MessageSquare size={16} className="text-zinc-700" />
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wide">Güncelleme Talebi</h3>
          </div>
          <button onClick={onClose} className="flex items-center justify-center w-7 h-7 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all font-bold text-sm">✕</button>
        </div>
        <div className="p-5 space-y-4 text-left">
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">Değiştirmek istediğiniz bilgileri detaylıca açıklayın. Ekibimiz profilinizi en kısa sürede güncelleyecektir.</p>
          <textarea
            rows={5}
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Örn: Telefon numaramı güncellemek istiyorum. Yeni numaram: 05XX XXX XX XX"
            className="w-full bg-white border border-zinc-200 font-medium text-sm text-zinc-900 p-3.5 rounded-xl resize-none focus:border-[#ffe119] outline-none transition-all duration-150 placeholder:text-zinc-300"
          />
          <div className="flex gap-3 pt-3 border-t border-zinc-100">
            <button onClick={onClose} className="flex-1 py-2.5 border border-zinc-200 text-zinc-700 font-semibold text-xs uppercase tracking-wider rounded-xl hover:bg-zinc-50 transition-all active:scale-95">İptal</button>
            <button onClick={handleSend} disabled={loading} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-zinc-900 hover:bg-[#ffe119] hover:text-[#1A2238] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200 active:scale-95">
              {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Send size={13} /> <span>Gönder</span></>}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─── PROFiL BİLGİ SATIRI BİLEŞENİ ───
function ProfileRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex justify-between items-center py-4 border-b border-zinc-100 last:border-0 group">
      <div className="flex items-center gap-3">
        <Icon size={16} className="text-zinc-400 group-hover:text-[#ffe119] transition-colors duration-200" />
        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{label}</span>
      </div>
      <span className="text-sm font-bold text-zinc-900 uppercase tracking-tight text-right max-w-[60%]">{value}</span>
    </div>
  );
}

// ─── İSTATİSTİK ÖĞESİ BİLEŞENİ ───
function StatItem({ value, label }) {
  return (
    <div className="flex-1 text-center group">
      <p className="text-2xl font-black text-zinc-900 group-hover:text-[#ffe119] transition-colors duration-200 tracking-tight">{value}</p>
      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mt-1">{label}</p>
    </div>
  );
}

// ==========================================
// ─── ANA PROFiL SAYFASI BİLEŞENİ ───
// ==========================================
export default function MasterProfile() {
  const [ticketOpen, setTicketOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['master-profile'],
    queryFn:  () => masterService.getProfile(),
  });

  const master = data?.data?.data;

  if (isLoading) return <div className="flex justify-center py-16"><Spinner /></div>;
  if (!master)   return null;

  return (
    <div className="space-y-6 font-sans text-left">

      {/* Üst Başlık */}
      <div className="border-b border-zinc-100 pb-3">
        <p className="text-[10px] font-bold tracking-wider uppercase text-zinc-400">Hesap Yönetimi</p>
        <h1 className="text-lg font-black text-zinc-900 uppercase tracking-tight mt-0.5">Profil Bilgileri</h1>
      </div>

      {/* HERO KART */}
      <div className="relative overflow-hidden bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
        <div className="absolute -right-10 -top-10 w-24 h-24 bg-[#ffe119]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-zinc-900 border-b-2 border-b-[#ffe119] rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xl font-black uppercase">{master.name?.[0]}</span>
            </div>
            <div>
              <p className="text-lg font-black text-zinc-900 uppercase tracking-tight leading-none">{master.name} {master.surname}</p>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mt-1.5">{master.expertise?.name || 'Ekspertiz Uzmanı'}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100/60 px-3 py-1.5 rounded-lg self-start sm:self-center">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-emerald-700 text-[10px] font-bold uppercase tracking-wider">Aktif Kullanıcı</span>
          </div>
        </div>

        <div className="flex items-center mt-6 pt-5 border-t border-zinc-100">
          <StatItem value={master.completedCount || 0} label="Tamamlanan İş" />
          <div className="w-px h-8 bg-zinc-200" />
          <StatItem value={master.City?.name || '-'} label="Çalışma Bölgesi" />
          <div className="w-px h-8 bg-zinc-200" />
          <StatItem value={new Date(master.created_at).getFullYear()} label="Kayıt Yılı" />
        </div>
      </div>

      {/* Liste Bilgileri */}
      <div className="w-full bg-white border border-zinc-200 rounded-2xl px-5 shadow-sm">
        <ProfileRow icon={User}      label="Ad Soyad"   value={`${master.name} ${master.surname}`} />
        <ProfileRow icon={Phone}     label="Telefon"    value={master.phone} />
        <ProfileRow icon={MapPin}    label="Bölge (İl / İlçe)"  value={[master.City?.name, master.District?.name].filter(Boolean).join(' / ')} />
        <ProfileRow icon={Briefcase} label="Uzmanlık"   value={master.expertise?.name} />
        <ProfileRow icon={Calendar}  label="Kayıt Tarihi" value={new Date(master.created_at).toLocaleDateString('tr-TR')} />
      </div>

      {/* ⚠️ GÜNCELLEME TALEBİ PANEL KUTUSU (TALEP DOĞRULTUSUNDA SARIYA BOYANDI) */}
      <div className="bg-[#ffe119] border border-amber-300 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all relative overflow-hidden group">
        {/* İçeride hafif lüks bir derinlik katması için beyaz şeffaf dekor yuvarlağı */}
        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/15 rounded-full pointer-events-none" />
        
        <div className="flex items-start gap-4 relative z-10">
          {/* İkon kutusu kontrast için koyu lacivert yapıldı */}
          <div className="w-11 h-11 bg-[#1A2238] rounded-xl flex items-center justify-center flex-shrink-0 text-[#ffe119] shadow-sm">
            <Wrench size={18} strokeWidth={2.5} />
          </div>
          <div className="space-y-0.5 text-left">
            <p className="text-sm font-black text-[#1A2238] uppercase tracking-tight">Bilgilerinizi güncellemek mi istiyorsunuz?</p>
            <p className="text-xs font-semibold text-[#1A2238]/80 leading-relaxed max-w-xl">
              Güvenlik sebebiyle verilerinizi panel üzerinden doğrudan değiştiremezsiniz. Bilgilerinizin güncellenmesi için merkez ekibimize hızlıca talep iletebilirsiniz.
            </p>
          </div>
        </div>
        
        {/* Buton tam kurumsal koyu lacivert zeminle sarının üstünde patlatıldı */}
        <button
          onClick={() => setTicketOpen(true)}
          className="w-full md:w-auto px-6 py-3.5 bg-[#1A2238] hover:bg-zinc-900 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all duration-150 flex items-center justify-center gap-2 shadow-md hover:shadow-none whitespace-nowrap active:scale-[0.98] relative z-10"
        >
          <MessageSquare size={14} strokeWidth={2.5} />
          <span>Talep Oluştur</span>
        </button>
      </div>

      {ticketOpen && <TicketModal onClose={() => setTicketOpen(false)} />}
    </div>
  );
}