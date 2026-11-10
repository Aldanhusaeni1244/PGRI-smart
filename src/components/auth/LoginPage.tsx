import React, { useState } from 'react';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  GraduationCap,
  BookOpen,
  ShieldCheck,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { useAuth, AuthRole, DEMO_ACCOUNTS } from '../../context/AuthContext';
import { SCHOOL_PROFILE } from '../../data/mockData';

export const LoginPage: React.FC = () => {
  const { login, quickLogin } = useAuth();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Harap masukkan Username/NIP/NISN dan Kata Sandi.');
      return;
    }

    setIsSubmitting(true);
    const success = login(username, password);
    setIsSubmitting(false);

    if (!success) {
      setErrorMessage(
        'Kredensial tidak valid. Silakan gunakan tombol Akses Cepat Demo di bawah atau periksa kembali NIP/NISN Anda.'
      );
    }
  };

  const handleFillAndLogin = (role: AuthRole) => {
    const cred = DEMO_ACCOUNTS[role];
    setUsername(cred.username);
    setPassword(cred.password);
    setErrorMessage(null);
    quickLogin(role);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-blue-600 selection:text-white">
      {/* Background Accent Grid / Glow */}
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Header Institution Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-2 rounded-2xl bg-white shadow-md border border-slate-200/80 mb-1">
            <img
              src={SCHOOL_PROFILE.badgeUrl}
              alt="Logo SMP PGRI 1"
              className="w-14 h-14 rounded-xl object-cover"
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            SMP PGRI 1 KOTA HARAPAN
          </h1>
          <p className="text-xs font-semibold text-blue-700 tracking-wide uppercase">
            E-Learning & Portal Akademik Terpadu
          </p>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Sistem Informasi Pembelajaran Mandiri, Penilaian CBT, dan Manajemen Rapor Digital Siswa.
          </p>
        </div>

        {/* Main Card */}
        <div className="mt-6 bg-white py-8 px-6 sm:px-8 shadow-sm border border-slate-200/80 rounded-2xl space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">Masuk ke Akun Portal</h2>
            <p className="text-[11px] text-slate-500">
              Gunakan Nomor Induk Siswa (NISN) atau NIP Guru yang telah terdaftar.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-in fade-in duration-200">
              <span className="font-bold">!</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username / NISN / NIP Field */}
            <div>
              <label
                htmlFor="username-input"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Username / NIP / NISN
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="username-input"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Contoh: 0098234120 / 19850312"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="password-input"
                  className="block text-xs font-semibold text-slate-700"
                >
                  Kata Sandi
                </label>
                <span className="text-[10px] text-slate-400">Minimal 6 karakter</span>
              </div>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ketik kata sandi Anda..."
                  className="w-full pl-9 pr-10 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>{isSubmitting ? 'Memverifikasi...' : 'Masuk ke Portal'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Demo Login Section */}
          <div className="pt-2">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200" />
              <span className="shrink-0 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Akses Cepat Demo (Quick Login 1-Klik)
              </span>
              <div className="flex-grow border-t border-slate-200" />
            </div>

            <div className="grid grid-cols-1 gap-2 mt-2">
              {/* Siswa Button */}
              <button
                type="button"
                onClick={() => handleFillAndLogin('student')}
                className="group w-full p-2.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/60 transition-all text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                      Siswa: Raditya Pratama
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      NISN: 0098234120 · Sandi: siswa123
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-slate-600 font-mono transition-colors">
                  Masuk Siswa →
                </span>
              </button>

              {/* Guru Button */}
              <button
                type="button"
                onClick={() => handleFillAndLogin('teacher')}
                className="group w-full p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/60 transition-all text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">
                      Guru: M.Pd (Pengajar IPA)
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      NIP: 19850312 · Sandi: guru123
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 group-hover:bg-emerald-600 group-hover:text-white text-slate-600 font-mono transition-colors">
                  Masuk Guru →
                </span>
              </button>

              {/* Wali Kelas Button */}
              <button
                type="button"
                onClick={() => handleFillAndLogin('homeroom')}
                className="group w-full p-2.5 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/60 transition-all text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-amber-700">
                      Wali Kelas: Dra. Hj. Sri Wahyuni
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      NIP: 19780415 · Sandi: walikelas123
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 group-hover:bg-amber-600 group-hover:text-white text-slate-600 font-mono transition-colors">
                  Masuk Wali Kelas →
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center text-[11px] text-slate-400 space-y-1">
          <p>Tahun Ajaran 2026/2027 · Kurikulum Merdeka Fase D</p>
          <p>© Yayasan Pembina Lembaga Pendidikan PGRI (YPLP PGRI)</p>
        </div>
      </div>
    </div>
  );
};
