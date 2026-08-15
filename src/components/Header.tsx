import React from 'react';
import { Search, Plus, Lock, RefreshCw, Sparkles, Menu } from 'lucide-react';
import { SyncDevice } from '../types/vault';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  devices: SyncDevice[];
  onOpenSyncModal: () => void;
  onOpenNewItemModal: () => void;
  onLockVault: () => void;
  onOpenGenerator: () => void;
  filter: 'all' | 'favorites' | 'breached' | 'weak';
  onFilterChange: (filter: 'all' | 'favorites' | 'breached' | 'weak') => void;
  isSyncing: boolean;
  onTriggerSync: () => void;
  onToggleMobileMenu?: () => void;
  isIOSMode?: boolean;
  onToggleIOSMode?: () => void;
  onOpenInstallGuide?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  devices,
  onOpenSyncModal,
  onOpenNewItemModal,
  onLockVault,
  onOpenGenerator,
  filter,
  onFilterChange,
  isSyncing,
  onTriggerSync,
  onToggleMobileMenu,
  isIOSMode,
  onToggleIOSMode,
  onOpenInstallGuide,
}) => {
  const activeDevicesCount = devices.length;

  return (
    <header className="h-16 border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 md:px-8 bg-white shrink-0 gap-3 sm:gap-6 z-20">
      {/* Left: Mobile Menu Toggle & Search */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-md">
        {onToggleMobileMenu && (
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Search Input */}
        <div className="flex items-center gap-2 w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus-within:border-slate-400 focus-within:bg-white transition-colors">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            id="vault-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search credentials..."
            className="bg-transparent border-none text-xs sm:text-sm focus:outline-none w-full text-slate-800 placeholder-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="text-[10px] bg-slate-200 hover:bg-slate-300 text-slate-600 px-1.5 py-0.5 rounded font-mono"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Quick Filter Tabs (Hidden on small mobile) */}
      <div className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 border border-slate-200 rounded-xl text-xs font-mono">
        <button
          onClick={() => onFilterChange('all')}
          className={`px-3 py-1 rounded-lg transition-all ${
            filter === 'all'
              ? 'bg-white text-slate-900 font-bold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All
        </button>
        <button
          onClick={() => onFilterChange('favorites')}
          className={`px-3 py-1 rounded-lg transition-all ${
            filter === 'favorites'
              ? 'bg-white text-slate-900 font-bold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Favorites
        </button>
        <button
          onClick={() => onFilterChange('weak')}
          className={`px-3 py-1 rounded-lg transition-all ${
            filter === 'weak'
              ? 'bg-amber-100 text-amber-800 font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Weak
        </button>
        <button
          onClick={() => onFilterChange('breached')}
          className={`px-3 py-1 rounded-lg transition-all ${
            filter === 'breached'
              ? 'bg-rose-100 text-rose-800 font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Breached
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Device Sync Pill (Desktop & Tablets) */}
        <button
          id="btn-sync-devices-pill"
          onClick={onOpenSyncModal}
          className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors text-left"
          title="Multi-Device Sync"
        >
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-600 font-mono font-semibold flex items-center gap-1.5">
              <span>Sync ({activeDevicesCount})</span>
              <span className={`w-1.5 h-1.5 rounded-full ${isSyncing ? 'bg-indigo-500 animate-ping' : 'bg-emerald-500'}`}></span>
            </span>
          </div>
        </button>

        {/* Sync Trigger icon button */}
        <button
          id="btn-trigger-sync"
          onClick={onTriggerSync}
          className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
          title="Synchronize nodes"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-indigo-600' : ''}`} />
        </button>

        {/* iOS Native Mode Quick Toggle */}
        {onToggleIOSMode && (
          <button
            onClick={onToggleIOSMode}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-medium transition-colors"
            title="Switch to iOS Minimalist Native Layout"
          >
            <span className="w-2 h-2 rounded-full bg-slate-500"></span>
            <span>iOS View</span>
          </button>
        )}

        {/* Password Generator Button */}
        <button
          id="btn-quick-generator"
          onClick={onOpenGenerator}
          className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
          title="Quick Password Generator"
        >
          <Sparkles className="w-4 h-4" />
        </button>

        {/* Install on iPhone / PWA Guide */}
        {onOpenInstallGuide && (
          <button
            onClick={onOpenInstallGuide}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-medium transition-colors"
            title="Install on iPhone / Mobile"
          >
            <span>📱 Install</span>
          </button>
        )}

        {/* Lock Vault Button */}
        <button
          id="btn-lock-vault"
          onClick={onLockVault}
          className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-bold transition-colors"
          title="Lock Vault & Sign Out"
        >
          <Lock className="w-3.5 h-3.5 text-slate-600" />
          <span className="hidden sm:inline">LOCK</span>
        </button>

        {/* New Entry Button */}
        <button
          id="btn-new-vault-entry"
          onClick={onOpenNewItemModal}
          className="bg-slate-900 text-white px-3 sm:px-4 py-1.5 rounded-xl text-xs font-mono font-bold hover:bg-slate-800 transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span className="hidden sm:inline">NEW ENTRY</span>
          <span className="sm:hidden">NEW</span>
        </button>
      </div>
    </header>
  );
};
