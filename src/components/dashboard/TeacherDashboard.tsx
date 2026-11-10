import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  FileCheck2,
  TrendingUp,
  CalendarCheck,
  Plus,
  Megaphone,
  FileQuestion,
  CheckCircle2,
  AlertTriangle,
  Award,
  Clock,
  Sparkles
} from 'lucide-react';
import { NewAssignmentModal } from '../modals/NewAssignmentModal';
import { NewAnnouncementModal } from '../modals/NewAnnouncementModal';
import { GradeSubmissionModal } from '../modals/GradeSubmissionModal';
import { DashboardHero } from './DashboardHero';

export const TeacherDashboard: React.FC = () => {
  const {
    activeUser,
    assignments,
    classStudents,
    attendanceRecords,
    setActiveTab
  } = useApp();

  const [isNewAssignmentOpen, setIsNewAssignmentOpen] = useState(false);
  const [isNewAnnouncementOpen, setIsNewAnnouncementOpen] = useState(false);
  const [gradingTarget, setGradingTarget] = useState<{
    assignmentId: string;
    studentId: string;
    studentName: string;
    assignmentTitle: string;
    submittedFile?: string;
    studentNote?: string;
  } | null>(null);

  // Submissions needing grading
  const pendingGradingSubmissions: Array<{
    assignmentId: string;
    assignmentTitle: string;
    subjectName: string;
    studentId: string;
    studentName: string;
    studentNisn: string;
    submittedAt: string;
    fileName?: string;
    studentNote?: string;
  }> = [];

  assignments.forEach((asg) => {
    asg.submissions.forEach((sub) => {
      if (sub.status === 'terkumpul') {
        pendingGradingSubmissions.push({
          assignmentId: asg.id,
          assignmentTitle: asg.title,
          subjectName: asg.subjectName,
          studentId: sub.studentId,
          studentName: sub.studentName,
          studentNisn: sub.studentNisn,
          submittedAt: sub.submittedAt,
          fileName: sub.fileName,
          studentNote: sub.studentNote,
        });
      }
    });
  });

  const studentsNeedingRemedial = classStudents.filter((s) => s.avgScore < 75);
  const studentsTopHonors = classStudents.filter((s) => s.avgScore >= 88);

  return (
    <div className="space-y-6">
      {/* Dynamic Hero Banner from AuthContext */}
      <DashboardHero
        actionButtons={
          <>
            <button
              onClick={() => setIsNewAssignmentOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Tugas</span>
            </button>
            <button
              onClick={() => setIsNewAnnouncementOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <Megaphone className="w-4 h-4 text-blue-300" />
              <span>Siarkan Info</span>
            </button>
            <button
              onClick={() => setActiveTab('cbt-ujian')}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <FileQuestion className="w-4 h-4 text-emerald-300" />
              <span>Bank Soal CBT</span>
            </button>
          </>
        }
      />

      {/* 4-Column KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Class Students */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-2">
            <span>Siswa Binaan Kelas</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
              32
            </span>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
              Kelas 8A
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Wali Kelas: Dra. Hj. Sri Wahyuni
          </div>
        </div>

        {/* KPI 2: Submissions Needing Grading */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-2">
            <span>Tugas Perlu Dinilai</span>
            <FileCheck2 className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
              {pendingGradingSubmissions.length}
            </span>
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              Antrean Koreksi
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Segera beri skor & catatan evaluasi
          </div>
        </div>

        {/* KPI 3: Class Average */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-2">
            <span>Rata-Rata Kelas 8A</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
              83.2
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              93% Tuntas
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Ambang KKM Sekolah: 75.0
          </div>
        </div>

        {/* KPI 4: Attendance Today */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-2">
            <span>Presensi Hari Ini</span>
            <CalendarCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
              96.8%
            </span>
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              Tertib
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Hadir: 29 · Izin: 1 · Sakit: 1 · Alpa: 1
          </div>
        </div>
      </div>

      {/* Main Grid: Assignment Grading Queue & Academic Health Check */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Submissions Queue with Quick Grading */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Antrean Koreksi & Penilaian Tugas Siswa
              </h2>
              <div className="text-[11px] text-slate-500">
                Periksa berkas tugas siswa, berikan nilai 0-100 dan masukan membangun
              </div>
            </div>
            <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-semibold">
              {pendingGradingSubmissions.length} Berkas Menunggu
            </span>
          </div>

          {pendingGradingSubmissions.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Semua Tugas Telah Selesai Dinilai!
              </div>
              <div className="text-[11px]">
                Tidak ada tugas siswa yang belum diperiksa.
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingGradingSubmissions.map((sub) => (
                <div
                  key={`${sub.assignmentId}_${sub.studentId}`}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {sub.studentName}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        NISN: {sub.studentNisn}
                      </span>
                    </div>
                    <div className="text-xs font-medium text-blue-600 dark:text-blue-400">
                      {sub.assignmentTitle}
                    </div>
                    {sub.studentNote && (
                      <div className="text-[11px] text-slate-600 dark:text-slate-400 italic">
                        "{sub.studentNote}"
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
                      <span>File: {sub.fileName || 'Berkas.pdf'}</span>
                      <span>·</span>
                      <span>Masuk: {sub.submittedAt}</span>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      setGradingTarget({
                        assignmentId: sub.assignmentId,
                        studentId: sub.studentId,
                        studentName: sub.studentName,
                        assignmentTitle: sub.assignmentTitle,
                        submittedFile: sub.fileName,
                        studentNote: sub.studentNote,
                      })
                    }
                    className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors shrink-0"
                  >
                    Beri Nilai & Masukan
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Class Academic Health (Remedial Alert & Top Honors) */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Status Ketuntasan KKM Kelas 8A
            </h2>
            <button
              onClick={() => setActiveTab('pantauan-akademik')}
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              Lihat Rapor
            </button>
          </div>

          {/* Remedial Warning Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Perlu Program Remedial (Nilai &lt; 75)</span>
            </div>
            {studentsNeedingRemedial.length === 0 ? (
              <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 text-xs">
                Semua siswa Kelas 8A telah mencapai standar KKM!
              </div>
            ) : (
              studentsNeedingRemedial.map((st) => (
                <div
                  key={st.id}
                  className="p-2.5 rounded-lg bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">
                      {st.name}
                    </span>
                    <span className="text-[11px] text-slate-500">Peringkat #{st.rank}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-rose-600">
                      {st.avgScore}
                    </span>
                    <span className="block text-[10px] text-rose-600">Remedial</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Top Honors Section */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
              <Award className="w-3.5 h-3.5" />
              <span>Siswa Berprestasi Unggul (Predikat A)</span>
            </div>
            <div className="space-y-1.5">
              {studentsTopHonors.slice(0, 3).map((st) => (
                <div
                  key={st.id}
                  className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 text-[10px] font-bold flex items-center justify-center font-mono">
                      #{st.rank}
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[120px]">
                      {st.name}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {st.avgScore}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isNewAssignmentOpen && (
        <NewAssignmentModal onClose={() => setIsNewAssignmentOpen(false)} />
      )}
      {isNewAnnouncementOpen && (
        <NewAnnouncementModal onClose={() => setIsNewAnnouncementOpen(false)} />
      )}
      {gradingTarget && (
        <GradeSubmissionModal
          target={gradingTarget}
          onClose={() => setGradingTarget(null)}
        />
      )}
    </div>
  );
};
