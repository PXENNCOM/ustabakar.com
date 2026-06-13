import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../../../services/index';
import { Spinner, Button, Modal } from '../../../../components/ui';
import toast from 'react-hot-toast';
import { ClipboardList, ChevronDown, ChevronUp, Plus, X, Tag } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';

export default function CategoryManager() {
  const queryClient = useQueryClient();
  const [openCat, setOpenCat] = useState(null);
  const [newCatName, setNewCatName] = useState('');
  const [newCatModal, setNewCatModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ text: '', type: 'open' });
  const [newOption, setNewOption] = useState('');
  const [openOptions, setOpenOptions] = useState(null);
  const [loading, setLoading] = useState(false);

  const { data: catsData, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => adminService.getCategories(),
  });

  const { data: questionsData } = useQuery({
    queryKey: ['admin-questions', openCat],
    queryFn: () => adminService.getQuestions(openCat),
    enabled: !!openCat,
  });

  const { data: optionsData } = useQuery({
    queryKey: ['admin-options', openOptions],
    queryFn: () => adminService.getOptions(openOptions),
    enabled: !!openOptions,
  });

  const categories = catsData?.data?.data || [];
  const questions  = questionsData?.data?.data || [];
  const options    = optionsData?.data?.data || [];

  const addCategory = async () => {
    if (!newCatName.trim()) return;
    setLoading(true);
    try {
      await adminService.createCategory({ name: newCatName });
      toast.success('Kategori eklendi');
      setNewCatName('');
      setNewCatModal(false);
      queryClient.invalidateQueries(['admin-categories']);
    } catch { toast.error('Hata oluştu'); }
    finally { setLoading(false); }
  };

  const addQuestion = async (catId) => {
    if (!newQuestion.text.trim()) return;
    setLoading(true);
    try {
      await adminService.createQuestion(catId, { question_text: newQuestion.text, answer_type: newQuestion.type });
      toast.success('Soru eklendi');
      setNewQuestion({ text: '', type: 'open' });
      queryClient.invalidateQueries(['admin-questions', catId]);
    } catch { toast.error('Hata oluştu'); }
    finally { setLoading(false); }
  };

  const addOption = async (questionId) => {
    if (!newOption.trim()) return;
    setLoading(true);
    try {
      await adminService.createOption(questionId, { option_text: newOption });
      toast.success('Seçenek eklendi');
      setNewOption('');
      queryClient.invalidateQueries(['admin-options', questionId]);
    } catch { toast.error('Hata oluştu'); }
    finally { setLoading(false); }
  };

  const deleteOption = async (optId, questionId) => {
    try {
      await adminService.deleteOption(optId);
      toast.success('Silindi');
      queryClient.invalidateQueries(['admin-options', questionId]);
    } catch { toast.error('Hata oluştu'); }
  };

  const toggleActive = async (cat) => {
    try {
      await adminService.updateCategory(cat.id, { is_active: !cat.is_active });
      queryClient.invalidateQueries(['admin-categories']);
    } catch { toast.error('Hata oluştu'); }
  };

  if (isLoading) return <Spinner />;

  return (
    <div>
      <SectionHeader
        icon={ClipboardList}
        title="Rapor Kategorileri"
        description="Ekspertiz formundaki kategori ve soruları yönetin"
        action={
          <Button variant="primary" size="sm" onClick={() => setNewCatModal(true)}>
            <Plus size={14} /> Yeni Kategori
          </Button>
        }
      />

      <div className="space-y-2">
        {categories.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-sm">Henüz kategori eklenmedi</div>
        )}
        {categories.map((cat, idx) => (
          <div key={cat.id} className={`border rounded-xl overflow-hidden transition-all ${openCat === cat.id ? 'border-blue-200 shadow-sm' : 'border-gray-200'}`}>
            <div className={`flex items-center justify-between px-4 py-3 ${openCat === cat.id ? 'bg-blue-50' : 'bg-gray-50'}`}>
              <button onClick={() => setOpenCat(openCat === cat.id ? null : cat.id)} className="flex items-center gap-3 flex-1 text-left">
                <span className="w-6 h-6 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-xs font-bold text-gray-500">{idx + 1}</span>
                <span className={`font-medium text-sm ${openCat === cat.id ? 'text-blue-700' : 'text-gray-900'}`}>{cat.name}</span>
                {openCat === cat.id ? <ChevronUp size={15} className="text-blue-400" /> : <ChevronDown size={15} className="text-gray-400" />}
              </button>
              <div className="flex items-center gap-2">
                {questions.length > 0 && openCat === cat.id && (
                  <span className="text-xs text-gray-400">{questions.length} soru</span>
                )}
                <button
                  onClick={() => toggleActive(cat)}
                  className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${cat.is_active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
                >
                  {cat.is_active ? 'Aktif' : 'Pasif'}
                </button>
              </div>
            </div>

            {openCat === cat.id && (
              <div className="p-4 space-y-3 bg-white">
                <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">YENİ SORU EKLE</p>
                  <textarea
                    className="input resize-none text-sm"
                    rows={2}
                    placeholder="Soru metnini buraya yazın..."
                    value={newQuestion.text}
                    onChange={(e) => setNewQuestion((q) => ({ ...q, text: e.target.value }))}
                  />
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 mb-1 block">Cevap Tipi</label>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => setNewQuestion((q) => ({ ...q, type: 'open' }))}
                          className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium border transition-all ${newQuestion.type === 'open' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>
                          Açık Uçlu
                        </button>
                        <button type="button" onClick={() => setNewQuestion((q) => ({ ...q, type: 'options' }))}
                          className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium border transition-all ${newQuestion.type === 'options' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>
                          Seçenekli
                        </button>
                      </div>
                    </div>
                    <div className="flex-shrink-0 mt-4">
                      <Button variant="primary" size="sm" onClick={() => addQuestion(cat.id)} loading={loading}>
                        <Plus size={14} /> Soruyu Ekle
                      </Button>
                    </div>
                  </div>
                </div>

                {questions.length === 0 && (
                  <div className="text-center py-6 text-gray-400 text-sm">Bu kategoriye henüz soru eklenmedi</div>
                )}

                {questions.map((q, qi) => (
                  <div key={q.id} className="border border-gray-100 rounded-xl overflow-hidden">
                    <div className="flex items-start gap-3 p-3 bg-white">
                      <span className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center text-xs font-bold text-gray-400 flex-shrink-0 mt-0.5">{qi + 1}</span>
                      <p className="text-sm text-gray-800 flex-1 leading-relaxed">{q.question_text}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-medium ${q.answer_type === 'options' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                        {q.answer_type === 'options' ? 'Seçenekli' : 'Açık uçlu'}
                      </span>
                    </div>

                    {q.answer_type === 'options' && (
                      <div className="border-t border-gray-100 px-3 pb-3 pt-2 bg-gray-50">
                        <button onClick={() => setOpenOptions(openOptions === q.id ? null : q.id)}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 mb-2">
                          <Tag size={11} />
                          {openOptions === q.id ? 'Seçenekleri Gizle' : 'Seçenekleri Yönet'}
                          {openOptions === q.id ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                        </button>

                        {openOptions === q.id && (
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-1.5">
                              {options.length === 0 && <span className="text-xs text-gray-400">Henüz seçenek yok</span>}
                              {options.map((opt) => (
                                <span key={opt.id} className="inline-flex items-center gap-1 bg-white border border-gray-200 px-2.5 py-1 rounded-lg text-xs font-medium text-gray-700">
                                  {opt.option_text}
                                  <button onClick={() => deleteOption(opt.id, q.id)} className="text-gray-300 hover:text-red-500 transition-colors ml-0.5">
                                    <X size={11} />
                                  </button>
                                </span>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <input className="input text-xs flex-1 bg-white" placeholder="Yeni seçenek..."
                                value={newOption} onChange={(e) => setNewOption(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addOption(q.id)} />
                              <Button variant="primary" size="sm" onClick={() => addOption(q.id)} loading={loading}>
                                <Plus size={12} />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal open={newCatModal} onClose={() => setNewCatModal(false)} title="Yeni Kategori Ekle" size="sm">
        <div className="space-y-4">
          <input className="input" placeholder="Kategori adı (örn: Airbag Ekspertiz)"
            value={newCatName} onChange={(e) => setNewCatName(e.target.value)}
            autoFocus onKeyDown={(e) => e.key === 'Enter' && addCategory()} />
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setNewCatModal(false)}>İptal</Button>
            <Button variant="primary" className="flex-1" onClick={addCategory} loading={loading}>Ekle</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
