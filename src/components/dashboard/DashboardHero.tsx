import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  GraduationCap,
  UserCheck,
  ShieldCheck,
  BookOpen,
  Award
} from 'lucide-react';

interface DashboardHeroProps {
  actionButtons?: React.ReactNode;
}

export const DashboardHero: React.FC<DashboardHeroProps> = ({ actionButtons }) => {
  const { user } = useAuth();
  const { role } = useApp();

  // Role resolution with fallback
  const currentRole = user?.role || (role === 'siswa' ? 'student' : role === 'guru' ? 'teacher' : 'homeroom');

  // Dynamic user data with safe fallbacks
  const userName = user?.name || (currentRole === 'student' ? 'Raditya Pratama' : currentRole === 'teacher' ? 'M.Pd' : 'Dra. Hj. Sri Wahyuni');
  const userIdentifier = user?.nisnOrNip || (currentRole === 'student' ? '0098234120' : currentRole === 'teacher' ? '19850312' : '19780415');
  const userClass = user?.classInfo || (currentRole === 'student' ? 'Kelas 8A' : currentRole === 'teacher' ? 'Guru Pengajar IPA' : 'Wali Kelas 8A');

  // Role-specific badge, title, and description
  let badgeLabel = 'Portal Siswa Terpadu SMP PGRI 1';
  let badgeIcon = <GraduationCap className="w-3.5 h-3.5 text-blue-300" />;
  let bannerTitle = `Semangat Belajar, ${userName}!`;
  let bannerDescription = `Anda terdaftar di ${userClass} (NISN: ${userIdentifier}). Pantau tugas, kuis CBT, dan perkembangan nilai akademik Anda secara real-time di bawah ini.`;

  if (currentRole === 'teacher') {
    badgeLabel = 'Portal Pendidik SMP PGRI 1';
    badgeIcon = <BookOpen className="w-3.5 h-3.5 text-emerald-300" />;
    bannerTitle = `Selamat Bertugas, ${userName}!`;
    bannerDescription = `Kelola materi, evaluasi tugas mandiri, pantau presensi kehadiran, dan tingkatkan efektivitas pembelajaran siswa Anda secara real-time (NIP: ${userIdentifier}).`;
  } else if (currentRole === 'homeroom') {
    badgeLabel = 'Administrasi Wali Kelas 8A';
    badgeIcon = <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />;
    bannerTitle = `Selamat Bertugas, ${userName}!`;
    bannerDescription = `Kelola materi, evaluasi tugas mandiri, pantau presensi kehadiran, dan pantau ketuntasan KKM siswa binaan Anda secara real-time (NIP: ${userIdentifier}).`;
  }

  return (
    <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 md:p-8 rounded-2xl shadow-md border border-slate-800 relative overflow-hidden">
      {/* Background Accent Grid / Glow */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-32 -bottom-20 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1 max-w-3xl">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="flex items-center gap-1.5">
              {badgeIcon}
              <span>{badgeLabel}</span>
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
            {bannerTitle}
          </h1>

          {/* Subtitle / Description */}
          <p className="text-slate-300 text-sm md:text-base max-w-3xl leading-relaxed">
            {bannerDescription}
          </p>
        </div>

        {/* Optional Action Buttons Slot */}
        {actionButtons && (
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start md:self-auto">
            {actionButtons}
          </div>
        )}
      </div>
    </div>
  );
};
