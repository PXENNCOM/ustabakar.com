import { CreditCard, Check, Package } from 'lucide-react';

function SelectCard({ active, onClick, icon: Icon, title, desc, right, categories }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex flex-col items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200 group active:scale-[0.98] w-full ${
        active ? 'border-[#ffe119] bg-zinc-50/50 shadow-sm' : 'border-zinc-200/80 bg-white hover:border-zinc-300'
      }`}
    >
      {active && (
        <span className="absolute top-4 right-4 w-5 h-5 bg-zinc-900 rounded-lg flex items-center justify-center shadow-sm">
          <Check size={11} className="text-[#ffe119]" strokeWidth={3} />
        </span>
      )}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-200 ${
        active ? 'bg-[#ffe119] border-[#ffe119] text-zinc-900' : 'bg-zinc-50 border-zinc-100 text-zinc-400 group-hover:text-zinc-900'
      }`}>
        <Icon size={16} strokeWidth={2.2} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-zinc-900 uppercase tracking-tight">{title}</p>
        {desc && <p className="text-xs font-medium text-zinc-400 mt-1 leading-relaxed">{desc}</p>}
      </div>

      {categories && categories.length > 0 && (
        <>
          <div className="w-full h-[1px] bg-zinc-200/60 my-1" />
          <ul className="w-full space-y-2">
            {categories.map((c, i) => (
              <li key={i} className="flex items-center gap-2">
                <Check size={11} className={active ? 'text-zinc-700' : 'text-zinc-300'} strokeWidth={3} />
                <span className="text-xs font-medium text-zinc-500">{c.category?.name ?? '—'}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {right && <p className="text-base font-black text-zinc-950 mt-2">{right}</p>}
    </button>
  );
}

export default function PaymentStep({ form, onChange, errors, packages }) {
  const selectedPkg = packages.find((p) => p.id === parseInt(form.package_id));

  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-zinc-50 pb-2">
        <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-zinc-400">AŞAMA 03</span>
        <h2 className="text-base font-bold text-zinc-900 tracking-tight mt-0.5">Hizmet Paketi Seçimi</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {packages.map((pkg) => (
          <SelectCard
            key={pkg.id}
            active={form.package_id === String(pkg.id)}
            onClick={() => {
              onChange('package_id', String(pkg.id));
              onChange('payment_method', 'card');
            }}
            icon={Package}
            title={pkg.name}
            desc={pkg.description || ''}
            right={`${Number(pkg.price).toLocaleString('tr-TR')} ₺`}
            categories={pkg.categories || []}
          />
        ))}
      </div>
      {errors.package_id && <p className="text-xs font-bold text-red-500 uppercase mt-1 tracking-wide">{errors.package_id}</p>}

      <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3.5">
        <CreditCard size={15} className="text-zinc-400 shrink-0" />
        <p className="text-xs font-medium text-zinc-500">
          Ödemeniz iyzico altyapısıyla <span className="font-bold text-zinc-800">kredi kartı</span> üzerinden güvenle tahsil edilir.
        </p>
      </div>

      {/* Sipariş Özet Kartı */}
      {selectedPkg && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3 shadow-md">
          <p className="text-[10px] font-mono font-black tracking-widest uppercase text-zinc-500">Sipariş Hakları Özeti</p>
          <div className="flex justify-between text-xs font-semibold uppercase tracking-wider">
            <span className="text-zinc-400">Seçilen Hak</span>
            <span className="text-white font-bold">{selectedPkg.name}</span>
          </div>
          {selectedPkg.categories?.length > 0 && (
            <div className="flex justify-between text-xs font-semibold uppercase tracking-wider">
              <span className="text-zinc-400">Kontrol Kapsamı</span>
              <span className="text-white font-bold">{selectedPkg.categories.length} Kategori</span>
            </div>
          )}
          <div className="h-[1px] bg-zinc-800 my-2" />
          <div className="flex justify-between items-baseline">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Toplam Tahsilat</span>
            <span className="text-xl font-black text-[#ffe119]">
              {Number(selectedPkg.price).toLocaleString('tr-TR')} ₺
            </span>
          </div>
        </div>
      )}
    </div>
  );
}