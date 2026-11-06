import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Assignment } from '../../types';
import {
  FileCheck2,
  Plus,
  Clock,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  Send,
  Award,
  ChevronDown,
  Download,
  Eye,
  ExternalLink,
  UploadCloud,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { SubmitAssignmentModal } from '../modals/SubmitAssignmentModal';
import { NewAssignmentModal } from '../modals/NewAssignmentModal';
import { GradeSubmissionModal } from '../modals/GradeSubmissionModal';
import { PdfDocumentViewer, PdfDocumentData, openPdfInNewTab } from '../documents/PdfDocumentViewer';

export const AssignmentManager: React.FC = () => {
  const {
    role,
    activeUser,
    assignments,
    subjects,
    showToast,
    customPdfs,
    uploadCustomPdf,
    resetCustomPdf,
    getAssignmentPdfUrl,
  } = useApp();

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleCustomPdfUpload = async (assignmentId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      showToast('Harap pilih berkas PDF (.pdf)', 'warning');
      return;
    }
    await uploadCustomPdf(assignmentId, file);
    e.target.value = '';
  };

  const [activePdfDoc, setActivePdfDoc] = useState<PdfDocumentData | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [submittingAssignment, setSubmittingAssignment] = useState<Assignment | null>(null);
  const [isNewAssignmentOpen, setIsNewAssignmentOpen] = useState(false);
  const [gradingTarget, setGradingTarget] = useState<{
    assignmentId: string;
    studentId: string;
    studentName: string;
    assignmentTitle: string;
    submittedFile?: string;
    studentNote?: string;
  } | null>(null);

  // Filter assignments
  const filteredAssignments = assignments.filter((asg) => {
    // Subject filter
    if (selectedSubject !== 'all' && asg.subjectId !== selectedSubject) return false;

    // Search query
    if (searchQuery && !asg.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;

    // Status filter
    if (role === 'siswa') {
      const mySub = asg.submissions.find((s) => s.studentId === activeUser.id);
      if (statusFilter === 'pending' && mySub) return false;
      if (statusFilter === 'submitted' && (!mySub || mySub.status !== 'terkumpul')) return false;
      if (statusFilter === 'graded' && (!mySub || mySub.status !== 'dinilai')) return false;
    } else {
      // Guru & Wali Kelas
      const hasPendingReview = asg.submissions.some((s) => s.status === 'terkumpul');
      const hasGraded = asg.submissions.some((s) => s.status === 'dinilai');
      if (statusFilter === 'submitted' && !hasPendingReview) return false;
      if (statusFilter === 'graded' && !hasGraded) return false;
      if (statusFilter === 'pending' && asg.submissions.length >= 10 && !hasPendingReview) return false;
    }

    return true;
  });

  if (activePdfDoc) {
    return (
      <PdfDocumentViewer
        document={activePdfDoc}
        onBack={() => setActivePdfDoc(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <FileCheck2 className="w-4 h-4" />
            <span>Manajemen Tugas & Praktikum Terpadu</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            {role === 'siswa' ? 'Daftar Tugas & Pengumpulan' : 'Manajemen & Penilaian Tugas Siswa'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Terhubung otomatis dengan pembobotan nilai rapor semester dan notifikasi tenggat waktu.
          </p>
        </div>

        {role === 'guru' && (
          <button
            onClick={() => setIsNewAssignmentOpen(true)}
            className="px-4 py-2.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors flex items-center gap-2 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Tugas Baru</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'Semua Tugas' },
            { id: 'pending', label: 'Belum Terkumpul' },
            { id: 'submitted', label: 'Menunggu Koreksi' },
            { id: 'graded', label: 'Sudah Dinilai' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as typeof statusFilter)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                statusFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Subject dropdown + Search */}
        <div className="flex items-center gap-2">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="p-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
          >
            <option value="all">Semua Mata Pelajaran</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari judul tugas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-7 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 w-44"
            />
          </div>
        </div>
      </div>

      {/* Assignment List Cards */}
      <div className="space-y-4">
        {filteredAssignments.length === 0 ? (
          <div className="py-16 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <FileCheck2 className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Tidak Ada Tugas yang Sesuai Filter
            </div>
            <div className="text-xs">Coba ubah status atau kategori mata pelajaran</div>
          </div>
        ) : (
          filteredAssignments.map((asg) => {
            const mySubmission = asg.submissions.find((s) => s.studentId === activeUser.id);
            const isSubmitted = !!mySubmission;
            const isGraded = mySubmission?.status === 'dinilai';

            return (
              <div
                key={asg.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                        {asg.subjectName}
                      </span>
                      <span className="text-[11px] text-slate-400">·</span>
                      <span className="text-xs text-slate-500 font-mono">
                        {asg.targetClass}
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                      {asg.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="text-xs font-mono px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      Bobot: {asg.weightPercent}%
                    </span>
                    <span className="text-xs font-mono px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      Maksimal: {asg.maxScore} Poin
                    </span>
                  </div>
                </div>

                {/* Status badges for Guru and Wali Kelas */}
                {(role === 'guru' || role === 'wali_kelas') && (() => {
                  const pendingCount = asg.submissions.filter((s) => s.status === 'terkumpul').length;
                  const gradedCount = asg.submissions.filter((s) => s.status === 'dinilai').length;
                  return (
                    <div className="flex items-center gap-2 flex-wrap">
                      {pendingCount > 0 && (
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 flex items-center gap-1 border border-amber-300 dark:border-amber-800">
                          <Clock className="w-3 h-3 text-amber-600" />
                          {pendingCount} Menunggu Koreksi
                        </span>
                      )}
                      {gradedCount > 0 && (
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 flex items-center gap-1 border border-emerald-300 dark:border-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          {gradedCount} Sudah Dinilai
                        </span>
                      )}
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        Total {asg.submissions.length} Pengumpulan
                      </span>
                    </div>
                  );
                })()}

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {asg.description}
                </p>

                {/* Guide attachment PDF viewer card */}
                {asg.attachmentName && (() => {
                  const customRecord = customPdfs[asg.id];
                  const isCustom = !!customRecord;
                  const currentFileName = customRecord?.fileName || asg.attachmentName;
                  const directPdfPath = getAssignmentPdfUrl(asg.id, currentFileName);

                  return (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 hover:bg-blue-100/70 dark:hover:bg-blue-900/50 hover:border-blue-400 dark:hover:border-blue-700 transition-all shadow-xs">
                      {/* Hidden File Input for uploading custom PDF for this assignment */}
                      <input
                        type="file"
                        ref={(el) => {
                          fileInputRefs.current[asg.id] = el;
                        }}
                        accept="application/pdf,.pdf"
                        className="hidden"
                        onChange={(e) => handleCustomPdfUpload(asg.id, e)}
                      />

                      <div
                        onClick={() =>
                          setActivePdfDoc({
                            assignmentId: asg.id,
                            fileName: currentFileName,
                            title: asg.title,
                            subjectName: asg.subjectName,
                            targetClass: asg.targetClass,
                            dueDate: asg.dueDate,
                            defaultTemplateName: asg.attachmentName,
                          })
                        }
                        className="group cursor-pointer flex items-center gap-3 min-w-0 flex-1"
                        title="Klik untuk membuka dokumen PDF di halaman baca"
                      >
                        <div className="p-2.5 rounded-xl bg-blue-600 text-white shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate max-w-[200px] sm:max-w-[320px]">
                              {currentFileName}
                            </span>
                            {isCustom ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white font-mono shrink-0 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                PDF Mandiri ({customRecord?.sizeKb} KB)
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-200/80 dark:bg-blue-800 text-blue-900 dark:text-blue-100 font-mono shrink-0">
                                PDF Kurikulum Resmi
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex flex-wrap items-center gap-2">
                            <span>Materi Terisi Lengkap</span>
                            <span>·</span>
                            <span>Dokumen Asli (.PDF)</span>
                            <span>·</span>
                            <span className="text-blue-600 dark:text-blue-400 font-semibold group-hover:underline">
                              Buka Dokumen PDF Asli →
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center flex-wrap gap-2 shrink-0 self-start sm:self-auto">
                        {/* Open PDF inside in-app viewer */}
                        <button
                          type="button"
                          onClick={() =>
                            setActivePdfDoc({
                              assignmentId: asg.id,
                              fileName: currentFileName,
                              title: asg.title,
                              subjectName: asg.subjectName,
                              targetClass: asg.targetClass,
                              dueDate: asg.dueDate,
                              defaultTemplateName: asg.attachmentName,
                            })
                          }
                          className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
                          title="Buka dokumen PDF di dalam sistem"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Buka PDF</span>
                        </button>

                        {/* Upload / Replace with own PDF */}
                        <button
                          type="button"
                          onClick={() => fileInputRefs.current[asg.id]?.click()}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors flex items-center gap-1.5"
                          title="Ganti berkas ini dengan PDF buatan Anda sendiri dari perangkat"
                        >
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>Ganti PDF</span>
                        </button>

                        {/* Reset button if custom */}
                        {isCustom && (
                          <button
                            type="button"
                            onClick={() => resetCustomPdf(asg.id, asg.attachmentName)}
                            className="p-1.5 text-xs rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                            title="Kembalikan ke PDF kurikulum bawaan"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Direct Native Browser Tab with title */}
                        <button
                          type="button"
                          onClick={() => openPdfInNewTab(directPdfPath, currentFileName)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
                          title="Buka langsung file PDF asli di tab baru peramban dengan judul resmi"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                          <span className="hidden sm:inline">Tab Baru</span>
                        </button>

                        {/* Download button */}
                        <a
                          href={directPdfPath}
                          download={currentFileName}
                          className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors"
                          title="Unduh berkas PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  );
                })()}

                {/* Submission State Box (Role: Siswa) */}
                {role === 'siswa' && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-500 font-mono">
                        Batas Tenggat: <strong>{asg.dueDate} WIB</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {isGraded ? (
                        <div className="flex items-center gap-3 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                          <div>
                            <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">
                              Sudah Dinilai Guru:
                            </div>
                            <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                              Skor: {mySubmission.score}/100 · "{mySubmission.feedback}"
                            </div>
                          </div>
                          <Award className="w-5 h-5 text-emerald-600 shrink-0" />
                        </div>
                      ) : isSubmitted ? (
                        <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-medium">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Terkumpul ({mySubmission.submittedAt}) · Menunggu Nilai</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSubmittingAssignment(asg)}
                          className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Kirim Tugas Sekarang</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Submissions List Box (Role: Guru & Wali Kelas) */}
                {(role === 'guru' || role === 'wali_kelas') && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        Pengumpulan Siswa Kelas ({asg.submissions.length} Siswa Mengumpulkan)
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        Tenggat: {asg.dueDate}
                      </span>
                    </div>

                    {asg.submissions.length === 0 ? (
                      <div className="text-xs text-slate-400 italic">
                        Belum ada siswa yang mengunggah tugas untuk topik ini.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {asg.submissions.map((sub) => (
                          <div
                            key={sub.studentId}
                            className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                          >
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white">
                                {sub.studentName} ({sub.studentNisn})
                              </div>
                              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 flex-wrap">
                                <span>Berkas:</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setActivePdfDoc({
                                      fileName: sub.fileName || 'Laporan_Siswa.pdf',
                                      title: `${asg.title} - ${sub.studentName}`,
                                      subjectName: asg.subjectName,
                                      targetClass: asg.targetClass,
                                      dueDate: asg.dueDate,
                                    })
                                  }
                                  className="font-mono text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                                  title="Buka berkas tugas siswa di halaman PDF"
                                >
                                  <FileText className="w-3 h-3" />
                                  <span>{sub.fileName} (Buka PDF)</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    openPdfInNewTab(
                                      sub.fileUrl || `/documents/${sub.fileName || 'Lembar_Kerja_Tugas.pdf'}`,
                                      sub.fileName || `${asg.title}_${sub.studentName}.pdf`
                                    )
                                  }
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center gap-1 transition-colors"
                                  title="Buka di tab baru peramban dengan judul resmi"
                                >
                                  <ExternalLink className="w-2.5 h-2.5 text-blue-600" />
                                  <span>Tab Baru</span>
                                </button>
                                <span>·</span>
                                <span>Diserahkan: {sub.submittedAt}</span>
                              </div>
                              {sub.studentNote && (
                                <div className="text-[11px] text-slate-600 dark:text-slate-400 italic">
                                  Catatan Siswa: "{sub.studentNote}"
                                </div>
                              )}
                              {sub.feedback && (
                                <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                                  Masukan Guru: "{sub.feedback}"
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {sub.status === 'dinilai' ? (
                                <div className="flex items-center gap-2">
                                  <div className="text-right">
                                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
                                      Nilai: {sub.score}/100
                                    </span>
                                    <span className="block text-[10px] text-emerald-600 mt-0.5">
                                      ✓ Sudah Dinilai
                                    </span>
                                  </div>
                                  {role === 'guru' && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setGradingTarget({
                                          assignmentId: asg.id,
                                          studentId: sub.studentId,
                                          studentName: sub.studentName,
                                          assignmentTitle: asg.title,
                                          submittedFile: sub.fileName,
                                          studentNote: sub.studentNote,
                                        })
                                      }
                                      className="px-2 py-1 text-[11px] font-medium rounded text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                                      title="Koreksi ulang nilai atau masukan"
                                    >
                                      Ubah
                                    </button>
                                  )}
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800">
                                    Menunggu Koreksi
                                  </span>
                                  {role === 'guru' && (
                                    <button
                                      onClick={() =>
                                        setGradingTarget({
                                          assignmentId: asg.id,
                                          studentId: sub.studentId,
                                          studentName: sub.studentName,
                                          assignmentTitle: asg.title,
                                          submittedFile: sub.fileName,
                                          studentNote: sub.studentNote,
                                        })
                                      }
                                      className="px-3 py-1.5 text-xs font-semibold rounded bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1 shadow-xs"
                                    >
                                      <Award className="w-3.5 h-3.5" />
                                      <span>Beri Nilai</span>
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modals */}
      {submittingAssignment && (
        <SubmitAssignmentModal
          assignment={submittingAssignment}
          onClose={() => setSubmittingAssignment(null)}
        />
      )}
      {isNewAssignmentOpen && (
        <NewAssignmentModal onClose={() => setIsNewAssignmentOpen(false)} />
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
