import { useState } from 'react';
import { Check, Edit2, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingRow({ label, settingKey, value, onSave, hint }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(settingKey, val);
      toast.success('Güncellendi');
      setEditing(false);
    } catch {
      toast.error('Hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-12 items-center gap-4 py-4 border-b border-gray-100 last:border-0">
      <div className="col-span-5">
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
      </div>
      <div className="col-span-7 flex items-center justify-end gap-2">
        {editing ? (
          <>
            <input
              className="input text-sm flex-1 max-w-xs"
              value={val}
              onChange={(e) => setVal(e.target.value)}
              autoFocus
            />
            <button
              onClick={handleSave}
              disabled={loading}
              className="w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-colors"
            >
              {loading
                ? <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <Check size={14} />
              }
            </button>
            <button
              onClick={() => { setEditing(false); setVal(value); }}
              className="w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg flex items-center justify-center transition-colors"
            >
              <X size={14} />
            </button>
          </>
        ) : (
          <>
            <span className="text-sm font-semibold text-gray-900 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
              {value || '—'}
            </span>
            <button
              onClick={() => setEditing(true)}
              className="w-8 h-8 bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-gray-400 rounded-lg flex items-center justify-center transition-colors"
            >
              <Edit2 size={14} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
