import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  Calendar,
  AlertCircle,
  ArrowRight,
  BookOpen,
  Send,
  Sparkles,
  ChevronRight,
  Check
} from 'lucide-react';
import { SubmitAssignmentModal } from '../modals/SubmitAssignmentModal';
import { SCHOOL_PROFILE } from '../../data/mockData';

export const StudentDashboard: React.FC = () => {
  const {
    activeUser,
    academicScores,
    assignments,
    quizzes,
    announcements,
    setActiveTab,
    setSelectedSubjectId
  } = useApp();

  const [submittingAssignmentId, setSubmittingAssignmentId] = useState<string | null>(null);

  // Compute stats
  const totalScores = academicScores.length;
  const avgScore =
    totalScores > 0
      ? (academicScores.reduce((acc, curr) => acc + curr.finalScore, 0) / totalScores).toFixed(1)
      : '0.0';

  const tuntasCount = academicScores.filter((s) => s.finalScore >= s.kkm).length;

  const urgentAssignments = assignments.filter((a) => {
    const isSubmitted = a.submissions.some((s) => s.studentId === activeUser.id);
    return !isSubmitted;
  });

  const selectedForSubmission = assignments.find((a) => a.id === submittingAssignmentId);

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner with Campus Asset */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-lg">
        <img
          src={SCHOOL_PROFILE.campusBannerUrl}
          alt="Kampus SMP PGRI"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-blue-300 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Portal Akademik Siswa Terpadu SMP PGRI</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Semangat Belajar, {activeUser.name}!
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Anda terdaftar di <strong className="text-white">Kelas 8A</strong> (NISN: {activeUser.identifier}).
              Pantau tugas, kuis CBT, dan perkembangan nilai akademik Anda secara real-time di bawah ini.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('cbt-ujian')}
              className="px-4 py-2.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <span>Mulai Kuis CBT</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveTab('pantauan-akademik')}
              className="px-4 py-2.5 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors whitespace-nowrap"
            >
              Lihat Rapor Nilai
            </button>
          </div>
        </div>
      </div>

      {/* 4-Column KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: GPA / Average */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-2">
            <span>Rata-Rata Nilai</span>
            <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
              {avgScore}
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Peringkat 3
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Dari 32 siswa Kelas 8A
          </div>
        </div>

        {/* KPI 2: KKM Completion */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-2">
            <span>Ketuntasan KKM</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
              {tuntasCount}/{totalScores}
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              100% Tuntas
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Ambang KKM Sekolah: 75.0
          </div>
        </div>

        {/* KPI 3: Attendance Rate */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-2">
            <span>Presensi Kehadiran</span>
            <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
              98.2%
            </span>
            <span className="text-xs text-slate-500">Disiplin</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            30 Hadir · 1 Izin · 0 Alpa
          </div>
        </div>

        {/* KPI 4: Pending Assignments */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-2">
            <span>Tugas Perlu Dikirim</span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
              {urgentAssignments.length}
            </span>
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              Menunggu Tindakan
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Segera kumpulkan sebelum deadline
          </div>
        </div>
      </div>

      {/* Main Content 2-Column Split: Academic Progress vs Urgent Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Real-Time Academic Performance Bar Chart */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Pantauan Nilai Akademik Real-Time vs KKM (75)
              </h2>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Nilai akhir dihitung otomatis dari Tugas (30%), UH (20%), UTS (25%), dan UAS (25%)
              </div>
            </div>
            <button
              onClick={() => setActiveTab('pantauan-akademik')}
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Detail Rapor</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Subject Grade Distribution List with KKM Marker */}
          <div className="space-y-3.5 pt-1">
            {academicScores.slice(0, 6).map((item) => {
              const isAboveKKM = item.finalScore >= item.kkm;
              const widthPct = Math.min(100, Math.max(10, item.finalScore));
              return (
                <div key={item.subjectId} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {item.subjectName}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500">KKM: 75</span>
                      <span
                        className={`font-mono tabular-nums font-bold text-xs ${
                          item.finalScore >= 88
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : item.finalScore >= 78
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {item.finalScore.toFixed(1)} ({item.predicate})
                      </span>
                    </div>
                  </div>

                  {/* Visual Bar with KKM line at 75% */}
                  <div className="relative w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    {/* 75% KKM Indicator Line */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-slate-400 dark:bg-slate-500 z-10 opacity-70"
                      style={{ left: '75%' }}
                      title="Garis Batas KKM 75"
                    />
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.finalScore >= 88
                          ? 'bg-emerald-500'
                          : item.finalScore >= 78
                          ? 'bg-blue-600'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 text-right">
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              * Garis vertikal abu-abu menandai batas ketuntasan minimal KKM (75.0)
            </span>
          </div>
        </div>

        {/* Right 1 Col: Urgent Tasks & Deadlines */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Tenggat Tugas Terdekat
                </h2>
              </div>
              <span className="text-[11px] font-mono font-medium text-amber-600 dark:text-amber-400">
                {urgentAssignments.length} Tugas
              </span>
            </div>

            {urgentAssignments.length === 0 ? (
              <div className="py-8 text-center text-slate-400">
                <Check className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Semua Tugas Selesai Dikirim!
                </div>
                <div className="text-[11px]">Tidak ada tanggungan tugas saat ini.</div>
              </div>
            ) : (
              <div className="space-y-3">
                {urgentAssignments.map((asg) => (
                  <div
                    key={asg.id}
                    className="p-3 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/40 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 truncate">
                        {asg.subjectName}
                      </span>
                      <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400 shrink-0 font-medium">
                        Tenggat: {asg.dueDate.split(' ')[0]}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                      {asg.title}
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">
                      {asg.description}
                    </p>
                    <div className="pt-1 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">Bobot: {asg.weightPercent}%</span>
                      <button
                        onClick={() => setSubmittingAssignmentId(asg.id)}
                        className="px-2.5 py-1 text-xs font-semibold rounded bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" />
                        <span>Kirim Tugas</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('tugas')}
              className="w-full py-2 text-xs font-semibold text-center text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors"
            >
              Lihat Seluruh Arsip Tugas →
            </button>
          </div>
        </div>
      </div>

      {/* Row 3: Today's Class Schedule & School Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Jadwal Pelajaran Hari Ini */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Jadwal Belajar Hari Ini (Selasa, 03 Nov)
              </h2>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Kelas 8A</span>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between bg-blue-50/30 dark:bg-blue-950/20">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Matematika Terapan (SPLDV & Pythagoras)
                </div>
                <div className="text-[11px] text-slate-500">
                  Guru: Bambang Sudirman, S.Pd · Ruang Kelas 8A
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 block">
                  08:00 - 10:00
                </span>
                <span className="text-[10px] text-emerald-600 font-medium">Sedang Berlangsung</span>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Pendidikan Pancasila & PPKn
                </div>
                <div className="text-[11px] text-slate-500">
                  Guru: Suryadi, S.Pd, M.H. · Ruang Kelas 8A
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 block">
                  10:15 - 11:45
                </span>
                <span className="text-[10px] text-slate-400">Jam Berikutnya</span>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Kuis Harian Daring CBT IPA
                </div>
                <div className="text-[11px] text-slate-500">
                  Guru: Dra. Hj. Sri Wahyuni, M.Pd · Lab Komputer
                </div>
              </div>
              <div className="text-right">
                <button
                  onClick={() => setActiveTab('cbt-ujian')}
                  className="px-2.5 py-1 text-xs font-semibold rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Buka CBT
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* School Announcements Preview */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Warta & Pengumuman Resmi SMP PGRI
            </h2>
            <button
              onClick={() => setActiveTab('pengumuman')}
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              Lihat Semua
            </button>
          </div>

          <div className="space-y-3">
            {announcements.slice(0, 2).map((ann) => (
              <div
                key={ann.id}
                onClick={() => setActiveTab('pengumuman')}
                className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 cursor-pointer transition-colors space-y-1.5"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-blue-700 dark:text-blue-400">
                    {ann.category.toUpperCase()}
                  </span>
                  <span className="text-slate-400 font-mono">{ann.date}</span>
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                  {ann.title}
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">
                  {ann.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Submit Assignment Modal */}
      {selectedForSubmission && (
        <SubmitAssignmentModal
          assignment={selectedForSubmission}
          onClose={() => setSubmittingAssignmentId(null)}
        />
      )}
    </div>
  );
};
