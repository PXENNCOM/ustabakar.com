import { CreditCard } from 'lucide-react';

function PackageCard({ pkg, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex flex-col items-start gap-0 p-5 rounded-2xl text-left transition-all duration-200 active:scale-[0.98] w-full ${
        active ? 'border-2 border-[#ffe119]' : 'border border-zinc-200/80 hover:border-zinc-300'
      }`}
    >
      {/* Önerilen Badge — sadece ilk paket değilse veya en pahalıysa göster, şimdilik son pakete koyuyoruz */}
      {pkg._recommended && (
        <span className="absolute -top-px right-4 bg-[#ffe119] text-zinc-900 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-b-lg">
          Önerilen
        </span>
      )}

      {/* Başlık + Check */}
      <div className={`flex items-start justify-between w-full ${pkg._recommended ? 'mt-3' : ''}`}>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-400 mb-1">
            {pkg._label || 'Paket'}
          </p>
          <p className="text-sm font-bold text-zinc-900 uppercase tracking-tight">{pkg.name}</p>
        </div>
        {active && (
          <span className="w-5 h-5 bg-zinc-900 rounded-md flex items-center justify-center shrink-0">
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M2 5.5L4.5 8L9 3" stroke="#ffe119" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        )}
      </div>

      {/* Fiyat */}
      <p className="text-2xl font-black text-zinc-950 mt-3 mb-4">
        {Number(pkg.price).toLocaleString('tr-TR')} ₺
      </p>

      {/* Kategoriler */}
      {pkg.categories?.length > 0 && (
        <div className="border-t border-zinc-100 pt-4 w-full flex flex-col gap-2">
          {pkg.categories.map((c, i) => (
            <div key={i} className="flex items-center gap-2 text-xs font-medium text-zinc-500">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                <path d="M2.5 7L5.5 10L11.5 4" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {c.category?.name ?? '—'}
            </div>
          ))}
        </div>
      )}
    </button>
  );
}

export default function PaymentStep({ form, onChange, errors, packages }) {
  const selectedPkg = packages.find((p) => String(p.id) === form.package_id);

  // En pahalı paketi "Önerilen" yap
  const maxPrice = Math.max(...packages.map(p => Number(p.price)));
  const labels = ['Temel', 'Kapsamlı', 'Tam Kapsamlı'];

  const enriched = packages.map((pkg, i) => ({
    ...pkg,
    _recommended: Number(pkg.price) === maxPrice,
    _label: labels[i] || 'Paket',
  }));

  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-zinc-50 pb-2">
        <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-zinc-400">AŞAMA 03</span>
        <h2 className="text-base font-bold text-zinc-900 tracking-tight mt-0.5">Hizmet Paketi Seçimi</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {enriched.map((pkg) => (
          <PackageCard
            key={pkg.id}
            pkg={pkg}
            active={form.package_id === String(pkg.id)}
            onClick={() => {
              onChange('package_id', String(pkg.id));
              onChange('payment_method', 'card');
            }}
          />
        ))}
      </div>
      {errors.package_id && (
        <p className="text-xs font-bold text-red-500 uppercase tracking-wide">{errors.package_id}</p>
      )}

      {/* Ödeme Notu */}
      <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3.5">
        <CreditCard size={15} className="text-zinc-400 shrink-0" />
        <p className="text-xs font-medium text-zinc-500">
          Ödemeniz iyzico altyapısıyla <span className="font-bold text-zinc-800">kredi kartı</span> üzerinden güvenle tahsil edilir.
        </p>
      </div>

      {/* Sipariş Özeti */}
      {selectedPkg && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
          <p className="text-[10px] font-mono font-black tracking-widest uppercase text-zinc-500">Sipariş özeti</p>
          <div className="flex justify-between text-xs font-semibold uppercase tracking-wider">
            <span className="text-zinc-500">Seçilen paket</span>
            <span className="text-white font-bold">{selectedPkg.name}</span>
          </div>
          {selectedPkg.categories?.length > 0 && (
            <div className="flex justify-between text-xs font-semibold uppercase tracking-wider">
              <span className="text-zinc-500">Kapsam</span>
              <span className="text-white font-bold">{selectedPkg.categories.length} Kategori</span>
            </div>
          )}
          <div className="border-t border-zinc-800 pt-3 flex justify-between items-baseline">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Toplam</span>
            <span className="text-xl font-black text-[#ffe119]">
              {Number(selectedPkg.price).toLocaleString('tr-TR')} ₺
            </span>
          </div>
        </div>
      )}
    </div>
  );
}