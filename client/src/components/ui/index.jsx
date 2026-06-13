import React from 'react';

// ─── Button ───────────────────────────────────────────────────────────────────
// Sitenin ön yüzündeki devasa, kalın ve vurucu buton tarzına getirildi
export const Button = ({
  children,
  variant = 'primary',
  size = '',
  loading = false,
  className = '',
  ...props
}) => {
  const variants = {
    primary:   'bg-[#ffe119] text-[#1A2238] hover:bg-[#1A2238] hover:text-white font-black uppercase tracking-widest transition-all duration-300 rounded-xl shadow-md',
    brand:     'bg-[#1A2238] text-white hover:bg-[#ffe119] hover:text-[#1A2238] font-black uppercase tracking-widest transition-all duration-300 rounded-xl',
    secondary: 'bg-zinc-100 text-[#1A2238] hover:bg-zinc-200 font-black uppercase tracking-widest rounded-xl transition-all',
    danger:    'bg-red-600 text-white hover:bg-red-700 font-black uppercase tracking-widest rounded-xl transition-all shadow-md shadow-red-200',
    success:   'bg-emerald-600 text-white hover:bg-emerald-700 font-black uppercase tracking-widest rounded-xl transition-all',
    outline:   'border-2 border-zinc-200 bg-white text-[#1A2238] hover:bg-zinc-50 font-black uppercase tracking-widest rounded-xl transition-all',
  };
  
  const sizes = {
    sm: 'px-4 py-2.5 text-xs',
    lg: 'px-8 py-5 text-sm md:text-base',
    '': 'px-6 py-4 text-xs md:text-sm', // Varsayılan büyük ve tok dolgu
  };

  return (
    <button
      className={`${variants[variant] ?? variants.primary} ${sizes[size] ?? ''} inline-flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 transition-transform ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin flex-shrink-0" />
      )}
      <span>{children}</span>
    </button>
  );
};

// ─── Input ────────────────────────────────────────────────────────────────────
// Ustanın sanayide rahatça yazabilmesi için kalın ve net kontrastlı input
export const Input = ({ label, error, className = '', ...props }) => (
  <div className="w-full space-y-1.5 text-left">
    {label && <label className="block text-[11px] font-black text-[#1A2238] uppercase tracking-widest">{label}</label>}
    <input 
      className={`w-full bg-zinc-50 border-2 font-bold text-sm text-[#1A2238] px-4 py-3.5 rounded-xl uppercase focus:bg-white focus:border-[#ffe119] outline-none transition-all ${
        error ? 'border-red-500 bg-red-50/10 focus:border-red-500' : 'border-zinc-100'
      } ${className}`} 
      {...props} 
    />
    {error && <p className="mt-1 text-xs font-bold text-red-500 uppercase tracking-wide">{error}</p>}
  </div>
);

// ─── Textarea ─────────────────────────────────────────────────────────────────
export const Textarea = ({ label, error, className = '', rows = 3, ...props }) => (
  <div className="w-full space-y-1.5 text-left">
    {label && <label className="block text-[11px] font-black text-[#1A2238] uppercase tracking-widest">{label}</label>}
    <textarea
      rows={rows}
      className={`w-full bg-zinc-50 border-2 font-medium text-sm text-[#1A2238] p-4 rounded-xl resize-none focus:bg-white focus:border-[#ffe119] outline-none transition-all ${
        error ? 'border-red-500 bg-red-50/10 focus:border-red-500' : 'border-zinc-100'
      } ${className}`}
      {...props}
    />
    {error && <p className="mt-1 text-xs font-bold text-red-500 uppercase tracking-wide">{error}</p>}
  </div>
);

// ─── Select ───────────────────────────────────────────────────────────────────
export const Select = ({ label, error, children, className = '', ...props }) => (
  <div className="w-full space-y-1.5 text-left">
    {label && <label className="block text-[11px] font-black text-[#1A2238] uppercase tracking-widest">{label}</label>}
    <select 
      className={`w-full bg-zinc-50 border-2 font-bold text-sm text-[#1A2238] px-4 py-3.5 rounded-xl focus:bg-white focus:border-[#ffe119] outline-none transition-all cursor-pointer ${
        error ? 'border-red-500 focus:border-red-500' : 'border-zinc-100'
      } ${className}`} 
      {...props}
    >
      {children}
    </select>
    {error && <p className="mt-1 text-xs font-bold text-red-500 uppercase tracking-wide">{error}</p>}
  </div>
);

// ─── Badge ────────────────────────────────────────────────────────────────────
export const Badge = ({ children, variant = 'gray' }) => {
  const variants = {
    gray:   'bg-zinc-100 text-zinc-600',
    green:  'bg-emerald-50 text-emerald-700 border border-emerald-100',
    red:    'bg-red-50 text-red-700 border border-red-100',
    yellow: 'bg-amber-50 text-amber-700 border border-amber-200',
    blue:   'bg-blue-50 text-blue-700 border border-blue-100',
    orange: 'bg-orange-50 text-orange-700 border border-orange-100',
    brand:  'bg-[#1A2238] text-[#ffe119]',
  };
  return (
    <span className={`inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md ${variants[variant] ?? variants.gray}`}>
      {children}
    </span>
  );
};

// ─── Spinner ──────────────────────────────────────────────────────────────────
export const Spinner = ({ size = 'md' }) => {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex items-center justify-center p-6">
      <div className={`${sizes[size]} border-3 border-zinc-200 border-t-[#ffe119] rounded-full animate-spin`} />
    </div>
  );
};

// ─── PageSpinner ──────────────────────────────────────────────────────────────
export const PageSpinner = () => (
  <div className="flex items-center justify-center h-64 w-full">
    <Spinner size="lg" />
  </div>
);

// ─── Card ─────────────────────────────────────────────────────────────────────
export const Card = ({ children, className = '' }) => (
  <div className={`bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm ${className}`}>{children}</div>
);

export const CardHeader = ({ children, className = '' }) => (
  <div className={`border-b border-zinc-100 pb-4 mb-4 ${className}`}>{children}</div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`w-full ${className}`}>{children}</div>
);

// ─── Modal ────────────────────────────────────────────────────────────────────
// Üst boşluk hatası, gri ince çizgiler ve siyahlık problemleri tamamen temizlendi
export const Modal = ({ open, onClose, title, children, size = 'md' }) => {
  if (!open) return null;
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  
  return (
    // items-center yerine items-start + pt ile dikey yerleşimi kilitleyerek sızmayı engelledik
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto pt-10 md:pt-24">
      
      {/* Karartma Arka Planı (Backdrop) */}
      <div 
        className="fixed inset-0 bg-[#0A0314]/75 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose} 
      />
      
      {/* Ana Modal Kutusu */}
      <div className={`relative bg-white w-full ${sizes[size]} my-auto rounded-[24px] overflow-hidden shadow-[0_25px_60px_-15px_rgba(10,3,20,0.5)] border border-zinc-100/80 animate-fadeIn z-10 flex flex-col`}>
        
        {title && (
          <div className="flex items-center justify-between px-6 py-4.5 bg-zinc-50 border-b border-zinc-100 select-none">
            <h3 className="font-black text-sm text-[#1A2238] uppercase tracking-wider">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-xl text-zinc-400 hover:text-[#1A2238] hover:bg-zinc-200/60 transition-all font-bold text-sm"
            >
              ✕
            </button>
          </div>
        )}
        
        {/* İçerik Alanı */}
        <div className="overflow-y-auto flex-1 px-6 py-6 bg-white text-left text-stone-900">
          {children}
        </div>
      </div>
    </div>
  );
};

// ─── ConfirmModal ─────────────────────────────────────────────────────────────
export const ConfirmModal = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Onayla',
  confirmVariant = 'primary',
  loading = false,
}) => (
  <Modal open={open} onClose={onClose} title={title} size="sm">
    <div className="w-full">
      <p className="text-sm font-bold text-[#1A2238]/70 leading-relaxed tracking-wide mb-6">
        {message}
      </p>
      
      {/* İptal ve Aksiyon Buton Grubu */}
      <div className="flex gap-3 justify-end pt-4 border-t border-zinc-100">
        <Button variant="outline" size="sm" type="button" onClick={onClose}>
          İptal
        </Button>
        <Button 
          variant={confirmVariant === 'danger' ? 'danger' : 'primary'} 
          size="sm" 
          type="button" 
          onClick={onConfirm} 
          loading={loading}
        >
          {confirmText}
        </Button>
      </div>
    </div>
  </Modal>
);

// ─── Table ────────────────────────────────────────────────────────────────────
export const Table = ({ headers, children, empty = 'Kayıt bulunamadı' }) => {
  const isEmpty = !children || (Array.isArray(children) && children.flat().filter(Boolean).length === 0);
  return (
    <div className="w-full overflow-x-auto border border-zinc-100 rounded-2xl bg-white shadow-sm">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-zinc-50 border-b border-zinc-100">
            {headers.map((h, i) => (
              <th key={i} className="px-6 py-4 text-[10px] font-mono font-black text-zinc-400 uppercase tracking-widest">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-50 text-sm font-semibold text-[#1A2238] uppercase tracking-tight">
          {children}
        </tbody>
      </table>
      {isEmpty && (
        <div className="text-center py-12 text-xs font-black text-zinc-400 uppercase tracking-widest bg-white">
          {empty}
        </div>
      )}
    </div>
  );
};

// ─── Pagination ───────────────────────────────────────────────────────────────
export const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-zinc-100">
      <p className="text-xs font-mono font-black text-zinc-400 uppercase tracking-widest">
        {page} / {totalPages} SAYFA
      </p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          ← ÖNCEKİ
        </Button>
        <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
          SONRAKİ →
        </Button>
      </div>
    </div>
  );
};

// ─── EmptyState ───────────────────────────────────────────────────────────────
export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center bg-white border border-zinc-100 rounded-2xl p-8">
    {Icon && (
      <div className="w-14 h-14 flex items-center justify-center rounded-2xl mb-4 bg-[#ffe119]/10 border border-[#ffe119]/20 text-[#1A2238]">
        <Icon size={24} />
      </div>
    )}
    <h3 className="text-sm font-black text-[#1A2238] uppercase tracking-wider mb-1">
      {title}
    </h3>
    {description && (
      <p className="text-xs font-bold text-zinc-400 uppercase tracking-wide mb-6 max-w-xs leading-relaxed">
        {description}
      </p>
    )}
    {action}
  </div>
);

// ─── StatusBadge ──────────────────────────────────────────────────────────────
export const StatusBadge = ({ status }) => {
  const map = {
    pending_payment:    { label: 'Ödeme Bekleniyor', variant: 'yellow' },
    pending_receipt:    { label: 'Dekont Bekleniyor', variant: 'orange' },
    pending_assignment: { label: 'Usta Atanmadı',    variant: 'red' },
    assigned:           { label: 'Usta Atandı',      variant: 'blue' },
    completed:          { label: 'Tamamlandı',        variant: 'green' },
    cancelled:          { label: 'İptal',             variant: 'gray' },
    active:             { label: 'Aktif',             variant: 'green' },
    passive:            { label: 'Pasif',             variant: 'gray' },
    pending:            { label: 'Onay Bekliyor',     variant: 'yellow' },
    rejected:           { label: 'Reddedildi',        variant: 'red' },
    approved:           { label: 'Onaylandı',         variant: 'green' },
    open:               { label: 'Açık',              variant: 'yellow' },
    closed:             { label: 'Kapatıldı',         variant: 'green' },
  };
  const s = map[status] ?? { label: status, variant: 'gray' };
  return <Badge variant={s.variant}>{s.label}</Badge>;
};

// ─── SectionHeader ────────────────────────────────────────────────────────────
export const SectionHeader = ({ title, icon: Icon, count, action }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-zinc-50 pb-2">
    <h2 className="text-xs font-mono font-black text-zinc-400 tracking-widest uppercase flex items-center gap-2">
      {Icon && <Icon size={15} className="text-zinc-400" />}
      <span>{title}</span>
    </h2>
    <div className="flex items-center gap-4 justify-between sm:justify-end">
      {count !== undefined && (
        <span className="text-[10px] font-mono font-black bg-zinc-100 text-[#1A2238] px-2.5 py-1 rounded-md uppercase">
          {count} KAYIT
        </span>
      )}
      {action}
    </div>
  </div>
);