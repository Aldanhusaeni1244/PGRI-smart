import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SchoolAnnouncement } from '../../types';
import {
  Megaphone,
  Pin,
  Calendar,
  User,
  Plus,
  Search,
  Tag,
  CheckCircle2,
  X
} from 'lucide-react';
import { NewAnnouncementModal } from '../modals/NewAnnouncementModal';

export const AnnouncementBoard: React.FC = () => {
  const { role, announcements } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [viewDetailModal, setViewDetailModal] = useState<SchoolAnnouncement | null>(null);

  const filteredAnnouncements = announcements.filter((ann) => {
    if (selectedCategory !== 'all' && ann.category !== selectedCategory) return false;
    if (
      searchQuery &&
      !ann.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !ann.summary.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'penting':
        return 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900';
      case 'akademik':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900';
      case 'kegiatan':
        return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900';
      case 'libur':
        return 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900';
      default:
        return 'text-slate-600 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <Megaphone className="w-4 h-4" />
            <span>Papan Informasi & Pengumuman Sekolah</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Warta Resmi SMP PGRI 1
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Pusat siaran berita resmi kurikulum, agenda PTS/PAT, dan kegiatan kesiswaan.
          </p>
        </div>

        {(role === 'guru' || role === 'wali_kelas') && (
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="px-4 py-2.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors flex items-center gap-2 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Terbitkan Pengumuman</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'Semua Kategori' },
            { id: 'akademik', label: 'Akademik & Ujian' },
            { id: 'kegiatan', label: 'Kegiatan Siswa' },
            { id: 'penting', label: 'Mendesak' },
            { id: 'libur', label: 'Kalender & Libur' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari kata kunci berita..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Announcements List Grid */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="py-16 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Megaphone className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Tidak Ada Pengumuman Ditemukan
            </div>
            <div className="text-xs">Coba cari dengan kata kunci lain atau pilih Semua Kategori</div>
          </div>
        ) : (
          filteredAnnouncements.map((ann) => (
            <div
              key={ann.id}
              className={`p-6 rounded-2xl bg-white dark:bg-slate-900 border shadow-xs space-y-3 transition-colors ${
                ann.isPinned
                  ? 'border-blue-300 dark:border-blue-900/60 bg-blue-50/20 dark:bg-blue-950/10'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border font-mono ${getCategoryColor(
                      ann.category
                    )}`}
                  >
                    {ann.category}
                  </span>
                  {ann.isPinned && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                      <Pin className="w-3.5 h-3.5" />
                      Disematkan
                    </span>
                  )}
                  <span className="text-slate-400 text-xs">·</span>
                  <span className="text-xs font-mono text-slate-500">{ann.date}</span>
                </div>

                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    Oleh: <strong>{ann.author}</strong> ({ann.authorRole})
                  </span>
                </div>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                {ann.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {ann.summary}
              </p>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-400 font-mono">
                  Target: {ann.targetAudience.toUpperCase()}
                </span>
                <button
                  onClick={() => setViewDetailModal(ann)}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Baca Selengkapnya →
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detail Modal */}
      {viewDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 sm:p-7 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border font-mono ${getCategoryColor(
                  viewDetailModal.category
                )}`}
              >
                {viewDetailModal.category}
              </span>
              <button
                onClick={() => setViewDetailModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {viewDetailModal.title}
              </h3>
              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                <span>{viewDetailModal.date}</span>
                <span>·</span>
                <span>
                  {viewDetailModal.author} ({viewDetailModal.authorRole})
                </span>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-3 whitespace-pre-line py-2">
              {viewDetailModal.content}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-right">
              <button
                onClick={() => setViewDetailModal(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Tutup Pengumuman
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Announcement Modal */}
      {isNewModalOpen && (
        <NewAnnouncementModal onClose={() => setIsNewModalOpen(false)} />
      )}
    </div>
  );
};
