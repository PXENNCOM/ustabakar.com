export default function StepIndicator({ step, total }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1 rounded-full flex-1 transition-all duration-300 ${
            i < step ? 'bg-amber-400' : 'bg-zinc-200'
          }`}
        />
      ))}
    </div>
  );
}