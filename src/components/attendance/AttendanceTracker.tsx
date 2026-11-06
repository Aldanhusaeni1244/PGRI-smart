import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AttendanceRecord } from '../../types';
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  HelpCircle,
  UserCheck,
  Users,
  Calendar,
  Save
} from 'lucide-react';

export const AttendanceTracker: React.FC = () => {
  const { role, activeUser, attendanceRecords, updateAttendance, showToast } = useApp();

  const [selectedDate, setSelectedDate] = useState('2026-11-03');

  // Stats
  const total = attendanceRecords.length;
  const hadirCount = attendanceRecords.filter((r) => r.status === 'hadir').length;
  const izinCount = attendanceRecords.filter((r) => r.status === 'izin').length;
  const sakitCount = attendanceRecords.filter((r) => r.status === 'sakit').length;
  const alpaCount = attendanceRecords.filter((r) => r.status === 'alpa').length;
  const attendancePercentage = total > 0 ? ((hadirCount / total) * 100).toFixed(1) : '100';

  const myRecord = attendanceRecords.find((r) => r.studentId === activeUser.id);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <CalendarCheck className="w-4 h-4" />
            <span>Presensi & Kedisiplinan Siswa</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            {role === 'siswa' ? 'Rekap Kehadiran Saya' : 'Presensi & Absensi Kelas 8A'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Pencatatan real-time kehadiran peserta didik untuk syarat kelulusan semester Kurikulum Merdeka.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>Tanggal: {selectedDate}</span>
          </div>
          {(role === 'guru' || role === 'wali_kelas') && (
            <button
              onClick={() => showToast('Seluruh data presensi kelas 8A berhasil disimpan permanen', 'success')}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Presensi</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] text-slate-500 mb-1">Persentase Kelas</div>
          <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 font-mono tabular-nums">
            {attendancePercentage}%
          </div>
          <div className="text-[10px] text-emerald-600 font-medium mt-1">Target &gt;90%</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] text-slate-500 mb-1">Hadir (H)</div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
            {hadirCount}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Tepat Waktu</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] text-slate-500 mb-1">Izin (I)</div>
          <div className="text-2xl font-extrabold text-amber-500 font-mono tabular-nums">
            {izinCount}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Disertai Surat</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] text-slate-500 mb-1">Sakit (S)</div>
          <div className="text-2xl font-extrabold text-indigo-500 font-mono tabular-nums">
            {sakitCount}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Surat Dokter</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] text-slate-500 mb-1">Alpa (A)</div>
          <div className="text-2xl font-extrabold text-rose-600 font-mono tabular-nums">
            {alpaCount}
          </div>
          <div className="text-[10px] text-rose-500 mt-1">Tanpa Berita</div>
        </div>
      </div>

      {/* Student Personal Streak Box */}
      {role === 'siswa' && myRecord && (
        <div className="p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Status Kehadiran Anda Hari Ini: HADIR (Tepat Waktu)</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Dicatat oleh Wali Kelas Dra. Hj. Sri Wahyuni pada pukul 07:10 WIB.
            </p>
          </div>
          <div className="text-right font-mono">
            <span className="text-xs font-bold text-emerald-600 block">Presensi 98.2%</span>
            <span className="text-[10px] text-slate-400">Total 30 Hadir berturut-turut</span>
          </div>
        </div>
      )}

      {/* Class Attendance Register Table */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Daftar Presensi Harian Siswa Kelas 8A
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {attendanceRecords.length} Peserta Didik
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-medium">
                <th className="py-2.5 px-3">No</th>
                <th className="py-2.5 px-3">Nama Siswa</th>
                <th className="py-2.5 px-3 text-center">Status Kehadiran</th>
                <th className="py-2.5 px-3">Keterangan / Catatan Guru</th>
                {(role === 'guru' || role === 'wali_kelas') && (
                  <th className="py-2.5 px-3 text-center">Ubah Status</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {attendanceRecords.map((item, idx) => {
                const getStatusBadge = (st: typeof item.status) => {
                  switch (st) {
                    case 'hadir':
                      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300';
                    case 'izin':
                      return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300';
                    case 'sakit':
                      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300';
                    case 'alpa':
                      return 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300';
                  }
                };

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-2.5 px-3 font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                      {item.studentName}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded uppercase font-mono ${getStatusBadge(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                      {item.notes || '-'}
                    </td>

                    {/* Teacher interactive status buttons */}
                    {(role === 'guru' || role === 'wali_kelas') && (
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1 font-mono">
                          {(['hadir', 'izin', 'sakit', 'alpa'] as const).map((s) => (
                            <button
                              key={s}
                              onClick={() => updateAttendance(item.id, s)}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                                item.status === s
                                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                              }`}
                            >
                              {s[0]}
                            </button>
                          ))}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
