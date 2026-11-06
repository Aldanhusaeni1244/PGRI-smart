import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Bell,
  Sun,
  Moon,
  GraduationCap,
  ChevronDown,
  UserCheck,
  ShieldCheck,
  BookOpen,
  CheckCircle2,
  Volume2
} from 'lucide-react';

import { SCHOOL_PROFILE } from '../../data/mockData';

interface NavbarProps {
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenNotifications }) => {
  const {
    role,
    setRole,
    activeUser,
    activeTab,
    setActiveTab,
    unreadCount,
    darkMode,
    toggleDarkMode,
    playNotificationChime
  } = useApp();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'mata-pelajaran', label: 'Mata Pelajaran' },
    { id: 'tugas', label: 'Tugas' },
    { id: 'cbt-ujian', label: 'Kuis & CBT' },
    { id: 'pantauan-akademik', label: 'Pantauan Akademik' },
    { id: 'pengumuman', label: 'Pengumuman' },
  ];

  const handleRoleSelect = (newRole: UserRole) => {
    setRole(newRole);
    setRoleMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-6 px-6 py-3.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Zone 1: Brand Wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg"
        >
          <img
            src={SCHOOL_PROFILE.badgeUrl}
            alt="Logo SMP PGRI"
            referrerPolicy="no-referrer"
            className="w-10 h-10 rounded-full object-cover shadow-sm ring-1 ring-amber-500/30"
          />
          <div className="leading-tight">
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap block">
              SMP PGRI 1
            </span>
            <span className="text-[11px] font-medium text-blue-700 dark:text-blue-400 block whitespace-nowrap">
              E-Learning & Akademik
            </span>
          </div>
        </button>
      </div>

      {/* Zone 2: Navigation Links (single-line, subtle hover underlines) */}
      <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
        {navLinks.map((link) => {
          const isActive = activeTab === link.id;
          return (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`py-1 relative transition-colors whitespace-nowrap shrink-0 ${
                isActive
                  ? 'text-blue-700 dark:text-blue-400 font-semibold'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {link.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: Primary Action & Controls (Role Switcher, Notifications, Theme, Profile) */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900 hover:bg-blue-100 transition-colors whitespace-nowrap shrink-0"
            title="Ganti Peran Pengguna"
          >
            {role === 'siswa' && <GraduationCap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
            {role === 'guru' && <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
            {role === 'wali_kelas' && <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
            <span>
              {role === 'siswa' ? 'Mode Siswa (Raditya)' : role === 'guru' ? 'Mode Guru (Dra. Sri)' : 'Wali Kelas / Kepsek'}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-2 z-50">
              <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Pilih Akses Pengguna
              </div>
              <button
                onClick={() => handleRoleSelect('siswa')}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                  role === 'siswa'
                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 font-medium'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-semibold">Siswa (Raditya Pratama)</div>
                    <div className="text-[11px] text-slate-500">Kelas 8A · NISN 0098234120</div>
                  </div>
                </div>
                {role === 'siswa' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
              </button>

              <button
                onClick={() => handleRoleSelect('guru')}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                  role === 'guru'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-medium'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className="font-semibold">Guru (Dra. Hj. Sri Wahyuni)</div>
                    <div className="text-[11px] text-slate-500">Guru IPA & Wali Kelas 8A</div>
                  </div>
                </div>
                {role === 'guru' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              </button>

              <button
                onClick={() => handleRoleSelect('wali_kelas')}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                  role === 'wali_kelas'
                    ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-medium'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <div>
                    <div className="font-semibold">Wali Kelas / Kepala Sekolah</div>
                    <div className="text-[11px] text-slate-500">Monitoring Kurikulum Merdeka</div>
                  </div>
                </div>
                {role === 'wali_kelas' && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
              </button>
            </div>
          )}
        </div>

        {/* Audio notification sound test icon */}
        <button
          onClick={playNotificationChime}
          className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Uji Suara Notifikasi"
        >
          <Volume2 className="w-4 h-4" />
        </button>

        {/* Notification Bell Button with Live Badge */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Buka Pusat Notifikasi"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-bold text-white bg-rose-600 rounded-full font-mono tabular-nums">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Dark / Light Mode Switch */}
        <button
          onClick={toggleDarkMode}
          className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={darkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* User Profile Thumbnail */}
        <div className="hidden sm:flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800">
          <img
            src={activeUser.avatarUrl}
            alt={activeUser.name}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 ring-1 ring-slate-300 dark:ring-slate-700"
          />
          <div className="hidden xl:block text-left">
            <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-tight">
              {activeUser.name}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
              {activeUser.className || activeUser.role}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
