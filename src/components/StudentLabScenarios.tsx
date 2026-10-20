import React, { useState } from 'react';
import { LabScenario } from '../types/logistics';
import { 
  GraduationCap, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Award, 
  RotateCcw, 
  HelpCircle,
  ArrowRight,
  BookOpen,
  PlusCircle,
  FolderPlus,
  Trash2,
  X
} from 'lucide-react';

interface StudentLabScenariosProps {
  onClose: () => void;
  onSelectBayFocus?: (bayId: string) => void;
  scenarios: LabScenario[];
  onAddNewScenario?: (scenario: LabScenario) => void;
  onDeleteScenario?: (scenarioId: string) => void;
  onOpenStudio?: () => void;
  onRunScenarioInApp?: (category: LabScenario['category']) => void;
}

export const StudentLabScenarios: React.FC<StudentLabScenariosProps> = ({
  onClose,
  onSelectBayFocus,
  scenarios,
  onAddNewScenario,
  onDeleteScenario,
  onOpenStudio,
  onRunScenarioInApp
}) => {
  const [activeScenarioId, setActiveScenarioId] = useState<string>(scenarios[0]?.id || 'SCENARIO-1');
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [resolvedScenarios, setResolvedScenarios] = useState<Record<string, { optionId: string; isCorrect: boolean; points: number }>>({});
  
  // Inline Creator State
  const [isCreatingScenario, setIsCreatingScenario] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('Kasus 5: Analisis Tumpahan Najis & Penanganan Darurat Forklift');
  const [newCategory, setNewCategory] = useState<LabScenario['category']>('Halal Cross-Contamination');
  const [newDifficulty, setNewDifficulty] = useState<LabScenario['difficulty']>('Menengah');
  const [newDescription, setNewDescription] = useState<string>(
    'Di Dock 1, pallet gelatin impor bocor dan cairan mengenai roda Forklift F-02. Pengemudi forklift tidak mengetahui bahwa cairan tersebut berisiko najis mughallazah dan berencana melanjutkan put-away ke rak ambient.'
  );
  const [newTrigger, setNewTrigger] = useState<string>('Kebocoran kemasan terdeteksi di Receiving Dock');
  const [newTask1, setNewTask1] = useState<string>('Hentikan operasi Forklift F-02 dan isolasi area dock');
  const [newTask2, setNewTask2] = useState<string>('Lakukan pensucian sertu (7 basuhan air & tanah suci)');
  const [newOpt1Label, setNewOpt1Label] = useState<string>('Hentikan Forklift F-02 seketika, pindahkan ke stasiun cuci untuk pensucian Sertu 7 kali basuhan');
  const [newOpt1Expl, setNewOpt1Expl] = useState<string>('BENAR: Standar HAS 23000 & Fatwa MUI mewajibkan pensucian najis berat sebelum MHE boleh kembali digunakan di gudang halal.');
  const [newOpt2Label, setNewOpt2Label] = useState<string>('Cukup lap roda dengan cairan pembersih biasa dan teruskan put-away');
  const [newOpt2Expl, setNewOpt2Expl] = useState<string>('SALAH: Pembersihan biasa tidak menghilangkan status najis mughallazah dan memicu kontaminasi silang massal ke seluruh gudang.');

  const activeScenario = scenarios.find(s => s.id === activeScenarioId) || scenarios[0];
  const activeResolution = activeScenario ? resolvedScenarios[activeScenario.id] : undefined;

  const handleChooseOption = (optionId: string) => {
    setSelectedOptionId(optionId);
    if (!activeScenario) return;
    const option = activeScenario.options.find(o => o.id === optionId);
    if (!option) return;

    setResolvedScenarios(prev => ({
      ...prev,
      [activeScenario.id]: {
        optionId,
        isCorrect: option.isCorrect,
        points: option.isCorrect ? 100 : Math.max(0, 100 + option.scoreDelta)
      }
    }));
  };

  const handleResetCurrent = () => {
    setSelectedOptionId(null);
    if (!activeScenario) return;
    setResolvedScenarios(prev => {
      const copy = { ...prev };
      delete copy[activeScenario.id];
      return copy;
    });
  };

  const handleResetAllScores = () => {
    setSelectedOptionId(null);
    setResolvedScenarios({});
  };

  const handleSaveCustomScenario = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `SCENARIO-${Date.now().toString().slice(-4)}`;
    const createdScenario: LabScenario = {
      id: newId,
      title: newTitle,
      category: newCategory,
      difficulty: newDifficulty,
      scenarioDescription: newDescription,
      triggerCondition: newTrigger,
      tasks: [
        { id: 't1', description: newTask1, completed: false, points: 50 },
        { id: 't2', description: newTask2, completed: false, points: 50 }
      ],
      correctResolutionId: 'opt-1',
      options: [
        {
          id: 'opt-1',
          actionLabel: newOpt1Label,
          explanation: newOpt1Expl,
          isCorrect: true,
          scoreDelta: 100
        },
        {
          id: 'opt-2',
          actionLabel: newOpt2Label,
          explanation: newOpt2Expl,
          isCorrect: false,
          scoreDelta: -50
        }
      ],
      learningOutcome: 'Mahasiswa mampu mempraktikkan mitigasi risiko kontaminasi dan prosedur pensucian bersertifikasi.'
    };

    if (onAddNewScenario) {
      onAddNewScenario(createdScenario);
    }
    setActiveScenarioId(newId);
    setSelectedOptionId(null);
    setIsCreatingScenario(false);
  };

  const totalPoints = Object.values(resolvedScenarios).reduce((sum, item) => sum + item.points, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-5xl w-full p-6 space-y-6 max-h-[92vh] overflow-y-auto text-slate-100 shadow-2xl">
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-400">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Laboratorium Praktikum Mahasiswa Teknik Logistik
              </h2>
              <p className="text-xs text-slate-400">
                Pilih skenario siap pakai atau buat skenario studi kasus baru secara manual di bawah ini.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreatingScenario(prev => !prev)}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 border ${
                isCreatingScenario
                  ? 'bg-amber-600 text-white border-amber-500'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 shadow-md'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isCreatingScenario ? 'Tutup Formulir Input' : '➕ Input Studi Kasus Baru'}</span>
            </button>

            <button
              onClick={handleResetAllScores}
              title="Reset seluruh skor praktikum ke 0 untuk memulai sesi praktikum baru"
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Reset Semua Nilai</span>
            </button>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Skor Praktikum Anda</span>
              <span className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                {totalPoints} <span className="text-xs text-slate-400 font-sans">/ {scenarios.length * 100} Poin</span>
              </span>
            </div>

            <button
              onClick={onClose}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>

        {/* INLINE SCENARIO CREATOR FORM (Visible when isCreatingScenario is true) */}
        {isCreatingScenario && (
          <div className="p-5 bg-slate-950 border-2 border-emerald-500/60 rounded-xl space-y-4 animate-in slide-in-from-top-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  Formulir Pembuatan Studi Kasus Baru (Manual Input)
                </h3>
              </div>
              <span className="text-xs text-emerald-400 font-medium">
                Hasil input akan langsung tampil di daftar tab kasus dan dapat diuji!
              </span>
            </div>

            <form onSubmit={handleSaveCustomScenario} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1">Judul Studi Kasus Baru:</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white font-medium"
                    placeholder="Contoh: Kasus 5: Pelanggaran Batas Suhu Chiller..."
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kategori Masalah:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200"
                  >
                    <option value="IoT & Cold Chain">IoT & Cold Chain (Suhu Dingin)</option>
                    <option value="Halal Cross-Contamination">Halal Cross-Contamination (Najis)</option>
                    <option value="Green E-Commerce Peak">Green E-Commerce Peak (Emisi EV)</option>
                    <option value="Regulatory Audit BPJPH">Regulatory Audit BPJPH (Sertifikasi)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Deskripsi Lengkap Kasus:</label>
                <textarea
                  rows={3}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200 leading-relaxed"
                  placeholder="Jelaskan insiden atau situasi darurat yang terjadi di gudang..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kondisi Pemicu Alarm (Trigger):</label>
                  <input
                    type="text"
                    required
                    value={newTrigger}
                    onChange={(e) => setNewTrigger(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-amber-300"
                    placeholder="Contoh: Sensor RTD mendeteksi suhu naik ke -5°C"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tingkat Kesulitan:</label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200"
                  >
                    <option value="Pemula">Pemula (Tingkat Sarjana Awal)</option>
                    <option value="Menengah">Menengah (Semester 5-6)</option>
                    <option value="Lanjutan">Lanjutan (Praktik Profesi / Akhir)</option>
                  </select>
                </div>
              </div>

              {/* Tasks */}
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-2">
                <span className="font-semibold text-slate-200 block">Dua Tugas Mahasiswa dalam Kasus Ini:</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    value={newTask1}
                    onChange={(e) => setNewTask1(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded p-2 text-slate-200"
                    placeholder="Tugas 1 (50 poin)"
                  />
                  <input
                    type="text"
                    required
                    value={newTask2}
                    onChange={(e) => setNewTask2(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded p-2 text-slate-200"
                    placeholder="Tugas 2 (50 poin)"
                  />
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Option 1: Correct */}
                <div className="p-3.5 bg-emerald-950/30 border border-emerald-600 rounded-lg space-y-2">
                  <span className="font-bold text-emerald-400 block">Solusi Tepat (Jawaban Benar +100 Poin):</span>
                  <input
                    type="text"
                    required
                    value={newOpt1Label}
                    onChange={(e) => setNewOpt1Label(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                    placeholder="Tindakan yang benar..."
                  />
                  <textarea
                    rows={2}
                    required
                    value={newOpt1Expl}
                    onChange={(e) => setNewOpt1Expl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-emerald-300"
                    placeholder="Penjelasan mengapa tindakan ini benar sesuai regulasi..."
                  />
                </div>

                {/* Option 2: Incorrect */}
                <div className="p-3.5 bg-rose-950/30 border border-rose-600 rounded-lg space-y-2">
                  <span className="font-bold text-rose-400 block">Solusi Keliru (Jawaban Salah Penalti -50 Poin):</span>
                  <input
                    type="text"
                    required
                    value={newOpt2Label}
                    onChange={(e) => setNewOpt2Label(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                    placeholder="Tindakan keliru yang dilarang..."
                  />
                  <textarea
                    rows={2}
                    required
                    value={newOpt2Expl}
                    onChange={(e) => setNewOpt2Expl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-rose-300"
                    placeholder="Penjelasan mengapa tindakan ini melanggar SOP..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreatingScenario(false)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded shadow-md flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Simpan & Langsung Uji Kasus Ini</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Case Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {scenarios.map((scenario, index) => {
            const isResolved = resolvedScenarios[scenario.id];
            const isSelected = activeScenarioId === scenario.id;
            const isCustom = scenario.id.startsWith('SCENARIO-') && !['SCENARIO-1', 'SCENARIO-2', 'SCENARIO-3', 'SCENARIO-4'].includes(scenario.id);

            return (
              <div
                key={scenario.id}
                onClick={() => {
                  setActiveScenarioId(scenario.id);
                  setSelectedOptionId(resolvedScenarios[scenario.id]?.optionId || null);
                  setIsCreatingScenario(false);
                }}
                className={`p-3.5 rounded-xl text-left border cursor-pointer transition-all flex flex-col justify-between relative group ${
                  isSelected
                    ? 'bg-slate-800 border-emerald-500 shadow-md ring-1 ring-emerald-500/40'
                    : 'bg-slate-950/70 border-slate-800 hover:bg-slate-850'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className="text-emerald-400 font-semibold uppercase">{scenario.category}</span>
                    <span className="text-slate-400">{scenario.difficulty}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-2">
                    {index + 1}. {scenario.title.split(': ')[1] || scenario.title}
                  </h4>
                  {isCustom && (
                    <span className="inline-block mt-1 text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-700 px-1.5 py-0.2 rounded font-semibold">
                      KUSTOM INPUTAN ANDA
                    </span>
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  {isResolved ? (
                    <span className={`inline-flex items-center gap-1 font-semibold ${
                      isResolved.isCorrect ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {isResolved.isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      <span>{isResolved.points} Poin</span>
                    </span>
                  ) : (
                    <span className="text-slate-500">Belum Dikerjakan</span>
                  )}

                  {isCustom && onDeleteScenario && (
                    <button
                      title="Hapus skenario kustom ini"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Hapus skenario "${scenario.title}"?`)) {
                          onDeleteScenario(scenario.id);
                          if (activeScenarioId === scenario.id) {
                            setActiveScenarioId(scenarios[0]?.id || 'SCENARIO-1');
                          }
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-400 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Scenario Detailed View */}
        {activeScenario && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
            {/* Scenario Problem Brief (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-400 font-semibold">{activeScenario.id}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300 font-medium">
                    {activeScenario.category}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">{activeScenario.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeScenario.scenarioDescription}
                </p>

                <div className="p-3 bg-amber-950/20 border border-amber-800/50 rounded-lg text-xs text-amber-300 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">Kondisi Pemicu Kritis:</span>
                    <span>{activeScenario.triggerCondition}</span>
                  </div>
                </div>

                {onRunScenarioInApp && (
                  <button
                    onClick={() => onRunScenarioInApp(activeScenario.category)}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 shadow"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>▶ Buka & Uji Kasus Ini di Simulasi Live ({activeScenario.category})</span>
                  </button>
                )}
              </div>

              {/* Checklist of Tasks */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2.5">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Tugas Analisis Praktikum Mahasiswa:
                </h4>
                <div className="space-y-2 text-xs">
                  {activeScenario.tasks.map((task) => (
                    <div key={task.id} className="flex items-start gap-2 text-slate-300">
                      <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-400 text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                        ✓
                      </span>
                      <span className="flex-1">{task.description}</span>
                      <span className="text-slate-500 font-mono text-[11px] shrink-0">{task.points} pts</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Learning Outcome */}
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex items-start gap-2.5 text-xs text-slate-400">
                <BookOpen className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-200 block">Capaian Pembelajaran (Learning Outcome):</span>
                  <span>{activeScenario.learningOutcome}</span>
                </div>
              </div>
            </div>

            {/* Interactive Decision Choices (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Pilih Tindakan Penyelesaian Terbaik (SOP WMS & Halal):
                  </h4>
                  {activeResolution && (
                    <button
                      onClick={handleResetCurrent}
                      title="Reset jawaban dan skor untuk kasus ini"
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded text-xs flex items-center gap-1.5 font-medium transition-colors shadow"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Jawaban Kasus Ini</span>
                    </button>
                  )}
                </div>

                {/* Options buttons */}
                <div className="space-y-3">
                  {activeScenario.options.map((option) => {
                    const isSelected = selectedOptionId === option.id;
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleChooseOption(option.id)}
                        className={`w-full text-left p-4 rounded-xl border text-xs transition-all space-y-2 ${
                          isSelected
                            ? option.isCorrect
                              ? 'bg-emerald-950/50 border-emerald-500 ring-1 ring-emerald-500'
                              : 'bg-rose-950/50 border-rose-500 ring-1 ring-rose-500'
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-white text-sm">{option.actionLabel}</span>
                          {isSelected && (
                            option.isCorrect ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : (
                              <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                            )
                          )}
                        </div>

                        {/* Explanation rendered if selected */}
                        {isSelected && (
                          <div className={`p-3 rounded-lg text-xs leading-relaxed ${
                            option.isCorrect 
                              ? 'bg-emerald-900/30 text-emerald-200 border border-emerald-800' 
                              : 'bg-rose-900/30 text-rose-200 border border-rose-800'
                          }`}>
                            {option.explanation}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* If solved correctly */}
                {activeResolution?.isCorrect && (
                  <div className="p-4 bg-emerald-950/40 border border-emerald-600 rounded-xl text-xs text-emerald-300 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-emerald-400" />
                      <span>
                        Hebat! Keputusan Anda memenuhi standar <strong>HAS 23000 & UU JPH No. 33/2014</strong>. Anda mendapatkan 100 poin!
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
