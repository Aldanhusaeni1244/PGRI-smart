import React, { useState } from 'react';
import {
  BookOpen,
  Upload,
  Video,
  FileText,
  Eye,
  CheckCircle2,
  X,
  Play,
  Layers,
  Sparkles,
  ExternalLink,
  Save,
  Clock,
  AlertCircle
} from 'lucide-react';
import { SUBJECTS_LIST } from '../../data/mockData';
import { MaterialItem } from '../../types';

interface MaterialUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMaterialCreated?: (item: MaterialItem) => void;
}

const STORAGE_MATERIALS_KEY = 'pgri_custom_materials';

export const MaterialUploaderModal: React.FC<MaterialUploaderModalProps> = ({
  isOpen,
  onClose,
  onMaterialCreated,
}) => {
  const [subjectId, setSubjectId] = useState<string>('sbj_ipa');
  const [targetClass, setTargetClass] = useState<string>('Kelas 8A');
  const [chapterNumber, setChapterNumber] = useState<number>(3);
  const [title, setTitle] = useState<string>('Struktur Organ dan Fungsi Sistem Sirkulasi Darah Manusia');
  const [description, setDescription] = useState<string>(
    'Materi pembelajaran komprehensif mengenai anatomi bilik jantung, pembuluh kapiler, mekanisme pembekuan darah, dan kelainan kardiovaskular.'
  );
  const [contentType, setContentType] = useState<'pdf' | 'video'>('pdf');

  // PDF state
  const [pdfFileName, setPdfFileName] = useState<string>('Modul_IPA_Sistem_Peredaran_Darah.pdf');
  const [pdfFileSize, setPdfFileSize] = useState<string>('2.8 MB');
  const [pdfPages, setPdfPages] = useState<string>('24 Halaman');

  // Video state
  const [videoUrl, setVideoUrl] = useState<string>('https://www.youtube.com/watch?v=kR2r6H9_a8E');
  const [videoDuration, setVideoDuration] = useState<string>('18 Menit');

  const [notification, setNotification] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedSubject = SUBJECTS_LIST.find((s) => s.id === subjectId) || SUBJECTS_LIST[0];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      alert('Hanya berkas format .PDF yang didukung!');
      return;
    }

    setPdfFileName(file.name);
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    setPdfFileSize(`${sizeMb} MB`);
    setPdfPages('Berkas Mandiri');
  };

  // Helper YouTube Embed parser
  const getYouTubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube-nocookie.com/embed/${match[2]}`;
    }
    return null;
  };

  const handleSaveMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Mohon isi judul modul materi!');
      return;
    }

    const newMaterial: MaterialItem = {
      id: `mat-${Date.now()}`,
      subjectId: selectedSubject.id,
      chapterNumber,
      title,
      description,
      contentType,
      durationOrPages: contentType === 'pdf' ? pdfPages : videoDuration,
      fileSize: contentType === 'pdf' ? pdfFileSize : 'Streaming HD',
      uploadDate: new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      downloadUrl: contentType === 'pdf' ? `/documents/${pdfFileName}` : undefined,
      videoUrl: contentType === 'video' ? videoUrl : undefined,
      pdfFileName: contentType === 'pdf' ? pdfFileName : undefined,
    };

    try {
      const stored = localStorage.getItem(STORAGE_MATERIALS_KEY);
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(newMaterial);
      localStorage.setItem(STORAGE_MATERIALS_KEY, JSON.stringify(list));
    } catch {
      // Ignore
    }

    if (onMaterialCreated) {
      onMaterialCreated(newMaterial);
    }

    setNotification(`Modul "${title}" berhasil diunggah dan terhubung ke siswa ${targetClass}!`);
    setTimeout(() => {
      setNotification(null);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl my-6">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20">
              <Upload className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold">Panel Unggah Modul & Materi Pembelajaran</h2>
              <p className="text-xs text-blue-100">
                Pendidik SMP PGRI 1 · Terhubung Langsung ke Pratinjau Siswa
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {notification && (
          <div className="m-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        <form onSubmit={handleSaveMaterial} className="p-6 space-y-5 max-h-[78vh] overflow-y-auto">
          {/* Metadata Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Mata Pelajaran <span className="text-red-500">*</span>
              </label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                {SUBJECTS_LIST.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Kelas <span className="text-red-500">*</span>
              </label>
              <select
                value={targetClass}
                onChange={(e) => setTargetClass(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Kelas 8A">Kelas 8A (Binaan)</option>
                <option value="Kelas 8B">Kelas 8B</option>
                <option value="Kelas 8C">Kelas 8C</option>
                <option value="Semua Kelas 8">Semua Rombel Kelas 8</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Bab Ke- <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                max={12}
                value={chapterNumber}
                onChange={(e) => setChapterNumber(Number(e.target.value))}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Module Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Judul Bab / Topik Materi Pembelajaran <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Bab 3 - Struktur Organ & Sirkulasi Darah Manusia"
              required
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Ringkasan Materi & Tujuan Capaian
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tuliskan tujuan instruksional dan ringkasan materi..."
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          {/* Content Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Tipe Berkas Materi <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setContentType('pdf')}
                className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 ${
                  contentType === 'pdf'
                    ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/60 ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="p-2 rounded-lg bg-blue-600 text-white">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Dokumen PDF / E-Modul
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Buku ajar, modul digital, lembar baca
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setContentType('video')}
                className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 ${
                  contentType === 'video'
                    ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/60 ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="p-2 rounded-lg bg-rose-600 text-white">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Tautan Video Pembelajaran
                  </div>
                  <div className="text-[10px] text-slate-500">
                    YouTube, Vimeo, MP4, Google Drive
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Conditional PDF Section */}
          {contentType === 'pdf' && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Konfigurasi Dokumen PDF
                </span>
                <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400">
                  {pdfFileName}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Unggah Berkas PDF dari Perangkat
                  </label>
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileUpload}
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Atau Pilih PDF Kurikulum Bawaan
                  </label>
                  <select
                    value={pdfFileName}
                    onChange={(e) => setPdfFileName(e.target.value)}
                    className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  >
                    <option value="Modul_IPA_Sistem_Peredaran_Darah.pdf">Modul IPA Sistem Peredaran Darah</option>
                    <option value="Modul_Matematika_Teorema_Pythagoras.pdf">Modul Matematika Teorema Pythagoras</option>
                    <option value="Modul_Bahasa_Indonesia_Teks_LHO.pdf">Modul B. Indonesia Teks LHO</option>
                    <option value="Modul_Bahasa_Inggris_Recount_Text.pdf">Modul B. Inggris Recount Text</option>
                    <option value="Modul_Informatika_Algoritma_Searching.pdf">Modul Informatika Algoritma</option>
                    <option value="Modul_IPS_Dinamika_Kependudukan_ASEAN.pdf">Modul IPS Dinamika ASEAN</option>
                    <option value="Modul_PAI_Adab_Menuntut_Ilmu.pdf">Modul PAI Adab Menuntut Ilmu</option>
                    <option value="Modul_PPKn_Kedaulatan_Rakyat_UUD1945.pdf">Modul PPKn Kedaulatan Rakyat</option>
                    <option value="Modul_PJOK_Kebugaran_Jasmani.pdf">Modul PJOK Kebugaran Jasmani</option>
                    <option value="Modul_Seni_Budaya_Ragam_Hias.pdf">Modul Seni Budaya Ragam Hias</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Jumlah Halaman</label>
                  <input
                    type="text"
                    value={pdfPages}
                    onChange={(e) => setPdfPages(e.target.value)}
                    placeholder="Contoh: 28 Halaman"
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Ukuran Berkas</label>
                  <input
                    type="text"
                    value={pdfFileSize}
                    onChange={(e) => setPdfFileSize(e.target.value)}
                    placeholder="Contoh: 3.2 MB"
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Conditional Video Section */}
          {contentType === 'video' && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
              <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                Konfigurasi Video Pembelajaran
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Tautan / URL Video (YouTube / Web)
                  </label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Durasi Video
                  </label>
                  <input
                    type="text"
                    value={videoDuration}
                    onChange={(e) => setVideoDuration(e.target.value)}
                    placeholder="Contoh: 20 Menit"
                    className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Live Video Embed Preview */}
              {getYouTubeEmbedUrl(videoUrl) && (
                <div className="rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 aspect-video max-w-md mx-auto">
                  <iframe
                    src={getYouTubeEmbedUrl(videoUrl)!}
                    title="Pratinjau Video"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              )}
            </div>
          )}

          {/* Student Live Preview Card */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
              <Eye className="w-4 h-4 text-blue-600" />
              <span>Pratinjau Tampilan Siswa (Live Student Preview)</span>
            </div>

            <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-start gap-3">
                <div
                  className={`p-2.5 rounded-xl text-white ${
                    contentType === 'pdf' ? 'bg-blue-600' : 'bg-rose-600'
                  }`}
                >
                  {contentType === 'pdf' ? <FileText className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">
                      Bab {chapterNumber}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="font-bold text-slate-900 dark:text-white truncate max-w-sm">
                      {title || 'Judul Materi Belajar'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {description || 'Deskripsi materi akan muncul di sini...'}
                  </p>
                  <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-2">
                    <span>{contentType === 'pdf' ? pdfPages : videoDuration}</span>
                    <span>·</span>
                    <span>{contentType === 'pdf' ? pdfFileSize : 'Video HD'}</span>
                    <span>·</span>
                    <span className="font-semibold text-emerald-600">Siap Dipelajari Siswa</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className={`px-3 py-1.5 rounded-lg text-white font-semibold text-xs flex items-center gap-1 self-start sm:self-auto shadow-xs ${
                  contentType === 'pdf' ? 'bg-blue-600' : 'bg-rose-600'
                }`}
              >
                {contentType === 'pdf' ? <Eye className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{contentType === 'pdf' ? 'Buka PDF' : 'Tonton Video'}</span>
              </button>
            </div>
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Simpan & Terbitkan Modul</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
