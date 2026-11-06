import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  Award,
  AlertTriangle,
  Printer,
  Download,
  Search,
  CheckCircle2,
  FileSpreadsheet,
  Edit3,
  Check,
  X,
  Users,
  ArrowLeft
} from 'lucide-react';
import { SCHOOL_PROFILE } from '../../data/mockData';

export const AcademicMonitor: React.FC = () => {
  const {
    role,
    activeUser,
    academicScores,
    classStudents,
    updateAcademicScore,
    showToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingScoreId, setEditingScoreId] = useState<string | null>(null);
  const [tempScores, setTempScores] = useState<{
    tugas1: number;
    tugas2: number;
    ulanganHarian: number;
    uts: number;
    uas: number;
  }>({ tugas1: 0, tugas2: 0, ulanganHarian: 0, uts: 0, uas: 0 });

  const [showReportCardModal, setShowReportCardModal] = useState(false);

  // Compute GPA and statistics
  const totalSubjects = academicScores.length;
  const averageGpa =
    totalSubjects > 0
      ? (
          academicScores.reduce((acc, curr) => acc + curr.finalScore, 0) /
          totalSubjects
        ).toFixed(2)
      : '0.00';

  const tuntasSubjectsCount = academicScores.filter(
    (item) => item.finalScore >= item.kkm
  ).length;

  const filteredStudents = classStudents.filter(
    (st) =>
      st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.nisn.includes(searchQuery)
  );

  const startEditing = (scoreItem: typeof academicScores[0]) => {
    setEditingScoreId(scoreItem.subjectId);
    setTempScores({
      tugas1: scoreItem.tugas1,
      tugas2: scoreItem.tugas2,
      ulanganHarian: scoreItem.ulanganHarian,
      uts: scoreItem.uts,
      uas: scoreItem.uas,
    });
  };

  const saveEditing = (subjectId: string, studentId: string) => {
    updateAcademicScore(studentId, subjectId, 'tugas1', tempScores.tugas1);
    updateAcademicScore(studentId, subjectId, 'tugas2', tempScores.tugas2);
    updateAcademicScore(studentId, subjectId, 'ulanganHarian', tempScores.ulanganHarian);
    updateAcademicScore(studentId, subjectId, 'uts', tempScores.uts);
    updateAcademicScore(studentId, subjectId, 'uas', tempScores.uas);
    setEditingScoreId(null);
  };

  const cancelEditing = () => {
    setEditingScoreId(null);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Summary */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            <span>Sistem Pantauan Akademik Terintegrasi</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            {role === 'siswa'
              ? 'Buku Rapor & Capaian Akademik Siswa'
              : 'Pantauan Akademik Kelas 8A (Real-Time)'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Standar Kurikulum Merdeka SMP · Kriteria Ketuntasan Minimal (KKM):{' '}
            <strong className="text-slate-800 dark:text-slate-200">75.0</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowReportCardModal(true)}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Pratinjau Rapor Resmi</span>
          </button>
          <button
            onClick={() => showToast('Rekap nilai akademik berhasil diekspor (Format CSV/Excel)', 'success')}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Ekspor Nilai (CSV)</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs text-slate-500 mb-1">Indeks Prestasi / Rata-rata</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-mono tabular-nums">
            {averageGpa}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Skala 0 - 100</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs text-slate-500 mb-1">Status KKM Nasional</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
            {tuntasSubjectsCount}/{totalSubjects}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1">100% Mata Pelajaran Tuntas</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs text-slate-500 mb-1">Predikat Dominan</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-500 font-mono">
            A (Sangat Baik)
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Rentang 88.0 - 100.0</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs text-slate-500 mb-1">Peringkat di Kelas 8A</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono tabular-nums">
            #3 <span className="text-xs font-normal text-slate-400">/ 32</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Siswa Berprestasi Akademik</div>
        </div>
      </div>

      {/* Main Table: Comprehensive Grade Breakdown by Subject */}
      <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Buku Nilai Mata Pelajaran (Kurikulum Merdeka SMP PGRI)
            </h2>
            <div className="text-[11px] text-slate-500">
              {role === 'guru' || role === 'wali_kelas'
                ? 'Klik ikon pensil untuk mengubah komponen nilai secara real-time'
                : 'Data nilai disinkronkan otomatis dari tugas, kuis, dan ujian guru'}
            </div>
          </div>
          <div className="text-[11px] font-mono text-slate-500">
            Rumus: (T1×15%) + (T2×15%) + (UH×20%) + (UTS×25%) + (UAS×25%)
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 font-medium">
                <th className="py-3 px-3">Mata Pelajaran</th>
                <th className="py-3 px-2 text-center font-mono">KKM</th>
                <th className="py-3 px-2 text-right font-mono">Tugas 1 (15%)</th>
                <th className="py-3 px-2 text-right font-mono">Tugas 2 (15%)</th>
                <th className="py-3 px-2 text-right font-mono">UH (20%)</th>
                <th className="py-3 px-2 text-right font-mono">UTS (25%)</th>
                <th className="py-3 px-2 text-right font-mono">UAS (25%)</th>
                <th className="py-3 px-3 text-right font-mono font-bold text-slate-800 dark:text-slate-200">
                  Nilai Akhir
                </th>
                <th className="py-3 px-2 text-center">Predikat</th>
                <th className="py-3 px-3 text-center">Status</th>
                {(role === 'guru' || role === 'wali_kelas') && (
                  <th className="py-3 px-2 text-center">Aksi</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {academicScores.map((row) => {
                const isEditing = editingScoreId === row.subjectId;
                const isPass = row.finalScore >= row.kkm;

                return (
                  <tr
                    key={row.subjectId}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                      <div>{row.subjectName}</div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        {row.notes}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center font-mono text-slate-500">
                      {row.kkm}
                    </td>

                    {/* Editable / Static inputs */}
                    {isEditing ? (
                      <>
                        <td className="py-2 px-1 text-right">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={tempScores.tugas1}
                            onChange={(e) =>
                              setTempScores({ ...tempScores, tugas1: Number(e.target.value) })
                            }
                            className="w-14 px-1 py-1 text-right text-xs rounded border border-blue-400 bg-white dark:bg-slate-800 font-mono"
                          />
                        </td>
                        <td className="py-2 px-1 text-right">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={tempScores.tugas2}
                            onChange={(e) =>
                              setTempScores({ ...tempScores, tugas2: Number(e.target.value) })
                            }
                            className="w-14 px-1 py-1 text-right text-xs rounded border border-blue-400 bg-white dark:bg-slate-800 font-mono"
                          />
                        </td>
                        <td className="py-2 px-1 text-right">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={tempScores.ulanganHarian}
                            onChange={(e) =>
                              setTempScores({
                                ...tempScores,
                                ulanganHarian: Number(e.target.value),
                              })
                            }
                            className="w-14 px-1 py-1 text-right text-xs rounded border border-blue-400 bg-white dark:bg-slate-800 font-mono"
                          />
                        </td>
                        <td className="py-2 px-1 text-right">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={tempScores.uts}
                            onChange={(e) =>
                              setTempScores({ ...tempScores, uts: Number(e.target.value) })
                            }
                            className="w-14 px-1 py-1 text-right text-xs rounded border border-blue-400 bg-white dark:bg-slate-800 font-mono"
                          />
                        </td>
                        <td className="py-2 px-1 text-right">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={tempScores.uas}
                            onChange={(e) =>
                              setTempScores({ ...tempScores, uas: Number(e.target.value) })
                            }
                            className="w-14 px-1 py-1 text-right text-xs rounded border border-blue-400 bg-white dark:bg-slate-800 font-mono"
                          />
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-3 px-2 text-right font-mono tabular-nums text-slate-600 dark:text-slate-300">
                          {row.tugas1}
                        </td>
                        <td className="py-3 px-2 text-right font-mono tabular-nums text-slate-600 dark:text-slate-300">
                          {row.tugas2}
                        </td>
                        <td className="py-3 px-2 text-right font-mono tabular-nums text-slate-600 dark:text-slate-300">
                          {row.ulanganHarian}
                        </td>
                        <td className="py-3 px-2 text-right font-mono tabular-nums text-slate-600 dark:text-slate-300">
                          {row.uts}
                        </td>
                        <td className="py-3 px-2 text-right font-mono tabular-nums text-slate-600 dark:text-slate-300">
                          {row.uas}
                        </td>
                      </>
                    )}

                    {/* Final Score */}
                    <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-sm text-slate-900 dark:text-white">
                      {row.finalScore.toFixed(1)}
                    </td>

                    {/* Predicate */}
                    <td className="py-3 px-2 text-center">
                      <span
                        className={`font-mono font-bold text-xs ${
                          row.predicate === 'A'
                            ? 'text-emerald-600'
                            : row.predicate === 'B'
                            ? 'text-blue-600'
                            : 'text-amber-600'
                        }`}
                      >
                        {row.predicate}
                      </span>
                    </td>

                    {/* KKM Status */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          isPass
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                        }`}
                      >
                        {isPass ? 'TUNTAS' : 'REMEDIAL'}
                      </span>
                    </td>

                    {/* Actions for teacher */}
                    {(role === 'guru' || role === 'wali_kelas') && (
                      <td className="py-3 px-2 text-center">
                        {isEditing ? (
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => saveEditing(row.subjectId, row.studentId)}
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                              title="Simpan Nilai"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                              title="Batal"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEditing(row)}
                            className="p-1 text-slate-400 hover:text-blue-600 rounded"
                            title="Edit Komponen Nilai"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Class Students Roster & Ranking (Overview) */}
      <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Peringkat & Perkembangan Akademik Siswa Kelas 8A
            </h2>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama siswa atau NISN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <th className="py-2.5 px-3">Peringkat</th>
                <th className="py-2.5 px-3">Nama Lengkap Siswa</th>
                <th className="py-2.5 px-3 font-mono">NISN</th>
                <th className="py-2.5 px-3 text-right font-mono">Rata-Rata Nilai</th>
                <th className="py-2.5 px-3 text-center">Kehadiran</th>
                <th className="py-2.5 px-3 text-center">Status Kelulusan KKM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStudents.map((st) => (
                <tr
                  key={st.id}
                  className={`hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors ${
                    st.id === 'std_01'
                      ? 'bg-blue-50/40 dark:bg-blue-950/20 font-medium'
                      : ''
                  }`}
                >
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-mono text-xs font-bold ${
                        st.rank === 1
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200'
                          : st.rank === 2
                          ? 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
                          : st.rank === 3
                          ? 'bg-amber-700/20 text-amber-900 dark:text-amber-300'
                          : 'text-slate-500'
                      }`}
                    >
                      {st.rank}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-900 dark:text-white font-semibold">
                    {st.name} {st.id === 'std_01' && <span className="text-blue-600 text-[10px]">(Anda)</span>}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-500">{st.nisn}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                    {st.avgScore}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-slate-600 dark:text-slate-400">
                    {st.attendanceRate}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        st.status === 'Tuntas KKM'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                      }`}
                    >
                      {st.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Report Card Modal */}
      {showReportCardModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowReportCardModal(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto"
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 dark:border-slate-800 my-auto">
            {/* Modal Header Actions */}
            <div className="flex flex-wrap items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={SCHOOL_PROFILE.badgeUrl}
                  alt="Badge SMP PGRI"
                  className="w-12 h-12 object-contain"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                    {SCHOOL_PROFILE.name}
                  </h3>
                  <div className="text-xs text-slate-500">
                    LAPORAN HASIL BELAJAR SISWA (RAPOR RESMI SMP)
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowReportCardModal(false)}
                  className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 flex items-center gap-1.5 transition-colors border border-slate-300 dark:border-slate-700 shadow-xs"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali ke Halaman Rapor</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Dokumen</span>
                </button>
                <button
                  onClick={() => setShowReportCardModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Tutup Pratinjau"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Student Biodata Sheet */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Nama Peserta Didik</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  Raditya Pratama
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">NISN / Nomor Induk</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  0098234120
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Rombongan Belajar</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Kelas 8A (Fase D)
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Tahun / Semester</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  2026/2027 · Genap
                </span>
              </div>
            </div>

            {/* Report Table */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                  <tr>
                    <th className="p-2.5">No</th>
                    <th className="p-2.5">Mata Pelajaran</th>
                    <th className="p-2.5 text-center font-mono">KKM</th>
                    <th className="p-2.5 text-center font-mono">Nilai Akhir</th>
                    <th className="p-2.5 text-center">Predikat</th>
                    <th className="p-2.5">Capaian Kompetensi Siswa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {academicScores.map((sc, i) => (
                    <tr key={sc.subjectId}>
                      <td className="p-2 text-center text-slate-400 font-mono">{i + 1}</td>
                      <td className="p-2 font-semibold text-slate-900 dark:text-white">
                        {sc.subjectName}
                      </td>
                      <td className="p-2 text-center font-mono text-slate-500">{sc.kkm}</td>
                      <td className="p-2 text-center font-mono font-bold text-slate-900 dark:text-white">
                        {sc.finalScore.toFixed(1)}
                      </td>
                      <td className="p-2 text-center font-bold text-blue-600">
                        {sc.predicate}
                      </td>
                      <td className="p-2 text-[11px] text-slate-600 dark:text-slate-300">
                        {sc.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 pt-6 text-center text-xs text-slate-700 dark:text-slate-300">
              <div>
                <div className="text-[11px] text-slate-400">Mengetahui,</div>
                <div className="font-semibold mt-1">Orang Tua / Wali Murid</div>
                <div className="h-16"></div>
                <div className="font-medium text-slate-500">(.......................................)</div>
              </div>

              <div>
                <div className="text-[11px] text-slate-400">Kota Harapan, 03 November 2026</div>
                <div className="font-semibold mt-1">Wali Kelas 8A SMP PGRI</div>
                <div className="h-16 flex items-center justify-center">
                  <span className="text-[11px] text-emerald-600 font-mono font-semibold">
                    [Tervalidasi Digital E-Learning]
                  </span>
                </div>
                <div className="font-bold underline text-slate-900 dark:text-white">
                  Dra. Hj. Sri Wahyuni, M.Pd
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  NIP. 19780512 200501 2 003
                </div>
              </div>
            </div>

            {/* Modal Bottom Footer Actions */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
              <button
                onClick={() => setShowReportCardModal(false)}
                className="px-5 py-2.5 text-xs font-bold rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white transition-colors flex items-center gap-2 shadow-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Halaman Rapor</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-5 py-2.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs flex items-center gap-2 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Rapor Siswa</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
