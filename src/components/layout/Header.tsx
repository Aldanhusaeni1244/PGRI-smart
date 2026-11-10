import React, { useState, useRef, useEffect } from 'react';
import {
  LogOut,
  ChevronDown,
  GraduationCap,
  BookOpen,
  ShieldCheck,
  Bell,
  Sun,
  Moon,
  User,
  SwitchCamera,
  CheckCircle2
} from 'lucide-react';
import { useAuth, AuthRole } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { SCHOOL_PROFILE } from '../../data/mockData';

interface HeaderProps {
  onOpenNotifications?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNotifications }) => {
  const { user, logout, switchRole } = useAuth();
  const {
    setRole,
    activeTab,
    setActiveTab,
    unreadCount,
    darkMode,
    toggleDarkMode,
  } = useApp();

  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
        setRoleSwitcherOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwitchRole = (newRole: AuthRole) => {
    switchRole(newRole);
    // Also sync with AppContext role
    if (newRole === 'student') setRole('siswa');
    else if (newRole === 'teacher') setRole('guru');
    else if (newRole === 'homeroom') setRole('wali_kelas');
    setRoleSwitcherOpen(false);
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
  };

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'mata-pelajaran', label: 'Mata Pelajaran' },
    { id: 'tugas', label: 'Tugas' },
    { id: 'cbt-ujian', label: 'Kuis & CBT' },
    { id: 'pantauan-akademik', label: 'Pantauan Akademik' },
    { id: 'pengumuman', label: 'Pengumuman' },
  ];

  const currentRole = user?.role || 'student';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 px-4 sm:px-6 py-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      {/* Brand & Institution Info */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg"
        >
          <img
            src={SCHOOL_PROFILE.badgeUrl}
            alt="Logo SMP PGRI 1"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover shadow-xs ring-1 ring-blue-500/20"
          />
          <div className="leading-tight">
            <span className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap block">
              SMP PGRI 1
            </span>
            <span className="text-[10px] sm:text-[11px] font-semibold text-blue-700 dark:text-blue-400 block whitespace-nowrap">
              Portal Akademik & E-Learning
            </span>
          </div>
        </button>
      </div>

      {/* Main Desktop Navigation Links */}
      <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-slate-600 dark:text-slate-300">
        {navLinks.map((link) => {
          const isActive = activeTab === link.id;
          return (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`py-1 relative transition-colors whitespace-nowrap shrink-0 ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-bold'
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

      {/* Right Controls: Notifications, Theme, Profile Dropdown */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Notification Bell */}
        {onOpenNotifications && (
          <button
            onClick={onOpenNotifications}
            className="relative p-2 text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Pusat Notifikasi"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-bold text-white bg-rose-600 rounded-full font-mono">
                {unreadCount}
              </span>
            )}
          </button>
        )}

        {/* Dark / Light Mode Switch */}
        <button
          onClick={toggleDarkMode}
          className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={darkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* User Profile & Dropdown Menu */}
        <div className="relative pl-1 sm:pl-2 border-l border-slate-200 dark:border-slate-800" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left focus:outline-none"
            aria-expanded={dropdownOpen}
          >
            <img
              src={user?.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=Raditya'}
              alt={user?.name || 'User Profile'}
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 object-cover"
            />
            <div className="hidden sm:block leading-tight text-left">
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate max-w-[140px]">
                {user?.name || 'Raditya Pratama'}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`text-[9.5px] font-bold px-1.5 py-0.2 rounded font-mono ${
                    currentRole === 'student'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                      : currentRole === 'teacher'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                  }`}
                >
                  {currentRole === 'student' ? 'SISWA' : currentRole === 'teacher' ? 'GURU' : 'WALI KELAS'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono hidden md:inline">
                  {user?.nisnOrNip}
                </span>
              </div>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              {/* User Bio Header */}
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {user?.name}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {currentRole === 'student' ? 'NISN: ' : 'NIP: '}
                  <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                    {user?.nisnOrNip}
                  </span>
                </div>
                <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                  {user?.classInfo}
                </div>
              </div>

              {/* Sub-menu: Switch Role Option */}
              <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <SwitchCamera className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Ganti Peran Pengguna</span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${roleSwitcherOpen ? 'rotate-180' : ''}`} />
                </button>

                {roleSwitcherOpen && (
                  <div className="mt-1 space-y-1 pl-2">
                    <button
                      type="button"
                      onClick={() => handleSwitchRole('student')}
                      className={`w-full flex items-center justify-between px-3 py-1.5 text-[11px] rounded-lg transition-colors ${
                        currentRole === 'student'
                          ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                        <span>Siswa (Raditya)</span>
                      </div>
                      {currentRole === 'student' && <CheckCircle2 className="w-3 h-3 text-blue-600" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSwitchRole('teacher')}
                      className={`w-full flex items-center justify-between px-3 py-1.5 text-[11px] rounded-lg transition-colors ${
                        currentRole === 'teacher'
                          ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Guru Pengajar (IPA)</span>
                      </div>
                      {currentRole === 'teacher' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSwitchRole('homeroom')}
                      className={`w-full flex items-center justify-between px-3 py-1.5 text-[11px] rounded-lg transition-colors ${
                        currentRole === 'homeroom'
                          ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                        <span>Wali Kelas 8A</span>
                      </div>
                      {currentRole === 'homeroom' && <CheckCircle2 className="w-3 h-3 text-amber-600" />}
                    </button>
                  </div>
                )}
              </div>

              {/* Logout Button (Red highlighted) */}
              <div className="p-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-red-600 dark:text-red-400" />
                  <span>Keluar / Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
