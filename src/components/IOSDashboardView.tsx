import React, { useState, useMemo } from 'react';
import {
  VaultItem,
  BreachAlert,
  SecurityAuditReport,
} from '../types/vault';
import { ServiceIcon } from './ServiceIcon';
import { TotpBadge } from './TotpBadge';
import {
  Search,
  Plus,
  Copy,
  Check,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  KeyRound,
  Lock,
  X,
  Star,
} from 'lucide-react';

interface IOSDashboardViewProps {
  items: VaultItem[];
  breachAlerts: BreachAlert[];
  auditReport: SecurityAuditReport;
  onSelectItem: (item: VaultItem) => void;
  onNewItem: () => void;
  onOpenGenerator: () => void;
  onOpenHealth: () => void;
  onOpenDarkWeb: () => void;
  onLockVault: () => void;
  onCopyPassword: (password: string, title: string) => void;
  authenticatedUser: string | null;
  onToggleIOSMode?: () => void;
  isIOSForced?: boolean;
  onOpenInstallGuide?: () => void;
}

export const IOSDashboardView: React.FC<IOSDashboardViewProps> = ({
  items,
  breachAlerts,
  auditReport,
  onSelectItem,
  onNewItem,
  onOpenGenerator,
  onOpenHealth,
  onLockVault,
  onCopyPassword,
  authenticatedUser,
  onToggleIOSMode,
  isIOSForced,
  onOpenInstallGuide,
}) => {
  const [activeTab, setActiveTab] = useState<'passwords' | 'security' | 'generator'>('passwords');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'favorites' | 'alerts'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeBreachesCount = breachAlerts.filter((b) => b.status === 'active').length;
  const weakCount = auditReport.weakCount + auditReport.reusedCount;
  const securityIssuesCount = activeBreachesCount + weakCount;

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedFilter === 'favorites' && !item.favorite) return false;
      if (selectedFilter === 'alerts' && item.healthStatus !== 'weak' && item.healthStatus !== 'breached' && !item.isBreached) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesId = (item.identifier || '').toLowerCase().includes(q);
        const matchesCategory = (item.category || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesId && !matchesCategory) return false;
      }
      return true;
    });
  }, [items, selectedFilter, searchQuery]);

  const handleCopy = (e: React.MouseEvent, item: VaultItem) => {
    e.stopPropagation();
    if (item.secret) {
      navigator.clipboard.writeText(item.secret);
      setCopiedId(item.id);
      onCopyPassword(item.secret, item.title);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F2F2F7] text-slate-900 font-sans select-none overflow-hidden pb-16">
      {/* iOS Status & Large Navigation Header */}
      <header className="bg-white/85 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 px-4 pt-3 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {activeTab === 'passwords' && 'Passwords'}
              {activeTab === 'security' && 'Security Audit'}
              {activeTab === 'generator' && 'Generator'}
            </h1>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700 font-mono">
              iOS
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenInstallGuide && (
              <button
                onClick={onOpenInstallGuide}
                className="text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-lg flex items-center gap-1"
                title="How to install on iPhone"
              >
                <span>📱 Install</span>
              </button>
            )}
            {onToggleIOSMode && (
              <button
                onClick={onToggleIOSMode}
                className="text-[11px] font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-1 rounded-lg"
                title="Toggle UI Layout"
              >
                {isIOSForced ? 'Desktop View' : 'iOS View'}
              </button>
            )}
            <button
              onClick={onNewItem}
              className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center active:scale-95 transition-transform shadow-xs"
              title="Add Credential"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Minimal iOS Search Bar */}
        {activeTab === 'passwords' && (
          <div className="mt-2.5 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#E5E5EA] border-0 rounded-xl pl-8 pr-8 py-1.5 text-xs text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Filter Pills */}
        {activeTab === 'passwords' && (
          <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                selectedFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600'
              }`}
            >
              All ({items.length})
            </button>
            <button
              onClick={() => setSelectedFilter('favorites')}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
                selectedFilter === 'favorites'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600'
              }`}
            >
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>Favorites</span>
            </button>
            {securityIssuesCount > 0 && (
              <button
                onClick={() => setSelectedFilter('alerts')}
                className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
                  selectedFilter === 'alerts'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-rose-50 border border-rose-200 text-rose-700'
                }`}
              >
                <ShieldAlert className="w-3 h-3" />
                <span>Alerts ({securityIssuesCount})</span>
              </button>
            )}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-3.5 py-3 space-y-3.5">
        {/* Passwords View */}
        {activeTab === 'passwords' && (
          <>
            {filteredItems.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-slate-200/80 shadow-xs my-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2.5">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">No Passwords Found</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tap the + button to add a new account credential.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden divide-y divide-slate-100">
                {filteredItems.map((item) => {
                  const isCopied = copiedId === item.id;
                  const hasAlert = item.isBreached || item.healthStatus === 'breached' || item.healthStatus === 'weak';

                  return (
                    <div
                      key={item.id}
                      onClick={() => onSelectItem(item)}
                      className="p-3 sm:p-3.5 flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer"
                    >
                      {/* Left: Icon and info */}
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <ServiceIcon
                          title={item.title}
                          type={item.type}
                          platformIcon={item.platformIcon}
                          size="md"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-slate-900 truncate">
                              {item.title}
                            </span>
                            {item.favorite && (
                              <Star className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
                            )}
                            {hasAlert && (
                              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                            )}
                          </div>
                          <div className="text-xs text-slate-500 font-mono truncate">
                            {item.identifier || item.category || 'Password'}
                          </div>
                        </div>
                      </div>

                      {/* Right: 2FA or 1-tap Copy & Chevron */}
                      <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                        {item.totpSecret && <TotpBadge secret={item.totpSecret} />}

                        {item.secret && (
                          <button
                            onClick={(e) => handleCopy(e, item)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 transition-colors"
                            title="Copy password"
                          >
                            {isCopied ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}

                        <button
                          onClick={() => onSelectItem(item)}
                          className="p-1 text-slate-400 hover:text-slate-700"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Security View */}
        {activeTab === 'security' && (
          <div className="space-y-3.5">
            {/* Health Score Pill */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Security Health</h3>
                  <span className="text-xs text-slate-500">{auditReport.overallScore}% Safe Rating</span>
                </div>
              </div>

              <span className="text-xs font-mono font-bold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                Protected
              </span>
            </div>

            {/* Inset List for Security Breakdown */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden divide-y divide-slate-100">
              <div
                onClick={onOpenHealth}
                className="p-3.5 flex items-center justify-between hover:bg-slate-50 cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">Compromised Passwords</div>
                  <div className="text-[11px] text-slate-500">Detected in known database breaches</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full ${
                    auditReport.breachedCount > 0 ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {auditReport.breachedCount}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>

              <div
                onClick={onOpenHealth}
                className="p-3.5 flex items-center justify-between hover:bg-slate-50 cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">Weak or Reused Passwords</div>
                  <div className="text-[11px] text-slate-500">Passwords susceptible to dictionary attacks</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full ${
                    weakCount > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {weakCount}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>

              <div
                onClick={onOpenHealth}
                className="p-3.5 flex items-center justify-between hover:bg-slate-50 cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">Protected Credentials</div>
                  <div className="text-[11px] text-slate-500">High entropy with AES-256 encryption</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {auditReport.strongCount}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Generator Quick Launcher */}
        {activeTab === 'generator' && (
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-xs">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Password Generator</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Generate high-entropy randomized strings with custom symbol constraints.
              </p>
            </div>

            <button
              onClick={onOpenGenerator}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-mono font-bold shadow-xs transition-transform active:scale-98"
            >
              Open Full Generator Studio
            </button>
          </div>
        )}
      </main>

      {/* Native iOS Bottom Tab Bar */}
      <nav className="fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-md border-t border-slate-200/80 z-40 px-6 py-2 flex items-center justify-around">
        <button
          onClick={() => setActiveTab('passwords')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-colors ${
            activeTab === 'passwords' ? 'text-slate-900 font-bold' : 'text-slate-400'
          }`}
        >
          <KeyRound className="w-5 h-5" />
          <span className="text-[10px]">Passwords</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-colors relative ${
            activeTab === 'security' ? 'text-slate-900 font-bold' : 'text-slate-400'
          }`}
        >
          <ShieldCheck className="w-5 h-5" />
          <span className="text-[10px]">Security</span>
          {securityIssuesCount > 0 && (
            <span className="absolute top-0 right-3 w-2 h-2 rounded-full bg-rose-500" />
          )}
        </button>

        <button
          onClick={() => {
            setActiveTab('generator');
            onOpenGenerator();
          }}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-colors ${
            activeTab === 'generator' ? 'text-slate-900 font-bold' : 'text-slate-400'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px]">Generate</span>
        </button>

        <button
          onClick={onLockVault}
          className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl text-slate-400 hover:text-slate-700 transition-colors"
        >
          <Lock className="w-5 h-5" />
          <span className="text-[10px]">Lock</span>
        </button>
      </nav>
    </div>
  );
};
