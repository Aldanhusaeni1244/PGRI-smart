import React, { createContext, useContext, useState, useEffect } from 'react';

export type AuthRole = 'student' | 'teacher' | 'homeroom';

export interface AuthUser {
  id: string;
  name: string;
  role: AuthRole;
  nisnOrNip: string;
  classInfo: string;
  avatar: string;
  email?: string;
  phone?: string;
  address?: string;
  motto?: string;
}

export interface DemoCredential {
  username: string;
  password: string;
  user: AuthUser;
  label: string;
}

export const DEMO_ACCOUNTS: Record<AuthRole, DemoCredential> = {
  student: {
    username: '0098234120',
    password: 'siswa123',
    label: 'Siswa (Raditya Pratama)',
    user: {
      id: 'std_01',
      name: 'Raditya Pratama',
      role: 'student',
      nisnOrNip: '0098234120',
      classInfo: 'Siswa Kelas 8A',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Raditya',
      email: 'raditya.pratama@smp-pgri.sch.id',
    },
  },
  teacher: {
    username: '19850312',
    password: 'guru123',
    label: 'Guru Pengajar (IPA)',
    user: {
      id: 'tch_01',
      name: 'M.Pd (Guru Pengajar IPA)',
      role: 'teacher',
      nisnOrNip: '19850312',
      classInfo: 'Guru Pengajar IPA',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=SriWahyuni',
      email: 'guru.ipa@smp-pgri.sch.id',
    },
  },
  homeroom: {
    username: '19780415',
    password: 'walikelas123',
    label: 'Wali Kelas 8A',
    user: {
      id: 'hdm_01',
      name: 'Dra. Hj. Sri Wahyuni',
      role: 'homeroom',
      nisnOrNip: '19780415',
      classInfo: 'Wali Kelas 8A',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=WaliKelas',
      email: 'sri.wahyuni@smp-pgri.sch.id',
    },
  },
};

const STORAGE_KEY = 'pgri_smart_user';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  switchRole: (role: AuthRole) => void;
  quickLogin: (role: AuthRole) => void;
  updateUser: (updatedFields: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore session from localStorage on initial load
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AuthUser;
        if (parsed && parsed.id && parsed.role) {
          setUser(parsed);
        }
      }
    } catch (e) {
      console.error('Gagal membaca data autentikasi dari localStorage:', e);
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Login handler
  const login = (username: string, password: string): boolean => {
    const trimmedUser = username.trim().toLowerCase();
    const trimmedPass = password.trim();

    // Check student credentials
    if (
      (trimmedUser === DEMO_ACCOUNTS.student.username.toLowerCase() ||
        trimmedUser === 'siswa' ||
        trimmedUser === 'raditya') &&
      trimmedPass === DEMO_ACCOUNTS.student.password
    ) {
      const account = DEMO_ACCOUNTS.student.user;
      setUser(account);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
      return true;
    }

    // Check teacher credentials
    if (
      (trimmedUser === DEMO_ACCOUNTS.teacher.username.toLowerCase() ||
        trimmedUser === 'guru' ||
        trimmedUser === 'ipa') &&
      trimmedPass === DEMO_ACCOUNTS.teacher.password
    ) {
      const account = DEMO_ACCOUNTS.teacher.user;
      setUser(account);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
      return true;
    }

    // Check homeroom credentials
    if (
      (trimmedUser === DEMO_ACCOUNTS.homeroom.username.toLowerCase() ||
        trimmedUser === 'walikelas' ||
        trimmedUser === 'sri') &&
      trimmedPass === DEMO_ACCOUNTS.homeroom.password
    ) {
      const account = DEMO_ACCOUNTS.homeroom.user;
      setUser(account);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
      return true;
    }

    return false;
  };

  // Quick login for demo buttons
  const quickLogin = (role: AuthRole) => {
    const account = DEMO_ACCOUNTS[role].user;
    setUser(account);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
    } catch (e) {
      console.error('Gagal menyimpan sesi login:', e);
    }
  };

  // Switch role directly while logged in
  const switchRole = (role: AuthRole) => {
    const account = DEMO_ACCOUNTS[role].user;
    setUser(account);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
    } catch (e) {
      console.error('Gagal memperbarui peran aktif:', e);
    }
  };

  // Update user profile data
  const updateUser = (updatedFields: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedFields };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Gagal memperbarui profil pengguna di localStorage:', e);
      }
      return updated;
    });
  };

  // Logout & session cleanup
  const logout = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Gagal menghapus sesi akun:', e);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        switchRole,
        quickLogin,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
