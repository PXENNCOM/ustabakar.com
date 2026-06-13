import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import QuestionItem from './QuestionItem';

export default function CategorySection({ category, answers, onAnswerChange }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 bg-zinc-50 hover:bg-zinc-100 transition-colors border-b border-zinc-200"
      >
        <span className="font-black text-[#1A2238] text-xs uppercase tracking-widest">
          {category.name}
        </span>
        {open
          ? <ChevronUp size={18} className="text-[#1A2238]" strokeWidth={2.5} />
          : <ChevronDown size={18} className="text-[#1A2238]" strokeWidth={2.5} />
        }
      </button>

      {open && (
        <div className="p-4 space-y-4 bg-zinc-50/50">
          {category.questions
            ?.filter((q) => q.is_active)
            .map((q) => (
              <QuestionItem
                key={q.id}
                question={q}
                answer={answers[q.id]}
                onAnswerChange={onAnswerChange}
              />
            ))}
        </div>
      )}
    </div>
  );
}