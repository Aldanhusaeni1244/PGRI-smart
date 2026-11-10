import React, { useState, useEffect } from 'react';
import {
  FileText,
  Upload,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
  Eye,
  Trash2,
  Send,
  Building2,
  FileCheck2,
  UserCheck
} from 'lucide-react';

export interface StudentPermit {
  id: string;
  studentId: string;
  studentName: string;
  studentNisn: string;
  className: string;
  type: 'sakit' | 'izin' | 'keperluan_keluarga';
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  parentContact: string;
  attachmentName?: string;
  attachmentDataUrl?: string;
  status: 'menunggu' | 'disetujui' | 'ditolak';
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

const STORAGE_KEY = 'pgri_student_permits';

export const INITIAL_PERMITS: StudentPermit[] = [
  {
    id: 'pmt-001',
    studentId: 'std_01',
    studentName: 'Raditya Pratama',
    studentNisn: '0098234120',
    className: 'Kelas 8A',
    type: 'sakit',
    startDate: '2026-11-03',
    endDate: '2026-11-04',
    totalDays: 2,
    reason: 'Demam tinggi dan flu berdasarkan rujukan dokter klinik Graha Medika.',
    parentContact: '0812-9988-7766 (Bpk. Bambang)',
    attachmentName: 'Surat_Dokter_Klinik_Graha_Medika.jpg',
    attachmentDataUrl: '',
    status: 'disetujui',
    submittedAt: '03 Nov 2026, 06:45 WIB',
    reviewedBy: 'Dra. Hj. Sri Wahyuni, M.Pd (Wali Kelas 8A)',
    reviewedAt: '03 Nov 2026, 07:15 WIB',
    reviewNotes: 'Semoga lekas sembuh, Raditya. Jangan lupa istirahat yang cukup.',
  },
  {
    id: 'pmt-002',
    studentId: 'std_10',
    studentName: 'Budi Santoso',
    studentNisn: '0098234129',
    className: 'Kelas 8A',
    type: 'izin',
    startDate: '2026-11-12',
    endDate: '2026-11-12',
    totalDays: 1,
    reason: 'Menghadiri prosesi pernikahan kakak kandung di luar kota.',
    parentContact: '0813-5566-7788 (Ibu Sumiati)',
    attachmentName: 'Surat_Izin_Orang_Tua.pdf',
    attachmentDataUrl: '',
    status: 'menunggu',
    submittedAt: '09 Nov 2026, 19:30 WIB',
  },
];

interface PermitRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentData?: {
    id: string;
    name: string;
    nisn: string;
    className: string;
  };
}

export const PermitRequestModal: React.FC<PermitRequestModalProps> = ({
  isOpen,
  onClose,
  studentData = {
    id: 'std_01',
    name: 'Raditya Pratama',
    nisn: '0098234120',
    className: 'Kelas 8A',
  },
}) => {
  const [permits, setPermits] = useState<StudentPermit[]>([]);
  const [activeTab, setActiveTab] = useState<'form' | 'history'>('form');

  // Form State
  const [type, setType] = useState<'sakit' | 'izin' | 'keperluan_keluarga'>('sakit');
  const [startDate, setStartDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('');
  const [parentContact, setParentContact] = useState('0812-3456-7890');
  const [attachmentName, setAttachmentName] = useState<string>('');
  const [attachmentPreview, setAttachmentPreview] = useState<string>('');
  const [previewModalImg, setPreviewModalImg] = useState<string | null>(null);
  const [notificationMsg, setNotificationMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Load permits from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPermits(JSON.parse(stored));
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PERMITS));
        setPermits(INITIAL_PERMITS);
      }
    } catch {
      setPermits(INITIAL_PERMITS);
    }
  }, []);

  if (!isOpen) return null;

  // Calculate day difference
  const calculateDays = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 1;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5 MB!');
      return;
    }

    setAttachmentName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setAttachmentPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert('Mohon cantumkan alasan atau keterangan izin!');
      return;
    }

    const totalDays = calculateDays(startDate, endDate);
    const now = new Date();
    const submittedAtFormatted = `${now.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })}, ${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`;

    const newPermit: StudentPermit = {
      id: `pmt-${Date.now()}`,
      studentId: studentData.id,
      studentName: studentData.name,
      studentNisn: studentData.nisn,
      className: studentData.className,
      type,
      startDate,
      endDate,
      totalDays,
      reason,
      parentContact,
      attachmentName: attachmentName || (type === 'sakit' ? 'Surat_Dokter_Scan.jpg' : 'Surat_Izin_Ortu.jpg'),
      attachmentDataUrl: attachmentPreview || '',
      status: 'menunggu',
      submittedAt: submittedAtFormatted,
    };

    const updated = [newPermit, ...permits];
    setPermits(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage quota
    }

    // Reset form
    setReason('');
    setAttachmentName('');
    setAttachmentPreview('');
    setNotificationMsg({
      text: 'Permohonan surat izin berhasil dikirimkan ke Wali Kelas 8A untuk diverifikasi.',
      type: 'success',
    });
    setActiveTab('history');

    setTimeout(() => {
      setNotificationMsg(null);
    }, 4000);
  };

  const handleCancelPermit = (id: string) => {
    if (!confirm('Apakah Anda yakin ingin membatalkan permohonan surat izin ini?')) return;
    const updated = permits.filter((p) => p.id !== id);
    setPermits(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const studentPermits = permits.filter((p) => p.studentId === studentData.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20">
              <FileCheck2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold">Layanan Pengajuan Surat Izin / Sakit</h2>
              <p className="text-xs text-blue-100">
                SMP PGRI 1 KOTA HARAPAN · Terhubung Langsung ke Wali Kelas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-6 pt-3">
          <button
            onClick={() => setActiveTab('form')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'form'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Form Pengajuan Izin Baru</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 relative ${
              activeTab === 'history'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Riwayat & Status Persetujuan ({studentPermits.length})</span>
            {studentPermits.some((p) => p.status === 'menunggu') && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {notificationMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{notificationMsg.text}</span>
            </div>
          )}

          {activeTab === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Student Info Banner */}
              <div className="p-3 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {studentData.name} ({studentData.nisn})
                  </div>
                  <div className="text-slate-500 dark:text-slate-400">
                    Siswa Aktif · {studentData.className}
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-md bg-blue-100 dark:bg-blue-900/80 text-blue-800 dark:text-blue-200 font-semibold font-mono text-[11px]">
                  Tahun Ajaran 2026/2027
                </div>
              </div>

              {/* Jenis Izin */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Jenis Pengajuan Surat Izin <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'sakit', label: 'Sakit (Surat Dokter)', desc: 'Istirahat medis' },
                    { id: 'izin', label: 'Izin Resmi', desc: 'Tugas/Keperluan' },
                    { id: 'keperluan_keluarga', label: 'Acara Keluarga', desc: 'Izin keluarga' },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setType(item.id as typeof type)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        type === item.id
                          ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/60 ring-2 ring-blue-500/20'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {item.label}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {item.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tanggal Mulai <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tanggal Selesai <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={endDate}
                      min={startDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Total durasi permohonan: {calculateDays(startDate, endDate)} hari belajar</span>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Keterangan / Alasan Rinci <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Jelaskan alasan izin secara jelas (misal: dirawat karena tifus di RS, menghadiri pernikahan kakak di Bandung, dll.)"
                  required
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Parent Contact */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  No. Telepon / WhatsApp Orang Tua / Wali <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={parentContact}
                  onChange={(e) => setParentContact(e.target.value)}
                  placeholder="0812-xxxx-xxxx (Nama Orang Tua)"
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Nomor ini akan digunakan wali kelas untuk konfirmasi keabsahan surat.
                </p>
              </div>

              {/* File Attachment */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Unggah Foto Surat Dokter / Bukti Surat Izin (Maks. 5 MB)
                </label>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 text-center hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <input
                    type="file"
                    id="permit-attachment-input"
                    accept="image/*,application/pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="permit-attachment-input"
                    className="cursor-pointer flex flex-col items-center justify-center gap-1.5"
                  >
                    <div className="p-2.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                      <Upload className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {attachmentName ? attachmentName : 'Pilih Berkas Foto / Scan Surat Dokter'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Format didukung: JPG, PNG, atau PDF (Foto harus terbaca jelas)
                    </span>
                  </label>

                  {attachmentPreview && (
                    <div className="mt-3 flex items-center justify-center gap-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60">
                      <img
                        src={attachmentPreview}
                        alt="Preview Surat"
                        className="w-10 h-10 object-cover rounded-md border border-slate-200"
                      />
                      <span className="text-xs text-slate-700 dark:text-slate-300 font-medium truncate max-w-[200px]">
                        {attachmentName}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setAttachmentName('');
                          setAttachmentPreview('');
                        }}
                        className="p-1 text-red-500 hover:text-red-700"
                        title="Hapus berkas"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-colors flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Permohonan Surat Izin</span>
                </button>
              </div>
            </form>
          ) : (
            /* History & Status Tab */
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Daftar Permohonan Izin Anda</span>
                <span className="font-mono">{studentPermits.length} Catatan</span>
              </div>

              {studentPermits.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800">
                  <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">Belum ada catatan permohonan surat izin.</p>
                </div>
              ) : (
                studentPermits.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100/60 dark:hover:bg-slate-800/80 transition-all space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              item.type === 'sakit'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            }`}
                          >
                            {item.type === 'sakit' ? 'Sakit' : 'Izin'}
                          </span>
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {item.startDate} s/d {item.endDate} ({item.totalDays} Hari)
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                          {item.reason}
                        </p>
                      </div>

                      {/* Status Badge */}
                      <div>
                        {item.status === 'disetujui' && (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 font-bold text-[11px] flex items-center gap-1 border border-emerald-300 dark:border-emerald-800">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Disetujui</span>
                          </span>
                        )}
                        {item.status === 'menunggu' && (
                          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 font-bold text-[11px] flex items-center gap-1 border border-amber-300 dark:border-amber-800 animate-pulse">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>Menunggu</span>
                          </span>
                        )}
                        {item.status === 'ditolak' && (
                          <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300 font-bold text-[11px] flex items-center gap-1 border border-red-300 dark:border-red-800">
                            <XCircle className="w-3.5 h-3.5 text-red-600" />
                            <span>Ditolak</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Metadata & Reviewer note */}
                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
                      <div className="flex items-center gap-3">
                        <span>Diajukan: {item.submittedAt}</span>
                        {item.attachmentName && (
                          <span className="font-mono text-blue-600 dark:text-blue-400 flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {item.attachmentName}
                          </span>
                        )}
                      </div>

                      {item.status === 'menunggu' && (
                        <button
                          type="button"
                          onClick={() => handleCancelPermit(item.id)}
                          className="text-red-600 hover:text-red-700 font-semibold text-[11px]"
                        >
                          Batalkan Permohonan
                        </button>
                      )}
                    </div>

                    {/* Review Notes from Wali Kelas */}
                    {item.reviewNotes && (
                      <div className="p-2.5 rounded-lg bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs">
                        <div className="font-semibold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                          <span>Catatan Wali Kelas ({item.reviewedBy}):</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 italic mt-0.5">
                          "{item.reviewNotes}"
                        </p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
