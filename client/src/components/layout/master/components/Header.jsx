import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../../store/AuthContext';
import { LogOut, Wrench, Home, DollarSign, User, Bell, Settings, ChevronDown } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'ANA SAYFA',   path: '/usta',          icon: Home,        end: true },
  { label: 'KAZANÇLARIM', path: '/usta/kazanclar', icon: DollarSign },
  { label: 'PROFİLİM',    path: '/usta/profil',    icon: User },
];

const notifications = [
  { id: 1, text: 'Yeni bir talep atandı, incelemeniz bekleniyor.', unread: true,  time: '5dk' },
  { id: 2, text: 'Ödemeniz hesabınıza aktarıldı.',                 unread: true,  time: '2sa' },
  { id: 3, text: 'Müşteri değerlendirme bıraktı.',                 unread: false, time: '1g'  },
];

export default function Header() {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [notifOpen,   setNotifOpen]   = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef   = useRef(null);
  const profileRef = useRef(null);

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current   && !notifRef.current.contains(e.target))   setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { logout(); navigate('/usta/giris'); };

  const isActive = (path, end) =>
    end ? location.pathname === path : location.pathname.startsWith(path);

  return (
    // Taşma hatasını önlemek için px-8 kaldırıldı, Layout'a bağlandı
    <header className="w-full bg-white border-b border-zinc-100 font-sans sticky top-0 z-40 select-none">
      <div className="w-full h-[80px] flex items-center justify-between gap-4">

        {/* ── SOL ALAN: LOGO VE PREMİUM USTA MENÜSÜ ── */}
        <div className="flex items-center gap-6">

          {/* Kurumsal Usta Panel Logosu */}
          <button onClick={() => navigate('/usta')} className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 bg-[#ffe119] rounded-xl flex items-center justify-center shadow-sm shadow-amber-200 group-hover:bg-[#1A2238] transition-colors duration-300">
              <Wrench size={18} className="text-[#1A2238] group-hover:text-[#ffe119] transition-colors duration-300" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-black text-[#1A2238] uppercase tracking-tight">
              USTA<span className="text-zinc-400 font-medium lowercase">bakar</span>
            </span>
          </button>

          {/* İnce Ayırıcı Çizgi */}
          <div className="h-6 w-px bg-zinc-200 hidden md:block" />

          {/* Menü Linkleri - Kalın, büyük harfli ve geniş tracking yapısı */}
          <nav className="hidden md:flex items-center gap-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon   = item.icon;
              const active = isActive(item.path, item.end);
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 active:scale-95 ${
                    active
                      ? 'bg-[#1A2238] text-[#ffe119] shadow-sm'
                      : 'text-zinc-400 hover:text-[#1A2238] hover:bg-zinc-50'
                  }`}
                >
                  <Icon size={14} strokeWidth={2.5} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* ── SAĞ ALAN: BİLDİRİM VE PROFiL ── */}
        <div className="flex items-center gap-3.5">

          {/* Bildirim Dropdown Kutusu */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => { setNotifOpen(v => !v); setProfileOpen(false); }}
              className={`relative w-10 h-10 flex items-center justify-center rounded-xl border transition-all duration-200 ${
                notifOpen 
                  ? 'bg-zinc-100 border-zinc-200 text-[#1A2238]' 
                  : 'bg-white border-zinc-100 text-zinc-400 hover:text-[#1A2238] hover:bg-zinc-50'
              }`}
            >
              <Bell size={18} strokeWidth={2.2} />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse" />
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-13 w-80 bg-white border border-zinc-200 rounded-2xl shadow-xl overflow-hidden z-50 animate-fadeIn text-left">
                <div className="flex items-center justify-between px-5 py-4 bg-zinc-50 border-b border-zinc-100">
                  <p className="text-xs font-black text-[#1A2238] uppercase tracking-wider">Bildirimler</p>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-mono font-black px-2.5 py-0.5 bg-[#1A2238] text-[#ffe119] rounded-md">
                      {unreadCount} YENİ
                    </span>
                  )}
                </div>
                <div className="divide-y divide-zinc-50 max-h-72 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className={`flex items-start gap-3 px-5 py-4 hover:bg-zinc-50/80 transition-colors cursor-pointer ${n.unread ? 'bg-[#ffe119]/5' : ''}`}>
                      <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${n.unread ? 'bg-[#ffe119]' : 'bg-zinc-200'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-zinc-700 leading-relaxed font-semibold">{n.text}</p>
                        <p className="text-[10px] font-mono font-bold text-zinc-400 uppercase mt-1">{n.time} ÖNCE</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profil Seçim Dropdown Kutusu */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => { setProfileOpen(v => !v); setNotifOpen(false); }}
              className={`flex items-center gap-2.5 pl-2 pr-3.5 py-2 rounded-xl border transition-all duration-200 group ${
                profileOpen ? 'bg-zinc-100 border-zinc-200' : 'bg-white border-zinc-100 hover:bg-zinc-50'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-[#1A2238] flex items-center justify-center text-[#ffe119] text-xs font-black uppercase shadow-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : <User size={14} />}
              </div>
              <span className="text-xs font-black text-[#1A2238] uppercase tracking-wider max-w-[90px] truncate hidden sm:block">
                {user?.name || 'Usta'}
              </span>
              <ChevronDown size={14} className={`text-zinc-400 transition-transform duration-200 ${profileOpen ? 'transform rotate-180 text-[#1A2238]' : 'group-hover:text-zinc-600'}`} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-13 w-60 bg-white border border-zinc-200 rounded-2xl shadow-xl overflow-hidden z-50 animate-fadeIn text-left">
                {/* Kullanıcı Bilgi Alanı */}
                <div className="px-5 py-4 bg-zinc-50 border-b border-zinc-100">
                  <p className="text-xs font-black text-[#1A2238] uppercase tracking-tight truncate">{user?.name} {user?.surname}</p>
                  <p className="text-[10px] font-mono font-bold text-zinc-400 uppercase mt-1 truncate">{user?.email || 'usta@mail.com'}</p>
                </div>
                
                {/* Menü Elemanları */}
                <button onClick={() => { navigate('/usta/profil'); setProfileOpen(false); }} className="w-full flex items-center gap-2.5 px-5 py-3.5 text-xs font-black text-zinc-500 uppercase tracking-wider hover:bg-zinc-50 hover:text-[#1A2238] transition-colors border-b border-zinc-50">
                  <User size={14} className="text-zinc-400" /> <span>Profilim</span>
                </button>
                <button onClick={() => { navigate('/usta/ayarlar'); setProfileOpen(false); }} className="w-full flex items-center gap-2.5 px-5 py-3.5 text-xs font-black text-zinc-500 uppercase tracking-wider hover:bg-zinc-50 hover:text-[#1A2238] transition-colors border-b border-zinc-50">
                  <Settings size={14} className="text-zinc-400" /> <span>Ayarlar</span>
                </button>
                
                {/* Çıkış Yap Butonu */}
                <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-5 py-3.5 text-xs font-black text-red-500 uppercase tracking-wider hover:bg-red-50/60 transition-colors">
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