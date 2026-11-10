import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Plus,
  Trash2,
  CheckCircle2,
  Shuffle,
  Clock,
  Award,
  BookOpen,
  Save,
  Copy,
  Search,
  Eye,
  Settings,
  X,
  FileCheck2,
  Sparkles,
  Layers,
  ChevronDown
} from 'lucide-react';
import { SUBJECTS_LIST } from '../../data/mockData';

export interface CbtBuilderQuestion {
  id: string;
  questionText: string;
  options: { key: string; text: string }[];
  correctAnswerKey: string;
  scoreWeight: number;
  explanation: string;
}

export interface CbtQuizConfig {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  targetClass: string;
  durationMinutes: number;
  passingScore: number;
  deadlineDate: string;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showExplanationAfterSubmit: boolean;
  questions: CbtBuilderQuestion[];
  createdAt: string;
  status: 'draft' | 'terbit';
}

const STORAGE_QUIZ_KEY = 'pgri_cbt_builder_quizzes';

// Default bank questions
const SAMPLE_BANK_QUESTIONS: Record<string, CbtBuilderQuestion[]> = {
  sbj_ipa: [
    {
      id: 'bq_ipa_01',
      questionText: 'Bagian jantung yang berfungsi memompa darah kaya oksigen (O2) ke seluruh tubuh adalah...',
      options: [
        { key: 'A', text: 'Serambi Kanan (Atrium Dekster)' },
        { key: 'B', text: 'Bilik Kiri (Ventrikel Sinister)' },
        { key: 'C', text: 'Bilik Kanan (Ventrikel Dekster)' },
        { key: 'D', text: 'Serambi Kiri (Atrium Sinister)' },
      ],
      correctAnswerKey: 'B',
      scoreWeight: 20,
      explanation: 'Bilik kiri (Ventrikel Sinister) memiliki dinding otot yang paling tebal karena harus memompa darah bertekanan tinggi ke seluruh sistemik tubuh.',
    },
    {
      id: 'bq_ipa_02',
      questionText: 'Penyakit anemia pada manusia umumnya disebabkan oleh defisiensi atau kekurangan zat...',
      options: [
        { key: 'A', text: 'Kalsium dan Fosfor' },
        { key: 'B', text: 'Zat Besi (Fe) dalam pembentukan hemoglobin' },
        { key: 'C', text: 'Vitamin D' },
        { key: 'D', text: 'Iodium' },
      ],
      correctAnswerKey: 'B',
      scoreWeight: 20,
      explanation: 'Zat besi adalah komponen penting hemoglobin pada sel darah merah yang mengikat oksigen.',
    },
  ],
  sbj_matematika: [
    {
      id: 'bq_mtk_01',
      questionText: 'Sebuah segitiga siku-siku memiliki panjang alas 6 cm dan tinggi 8 cm. Berapakah panjang sisi miring (hipotenusa) segitiga tersebut?',
      options: [
        { key: 'A', text: '9 cm' },
        { key: 'B', text: '10 cm' },
        { key: 'C', text: '12 cm' },
        { key: 'D', text: '14 cm' },
      ],
      correctAnswerKey: 'B',
      scoreWeight: 25,
      explanation: 'Berdasarkan Teorema Pythagoras: c² = a² + b² = 6² + 8² = 36 + 64 = 100, sehingga c = √100 = 10 cm.',
    },
  ],
};

interface CbtQuestionBuilderProps {
  onClose?: () => void;
  onQuizCreated?: (quiz: CbtQuizConfig) => void;
}

export const CbtQuestionBuilder: React.FC<CbtQuestionBuilderProps> = ({
  onClose,
  onQuizCreated,
}) => {
  const [activeTab, setActiveTab] = useState<'builder' | 'bank' | 'saved'>('builder');

  // Quiz Meta
  const [subjectId, setSubjectId] = useState<string>('sbj_ipa');
  const [title, setTitle] = useState<string>('Penilaian Harian: Sistem Peredaran Darah Manusia');
  const [targetClass, setTargetClass] = useState<string>('Kelas 8A');
  const [durationMinutes, setDurationMinutes] = useState<number>(45);
  const [passingScore, setPassingScore] = useState<number>(75);
  const [deadlineDate, setDeadlineDate] = useState<string>('2026-11-20');
  const [shuffleQuestions, setShuffleQuestions] = useState<boolean>(true);
  const [shuffleOptions, setShuffleOptions] = useState<boolean>(true);
  const [showExplanation, setShowExplanation] = useState<boolean>(true);

  // Questions List
  const [questions, setQuestions] = useState<CbtBuilderQuestion[]>([
    {
      id: 'q-1',
      questionText: 'Manakah dari pernyataan berikut yang BENAR mengenai fungsi sel darah merah (eritrosit)?',
      options: [
        { key: 'A', text: 'Membunuh kuman penyakit yang masuk ke tubuh' },
        { key: 'B', text: 'Mengangkut gas oksigen dari paru-paru ke seluruh jaringan tubuh' },
        { key: 'C', text: 'Membantu proses pembekuan darah saat luka' },
        { key: 'D', text: 'Menghasilkan antibodi spesifik' },
      ],
      correctAnswerKey: 'B',
      scoreWeight: 20,
      explanation: 'Eritrosit mengandung hemoglobin yang mengikat oksigen untuk diedarkan ke seluruh tubuh.',
    },
    {
      id: 'q-2',
      questionText: 'Organ peredaran darah yang memiliki katup bicuspidalis dan tricuspidalis adalah...',
      options: [
        { key: 'A', text: 'Pembuluh Vena Kava' },
        { key: 'B', text: 'Jantung (Cor)' },
        { key: 'C', text: 'Paru-paru' },
        { key: 'D', text: 'Pembuluh Arteri Aorta' },
      ],
      correctAnswerKey: 'B',
      scoreWeight: 20,
      explanation: 'Katup bicuspid dan tricuspid berada di dalam bilik dan serambi jantung untuk mencegah arus balik darah.',
    },
  ]);

  const [savedQuizzes, setSavedQuizzes] = useState<CbtQuizConfig[]>([]);
  const [previewQuiz, setPreviewQuiz] = useState<CbtQuizConfig | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load saved quizzes from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_QUIZ_KEY);
      if (stored) {
        setSavedQuizzes(JSON.parse(stored));
      }
    } catch {
      // Ignore
    }
  }, []);

  const totalScore = questions.reduce((sum, q) => sum + q.scoreWeight, 0);

  const selectedSubject = SUBJECTS_LIST.find((s) => s.id === subjectId) || SUBJECTS_LIST[0];

  const handleAddQuestion = () => {
    const newQ: CbtBuilderQuestion = {
      id: `q-${Date.now()}`,
      questionText: '',
      options: [
        { key: 'A', text: '' },
        { key: 'B', text: '' },
        { key: 'C', text: '' },
        { key: 'D', text: '' },
      ],
      correctAnswerKey: 'A',
      scoreWeight: 10,
      explanation: '',
    };
    setQuestions([...questions, newQ]);
  };

  const handleDuplicateQuestion = (index: number) => {
    const target = questions[index];
    const duplicated: CbtBuilderQuestion = {
      ...target,
      id: `q-${Date.now()}`,
      questionText: `${target.questionText} (Salinan)`,
      options: target.options.map((opt) => ({ ...opt })),
    };
    const next = [...questions];
    next.splice(index + 1, 0, duplicated);
    setQuestions(next);
  };

  const handleDeleteQuestion = (index: number) => {
    if (questions.length <= 1) {
      alert('Minimal harus ada 1 butir soal!');
      return;
    }
    const next = questions.filter((_, idx) => idx !== index);
    setQuestions(next);
  };

  const handleUpdateQuestion = (index: number, field: keyof CbtBuilderQuestion, value: any) => {
    const next = [...questions];
    next[index] = { ...next[index], [field]: value };
    setQuestions(next);
  };

  const handleUpdateOption = (qIndex: number, optIndex: number, newText: string) => {
    const next = [...questions];
    const opts = [...next[qIndex].options];
    opts[optIndex] = { ...opts[optIndex], text: newText };
    next[qIndex] = { ...next[qIndex], options: opts };
    setQuestions(next);
  };

  const handleImportFromBank = (bankQ: CbtBuilderQuestion) => {
    const imported: CbtBuilderQuestion = {
      ...bankQ,
      id: `q-${Date.now()}`,
      options: bankQ.options.map((o) => ({ ...o })),
    };
    setQuestions([...questions, imported]);
    setToastMessage(`Soal "${bankQ.questionText.slice(0, 30)}..." berhasil ditambahkan ke lembar kuis!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveQuiz = (status: 'draft' | 'terbit') => {
    if (!title.trim()) {
      alert('Mohon isi judul kuis!');
      return;
    }
    if (questions.some((q) => !q.questionText.trim())) {
      alert('Semua butir soal wajib memiliki teks pertanyaan!');
      return;
    }

    const newQuiz: CbtQuizConfig = {
      id: `cbt-${Date.now()}`,
      title,
      subjectId: selectedSubject.id,
      subjectName: selectedSubject.name,
      targetClass,
      durationMinutes,
      passingScore,
      deadlineDate,
      shuffleQuestions,
      shuffleOptions,
      showExplanationAfterSubmit: showExplanation,
      questions,
      createdAt: new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      status,
    };

    const updated = [newQuiz, ...savedQuizzes];
    setSavedQuizzes(updated);
    try {
      localStorage.setItem(STORAGE_QUIZ_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }

    if (onQuizCreated) {
      onQuizCreated(newQuiz);
    }

    setToastMessage(`Kuis CBT "${title}" berhasil ${status === 'terbit' ? 'diterbitkan untuk siswa' : 'disimpan sebagai draft'}!`);
    setActiveTab('saved');
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden space-y-0">
      {/* Top Header */}
      <div className="p-6 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-200 text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Modul Guru · Pengarah & Pengembang CBT</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black mt-1">
            Bank Soal & CBT Question Builder Digital
          </h1>
          <p className="text-xs text-blue-100 mt-0.5">
            Rancang kuis pilihan ganda terstruktur dengan kunci jawaban, acak butir soal, dan bobot nilai terintegrasi.
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors self-start sm:self-auto"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 px-6 pt-3 gap-2">
        <button
          onClick={() => setActiveTab('builder')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'builder'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Builder Kuis Baru</span>
        </button>
        <button
          onClick={() => setActiveTab('bank')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'bank'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Koleksi Bank Soal</span>
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'saved'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Kuis Tersimpan & Terbit ({savedQuizzes.length})</span>
        </button>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="m-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Tab Content */}
      <div className="p-6">
        {activeTab === 'builder' && (
          <div className="space-y-6">
            {/* Meta Configuration Card */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Settings className="w-4 h-4 text-blue-600" />
                  <span>Pengaturan Lembar Ujian CBT</span>
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200">
                    Total Bobot: {totalScore} Poin
                  </span>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                    {questions.length} Butir Soal
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Mata Pelajaran
                  </label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {SUBJECTS_LIST.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Judul Ujian / Kuis CBT
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Penilaian Harian Teorema Pythagoras Bab 2"
                    className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Kelas
                  </label>
                  <select
                    value={targetClass}
                    onChange={(e) => setTargetClass(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Kelas 8A">Kelas 8A (Unggulan)</option>
                    <option value="Kelas 8B">Kelas 8B</option>
                    <option value="Kelas 8C">Kelas 8C</option>
                    <option value="Semua Kelas 8">Semua Kelas 8</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Durasi (Menit)
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={180}
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nilai KKM (Passing)
                  </label>
                  <input
                    type="number"
                    min={50}
                    max={100}
                    value={passingScore}
                    onChange={(e) => setPassingScore(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Batas Waktu (Deadline)
                  </label>
                  <input
                    type="date"
                    value={deadlineDate}
                    onChange={(e) => setDeadlineDate(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Switches */}
              <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shuffleQuestions}
                    onChange={(e) => setShuffleQuestions(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Acak Urutan Soal (Shuffle)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shuffleOptions}
                    onChange={(e) => setShuffleOptions(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Acak Opsi Pilihan A/B/C/D</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showExplanation}
                    onChange={(e) => setShowExplanation(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Tampilkan Pembahasan Kunci</span>
                </label>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Daftar Butir Soal Ujian ({questions.length} Butir)
                </h3>
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Butir Soal</span>
                </button>
              </div>

              {questions.map((q, qIdx) => (
                <div
                  key={q.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3.5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-mono font-bold text-xs flex items-center justify-center">
                        {qIdx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Soal Pilihan Ganda
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-slate-400">Bobot:</span>
                        <input
                          type="number"
                          min={1}
                          max={100}
                          value={q.scoreWeight}
                          onChange={(e) => handleUpdateQuestion(qIdx, 'scoreWeight', Number(e.target.value))}
                          className="w-16 p-1 text-center font-mono font-bold text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                        <span className="text-slate-400">Poin</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDuplicateQuestion(qIdx)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Duplikasi Butir Soal"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteQuestion(qIdx)}
                        className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                        title="Hapus Butir Soal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Question Text */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Narasi Pertanyaan
                    </label>
                    <textarea
                      rows={2}
                      value={q.questionText}
                      onChange={(e) => handleUpdateQuestion(qIdx, 'questionText', e.target.value)}
                      placeholder="Ketikkan teks soal di sini..."
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Options List */}
                  <div className="space-y-2">
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                      Opsi Pilihan Jawaban & Kunci Jawaban Benar
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, optIdx) => {
                        const isCorrect = q.correctAnswerKey === opt.key;
                        return (
                          <div
                            key={opt.key}
                            className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                              isCorrect
                                ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 ring-1 ring-emerald-500/20'
                                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => handleUpdateQuestion(qIdx, 'correctAnswerKey', opt.key)}
                              className={`w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center transition-colors ${
                                isCorrect
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-emerald-100 hover:text-emerald-700'
                              }`}
                              title={isCorrect ? 'Kunci Jawaban Benar' : 'Klik untuk jadikan kunci jawaban'}
                            >
                              {opt.key}
                            </button>
                            <input
                              type="text"
                              value={opt.text}
                              onChange={(e) => handleUpdateOption(qIdx, optIdx, e.target.value)}
                              placeholder={`Opsi ${opt.key}`}
                              className="w-full text-xs bg-transparent border-none focus:outline-none text-slate-900 dark:text-white"
                            />
                            {isCorrect && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Explanation */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Pembahasan Kunci Jawaban (Ditampilkan saat review)
                    </label>
                    <input
                      type="text"
                      value={q.explanation}
                      onChange={(e) => handleUpdateQuestion(qIdx, 'explanation', e.target.value)}
                      placeholder="Berikan alasan atau rujukan pembahasan kunci..."
                      className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              ))}

              {/* Bottom Actions */}
              <div className="pt-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4 text-blue-600" />
                  <span>Tambah Soal Berikutnya</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSaveQuiz('draft')}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Draft</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSaveQuiz('terbit')}
                    className="px-5 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-colors flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Terbitkan Ujian CBT untuk Siswa</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bank Soal Tab */}
        {activeTab === 'bank' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-blue-900 dark:text-blue-200">
                  Koleksi Bank Soal Standar Kurikulum SMP PGRI 1
                </span>
                <p className="text-blue-700 dark:text-blue-300 text-[11px] mt-0.5">
                  Gunakan butir soal berkualitas tinggi yang sudah diverifikasi MGMP sekolah untuk dimasukkan langsung ke lembar ujian Anda.
                </p>
              </div>
              <span className="font-mono text-blue-800 dark:text-blue-200 font-bold">
                {Object.values(SAMPLE_BANK_QUESTIONS).flat().length} Soal Tersedia
              </span>
            </div>

            <div className="space-y-3">
              {Object.entries(SAMPLE_BANK_QUESTIONS).map(([sbj, list]) => {
                const subMeta = SUBJECTS_LIST.find((s) => s.id === sbj) || SUBJECTS_LIST[0];
                return (
                  <div key={sbj} className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                      Mata Pelajaran: {subMeta.name} ({list.length} Soal)
                    </h4>
                    {list.map((bq) => (
                      <div
                        key={bq.id}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1.5 flex-1">
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {bq.questionText}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                            <span>Kunci: Opsi <strong>{bq.correctAnswerKey}</strong></span>
                            <span>·</span>
                            <span>Bobot Standar: {bq.scoreWeight} Poin</span>
                            <span>·</span>
                            <span className="italic text-slate-400 truncate max-w-sm">
                              {bq.explanation}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleImportFromBank(bq)}
                          className="px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 font-semibold text-xs flex items-center gap-1.5 shrink-0 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Gunakan Soal Ini</span>
                        </button>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Saved Quizzes Tab */}
        {activeTab === 'saved' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Riwayat Ujian CBT yang Dibuat Guru</span>
              <span className="font-mono">{savedQuizzes.length} Ujian Terdaftar</span>
            </div>

            {savedQuizzes.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800">
                <FileCheck2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-500">Belum ada ujian CBT yang disimpan.</p>
              </div>
            ) : (
              savedQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        {quiz.subjectName}
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="font-mono text-slate-500">{quiz.targetClass}</span>
                      <span className="text-slate-400">·</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          quiz.status === 'terbit'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {quiz.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      {quiz.title}
                    </h4>
                    <div className="text-[11px] text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                      <span>{quiz.questions.length} Butir Soal</span>
                      <span>·</span>
                      <span>Durasi: {quiz.durationMinutes} Menit</span>
                      <span>·</span>
                      <span>KKM: {quiz.passingScore}</span>
                      <span>·</span>
                      <span>Dibuat: {quiz.createdAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setPreviewQuiz(quiz)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-600" />
                      <span>Lihat Preview</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-6 flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 bg-blue-700 text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">{previewQuiz.title}</h3>
                <p className="text-xs text-blue-200">{previewQuiz.subjectName} · {previewQuiz.targetClass}</p>
              </div>
              <button
                onClick={() => setPreviewQuiz(null)}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {previewQuiz.questions.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="font-bold text-slate-900 dark:text-white">
                    {idx + 1}. {q.questionText}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-700 dark:text-slate-300">
                    {q.options.map((opt) => (
                      <div
                        key={opt.key}
                        className={`p-2 rounded-lg border text-[11px] ${
                          opt.key === q.correctAnswerKey
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 font-semibold text-emerald-800 dark:text-emerald-200'
                            : 'border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <strong>{opt.key}.</strong> {opt.text}
                      </div>
                    ))}
                  </div>
                  {q.explanation && (
                    <div className="p-2 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-200 text-[11px]">
                      <strong>Pembahasan:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
