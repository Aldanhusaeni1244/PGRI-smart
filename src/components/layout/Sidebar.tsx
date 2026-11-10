import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { UserProfileEditModal } from '../profile/UserProfileEditModal';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  HelpCircle,
  Award,
  CheckSquare,
  Bell,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  UserCheck,
  ShieldCheck,
  LogOut,
  Calendar
} from 'lucide-react';

export interface SidebarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  onOpenProfileModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab: propActiveTab,
  setActiveTab: propSetActiveTab,
  onOpenProfileModal,
}) => {
  const {
    activeTab: contextActiveTab,
    setActiveTab: contextSetActiveTab,
    role,
  } = useApp();
  const { user, logout } = useAuth();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isMapelAccordionOpen, setIsMapelAccordionOpen] = useState<boolean>(true);
  const [activeSubMapel, setActiveSubMapel] = useState<'subjects' | 'schedule'>('subjects');

  const currentActiveTab = propActiveTab !== undefined ? propActiveTab : contextActiveTab;
  const currentSetActiveTab = propSetActiveTab !== undefined ? propSetActiveTab : contextSetActiveTab;

  const isMapelActive = currentActiveTab === 'mata-pelajaran' || currentActiveTab === 'jadwal';

  const handleOpenProfile = () => {
    if (onOpenProfileModal) {
      onOpenProfileModal();
    } else {
      setIsProfileModalOpen(true);
    }
  };

  const handleToggleMapelAccordion = () => {
    setIsMapelAccordionOpen(!isMapelAccordionOpen);
    if (!isMapelActive) {
      currentSetActiveTab('mata-pelajaran');
      window.dispatchEvent(new CustomEvent('pgri_switch_mapel_tab', { detail: 'subjects' }));
      setActiveSubMapel('subjects');
    }
  };

  const handleSelectSubMapel = (sub: 'subjects' | 'schedule') => {
    setActiveSubMapel(sub);
    setIsMapelAccordionOpen(true);
    currentSetActiveTab('mata-pelajaran');
    window.dispatchEvent(new CustomEvent('pgri_switch_mapel_tab', { detail: sub }));
  };

  // Determine role context from AuthContext or AppContext
  const isStudent = user?.role === 'student' || role === 'siswa';
  const isTeacher = user?.role === 'teacher' || role === 'guru';
  const isHomeroom = user?.role === 'homeroom' || role === 'wali_kelas';

  // Profile data per role
  const profileName = isStudent
    ? user?.name || 'Raditya Pratama'
    : isTeacher
    ? user?.name || 'M.Pd'
    : user?.name || 'Dra. Hj. Sri Wahyuni';

  const identifierText = isStudent
    ? `NISN: ${user?.nisnOrNip || '0098234120'}`
    : isTeacher
    ? `NIP: ${user?.nisnOrNip || '19850312'}`
    : `NIP: ${user?.nisnOrNip || '19780415'}`;

  const roleBadgeText = isStudent
    ? 'Siswa Kelas 8A'
    : isTeacher
    ? 'Guru Pengajar IPA'
    : 'Wali Kelas 8A';

  const scheduleSubtitle = isStudent
    ? 'Jadwal Pelajaran Kelas 8A'
    : isTeacher
    ? 'Jadwal Mengajar Pribadi'
    : 'Jadwal Kelas Binaan 8A';

  return (
    <>
      <aside className="w-64 shrink-0 hidden md:flex flex-col justify-between bg-slate-900 border-r border-slate-800 p-4 transition-colors text-slate-100 selection:bg-blue-600 selection:text-white">
        <div className="space-y-4">
          {/* 1. Dynamic User Profile Card */}
          <div
            onClick={handleOpenProfile}
            className="cursor-pointer transition-all duration-200 hover:bg-slate-800/90 border border-slate-700/60 hover:border-blue-500/50 rounded-xl p-3 group relative shadow-xs"
            title="Klik untuk membuka Pengaturan Akun, Edit Profil & Keamanan"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                  {isStudent ? (
                    <GraduationCap className="w-4 h-4" />
                  ) : isTeacher ? (
                    <BookOpen className="w-4 h-4" />
                  ) : (
                    <ShieldCheck className="w-4 h-4" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                    {profileName}
                  </div>
                  <div className="text-[10.5px] text-slate-400 font-mono truncate">
                    {identifierText}
                  </div>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[10.5px]">
              <span className="font-semibold text-blue-400 font-mono truncate max-w-[130px]">
                {roleBadgeText}
              </span>
              <span className="text-slate-400 font-mono">2026/27 Genap</span>
            </div>
          </div>

          {/* 2. Structured Slim Navigation Menu (Vertical & Clean, No Absolute Overlay Bug) */}
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Menu Pembelajaran
            </div>

            {/* Menu 1: Dashboard Utama */}
            <button
              type="button"
              onClick={() => currentSetActiveTab('dashboard')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all ${
                currentActiveTab === 'dashboard'
                  ? 'bg-blue-600 text-white font-medium shadow-md'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard
                  className={`w-4 h-4 shrink-0 ${
                    currentActiveTab === 'dashboard' ? 'text-white' : 'text-slate-400'
                  }`}
                />
                <span className="whitespace-nowrap font-medium">Dashboard Utama</span>
              </div>
            </button>

            {/* Menu 2: Mata Pelajaran (Accordion Collapsible) */}
            <div className="space-y-1">
              <button
                type="button"
                onClick={handleToggleMapelAccordion}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all ${
                  isMapelActive
                    ? 'bg-slate-800 text-white font-medium border border-blue-500/40 shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <BookOpen
                    className={`w-4 h-4 shrink-0 ${isMapelActive ? 'text-blue-400' : 'text-slate-400'}`}
                  />
                  <span className="whitespace-nowrap font-medium">Mata Pelajaran</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {isMapelAccordionOpen ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Accordion Sub-Menu (Sequential Vertically Below, No Overlap) */}
              {isMapelAccordionOpen && (
                <div className="pl-9 space-y-1 mt-1">
                  {/* Sub-item 1: Daftar Mapel & Modul */}
                  <button
                    type="button"
                    onClick={() => handleSelectSubMapel('subjects')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-between ${
                      isMapelActive && activeSubMapel === 'subjects'
                        ? 'bg-blue-600 text-white font-bold shadow-xs'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    <span className="truncate">Daftar Mapel & Modul</span>
                    <span
                      className={`text-[9.5px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                        isMapelActive && activeSubMapel === 'subjects'
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      10 Mapel
                    </span>
                  </button>

                  {/* Sub-item 2: Jadwal Pelajaran Mingguan */}
                  <button
                    type="button"
                    onClick={() => handleSelectSubMapel('schedule')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-between ${
                      isMapelActive && activeSubMapel === 'schedule'
                        ? 'bg-blue-600 text-white font-bold shadow-xs'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Calendar className="w-3 h-3 shrink-0" />
                      <span className="truncate">Jadwal Pelajaran Mingguan</span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Menu 3: Tugas & Praktikum */}
            <button
              type="button"
              onClick={() => currentSetActiveTab('tugas')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all ${
                currentActiveTab === 'tugas'
                  ? 'bg-blue-600 text-white font-medium shadow-md'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText
                  className={`w-4 h-4 shrink-0 ${
                    currentActiveTab === 'tugas' ? 'text-white' : 'text-slate-400'
                  }`}
                />
                <span className="whitespace-nowrap font-medium">
                  {isStudent ? 'Tugas & Praktikum' : 'Manajemen Tugas'}
                </span>
              </div>
              <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold shrink-0">
                2 Aktif
              </span>
            </button>

            {/* Menu 4: Kuis & CBT Digital */}
            <button
              type="button"
              onClick={() => currentSetActiveTab('cbt-ujian')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all ${
                currentActiveTab === 'cbt-ujian'
                  ? 'bg-blue-600 text-white font-medium shadow-md'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <HelpCircle
                  className={`w-4 h-4 shrink-0 ${
                    currentActiveTab === 'cbt-ujian' ? 'text-white' : 'text-slate-400'
                  }`}
                />
                <span className="whitespace-nowrap font-medium">Kuis & CBT Digital</span>
              </div>
              <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold shrink-0">
                CBT Live
              </span>
            </button>

            {/* Menu 5: Rapor & Nilai Saya / Pantauan Akademik */}
            <button
              type="button"
              onClick={() => currentSetActiveTab('pantauan-akademik')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all ${
                currentActiveTab === 'pantauan-akademik'
                  ? 'bg-blue-600 text-white font-medium shadow-md'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Award
                  className={`w-4 h-4 shrink-0 ${
                    currentActiveTab === 'pantauan-akademik' ? 'text-white' : 'text-slate-400'
                  }`}
                />
                <span className="whitespace-nowrap font-medium">
                  {isStudent ? 'Rapor & Nilai Saya' : 'Pantauan Akademik'}
                </span>
              </div>
              <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold shrink-0">
                Real-Time
              </span>
            </button>

            {/* Menu 6: Presensi & Absensi */}
            <button
              type="button"
              onClick={() => currentSetActiveTab('presensi')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all ${
                currentActiveTab === 'presensi'
                  ? 'bg-blue-600 text-white font-medium shadow-md'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <CheckSquare
                  className={`w-4 h-4 shrink-0 ${
                    currentActiveTab === 'presensi' ? 'text-white' : 'text-slate-400'
                  }`}
                />
                <span className="whitespace-nowrap font-medium">
                  {isStudent ? 'Rekap Kehadiran' : 'Presensi & Absensi'}
                </span>
              </div>
            </button>

            {/* Menu 7: Pengumuman Sekolah */}
            <button
              type="button"
              onClick={() => currentSetActiveTab('pengumuman')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all ${
                currentActiveTab === 'pengumuman'
                  ? 'bg-blue-600 text-white font-medium shadow-md'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Bell
                  className={`w-4 h-4 shrink-0 ${
                    currentActiveTab === 'pengumuman' ? 'text-white' : 'text-slate-400'
                  }`}
                />
                <span className="whitespace-nowrap font-medium">Pengumuman Sekolah</span>
              </div>
              <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold shrink-0">
                2 Baru
              </span>
            </button>
          </div>
        </div>

        {/* Bottom Educational Quality Footer */}
        <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-200 font-semibold text-xs">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Kurikulum Merdeka</span>
            </div>
            <button
              type="button"
              onClick={logout}
              className="text-slate-400 hover:text-red-400 transition-colors p-1 rounded-md"
              title="Keluar / Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[10px] leading-relaxed text-slate-500">
            SMP PGRI 1 KOTA HARAPAN · Terakreditasi A (Unggul)
          </p>
        </div>
      </aside>

      {/* Account Settings & Profile Edit Modal */}
      <UserProfileEditModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
};
