import { Camera, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PhotoStep({ photos, onPhotosChange, minPhotos, maxPhotos }) {
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const total = photos.length + files.length;
    if (total > maxPhotos) {
      toast.error(`En fazla ${maxPhotos} fotoğraf yükleyebilirsiniz`);
      return;
    }
    onPhotosChange([...photos, ...files]);
  };

  const removePhoto = (index) => {
    onPhotosChange(photos.filter((_, i) => i !== index));
  };

  const isCompleted = photos.length >= minPhotos;

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-100 pb-3">
        <h2 className="text-lg font-black text-[#1A2238] uppercase tracking-tight">ARAÇ FOTOĞRAFLARI</h2>
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mt-1">
          Aracın dört bir yanını, motorunu ve varsa kusurlarını net şekilde çekin
        </p>
      </div>

      <div
        className={`flex items-center justify-between px-5 py-4 rounded-xl border font-sans ${
          isCompleted
            ? 'bg-emerald-50 text-emerald-800 border-emerald-100'
            : 'bg-amber-50 text-amber-800 border-amber-100'
        }`}
      >
        <div className="flex items-center space-x-2">
          {isCompleted && <CheckCircle2 size={16} />}
          <span className="text-xs font-black uppercase tracking-wider">
            {photos.length} FOTOĞRAF SEÇİLDİ
          </span>
        </div>
        <span className="text-[11px] font-mono font-bold uppercase">
          MİN: {minPhotos} · MAKS: {maxPhotos}
        </span>
      </div>

      <label className="w-full border-2 border-dashed border-zinc-300 rounded-2xl p-8 flex flex-col items-center gap-2.5 cursor-pointer hover:border-[#ffe119] hover:bg-zinc-50 transition-all text-center select-none">
        <Camera size={36} className="text-[#1A2238]" strokeWidth={2.5} />
        <span className="text-xs font-black text-[#1A2238] uppercase tracking-widest">
          FOTOĞRAFLARI SEÇ VEYA KAMERAYI AÇ
        </span>
        <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
      </label>

      {photos.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
          {photos.map((photo, i) => (
            <div
              key={i}
              className="relative aspect-square rounded-xl overflow-hidden border border-zinc-100 bg-zinc-50 shadow-sm"
            >
              <img src={URL.createObjectURL(photo)} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removePhoto(i)}
                className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white font-black rounded-xl flex items-center justify-center text-sm shadow-md active:scale-90 hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}