import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CalendarDays, Clock, MapPin, User, ChevronRight } from 'lucide-react';

interface ScheduleSlot {
  time: string;
  subject: string;
  code: string;
  teacher: string;
  room: string;
  type: 'lesson' | 'break' | 'activity';
}

export const ScheduleCalendar: React.FC = () => {
  const { setActiveTab } = useApp();
  const [activeDay, setActiveDay] = useState<'senin' | 'selasa' | 'rabu' | 'kamis' | 'jumat'>('selasa');

  const daysSchedule: Record<string, ScheduleSlot[]> = {
    senin: [
      { time: '07:00 - 07:30', subject: 'Upacara Bendera Hari Senin & Pembiasaan Karakter PGRI', code: 'UPC', teacher: 'Pembina Upacara', room: 'Lapangan Utama', type: 'activity' },
      { time: '07:30 - 09:30', subject: 'Ilmu Pengetahuan Alam (IPA Terpadu)', code: 'IPA-8', teacher: 'Dra. Hj. Sri Wahyuni, M.Pd', room: 'Lab Biologi Lantai 2', type: 'lesson' },
      { time: '09:30 - 10:15', subject: 'Istirahat Pertama & Pojok Baca Literasi', code: 'IST', teacher: '-', room: 'Kantin & Perpustakaan', type: 'break' },
      { time: '10:15 - 11:45', subject: 'Pendidikan Agama & Budi Pekerti', code: 'PAI-8', teacher: 'Ust. Ridwan Kamil, S.Ag', room: 'Musholla As-Salam & Kelas 8A', type: 'lesson' },
      { time: '11:45 - 12:30', subject: 'Sholat Dzuhur Berjamaah', code: 'SHL', teacher: 'Tim Rohis PGRI', room: 'Musholla As-Salam', type: 'activity' },
    ],
    selasa: [
      { time: '07:15 - 07:45', subject: 'Literasi Numerasi & Doa Pagi', code: 'LIT', teacher: 'Wali Kelas 8A', room: 'Ruang Kelas 8A', type: 'activity' },
      { time: '07:45 - 09:45', subject: 'Matematika Terapan (SPLDV & Pythagoras)', code: 'MTK-8', teacher: 'Bambang Sudirman, S.Pd', room: 'Ruang Kelas 8A', type: 'lesson' },
      { time: '09:45 - 10:15', subject: 'Istirahat Pagi', code: 'IST', teacher: '-', room: 'Kantin Sekolah', type: 'break' },
      { time: '10:15 - 11:45', subject: 'Pendidikan Pancasila & PPKn', code: 'PPK-8', teacher: 'Suryadi, S.Pd, M.H.', room: 'Ruang Kelas 8A', type: 'lesson' },
      { time: '11:45 - 12:30', subject: 'Sholat Dzuhur Berjamaah', code: 'SHL', teacher: 'Tim Rohis PGRI', room: 'Musholla As-Salam', type: 'activity' },
    ],
    rabu: [
      { time: '07:15 - 07:30', subject: 'Tadarus / Renungan Pagi Budi Pekerti', code: 'TDR', teacher: 'Wali Kelas', room: 'Ruang Kelas 8A', type: 'activity' },
      { time: '07:30 - 09:30', subject: 'Bahasa Indonesia (Teks LHO & Menulis Efektif)', code: 'IND-8', teacher: 'Endang Kusuma, M.Hum', room: 'Ruang Kelas 8A', type: 'lesson' },
      { time: '09:30 - 10:15', subject: 'Istirahat Pagi', code: 'IST', teacher: '-', room: 'Kantin Sekolah', type: 'break' },
      { time: '10:15 - 11:45', subject: 'Ilmu Pengetahuan Sosial (IPS)', code: 'IPS-8', teacher: 'Dra. Siti Rahmah', room: 'Ruang Kelas 8A', type: 'lesson' },
      { time: '11:45 - 12:30', subject: 'Sholat Dzuhur Berjamaah', code: 'SHL', teacher: 'Tim Rohis PGRI', room: 'Musholla As-Salam', type: 'activity' },
    ],
    kamis: [
      { time: '06:45 - 08:00', subject: 'PJOK (Kebugaran Jasmani & Bola Voli)', code: 'PJK-8', teacher: 'Hendra Setiawan, S.Pd', room: 'GOR & Lapangan PGRI', type: 'lesson' },
      { time: '08:00 - 10:00', subject: 'Bahasa Inggris (English Speaking & Writing)', code: 'ENG-8', teacher: 'Nurul Hidayati, S.Pd', room: 'Lab Bahasa Lantai 1', type: 'lesson' },
      { time: '10:00 - 10:30', subject: 'Istirahat Pagi', code: 'IST', teacher: '-', room: 'Kantin Sehat', type: 'break' },
      { time: '10:30 - 12:00', subject: 'Penguatan Profil Pelajar Pancasila (P5)', code: 'P5', teacher: 'Fasilitator P5 Kelas 8', room: 'Aula SMP PGRI', type: 'lesson' },
    ],
    jumat: [
      { time: '06:45 - 07:30', subject: 'Jumat Bersih & Senam Kesegaran Jasmani PGRI', code: 'SKJ', teacher: 'Seluruh Dewan Guru', room: 'Halaman Utama', type: 'activity' },
      { time: '07:30 - 09:00', subject: 'Informatika & Literasi Digital', code: 'INF-8', teacher: 'Ahmad Faisal, S.Kom', room: 'Lab Komputer 1', type: 'lesson' },
      { time: '09:00 - 09:30', subject: 'Istirahat Pagi', code: 'IST', teacher: '-', room: 'Kantin Sekolah', type: 'break' },
      { time: '09:30 - 11:00', subject: 'Seni Budaya & Prakarya Daerah', code: 'SNB-8', teacher: 'Dewi Lestari, S.Sn', room: 'Studio Seni & Kerajinan', type: 'lesson' },
      { time: '11:30 - 12:30', subject: 'Sholat Jumat Berjamaah', code: 'JMT', teacher: 'Keluarga Besar SMP PGRI', room: 'Masjid Agung Harapan', type: 'activity' },
    ],
  };

  const dayTabs = [
    { id: 'senin', label: 'Senin' },
    { id: 'selasa', label: 'Selasa (Hari Ini)' },
    { id: 'rabu', label: 'Rabu' },
    { id: 'kamis', label: 'Kamis' },
    { id: 'jumat', label: 'Jumat' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <CalendarDays className="w-4 h-4" />
            <span>Jadwal Pelajaran Terstruktur</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Jadwal Belajar Kelas 8A (Semester Genap 2026/2027)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Jadwal tatap muka, praktikum laboratorium, dan sesi pembelajaran digital.
          </p>
        </div>
      </div>

      {/* Day Selector Tabs */}
      <div className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center gap-1 overflow-x-auto">
        {dayTabs.map((day) => (
          <button
            key={day.id}
            onClick={() => setActiveDay(day.id as typeof activeDay)}
            className={`flex-1 min-w-[120px] py-2 px-3 text-xs font-bold rounded-lg transition-all text-center ${
              activeDay === day.id
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {day.label}
          </button>
        ))}
      </div>

      {/* Timetable Slots */}
      <div className="space-y-3">
        {daysSchedule[activeDay].map((slot, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              slot.type === 'lesson'
                ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-400'
                : slot.type === 'break'
                ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200/60 dark:border-amber-900/40'
                : 'bg-slate-50 dark:bg-slate-850 border-slate-200/60 dark:border-slate-800'
            }`}
          >
            <div className="flex items-start sm:items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 shrink-0">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>{slot.time}</span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                    [{slot.code}]
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {slot.subject}
                  </span>
                </div>
                {slot.type === 'lesson' && (
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {slot.teacher}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {slot.room}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {slot.type === 'lesson' && (
              <button
                onClick={() => setActiveTab('mata-pelajaran')}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 hover:bg-blue-100 transition-colors flex items-center gap-1 self-start sm:self-auto shrink-0"
              >
                <span>Buka Materi</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
