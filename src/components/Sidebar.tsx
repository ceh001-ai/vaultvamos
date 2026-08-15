import React from 'react';
import {
  KeyRound,
  Fingerprint,
  FileText,
  CreditCard,
  Terminal,
  ShieldAlert,
  Radio,
  Sparkles,
  Lock,
  Smartphone,
  LogOut,
  User,
  X
} from 'lucide-react';

export type NavSection =
  | 'all'
  | 'identity'
  | 'note'
  | 'card'
  | 'key'
  | 'health'
  | 'darkweb'
  | 'devices'
  | 'generator'
  | 'settings';

interface SidebarProps {
  currentSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  itemCounts: {
    all: number;
    identity: number;
    note: number;
    card: number;
    key: number;
    weakHealth: number;
    activeBreaches: number;
  };
  authenticatedUser?: string | null;
  onLockVault?: () => void;
  onCloseMobileMenu?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onSelectSection,
  itemCounts,
  authenticatedUser = 'admin',
  onLockVault,
  onCloseMobileMenu,
}) => {
  const handleNavClick = (section: NavSection) => {
    onSelectSection(section);
    if (onCloseMobileMenu) {
      onCloseMobileMenu();
    }
  };

  return (
    <aside className="w-64 border-r border-slate-200 flex flex-col bg-white select-none h-full shrink-0 z-30">
      {/* Brand Header */}
      <div className="p-5 pb-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center shadow-sm">
            <Lock className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 tracking-tight text-base leading-none">VAULT_OS</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono font-bold">
                E2EE
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Zero-Knowledge Enclave</span>
          </div>
        </div>

        {/* Mobile Close Button */}
        {onCloseMobileMenu && (
          <button
            onClick={onCloseMobileMenu}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            title="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 px-3 space-y-5 overflow-y-auto py-4">
        {/* Group: Digital Vault */}
        <div>
          <div className="text-[10px] uppercase tracking-widest text-slate-400 mb-2 px-3 font-mono font-bold">
            Vault Items
          </div>
          <div className="space-y-0.5 font-mono text-xs">
            <button
              id="nav-all-credentials"
              onClick={() => handleNavClick('all')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                currentSection === 'all'
                  ? 'bg-slate-100 text-slate-900 font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <KeyRound className="w-4 h-4 text-slate-700" />
                <span>All Passwords</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                {itemCounts.all}
              </span>
            </button>

            <button
              id="nav-identities"
              onClick={() => handleNavClick('identity')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                currentSection === 'identity'
                  ? 'bg-slate-100 text-slate-900 font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Fingerprint className="w-4 h-4 text-indigo-600" />
                <span>Identities</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                {itemCounts.identity}
              </span>
            </button>

            <button
              id="nav-secure-notes"
              onClick={() => handleNavClick('note')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                currentSection === 'note'
                  ? 'bg-slate-100 text-slate-900 font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Secure Notes</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                {itemCounts.note}
              </span>
            </button>

            <button
              id="nav-cards"
              onClick={() => handleNavClick('card')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                currentSection === 'card'
                  ? 'bg-slate-100 text-slate-900 font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-4 h-4 text-amber-600" />
                <span>Cards</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                {itemCounts.card}
              </span>
            </button>

            <button
              id="nav-keys"
              onClick={() => handleNavClick('key')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                currentSection === 'key'
                  ? 'bg-slate-100 text-slate-900 font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Terminal className="w-4 h-4 text-purple-600" />
                <span>SSH Keys</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                {itemCounts.key}
              </span>
            </button>
          </div>
        </div>

        {/* Group: Security Health */}
        <div>
          <div className="text-[10px] uppercase tracking-widest text-slate-400 mb-2 px-3 font-mono font-bold">
            Audit & Intelligence
          </div>
          <div className="space-y-0.5 font-mono text-xs">
            <button
              id="nav-security-health"
              onClick={() => handleNavClick('health')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                currentSection === 'health'
                  ? 'bg-slate-100 text-slate-900 font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                <span>Security Health</span>
              </div>
              {itemCounts.weakHealth > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold">
                  {itemCounts.weakHealth}
                </span>
              )}
            </button>

            <button
              id="nav-dark-web"
              onClick={() => handleNavClick('darkweb')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                currentSection === 'darkweb'
                  ? 'bg-slate-100 text-slate-900 font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Radio className="w-4 h-4 text-rose-500" />
                <span>Breach Monitor</span>
              </div>
              {itemCounts.activeBreaches > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 font-bold">
                  {itemCounts.activeBreaches}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Group: Utilities */}
        <div>
          <div className="text-[10px] uppercase tracking-widest text-slate-400 mb-2 px-3 font-mono font-bold">
            Tools
          </div>
          <div className="space-y-0.5 font-mono text-xs">
            <button
              id="nav-generator"
              onClick={() => handleNavClick('generator')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                currentSection === 'generator'
                  ? 'bg-slate-100 text-slate-900 font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Generator</span>
              </div>
            </button>

            <button
              id="nav-devices"
              onClick={() => handleNavClick('devices')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                currentSection === 'devices'
                  ? 'bg-slate-100 text-slate-900 font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-4 h-4 text-slate-600" />
                <span>Devices</span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* User Session Footer */}
      <div className="p-3 border-t border-slate-100 bg-slate-50">
        <div className="bg-white border border-slate-200 rounded-xl p-2.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs shrink-0 font-bold">
              {authenticatedUser ? authenticatedUser.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="truncate">
              <div className="text-xs font-bold text-slate-900 truncate">{authenticatedUser || 'User'}</div>
              <div className="text-[10px] text-emerald-600 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Active Vault</span>
              </div>
            </div>
          </div>
          {onLockVault && (
            <button
              onClick={onLockVault}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Lock Vault & Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
