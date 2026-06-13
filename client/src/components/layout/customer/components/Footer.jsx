export default function Footer() {
  return (
    <footer className="w-full py-6 mt-auto border-t border-amber-100/60 bg-transparent text-center">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs font-medium text-stone-400">
        <span>© {new Date().getFullYear()} Usta Bakar.</span>
        <span className="hidden sm:inline text-stone-300">|</span>
        <span>Tüm hakları saklıdır.</span>
      </div>
    </footer>
  );
}