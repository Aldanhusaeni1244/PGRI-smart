import React, { useState } from 'react';
import {
  Sparkles,
  UserCheck,
  FileText,
  BookOpen,
  Award,
  Upload,
  X,
  ChevronUp,
  Layers,
  GraduationCap
} from 'lucide-react';
import { PermitRequestModal } from '../student/PermitRequestModal';
import { StudentReportDownloadCard } from '../student/StudentReportDownloadCard';
import { CbtQuestionBuilder } from '../teacher/CbtQuestionBuilder';
import { MaterialUploaderModal } from '../teacher/MaterialUploaderModal';
import { HomeroomManagementPanel } from '../homeroom/HomeroomManagementPanel';

export const PgriSmartExtensionHub: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeModule, setActiveModule] = useState<
    'none' | 'permit_modal' | 'report_download' | 'cbt_builder' | 'material_uploader' | 'homeroom_panel'
  >('none');

  return (
    <>
      {/* Floating Action Trigger for Easy Testing */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2">
        {isOpen && (
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-2 w-72 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Modul Ekstensi PGRI Smart</span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Menu Buttons */}
            <div className="space-y-1 text-xs">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pt-1">
                Peran Siswa
              </div>
              <button
                type="button"
                onClick={() => setActiveModule('permit_modal')}
                className="w-full p-2 rounded-xl text-left hover:bg-blue-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2 transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Form Pengajuan Izin/Sakit</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModule('report_download')}
                className="w-full p-2 rounded-xl text-left hover:bg-blue-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2 transition-colors"
              >
                <Award className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cetak Rapor PDF Mandiri</span>
              </button>

              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pt-1.5">
                Peran Guru
              </div>
              <button
                type="button"
                onClick={() => setActiveModule('cbt_builder')}
                className="w-full p-2 rounded-xl text-left hover:bg-blue-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2 transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span>Bank Soal & Builder CBT</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModule('material_uploader')}
                className="w-full p-2 rounded-xl text-left hover:bg-blue-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2 transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-blue-600" />
                <span>Upload Modul Materi PDF/Video</span>
              </button>

              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pt-1.5">
                Peran Wali Kelas
              </div>
              <button
                type="button"
                onClick={() => setActiveModule('homeroom_panel')}
                className="w-full p-2 rounded-xl text-left hover:bg-blue-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>Panel Wali Kelas 8A (Leger 32)</span>
              </button>
            </div>
          </div>
        )}

        {/* Floating Toggle Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2.5 rounded-full bg-gradient-to-r from-blue-700 to-indigo-600 hover:from-blue-800 hover:to-indigo-700 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition-all hover:scale-105"
        >
          <Layers className="w-4 h-4" />
          <span>Fitur Modular Baru</span>
          <ChevronUp className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Render Active Modals / Popups */}
      <PermitRequestModal
        isOpen={activeModule === 'permit_modal'}
        onClose={() => setActiveModule('none')}
      />

      <MaterialUploaderModal
        isOpen={activeModule === 'material_uploader'}
        onClose={() => setActiveModule('none')}
      />

      {/* Report Modal Viewer */}
      {activeModule === 'report_download' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-3xl my-8">
            <div className="flex justify-end mb-2">
              <button
                type="button"
                onClick={() => setActiveModule('none')}
                className="p-1.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <StudentReportDownloadCard />
          </div>
        </div>
      )}

      {/* CBT Builder Modal View */}
      {activeModule === 'cbt_builder' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-4xl my-8">
            <CbtQuestionBuilder onClose={() => setActiveModule('none')} />
          </div>
        </div>
      )}

      {/* Homeroom Panel Modal View */}
      {activeModule === 'homeroom_panel' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-5xl my-8">
            <div className="flex justify-end mb-2">
              <button
                type="button"
                onClick={() => setActiveModule('none')}
                className="p-1.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <HomeroomManagementPanel />
          </div>
        </div>
      )}
    </>
  );
};
