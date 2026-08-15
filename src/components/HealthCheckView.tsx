import React, { useState } from 'react';
import { VaultItem, SecurityAuditReport } from '../types/vault';
import { ServiceIcon } from './ServiceIcon';
import {
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { generatePassword } from '../crypto/vaultCrypto';

interface HealthCheckViewProps {
  items: VaultItem[];
  report: SecurityAuditReport;
  onUpdateItemPassword: (itemId: string, newPassword: string) => void;
  onSelectItem: (item: VaultItem) => void;
  onOpenDarkWeb: () => void;
}

export const HealthCheckView: React.FC<HealthCheckViewProps> = ({
  items,
  report,
  onUpdateItemPassword,
  onSelectItem,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'weak' | 'strong'>('all');
  const [fixedItemIds, setFixedItemIds] = useState<Record<string, boolean>>({});

  const filteredItems = items.filter((item) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'weak') return item.healthStatus !== 'strong';
    if (selectedCategory === 'strong') return item.healthStatus === 'strong';
    return true;
  });

  const handleQuickFix = (itemId: string) => {
    const newStrongPass = generatePassword({
      length: 22,
      useUpper: true,
      useLower: true,
      useNumbers: true,
      useSpecial: true,
      avoidAmbiguous: true,
      mode: 'random',
    });

    onUpdateItemPassword(itemId, newStrongPass);
    setFixedItemIds((prev) => ({ ...prev, [itemId]: true }));
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 flex-1 overflow-y-auto space-y-6 bg-slate-50">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200 font-bold">
              Health Diagnostic
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Analyzed {items.length} credential{items.length !== 1 ? 's' : ''}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Credential Security Health</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
            Detects password strength, key entropy, and security risks across stored vault entries.
          </p>
        </div>

        {/* Big Score Meter */}
        <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 p-4 rounded-xl shrink-0 w-full md:w-auto justify-between md:justify-start">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-mono font-bold text-slate-900">
              {report.overallScore.toFixed(0)}%
            </div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold font-mono">
              Security Score
            </div>
          </div>
          <div className="h-10 w-px bg-slate-200"></div>
          <div className="text-xs space-y-1 font-mono">
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{report.strongCount} Protected</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-700 font-bold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{report.weakCount + report.reusedCount} At Risk</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-slate-200/70 p-1 rounded-xl w-fit text-xs font-mono">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
            selectedCategory === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All Items ({items.length})
        </button>
        <button
          onClick={() => setSelectedCategory('weak')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
            selectedCategory === 'weak' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Needs Action ({report.weakCount + report.reusedCount})
        </button>
        <button
          onClick={() => setSelectedCategory('strong')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
            selectedCategory === 'strong' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Strong ({report.strongCount})
        </button>
      </div>

      {/* Items List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 font-mono text-xs shadow-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <div className="font-bold text-slate-800">All credentials in this category are fully secure.</div>
            <div className="mt-1 text-slate-400">No security vulnerabilities detected.</div>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isFixed = !!fixedItemIds[item.id];

            return (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <ServiceIcon title={item.title} type={item.type} platformIcon={item.platformIcon} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 truncate">{item.title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {item.category || 'General'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-mono truncate mt-0.5">
                      {item.identifier || '—'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  {item.healthStatus === 'strong' || isFixed ? (
                    <span className="text-emerald-700 text-xs font-mono font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Strong Password</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleQuickFix(item.id)}
                      className="py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Auto-Generate 22-char</span>
                    </button>
                  )}

                  <button
                    onClick={() => onSelectItem(item)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 text-xs font-mono font-bold"
                  >
                    View
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
