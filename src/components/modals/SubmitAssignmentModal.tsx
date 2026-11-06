import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Assignment } from '../../types';
import { X, UploadCloud, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface SubmitAssignmentModalProps {
  assignment: Assignment;
  onClose: () => void;
}

export const SubmitAssignmentModal: React.FC<SubmitAssignmentModalProps> = ({
  assignment,
  onClose,
}) => {
  const { submitAssignment } = useApp();
  const [studentNote, setStudentNote] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('Laporan_Tugas_Raditya_8A.pdf');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      submitAssignment(assignment.id, studentNote, selectedFileName);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
              {assignment.subjectName}
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Pengumpulan Tugas Siswa
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-1">
          <div className="text-xs font-bold text-slate-900 dark:text-white">
            {assignment.title}
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400">
            {assignment.description}
          </p>
          <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono pt-1">
            <span>Tenggat: {assignment.dueDate}</span>
            <span>·</span>
            <span>Bobot: {assignment.weightPercent}%</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Upload Real Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Lampiran Berkas Tugas Siswa (.PDF)
            </label>
            <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-5 text-center hover:border-blue-500 transition-colors bg-slate-50/50 dark:bg-slate-800/40 cursor-pointer block">
              <input
                type="file"
                accept="application/pdf,.pdf"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setSelectedFileName(f.name);
                }}
              />
              <UploadCloud className="w-8 h-8 mx-auto text-blue-600 mb-2" />
              <div className="text-xs font-medium text-slate-700 dark:text-slate-200">
                Klik untuk memilih berkas dari HP / Komputer:
              </div>
              <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-xs font-mono">
                <FileText className="w-3.5 h-3.5" />
                <span>{selectedFileName}</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-2">
                Format PDF didukung · Maksimal 25 MB
              </div>
            </label>
          </div>

          {/* Student Note */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Catatan untuk Guru (Opsional)
            </label>
            <textarea
              rows={3}
              value={studentNote}
              onChange={(e) => setStudentNote(e.target.value)}
              placeholder="Contoh: Sudah saya lengkapi dengan grafik hasil uji praktikum di halaman 3..."
              className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Mengunggah...' : 'Kirim Tugas Sekarang'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
