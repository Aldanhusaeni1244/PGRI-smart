import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Megaphone } from 'lucide-react';

interface NewAnnouncementModalProps {
  onClose: () => void;
}

export const NewAnnouncementModal: React.FC<NewAnnouncementModalProps> = ({ onClose }) => {
  const { activeUser, createAnnouncement } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'akademik' | 'kegiatan' | 'penting' | 'libur'>('akademik');
  const [targetAudience, setTargetAudience] = useState<'semua' | 'siswa' | 'guru' | 'kelas_8a'>('semua');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) return;

    createAnnouncement({
      title,
      category,
      author: activeUser.name,
      authorRole: activeUser.className || activeUser.role,
      targetAudience,
      summary,
      content: content || summary,
      isPinned,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Terbitkan Pengumuman Sekolah
              </h3>
              <div className="text-[11px] text-slate-500">
                Notifikasi otomatis akan disiarkan ke siswa dan guru SMP PGRI
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Kategori Informasi
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as typeof category)}
                className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              >
                <option value="akademik">Akademik & Ujian</option>
                <option value="kegiatan">Kegiatan & Lomba</option>
                <option value="penting">Penting & Mendesak</option>
                <option value="libur">Hari Libur & Kalender</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Target Audiens
              </label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value as typeof targetAudience)}
                className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              >
                <option value="semua">Semua (Siswa & Guru)</option>
                <option value="siswa">Hanya Siswa</option>
                <option value="kelas_8a">Khusus Kelas 8A</option>
                <option value="guru">Hanya Dewan Guru</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Judul Pengumuman
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Jadwal Ujian Praktik IPA & Bahasa Inggris Kelas 8"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Ringkasan Singkat (Muncul di Pop-up Notifikasi)
            </label>
            <input
              type="text"
              required
              placeholder="Ringkasan 1-2 kalimat untuk notifikasi cepat..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Isi Lengkap Pengumuman
            </label>
            <textarea
              rows={4}
              placeholder="Tuliskan detail jadwal, tempat pelaksanaan, atau hal yang wajib dibawa siswa..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="pinAnnouncement"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            <label htmlFor="pinAnnouncement" className="text-xs text-slate-700 dark:text-slate-300">
              Sematkan di bagian teratas (Pin Announcement)
            </label>
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
              Publikasikan & Siarkan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
