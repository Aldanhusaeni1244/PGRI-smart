import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  BookOpen,
  FileCheck2,
  FileQuestion,
  LineChart,
  CalendarCheck,
  Megaphone,
  CalendarDays,
  Award,
  Users
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { role, activeTab, setActiveTab, assignments, unreadCount } = useApp();

  const pendingAssignmentsCount = assignments.filter((a) => {
    if (role === 'siswa') {
      const mySub = a.submissions.find((s) => s.studentId === 'std_01');
      return !mySub;
    }
    // for teacher: need grading
    return a.submissions.some((s) => s.status === 'terkumpul');
  }).length;

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard Utama',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'mata-pelajaran',
      label: 'Mata Pelajaran',
      icon: BookOpen,
      badge: '10 Mapel',
    },
    {
      id: 'tugas',
      label: role === 'siswa' ? 'Tugas & Praktikum' : 'Manajemen Tugas',
      icon: FileCheck2,
      badge: pendingAssignmentsCount > 0 ? `${pendingAssignmentsCount} Aktif` : null,
      badgeColor: 'amber',
    },
    {
      id: 'cbt-ujian',
      label: 'Kuis & CBT Digital',
      icon: FileQuestion,
      badge: 'CBT Live',
      badgeColor: 'blue',
    },
    {
      id: 'pantauan-akademik',
      label: role === 'siswa' ? 'Rapor & Nilai Saya' : 'Pantauan Akademik Kelas',
      icon: LineChart,
      badge: 'Real-Time',
    },
    {
      id: 'presensi',
      label: role === 'siswa' ? 'Rekap Kehadiran' : 'Presensi & Absensi',
      icon: CalendarCheck,
      badge: null,
    },
    {
      id: 'pengumuman',
      label: 'Pengumuman Sekolah',
      icon: Megaphone,
      badge: unreadCount > 0 ? `${unreadCount} Baru` : null,
      badgeColor: 'rose',
    },
    {
      id: 'jadwal',
      label: 'Jadwal Pelajaran',
      icon: CalendarDays,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col justify-between bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 transition-colors">
      <div className="space-y-6">
        {/* User Identity Card */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
              {role === 'siswa' ? '8A' : role === 'guru' ? 'IPA' : 'ADM'}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                {role === 'siswa' ? 'Raditya Pratama' : role === 'guru' ? 'Dra. Hj. Sri Wahyuni' : 'Drs. H. Mulyono'}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {role === 'siswa' ? 'NISN: 0098234120' : role === 'guru' ? 'NIP: 19780512...' : 'Kepala Sekolah'}
              </div>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Tahun Ajaran</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">2026/2027 Genap</span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1">
          <div className="px-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
            Menu Pembelajaran
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                  <span className="whitespace-nowrap">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded text-white ${
                      isActive
                        ? 'bg-white/20'
                        : item.badgeColor === 'rose'
                        ? 'bg-rose-500'
                        : item.badgeColor === 'amber'
                        ? 'bg-amber-600'
                        : item.badgeColor === 'blue'
                        ? 'bg-blue-600'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Educational Quality Badge */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-2">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
          <Award className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Kurikulum Merdeka SMP</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-500">
          SMP PGRI 1 Terakreditasi A · Penilaian Terpadu & Berkelanjutan
        </p>
      </div>
    </aside>
  );
};
