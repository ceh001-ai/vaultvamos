import React, { useState } from 'react';
import {
  VaultItem,
  BreachAlert,
  SecurityAuditReport,
  SyncDevice,
} from '../types/vault';
import { ServiceIcon } from './ServiceIcon';
import { TotpBadge } from './TotpBadge';
import {
  Copy,
  Check,
  Eye,
  EyeOff,
  ShieldCheck,
  Zap,
  Sparkles,
  ChevronRight,
  Plus,
  Lock,
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';

interface DashboardViewProps {
  items: VaultItem[];
  breachAlerts: BreachAlert[];
  auditReport: SecurityAuditReport;
  devices: SyncDevice[];
  onSelectItem: (item: VaultItem) => void;
  onOpenHealthCheck: () => void;
  onOpenDarkWebAlerts: () => void;
  onOpenSyncModal: () => void;
  onOpenGenerator: () => void;
  onRemediateBreach: (breachId: string) => void;
  onCopyPassword: (password: string, title: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  items,
  breachAlerts,
  auditReport,
  devices,
  onSelectItem,
  onOpenHealthCheck,
  onOpenDarkWebAlerts,
  onOpenSyncModal,
  onOpenGenerator,
  onRemediateBreach,
  onCopyPassword,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedUsernameId, setCopiedUsernameId] = useState<string | null>(null);
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});

  const activeBreach = breachAlerts.find((b) => b.status === 'active');

  const handleCopyPassword = (e: React.MouseEvent, item: VaultItem) => {
    e.stopPropagation();
    if (item.secret) {
      navigator.clipboard.writeText(item.secret);
      setCopiedId(item.id);
      onCopyPassword(item.secret, item.title);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleCopyUsername = (e: React.MouseEvent, item: VaultItem) => {
    e.stopPropagation();
    if (item.identifier) {
      navigator.clipboard.writeText(item.identifier);
      setCopiedUsernameId(item.id);
      setTimeout(() => setCopiedUsernameId(null), 2000);
    }
  };

  const toggleReveal = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="p-3.5 sm:p-6 md:p-8 flex-1 overflow-y-auto bg-slate-50">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-4 sm:gap-6">
        {/* Left / Main Section: Credentials List */}
        <div className="col-span-12 lg:col-span-8 space-y-4 sm:space-y-6">
          {/* Header Bar */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>Vault Credentials</span>
                <span className="text-[11px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-mono font-semibold">
                  {items.length}
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                On-device encrypted credential vault
              </p>
            </div>

            {/* Quick Generator Shortcut for Mobile/Desktop */}
            <button
              onClick={onOpenGenerator}
              className="sm:hidden px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-mono font-bold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Generate</span>
            </button>
          </div>

          {/* Active Dark Web Alert Banner if any */}
          {activeBreach && (
            <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-rose-100 text-rose-600 rounded-xl mt-0.5 shrink-0">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-rose-900 font-mono">
                    Compromised Credential Detected
                  </h3>
                  <p className="text-xs text-rose-700 mt-0.5 leading-relaxed">
                    {activeBreach.description}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onRemediateBreach(activeBreach.id)}
                className="w-full sm:w-auto px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-mono font-bold rounded-xl transition-colors shrink-0 shadow-xs cursor-pointer"
              >
                Resolve
              </button>
            </div>
          )}

          {/* Credentials Container */}
          {items.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 text-center shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No Credentials in Vault</h3>
              <p className="text-xs text-slate-500 font-mono mt-1 max-w-xs mx-auto">
                Add your first password or generate a cryptographically strong credential.
              </p>
              <button
                onClick={onOpenGenerator}
                className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-mono font-bold hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create New Entry</span>
              </button>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              {/* MOBILE CARDS VIEW (Clean, touch-friendly for phone screens) */}
              <div className="divide-y divide-slate-100 sm:hidden">
                {items.map((item) => {
                  const isRevealed = !!revealedIds[item.id];
                  const isCopied = copiedId === item.id;
                  const isUserCopied = copiedUsernameId === item.id;

                  return (
                    <div
                      key={item.id}
                      onClick={() => onSelectItem(item)}
                      className="p-4 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer space-y-3"
                    >
                      {/* Top Row: Icon, Title, Status */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3 min-w-0">
                          <ServiceIcon
                            title={item.title}
                            type={item.type}
                            platformIcon={item.platformIcon}
                            size="md"
                          />
                          <div className="min-w-0">
                            <div className="text-slate-900 font-bold text-sm truncate flex items-center gap-1.5">
                              <span>{item.title}</span>
                              {item.favorite && (
                                <span className="text-[10px] text-amber-500">★</span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500 font-mono">
                              {item.category || 'General'}
                            </span>
                          </div>
                        </div>

                        {/* Health status badge */}
                        <div className="shrink-0">
                          {item.healthStatus === 'strong' && (
                            <span className="text-emerald-700 text-[10px] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-bold font-mono">
                              Protected
                            </span>
                          )}
                          {item.healthStatus === 'weak' && (
                            <span className="text-amber-700 text-[10px] bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 font-bold font-mono">
                              Weak
                            </span>
                          )}
                          {item.healthStatus === 'breached' && (
                            <span className="text-rose-700 text-[10px] bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 font-bold font-mono">
                              Breached
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Middle: Username & 2FA */}
                      <div className="bg-slate-50 rounded-xl p-2.5 flex items-center justify-between border border-slate-200/70 text-xs font-mono">
                        <div className="text-slate-700 truncate pr-2">
                          <span className="text-slate-400 mr-1">User:</span>
                          <span className="font-medium text-slate-900">{item.identifier || '—'}</span>
                        </div>

                        {item.identifier && (
                          <button
                            onClick={(e) => handleCopyUsername(e, item)}
                            className="p-1 text-slate-400 hover:text-slate-700 shrink-0"
                            title="Copy username"
                          >
                            {isUserCopied ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </div>

                      {/* Bottom Row: Password actions & 2FA */}
                      <div className="flex items-center justify-between gap-2 pt-1">
                        {item.totpSecret ? (
                          <TotpBadge secret={item.totpSecret} />
                        ) : (
                          <span className="text-[11px] text-slate-400 font-mono">
                            {item.lastAccessed ? `Used ${item.lastAccessed}` : 'Ready'}
                          </span>
                        )}

                        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          {item.secret && (
                            <>
                              <button
                                onClick={(e) => toggleReveal(e, item.id)}
                                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono rounded-lg flex items-center gap-1 transition-colors"
                              >
                                {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                <span>{isRevealed ? item.secret : '••••••••'}</span>
                              </button>

                              <button
                                onClick={(e) => handleCopyPassword(e, item)}
                                className="p-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors flex items-center justify-center"
                                title="Copy Password"
                              >
                                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => onSelectItem(item)}
                            className="p-2 text-slate-400 hover:text-slate-800"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* TABLE VIEW (For tablets & laptops) */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider font-mono border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-3.5 font-bold">Credential</th>
                      <th className="px-5 py-3.5 font-bold">Identifier / Username</th>
                      <th className="px-5 py-3.5 font-bold">2FA / Security</th>
                      <th className="px-5 py-3.5 font-bold text-center">Status</th>
                      <th className="px-5 py-3.5 font-bold text-right">Quick Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map((item) => {
                      const isRevealed = !!revealedIds[item.id];
                      const isCopied = copiedId === item.id;
                      const isUserCopied = copiedUsernameId === item.id;

                      return (
                        <tr
                          key={item.id}
                          id={`vault-row-${item.id}`}
                          onClick={() => onSelectItem(item)}
                          className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                        >
                          {/* Platform Name & Icon */}
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <ServiceIcon
                                title={item.title}
                                type={item.type}
                                platformIcon={item.platformIcon}
                              />
                              <div>
                                <div className="text-slate-900 font-bold group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                                  <span>{item.title}</span>
                                  {item.favorite && (
                                    <span className="text-[10px] text-amber-500">★</span>
                                  )}
                                </div>
                                <span className="text-[11px] text-slate-500 font-mono">
                                  {item.category || 'General'}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Identifier */}
                          <td className="px-5 py-3.5 text-slate-700 font-mono text-xs max-w-[200px] truncate">
                            <div className="flex items-center gap-1.5">
                              <span className="truncate">{item.identifier || '—'}</span>
                              {item.identifier && (
                                <button
                                  onClick={(e) => handleCopyUsername(e, item)}
                                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-slate-700 transition-opacity"
                                  title="Copy username"
                                >
                                  {isUserCopied ? (
                                    <Check className="w-3 h-3 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              )}
                            </div>
                          </td>

                          {/* 2FA Badge */}
                          <td className="px-5 py-3.5">
                            {item.totpSecret ? (
                              <TotpBadge secret={item.totpSecret} />
                            ) : (
                              <span className="text-slate-400 text-xs font-mono">Inactive</span>
                            )}
                          </td>

                          {/* Status */}
                          <td className="px-5 py-3.5 text-center">
                            {item.healthStatus === 'strong' && (
                              <span className="text-emerald-700 text-[10px] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-bold font-mono">
                                Protected
                              </span>
                            )}
                            {item.healthStatus === 'weak' && (
                              <span className="text-amber-700 text-[10px] bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 font-bold font-mono">
                                Weak
                              </span>
                            )}
                            {item.healthStatus === 'breached' && (
                              <span className="text-rose-700 text-[10px] bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 font-bold font-mono">
                                Breached
                              </span>
                            )}
                            {(!item.healthStatus || item.healthStatus === 'reused' || item.healthStatus === 'missing_2fa') && (
                              <span className="text-slate-600 text-[10px] bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 font-bold font-mono">
                                Active
                              </span>
                            )}
                          </td>

                          {/* Action Buttons */}
                          <td className="px-5 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1.5">
                              {item.secret && (
                                <>
                                  <button
                                    onClick={(e) => toggleReveal(e, item.id)}
                                    className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
                                    title={isRevealed ? 'Hide secret' : 'Reveal secret'}
                                  >
                                    {isRevealed ? (
                                      <EyeOff className="w-4 h-4 text-indigo-600" />
                                    ) : (
                                      <Eye className="w-4 h-4" />
                                    )}
                                  </button>
                                  <button
                                    onClick={(e) => handleCopyPassword(e, item)}
                                    className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
                                    title="Copy password"
                                  >
                                    {isCopied ? (
                                      <Check className="w-4 h-4 text-emerald-600" />
                                    ) : (
                                      <Copy className="w-4 h-4" />
                                    )}
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => onSelectItem(item)}
                                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
                                title="View details"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right Section: Compact Security & Quick Tools */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          {/* Security Overview Box */}
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold font-mono">
                Vault Health
              </span>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {auditReport.overallScore}% Safe
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl">
                <div className="text-xl font-bold font-mono text-slate-900">
                  {auditReport.strongCount}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">Protected</div>
              </div>
              <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl">
                <div className="text-xl font-bold font-mono text-amber-600">
                  {auditReport.weakCount + auditReport.reusedCount}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">Need Review</div>
              </div>
            </div>

            <button
              onClick={onOpenHealthCheck}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-mono font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Full Health Audit</span>
            </button>
          </div>

          {/* Quick Password Generator Card */}
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold font-mono">
                Password Generator
              </span>
              <Zap className="w-3.5 h-3.5 text-amber-500" />
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Create randomized 20+ character passwords with maximum cryptographic entropy.
            </p>

            <button
              onClick={onOpenGenerator}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span>Launch Generator</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Security Spec Note */}
          <div className="bg-slate-100/70 border border-slate-200 p-4 rounded-2xl text-[11px] font-mono text-slate-500 space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-700 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero-Knowledge Storage</span>
            </div>
            <p className="leading-normal text-slate-500">
              Payloads are AES-256 encrypted on this device. No unencrypted secrets leave browser memory.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
