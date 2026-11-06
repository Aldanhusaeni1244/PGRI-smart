import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Calendar, FileText, UploadCloud, CheckCircle2, Trash2 } from 'lucide-react';

interface NewAssignmentModalProps {
  onClose: () => void;
}

export const NewAssignmentModal: React.FC<NewAssignmentModalProps> = ({ onClose }) => {
  const { subjects, createAssignment, showToast } = useApp();

  const [subjectId, setSubjectId] = useState(subjects[0]?.id || 'sbj_ipa');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('2026-11-10 23:59');
  const [targetClass, setTargetClass] = useState('Kelas 8A');
  const [weightPercent, setWeightPercent] = useState(20);
  const [attachmentName, setAttachmentName] = useState('Lembar_Kerja_Tugas.pdf');
  const [customFile, setCustomFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      showToast('Harap pilih berkas PDF (.pdf)', 'warning');
      return;
    }
    setCustomFile(file);
    setAttachmentName(file.name);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const selectedSubject = subjects.find((s) => s.id === subjectId);
    const assignedDate = new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    createAssignment(
      {
        subjectId,
        subjectName: selectedSubject?.name || 'Mata Pelajaran',
        title,
        description,
        assignedDate,
        dueDate,
        targetClass,
        maxScore: 100,
        weightPercent: Number(weightPercent),
        attachmentName: customFile ? customFile.name : attachmentName,
      },
      customFile ? { file: customFile } : undefined
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Buat Tugas Baru untuk Siswa
            </h3>
            <div className="text-[11px] text-slate-500">
              Notifikasi otomatis akan disiarkan langsung ke seluruh siswa
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Mata Pelajaran
              </label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Target Kelas
              </label>
              <select
                value={targetClass}
                onChange={(e) => setTargetClass(e.target.value)}
                className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              >
                <option value="Kelas 8A">Kelas 8A</option>
                <option value="Kelas 8B">Kelas 8B</option>
                <option value="Kelas 8C">Kelas 8C</option>
                <option value="Semua Kelas 8">Semua Kelas 8</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Judul Tugas / Praktikum
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Analisis Ekosistem Kolam dan Rantai Makanan"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Petunjuk Pengerjaan & Rubrik
            </label>
            <textarea
              required
              rows={3}
              placeholder="Jelaskan instruksi pengerjaan, format laporan, dan kriteria penilaian..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Batas Pengumpulan (Deadline)
              </label>
              <input
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="2026-11-10 23:59"
                className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Bobot Nilai (%)
              </label>
              <input
                type="number"
                min="5"
                max="50"
                value={weightPercent}
                onChange={(e) => setWeightPercent(Number(e.target.value))}
                className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
              />
            </div>
          </div>

          {/* PDF Attachment Section */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Dokumen PDF Lampiran Tugas</span>
              </label>
              <span className="text-[10px] text-slate-500 font-mono">Format .PDF</span>
            </div>

            {/* Hidden native input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={handleFileSelect}
            />

            {customFile ? (
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="truncate">
                    <span className="font-bold text-emerald-900 dark:text-emerald-100 font-mono truncate block">
                      {customFile.name}
                    </span>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-300">
                      Ukuran: {Math.round(customFile.size / 1024)} KB · Siap diterbitkan sebagai PDF asli
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCustomFile(null);
                    setAttachmentName('Lembar_Kerja_Tugas.pdf');
                  }}
                  className="p-1 text-rose-600 hover:text-rose-700 rounded hover:bg-rose-100 dark:hover:bg-rose-950 transition-colors ml-2"
                  title="Batalkan berkas ini"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <select
                  value={attachmentName}
                  onChange={(e) => setAttachmentName(e.target.value)}
                  className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                >
                  <option value="Lembar_Kerja_Tugas.pdf">
                    📄 Lembar_Kerja_Tugas.pdf (Standar Kurikulum PGRI)
                  </option>
                  <option value="Panduan_Praktikum_Uji_Nutrisi_8A.pdf">
                    🔬 Panduan_Praktikum_Uji_Nutrisi_8A.pdf (IPA Terpadu)
                  </option>
                  <option value="Lembar_Kerja_Pythagoras_No1-5.pdf">
                    📐 Lembar_Kerja_Pythagoras_No1-5.pdf (Matematika)
                  </option>
                  <option value="Rubrik_Penilaian_Teks_LHO.pdf">
                    📚 Rubrik_Penilaian_Teks_LHO.pdf (Bahasa Indonesia)
                  </option>
                  <option value="Studi_Kasus_Perpus_SMP_PGRI.pdf">
                    💻 Studi_Kasus_Perpus_SMP_PGRI.pdf (Informatika)
                  </option>
                </select>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2 px-3 text-xs font-semibold rounded-lg border border-dashed border-blue-400 dark:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-blue-700 dark:text-blue-300 transition-colors flex items-center justify-center gap-2"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Atau Unggah Berkas PDF Sendiri dari Komputer / HP</span>
                </button>
              </div>
            )}
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
              className="px-5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
            >
              Terbitkan & Kirim Notifikasi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
