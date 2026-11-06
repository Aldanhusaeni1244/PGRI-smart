import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  CheckCheck,
  Bell,
  Clock,
  AlertCircle,
  FileText,
  Award,
  Megaphone,
  CalendarCheck,
  Volume2
} from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    role,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setActiveTab,
    playNotificationChime
  } = useApp();

  const [filterType, setFilterType] = useState<string>('all');

  if (!isOpen) return null;

  // Filter notifications relevant to current role
  const relevantNotifs = notifications.filter(
    (n) => n.targetRole === 'all' || n.targetRole === role
  );

  const filteredNotifs = relevantNotifs.filter((n) => {
    if (filterType === 'all') return true;
    return n.type === filterType;
  });

  const handleNotificationClick = (id: string, actionTarget?: string) => {
    markNotificationAsRead(id);
    if (actionTarget) {
      setActiveTab(actionTarget);
      onClose();
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'tugas':
        return <FileText className="w-4 h-4 text-amber-500" />;
      case 'nilai':
        return <Award className="w-4 h-4 text-emerald-500" />;
      case 'pengumuman':
        return <Megaphone className="w-4 h-4 text-blue-500" />;
      case 'presensi':
        return <CalendarCheck className="w-4 h-4 text-indigo-500" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="w-full max-w-md h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 transition-colors">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Pusat Notifikasi Real-Time
              </h2>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Otomatis untuk Tugas, Nilai & Pengumuman
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={playNotificationChime}
              className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Coba Nada Notifikasi"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Bar & Quick Filters */}
        <div className="p-3 bg-slate-50/80 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
          {/* Segmented Filter Buttons */}
          <div className="flex items-center gap-1 overflow-x-auto py-0.5">
            {[
              { id: 'all', label: 'Semua' },
              { id: 'tugas', label: 'Tugas' },
              { id: 'nilai', label: 'Nilai' },
              { id: 'pengumuman', label: 'Info' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  filterType === f.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <button
            onClick={markAllNotificationsAsRead}
            className="flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 hover:underline shrink-0 font-medium whitespace-nowrap"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Tandai Semua</span>
          </button>
        </div>

        {/* Notification List Body */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 p-2">
          {filteredNotifs.length === 0 ? (
            <div className="py-16 text-center text-slate-400 dark:text-slate-500">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <div className="text-xs font-medium">Tidak ada notifikasi aktif</div>
              <div className="text-[11px]">Semua pembaruan akademik telah terbaca</div>
            </div>
          ) : (
            filteredNotifs.map((item) => (
              <div
                key={item.id}
                onClick={() => handleNotificationClick(item.id, item.actionTarget)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  !item.isRead
                    ? 'bg-blue-50/60 dark:bg-blue-950/30 hover:bg-blue-50 dark:hover:bg-blue-950/50'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                    {getIconForType(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {item.title}
                      </span>
                      {item.priority === 'urgent' && (
                        <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 shrink-0 flex items-center gap-0.5">
                          <AlertCircle className="w-3 h-3" />
                          Mendesak
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
                      <span className="flex items-center gap-1 font-mono tabular-nums">
                        <Clock className="w-3 h-3" />
                        {item.timestamp}
                      </span>
                      {item.actionTarget && (
                        <span className="text-blue-600 dark:text-blue-400 font-medium">
                          Buka Menu →
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-center text-[11px] text-slate-500">
          Notifikasi terintegrasi otomatis dengan sistem tugas & ujian SMP PGRI
        </div>
      </div>
    </div>
  );
};
