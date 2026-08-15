import React, { useState } from 'react';
import { VaultItem } from '../types/vault';
import {
  Fingerprint,
  Copy,
  Check,
  Plus,
} from 'lucide-react';

interface IdentitiesViewProps {
  items: VaultItem[];
  onSelectItem: (item: VaultItem) => void;
  onNewIdentity: () => void;
  onCopyText: (text: string, label: string) => void;
}

export const IdentitiesView: React.FC<IdentitiesViewProps> = ({
  items,
  onSelectItem,
  onNewIdentity,
  onCopyText,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const identityItems = items.filter((i) => i.type === 'identity');

  const handleCopy = (e: React.MouseEvent, text: string, label: string, keyId: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedKey(keyId);
    onCopyText(text, label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 flex-1 overflow-y-auto space-y-6 bg-slate-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200 font-bold">
              Identity Protocol
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Digital Identity Vault</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
            Passports, Driver Licenses, and legal identities secured with client-side encryption.
          </p>
        </div>

        <button
          onClick={onNewIdentity}
          className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold font-mono hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Identity</span>
        </button>
      </div>

      {/* Identity Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {identityItems.length === 0 ? (
          <div className="col-span-full bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 font-mono text-xs shadow-xs">
            No identity records stored yet. Click "+ New Identity" to add one.
          </div>
        ) : (
          identityItems.map((item) => {
            const idDetails = item.identityDetails || { fullName: item.identifier };

            return (
              <div
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 transition-all cursor-pointer shadow-xs relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold">
                        <Fingerprint className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {idDetails.fullName || item.identifier}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Legal Name:</span>
                      <span className="text-slate-900 font-bold">{idDetails.fullName || '—'}</span>
                    </div>
                    {idDetails.passportNumber && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Passport:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-900 font-bold">{idDetails.passportNumber}</span>
                          <button
                            onClick={(e) => handleCopy(e, idDetails.passportNumber!, 'Passport', item.id)}
                            className="text-slate-400 hover:text-slate-700"
                          >
                            {copiedKey === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Zero-Knowledge AES-256</span>
                  <span className="text-indigo-600 font-bold">View Profile →</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
