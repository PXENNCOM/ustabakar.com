export default function QuestionItem({ question, answer, onAnswerChange }) {
  return (
    <div className="border border-zinc-100 bg-white rounded-2xl p-5 space-y-4 shadow-sm">
      <p className="text-sm font-black text-[#1A2238] uppercase tracking-tight leading-snug">
        {question.question_text}
      </p>

      {question.answer_type === 'options' && question.options?.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {question.options.map((opt) => {
            const isSelected = answer?.selected_option_id === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() =>
                  onAnswerChange(question.id, 'selected_option_id', isSelected ? null : opt.id)
                }
                className={`px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider border-2 text-center transition-all duration-200 active:scale-95 ${
                  isSelected
                    ? 'bg-[#1A2238] text-white border-[#1A2238] shadow-md'
                    : 'bg-zinc-50 text-[#1A2238] border-zinc-100 hover:border-[#ffe119]'
                }`}
              >
                {opt.option_text}
              </button>
            );
          })}
        </div>
      )}

      <textarea
        rows={2}
        className="w-full bg-zinc-50 border-2 border-zinc-100 font-medium text-sm text-[#1A2238] p-3 rounded-xl resize-none focus:bg-white focus:border-[#ffe119] outline-none transition-all"
        placeholder="Bu aksam hakkında ek not veya arıza detayı girin (opsiyonel)..."
        value={answer?.open_text || ''}
        onChange={(e) => onAnswerChange(question.id, 'open_text', e.target.value)}
      />
    </div>
  );
}