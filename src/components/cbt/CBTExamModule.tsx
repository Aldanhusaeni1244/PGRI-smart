import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Quiz } from '../../types';
import confetti from 'canvas-confetti';
import {
  FileQuestion,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Award,
  ChevronLeft,
  ChevronRight,
  Flag,
  Sparkles,
  BookOpen
} from 'lucide-react';

export const CBTExamModule: React.FC = () => {
  const { role, quizzes, submitQuizAttempt, showToast } = useApp();

  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);
  const [isExamCompleted, setIsExamCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [isPassed, setIsPassed] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  // Timer loop
  useEffect(() => {
    if (!activeQuiz || isExamCompleted || timeLeftSeconds <= 0) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeQuiz, isExamCompleted, timeLeftSeconds]);

  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setFlaggedQuestions({});
    setTimeLeftSeconds(quiz.durationMinutes * 60);
    setIsExamCompleted(false);
    setFinalScore(null);
  };

  const handleSelectAnswer = (optionIdx: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionIdx,
    }));
  };

  const toggleFlagQuestion = () => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [currentQuestionIndex]: !prev[currentQuestionIndex],
    }));
  };

  const handleFinishExam = () => {
    if (!activeQuiz) return;

    let correctCount = 0;
    activeQuiz.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswer) {
        correctCount += 1;
      }
    });

    const score = Math.round((correctCount / activeQuiz.questions.length) * 100);
    const passed = score >= activeQuiz.passingScore;

    setFinalScore(score);
    setIsPassed(passed);
    setIsExamCompleted(true);
    setShowSubmitConfirm(false);

    submitQuizAttempt(activeQuiz.id, userAnswers, score, passed);

    if (passed) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <FileQuestion className="w-4 h-4" />
            <span>Computer-Based Test (CBT) Digital SMP PGRI</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Kuis & Ujian Digital Berbasis Komputer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Penilaian harian interaktif, timer otomatis, auto-scoring real-time, dan pembahasan soal.
          </p>
        </div>

        {activeQuiz && !isExamCompleted && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 font-mono text-base font-bold shadow-xs">
            <Clock className="w-4 h-4 animate-pulse" />
            <span>{formatTimer(timeLeftSeconds)}</span>
          </div>
        )}
      </div>

      {/* Screen 1: Quiz Selection List */}
      {!activeQuiz && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {quizzes.map((quiz) => {
            const hasCompleted = !!quiz.completedByStudent;
            return (
              <div
                key={quiz.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 hover:border-blue-400 dark:hover:border-blue-600 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                    {quiz.subjectName}
                  </span>
                  <span className="text-xs font-mono text-slate-500">{quiz.targetClass}</span>
                </div>

                <div className="space-y-1">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    {quiz.title}
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {quiz.description}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs text-center font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Waktu</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {quiz.durationMinutes} Menit
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Jumlah Soal</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {quiz.totalQuestions} Soal
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">KKM Lulus</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {quiz.passingScore}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  {hasCompleted ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-emerald-600">
                        Skor: {quiz.completedByStudent?.score}/100
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          quiz.completedByStudent?.passed
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {quiz.completedByStudent?.passed ? 'TUNTAS' : 'REMEDIAL'}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500 font-mono">
                      Batas: {quiz.deadline}
                    </span>
                  )}

                  <button
                    onClick={() => startQuiz(quiz)}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{hasCompleted ? 'Coba Ulang Kuis' : 'Mulai Ujian CBT'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Screen 2: Active Exam Room */}
      {activeQuiz && !isExamCompleted && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Viewer (3 cols) */}
          <div className="lg:col-span-3 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            {/* Question Top bar */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Soal Nomor {currentQuestionIndex + 1} dari {activeQuiz.questions.length}
              </span>
              <button
                onClick={toggleFlagQuestion}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                  flaggedQuestions[currentQuestionIndex]
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>
                  {flaggedQuestions[currentQuestionIndex] ? 'Ragu-ragu (Ditandai)' : 'Tandai Ragu-ragu'}
                </span>
              </button>
            </div>

            {/* Question Text */}
            <div className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-relaxed">
              {activeQuiz.questions[currentQuestionIndex].question}
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              {activeQuiz.questions[currentQuestionIndex].options.map((opt, oIdx) => {
                const isSelected = userAnswers[currentQuestionIndex] === oIdx;
                const optionLetters = ['A', 'B', 'C', 'D'];

                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectAnswer(oIdx)}
                    className={`w-full p-4 rounded-xl text-left text-xs sm:text-sm font-medium transition-all flex items-start gap-3 border ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 shadow-xs ring-1 ring-blue-600'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {optionLetters[oIdx]}
                    </span>
                    <span className="mt-0.5 leading-relaxed">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Navigation buttons */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>

              {currentQuestionIndex < activeQuiz.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 transition-colors flex items-center gap-1"
                >
                  <span>Berikutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setShowSubmitConfirm(true)}
                  className="px-5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Selesai & Kumpulkan</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Question Palette Grid (1 col) */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Nomor Soal
            </h3>

            <div className="grid grid-cols-5 gap-2">
              {activeQuiz.questions.map((_, qIdx) => {
                const isAnswered = userAnswers[qIdx] !== undefined;
                const isFlagged = flaggedQuestions[qIdx];
                const isCurrent = currentQuestionIndex === qIdx;

                return (
                  <button
                    key={qIdx}
                    onClick={() => setCurrentQuestionIndex(qIdx)}
                    className={`h-9 rounded-lg font-mono text-xs font-bold transition-all relative ${
                      isCurrent
                        ? 'ring-2 ring-blue-600 ring-offset-2'
                        : ''
                    } ${
                      isFlagged
                        ? 'bg-amber-400 text-amber-950'
                        : isAnswered
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {qIdx + 1}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-blue-600" />
                <span>Sudah Dijawab ({Object.keys(userAnswers).length})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-amber-400" />
                <span>Ragu-ragu</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-slate-200 dark:bg-slate-700" />
                <span>Belum Dijawab</span>
              </div>
            </div>

            <button
              onClick={() => setShowSubmitConfirm(true)}
              className="w-full mt-4 py-2.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
            >
              Kumpulkan Ujian Sekarang
            </button>
          </div>
        </div>
      )}

      {/* Screen 3: Exam Results & Review */}
      {activeQuiz && isExamCompleted && finalScore !== null && (
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-8">
          {/* Score Header Card */}
          <div className="text-center space-y-3 max-w-md mx-auto">
            <div className="inline-flex p-3 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Award className="w-10 h-10" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Hasil Penilaian CBT SMP PGRI
            </h2>
            <div className="text-4xl sm:text-5xl font-black text-blue-600 dark:text-blue-400 font-mono tabular-nums">
              {finalScore} <span className="text-sm font-normal text-slate-400">/ 100</span>
            </div>
            <div>
              <span
                className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${
                  isPassed
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                }`}
              >
                {isPassed
                  ? `SELAMAT! ANDA LULUS STANDAR KKM (${activeQuiz.passingScore})`
                  : `NILAI DI BAWAH KKM (${activeQuiz.passingScore}) - JADWAL REMEDIAL DIBUTUHKAN`}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Nilai telah tercatat secara otomatis di sistem rapor akademik guru dan wali kelas Anda.
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => setActiveQuiz(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Kembali ke Daftar Kuis
              </button>
            </div>
          </div>

          {/* Detailed Question Review & Explanations */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Pembahasan Soal & Kunci Jawaban</span>
            </h3>

            <div className="space-y-4">
              {activeQuiz.questions.map((q, idx) => {
                const userAns = userAnswers[idx];
                const isCorrect = userAns === q.correctAnswer;
                const optionLetters = ['A', 'B', 'C', 'D'];

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border text-xs space-y-2 ${
                      isCorrect
                        ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/10'
                        : 'border-rose-200 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        Soal {idx + 1}:
                      </span>
                      <span
                        className={`font-semibold ${
                          isCorrect ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {isCorrect ? '✓ Jawaban Benar' : '✗ Jawaban Salah'}
                      </span>
                    </div>

                    <p className="font-medium text-slate-900 dark:text-white">{q.question}</p>

                    <div className="pt-1 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                      <div>
                        Jawaban Anda:{' '}
                        <strong>
                          {userAns !== undefined
                            ? `${optionLetters[userAns]}. ${q.options[userAns]}`
                            : 'Tidak dijawab'}
                        </strong>
                      </div>
                      <div className="text-emerald-700 dark:text-emerald-400 font-semibold">
                        Kunci Jawaban:{' '}
                        {optionLetters[q.correctAnswer]}. {q.options[q.correctAnswer]}
                      </div>
                    </div>

                    <div className="p-2.5 rounded bg-white dark:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      <strong>Penjelasan Ilmiah:</strong> {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 text-center">
            <AlertCircle className="w-10 h-10 mx-auto text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Kumpulkan Ujian CBT?
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Anda telah menjawab <strong>{Object.keys(userAnswers).length}</strong> dari{' '}
              <strong>{activeQuiz?.questions.length}</strong> soal. Setelah dikumpulkan, hasil nilai akan langsung dihitung.
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Periksa Lagi
              </button>
              <button
                onClick={handleFinishExam}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
              >
                Ya, Kumpulkan Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
