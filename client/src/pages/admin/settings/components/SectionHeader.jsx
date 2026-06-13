export default function SectionHeader({ icon: Icon, title, description, action }) {
  return (
    <div className="flex items-start justify-between pb-4 border-b border-gray-100 mb-5">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
          <Icon size={18} className="text-blue-600" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}
