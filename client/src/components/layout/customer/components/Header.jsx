import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../../store/AuthContext';
import { LogOut, Car, LayoutDashboard, ClipboardList, Bell, User, Settings, ChevronDown, Plus, Check } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Ana Sayfa', path: '/musteri',          icon: LayoutDashboard },
  { label: 'Talepler',  path: '/musteri/talepler',  icon: ClipboardList },
];

const initialNotifications = [
  { id: 1, text: 'Başvurunuz onaylandı ve işleme alındı.',      unread: true,  time: '2dk' },
  { id: 2, text: 'Ekspertiz raporu hazır, inceleyebilirsiniz.', unread: true,  time: '1sa' },
  { id: 3, text: 'Yeni mesajınız var.',                         unread: false, time: '3sa' },
];

export default function Header() {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [notifOpen,   setNotifOpen]   = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifs, setNotifs]           = useState(initialNotifications);
  const notifRef   = useRef(null);
  const profileRef = useRef(null);

  const unreadCount = notifs.filter(n => n.unread).length;

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current   && !notifRef.current.contains(e.target))   setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { logout(); navigate('/giris'); };

  const markAllAsRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, unread: false })));
  };

  return (
    <header className="w-full bg-white border-b border-zinc-200/80 font-sans sticky top-0 z-40 select-none">
      <div className="w-full h-[72px] flex items-center justify-between gap-4">

        {/* ── SOL ALAN: LOGO VE NAVİGASYON ── */}
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/musteri')} className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 bg-[#ffe119] rounded-xl flex items-center justify-center border border-amber-400/20 shadow-sm transition-transform duration-300 active:scale-95">
              <Car size={18} className="text-zinc-900" strokeWidth={2.5} />
            </div>
            <span className="text-base font-bold text-zinc-900 tracking-tight">
              Usta<span className="text-zinc-400 font-medium lowercase pl-0.5">bakar</span>
            </span>
          </button>

          <div className="h-4 w-px bg-zinc-200 hidden md:block" />

          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = location.pathname === item.path;
              const Icon   = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    active ? 'text-zinc-900 font-semibold bg-zinc-50' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50/60'
                  }`}
                >
                  <Icon size={15} strokeWidth={active ? 2.2 : 1.8} className={active ? 'text-zinc-900' : 'text-zinc-400'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* ── SAĞ ALAN: AKSİYONLAR ── */}
        <div className="flex items-center gap-3">

          <button
            onClick={() => navigate('/musteri/yeni-talep')}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#ffe119] hover:bg-[#ffe119]/90 text-zinc-900 text-sm font-bold rounded-xl border border-amber-400/30 transition-all shadow-sm active:scale-98 shrink-0"
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>Yeni Talep</span>
          </button>

          {/* ── BİLDİRİM PANELİ (GENİŞLETİLMİŞ VE FERAH YENİ VERSİYON) ── */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => { setNotifOpen(v => !v); setProfileOpen(false); }}
              className={`relative w-9 h-9 inline-flex items-center justify-center rounded-xl border transition-all duration-150 ${
                notifOpen 
                  ? 'bg-zinc-950 border-zinc-950 text-white shadow-md' 
                  : 'bg-white border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
              }`}
            >
              <Bell size={16} strokeWidth={2} />
              {unreadCount > 0 && (
                <span className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${notifOpen ? 'bg-[#ffe119]' : 'bg-red-500'}`} />
              )}
            </button>

            {notifOpen && (
              /* w-84 değerini w-[420px] yaparak yatayda genişlettik, dikey yığılmayı önledik */
              <div className="absolute right-0 top-14 mt-1 w-[420px] max-w-[calc(100vw-2rem)] bg-white border border-zinc-200/80 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] overflow-hidden z-50 text-left animate-fadeIn">
                
                {/* Geniş ve Rahat Başlık Alanı */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 bg-white">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold text-zinc-900 tracking-wide uppercase">Bildirimler</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-mono font-black px-2 py-0.5 bg-zinc-100 text-zinc-700 rounded-md">{unreadCount} YENİ</span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllAsRead}
                      className="text-[11px] font-semibold text-zinc-400 hover:text-zinc-900 flex items-center gap-1 transition-colors outline-none"
                    >
                      <Check size={12} strokeWidth={3} /> Hepsini Okundu Say
                    </button>
                  )}
                </div>

                {/* Bildirim İçerik Satırları (Yatayda Ferah) */}
                <div className="divide-y divide-zinc-100 max-h-80 overflow-y-auto bg-white">
                  {notifs.length === 0 ? (
                    <div className="py-14 text-center text-xs text-zinc-400 font-medium uppercase tracking-wide">Yeni Bildirim Bulunmuyor</div>
                  ) : (
                    notifs.map(n => (
                      <div 
                        key={n.id} 
                        className={`flex items-center justify-between gap-4 px-5 py-4 hover:bg-zinc-50/50 transition-colors relative ${
                          n.unread ? 'bg-white' : 'bg-white opacity-75'
                        }`}
                      >
                        <div className="flex items-start gap-3.5 min-w-0 flex-1">
                          {/* Durum Noktası */}
                          <div className="mt-1 shrink-0">
                            <div className={`w-2 h-2 rounded-full ${n.unread ? 'bg-[#ffe119] ring-4 ring-[#ffe119]/15' : 'bg-zinc-200'}`} />
                          </div>
                          
                          {/* Bildirim Metni - Geniş en sayesinde tek satırda veya çok daha az kırılarak uzuyor */}
                          <p className={`text-xs leading-relaxed text-zinc-800 pr-2 truncate md:whitespace-normal ${n.unread ? 'font-semibold' : 'font-medium'}`}>
                            {n.text}
                          </p>
                        </div>

                        {/* Zaman Bilgisi - Sağ köşeye sabitlendi ve genişlik payı ayrıldı */}
                        <div className="shrink-0 text-right min-w-[45px]">
                          <p className="text-[10px] font-medium text-zinc-400 font-mono">{n.time} önce</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profil Seçim Alanı */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => { setProfileOpen(v => !v); setNotifOpen(false); }}
              className={`inline-flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-xl border transition-all duration-150 group ${
                profileOpen ? 'bg-zinc-50 border-zinc-300' : 'bg-white border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-zinc-900 flex items-center justify-center text-white text-xs font-bold uppercase shadow-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : <User size={13} />}
              </div>
              <span className="text-sm font-semibold text-zinc-700 max-w-[90px] truncate hidden sm:block">
                {user?.name || 'ahmet'}
              </span>
              <ChevronDown size={13} className={`text-zinc-400 transition-transform duration-150 ${profileOpen ? 'transform rotate-180 text-zinc-800' : 'group-hover:text-zinc-600'}`} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-14 mt-1 w-56 bg-white border border-zinc-200 rounded-2xl shadow-xl shadow-zinc-200/40 overflow-hidden z-50 text-left">
                <div className="px-4 py-3 bg-zinc-50 border-b border-zinc-100">
                  <p className="text-sm font-bold text-zinc-900 truncate">{user?.name} {user?.surname}</p>
                  <p className="text-xs text-zinc-400 mt-0.5 truncate">{user?.email || 'musteri@mail.com'}</p>
                </div>
                <button onClick={() => { navigate('/musteri/profil'); setProfileOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors font-medium border-b border-zinc-50">
                  <User size={14} className="text-zinc-400" /> <span>Profilim</span>
                </button>
                <button onClick={() => { navigate('/musteri/ayarlar'); setProfileOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors font-medium border-b border-zinc-50">
                  <Settings size={14} className="text-zinc-400" /> <span>Ayarlar</span>
                </button>
                <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors font-semibold">
                  <LogOut size={14} /> <span>Çıkış Yap</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}