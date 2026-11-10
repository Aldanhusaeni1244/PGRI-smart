import React, { useState, useEffect } from 'react';
import {
  User,
  Lock,
  LogOut,
  GraduationCap,
  UserCheck,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Save,
  X,
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail
} from 'lucide-react';
import { useAuth, AuthRole } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

interface UserProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileEditModal: React.FC<UserProfileEditModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, updateUser, switchRole, logout } = useAuth();
  const { setRole } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'switch_role'>('profile');

  // Profile Form States
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [motto, setMotto] = useState<string>('');

  // Password Form States
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showCurrentPass, setShowCurrentPass] = useState<boolean>(false);
  const [showNewPass, setShowNewPass] = useState<boolean>(false);
  const [showConfirmPass, setShowConfirmPass] = useState<boolean>(false);

  // Status Alerts
  const [successAlert, setSuccessAlert] = useState<string | null>(null);
  const [errorAlert, setErrorAlert] = useState<string | null>(null);

  // Initialize or reset form values when user changes or modal opens
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || `${user.role}@smp-pgri.sch.id`);
      setPhone(user.phone || (user.role === 'student' ? '0812-3456-7890' : '0813-8899-1122'));
      setAddress(user.address || 'Jl. Harapan Bangsa No. 12, Kompleks PGRI');
      setMotto(
        user.motto ||
          (user.role === 'student'
            ? 'Belajar keras, berakhlak mulia, dan pantang menyerah.'
            : user.role === 'teacher'
            ? 'Mendidik dengan hati, menginspirasi dengan budi pekerti.'
            : 'Membimbing generasi cerdas berkarakter Profil Pancasila.')
      );
      setSuccessAlert(null);
      setErrorAlert(null);
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorAlert('Nama lengkap tidak boleh kosong.');
      return;
    }

    updateUser({
      name,
      email,
      phone,
      address,
      motto,
    });

    setErrorAlert(null);
    setSuccessAlert('Profil berhasil diperbarui dan tersimpan secara real-time!');
    setTimeout(() => {
      setSuccessAlert(null);
    }, 3000);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setErrorAlert('Harap masukkan kata sandi saat ini.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorAlert('Kata sandi baru minimal harus 6 karakter.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorAlert('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrorAlert(null);
    setSuccessAlert('Kata sandi berhasil diperbarui dengan aman!');
    setTimeout(() => {
      setSuccessAlert(null);
    }, 3000);
  };

  const handleSwitchAccount = (newRole: AuthRole) => {
    switchRole(newRole);
    if (newRole === 'student') setRole('siswa');
    else if (newRole === 'teacher') setRole('guru');
    else if (newRole === 'homeroom') setRole('wali_kelas');

    setSuccessAlert(`Beralih peran aktif ke ${newRole.toUpperCase()} berhasil!`);
    setTimeout(() => {
      setSuccessAlert(null);
    }, 2500);
  };

  const handleLogoutAction = () => {
    onClose();
    logout();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-6 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Kembali ke Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Kembali</span>
            </button>
            <div className="border-l border-white/20 pl-3">
              <h2 className="text-sm sm:text-base font-extrabold leading-tight">
                Pengaturan Akun & Profil Pengguna
              </h2>
              <p className="text-[11px] text-slate-300">
                SMP PGRI 1 KOTA HARAPAN · Portal Akademik
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Header */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 px-6 pt-3 gap-2 overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Edit Profil</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`pb-3 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'security'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Keamanan & Password</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('switch_role')}
            className={`pb-3 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'switch_role'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Ganti Peran Demo</span>
          </button>
        </div>

        {/* Alerts */}
        {successAlert && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successAlert}</span>
          </div>
        )}
        {errorAlert && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorAlert}</span>
          </div>
        )}

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* TAB 1: EDIT PROFIL */}
          {activeTab === 'profile' && (
            <form id="edit-profile-form" onSubmit={handleSaveProfile} className="space-y-4">
              {/* Profile Card Header */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 flex items-center gap-4">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 p-1 ring-2 ring-blue-500/30 object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {user.name}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                        user.role === 'student'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/80 dark:text-blue-200'
                          : user.role === 'teacher'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/80 dark:text-emerald-200'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/80 dark:text-amber-200'
                      }`}
                    >
                      {user.classInfo}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    ID Akun: {user.id} · Terdaftar Aktif Semester Genap 2026/2027
                  </p>
                </div>
              </div>

              {/* Read-Only Identity Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-800">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    {user.role === 'student' ? 'Nomor Induk Siswa (NISN)' : 'Nomor Induk Pegawai (NIP)'}
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={user.nisnOrNip}
                    className="w-full px-3 py-1.5 text-xs font-mono font-bold rounded-lg bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 cursor-not-allowed"
                  />
                  <span className="text-[10px] text-slate-400">Data terikat resmi DAPODIK (Read-Only)</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Rombel / Penugasan Kelas
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={user.classInfo}
                    className="w-full px-3 py-1.5 text-xs font-mono font-bold rounded-lg bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 cursor-not-allowed"
                  />
                  <span className="text-[10px] text-slate-400">Ditetapkan oleh Kurikulum Sekolah</span>
                </div>
              </div>

              {/* Editable Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nama lengkap pengguna"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nomor WhatsApp / Kontak <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0812-xxxx-xxxx"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Alamat Email Sekolah
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@smp-pgri.sch.id"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Alamat Domisili Siswa / Pengajar
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Jl. Harapan Bangsa No. 12"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {user.role === 'student' ? 'Motto Belajar Siswa' : 'Motto & Jam Pelayanan Konsultasi'}
                  </label>
                  <textarea
                    rows={2}
                    value={motto}
                    onChange={(e) => setMotto(e.target.value)}
                    placeholder="Tuliskan motto inspiratif..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </form>
          )}

          {/* TAB 2: KEAMANAN & PASSWORD */}
          {activeTab === 'security' && (
            <form id="edit-password-form" onSubmit={handleSavePassword} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs text-blue-900 dark:text-blue-200">
                <span className="font-bold">Standar Keamanan Akun SMP PGRI 1:</span>
                <p className="mt-0.5 text-[11px] text-blue-700 dark:text-blue-300">
                  Gunakan kombinasi minimal 6 karakter. Jangan berikan kata sandi Anda kepada pihak lain.
                </p>
              </div>

              {/* Current Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kata Sandi Saat Ini <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Masukkan kata sandi lama Anda"
                    className="w-full pl-9 pr-10 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kata Sandi Baru <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full pl-9 pr-10 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Konfirmasi Kata Sandi Baru <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ketik ulang kata sandi baru"
                    className="w-full pl-9 pr-10 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB 3: GANTI PERAN (SWITCH ROLE) & LOGOUT */}
          {activeTab === 'switch_role' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs">
                <span className="font-bold text-slate-900 dark:text-white">
                  Pindah Cepat Akun Demo (Simulasi Multi-Role)
                </span>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                  Beralih antar profil untuk menguji fitur siswa, guru, dan administrasi wali kelas secara instan.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {/* Siswa Option */}
                <button
                  type="button"
                  onClick={() => handleSwitchAccount('student')}
                  className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                    user.role === 'student'
                      ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/60 ring-2 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        Siswa: Raditya Pratama
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                        NISN: 0098234120 · Kelas 8A
                      </div>
                    </div>
                  </div>
                  {user.role === 'student' ? (
                    <span className="px-2.5 py-1 rounded-full bg-blue-600 text-white font-bold text-[10px]">
                      Aktif Sekarang
                    </span>
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {/* Guru Option */}
                <button
                  type="button"
                  onClick={() => handleSwitchAccount('teacher')}
                  className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                    user.role === 'teacher'
                      ? 'border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/60 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        Guru Pengajar: M.Pd
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                        NIP: 19850312 · Pengajar IPA
                      </div>
                    </div>
                  </div>
                  {user.role === 'teacher' ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-bold text-[10px]">
                      Aktif Sekarang
                    </span>
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {/* Wali Kelas Option */}
                <button
                  type="button"
                  onClick={() => handleSwitchAccount('homeroom')}
                  className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                    user.role === 'homeroom'
                      ? 'border-amber-600 bg-amber-50/80 dark:bg-amber-950/60 ring-2 ring-amber-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        Wali Kelas: Dra. Hj. Sri Wahyuni
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                        NIP: 19780415 · Rombel 8A
                      </div>
                    </div>
                  </div>
                  {user.role === 'homeroom' ? (
                    <span className="px-2.5 py-1 rounded-full bg-amber-600 text-white font-bold text-[10px]">
                      Aktif Sekarang
                    </span>
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              </div>

              {/* Dedicated Logout Action Box */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleLogoutAction}
                  className="w-full p-3 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/60 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center justify-center gap-2 text-xs font-bold shadow-xs"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar / Logout dari Portal SMP PGRI 1</span>
                </button>
                <p className="text-[10px] text-center text-slate-400 mt-1.5">
                  Sesi login Anda akan dibersihkan dari penyimpanan lokal peramban.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium px-4 py-2 rounded-lg text-xs transition-colors"
          >
            Batal / Kembali
          </button>

          {activeTab === 'profile' && (
            <button
              type="submit"
              form="edit-profile-form"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Perubahan</span>
            </button>
          )}

          {activeTab === 'security' && (
            <button
              type="submit"
              form="edit-password-form"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Perbarui Kata Sandi</span>
            </button>
          )}

          {activeTab === 'switch_role' && (
            <button
              type="button"
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-xs transition-colors"
            >
              Selesai
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
