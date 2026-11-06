import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Award, FileText, CheckCircle2 } from 'lucide-react';

interface GradeSubmissionModalProps {
  target: {
    assignmentId: string;
    studentId: string;
    studentName: string;
    assignmentTitle: string;
    submittedFile?: string;
    studentNote?: string;
  };
  onClose: () => void;
}

export const GradeSubmissionModal: React.FC<GradeSubmissionModalProps> = ({
  target,
  onClose,
}) => {
  const { gradeSubmission } = useApp();
  const [score, setScore] = useState<number>(90);
  const [feedback, setFeedback] = useState('Analisis sangat baik, data terstruktur dan kesimpulan akurat.');

  const handleGrade = (e: React.FormEvent) => {
    e.preventDefault();
    gradeSubmission(target.assignmentId, target.studentId, Number(score), feedback);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Penilaian Tugas Siswa
              </h3>
              <div className="text-[11px] text-slate-500">
                Nilai dan feedback akan langsung diterima oleh siswa
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student submission preview card */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              {target.studentName}
            </span>
            <span className="text-[10px] font-mono text-slate-400">Kelas 8A</span>
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
            {target.assignmentTitle}
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 pt-1">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>{target.submittedFile || 'Laporan_Tugas.pdf'}</span>
          </div>
          {target.studentNote && (
            <div className="text-[11px] text-slate-600 dark:text-slate-400 italic bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700">
              "{target.studentNote}"
            </div>
          )}
        </div>

        <form onSubmit={handleGrade} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Nilai Skor (Skala 0 - 100)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0"
                max="100"
                required
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="w-28 p-2 text-base font-bold text-center rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
              <div className="text-xs text-slate-500">
                {score >= 75 ? (
                  <span className="text-emerald-600 font-semibold">Tuntas Standar KKM</span>
                ) : (
                  <span className="text-rose-600 font-semibold">Di Bawah KKM (Remedial)</span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Catatan & Masukan Guru
            </label>
            <textarea
              required
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Berikan apresiasi dan saran perbaikan..."
              className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
            >
              Simpan & Beritahu Siswa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
