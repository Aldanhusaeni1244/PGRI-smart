import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
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
  Users,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { role, activeTab, setActiveTab, assignments, unreadCount } = useApp();
  let authUser = null;
  try {
    const auth = useAuth();
    authUser = auth.user;
  } catch {
    // Fallback if rendered outside AuthProvider
  }

  const pendingAssignmentsCount = assignments.filter((a) => {
    if (role === 'siswa') {
      const mySub = a.submissions.find((s) => s.studentId === 'std_01');
      return !mySub;
    }
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

  const displayName = authUser?.name || (role === 'siswa' ? 'Raditya Pratama' : role === 'guru' ? 'M.Pd (Guru IPA)' : 'Dra. Hj. Sri Wahyuni');
  const displayNisnOrNip = authUser?.nisnOrNip || (role === 'siswa' ? 'NISN: 0098234120' : role === 'guru' ? 'NIP: 19850312' : 'NIP: 19780415');
  const displayClass = authUser?.classInfo || (role === 'siswa' ? 'Siswa Kelas 8A' : role === 'guru' ? 'Guru Pengajar IPA' : 'Wali Kelas 8A');

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col justify-between bg-slate-900 border-r border-slate-800 p-4 transition-colors text-slate-100 selection:bg-blue-600 selection:text-white">
      <div className="space-y-6">
        {/* User Identity Card (Executive Navy Style) */}
        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {role === 'siswa' ? <GraduationCap className="w-4 h-4" /> : role === 'guru' ? <BookOpen className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">
                {displayName}
              </div>
              <div className="text-[11px] text-slate-400 font-mono truncate">
                {displayNisnOrNip}
              </div>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
            <span className="truncate max-w-[130px] font-medium text-blue-400">{displayClass}</span>
            <span className="font-semibold text-slate-300 font-mono text-[10px]">2026/27 Genap</span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1">
          <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Menu Pembelajaran
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white font-medium shadow-md'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
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
                        : 'bg-slate-800 text-slate-300'
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
      <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 space-y-2">
        <div className="flex items-center gap-2 text-slate-200 font-semibold">
          <Award className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Kurikulum Merdeka SMP</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-400">
          SMP PGRI 1 Terakreditasi A (Unggul) · Portal Terpadu Guru & Siswa
        </p>
      </div>
    </aside>
  );
};
