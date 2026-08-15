import React from 'react';
import { X, Share, PlusSquare, Smartphone, CheckCircle, Download } from 'lucide-react';

interface IOSInstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IOSInstallGuideModal: React.FC<IOSInstallGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl border-t sm:border border-slate-200 w-full max-w-md overflow-hidden shadow-2xl animate-in slide-in-from-bottom-6 sm:fade-in">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Install on iPhone
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Native Home Screen App (PWA)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps Content */}
        <div className="p-5 space-y-4 text-xs sm:text-sm text-slate-700">
          <p className="text-xs text-slate-600 leading-relaxed">
            You can run **VAULT_OS** directly on your iPhone as a standalone local app without Safari navigation bars:
          </p>

          <div className="space-y-3">
            {/* Step 1 */}
            <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                1
              </div>
              <div className="space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span>Open in Safari & Tap Share</span>
                  <Share className="w-4 h-4 text-indigo-600" />
                </div>
                <p className="text-xs text-slate-500 leading-normal">
                  Open this link in iPhone Safari and tap the <strong>Share</strong> button at the bottom of your screen.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                2
              </div>
              <div className="space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span>Tap "Add to Home Screen"</span>
                  <PlusSquare className="w-4 h-4 text-indigo-600" />
                </div>
                <p className="text-xs text-slate-500 leading-normal">
                  Scroll down the action sheet and select <strong>Add to Home Screen</strong>.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                3
              </div>
              <div className="space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span>Launch from Home Screen</span>
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-xs text-slate-500 leading-normal">
                  Tap <strong>Add</strong>. Vault OS is now installed as a dedicated app icon on your iPhone home screen!
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-100 rounded-xl p-3 text-[11px] text-slate-600 font-mono">
            <strong>Key Features:</strong> Runs standalone in fullscreen, stores AES-256 encrypted passwords in local memory, and functions offline.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-bold rounded-xl transition-colors cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
