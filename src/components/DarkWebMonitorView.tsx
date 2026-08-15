import React, { useState } from 'react';
import { BreachAlert, VaultItem } from '../types/vault';
import {
  Radio,
  ShieldAlert,
  ArrowRight,
  Plus,
  Mail,
} from 'lucide-react';

interface DarkWebMonitorViewProps {
  alerts: BreachAlert[];
  items: VaultItem[];
  onRemediateBreach: (breachId: string) => void;
  onAddMonitoredIdentity: (identity: string) => void;
  onSelectItem: (item: VaultItem) => void;
}

export const DarkWebMonitorView: React.FC<DarkWebMonitorViewProps> = ({
  alerts,
  onRemediateBreach,
  onAddMonitoredIdentity,
}) => {
  const [newEmail, setNewEmail] = useState('');
  const [monitoredIdentities, setMonitoredIdentities] = useState<string[]>([
    'demo.user@github.com',
    'admin@vaultos.local',
  ]);
  const [scanning, setScanning] = useState(false);

  const handleAddIdentity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    if (!monitoredIdentities.includes(newEmail.trim())) {
      setMonitoredIdentities((prev) => [...prev, newEmail.trim()]);
      onAddMonitoredIdentity(newEmail.trim());
    }
    setNewEmail('');
  };

  const handleTriggerScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
    }, 1200);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 flex-1 overflow-y-auto space-y-6 bg-slate-50">
      {/* Hero Threat Radar Banner */}
      <div className="bg-white border border-rose-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              Surveillance Active
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Monitoring {monitoredIdentities.length} identities
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Dark Web & Breach Surveillance</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
            Surveillance across compromised credential datasets to alert you immediately if your credentials appear in external leaks.
          </p>
        </div>

        <button
          onClick={handleTriggerScan}
          disabled={scanning}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-2 transition-all shadow-xs cursor-pointer shrink-0"
        >
          <Radio className={`w-4 h-4 ${scanning ? 'animate-spin' : ''}`} />
          <span>{scanning ? 'Scanning Leaks...' : 'Run Breach Scan'}</span>
        </button>
      </div>

      {/* Monitored Identities */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono mb-3">
          Monitored Identity Handles
        </h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {monitoredIdentities.map((id) => (
            <span
              key={id}
              className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{id}</span>
            </span>
          ))}
        </div>

        <form onSubmit={handleAddIdentity} className="flex gap-2 max-w-md">
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Add email or handle to monitor..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-slate-800"
          />
          <button
            type="submit"
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </form>
      </div>

      {/* Breach Feeds */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 font-mono">Surveillance Alerts</h3>
        {alerts.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 font-mono text-xs shadow-xs">
            No breaches detected for your monitored identities.
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-white border border-rose-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{alert.serviceName}</span>
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-rose-100 text-rose-800">
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{alert.description}</p>
                  <div className="text-[11px] text-slate-500 font-mono mt-1">
                    Exposed: {alert.exposedFields.join(', ')} • Detected: {alert.detectedAt}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onRemediateBreach(alert.id)}
                className="w-full sm:w-auto py-2 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-xs shrink-0"
              >
                <span>Remediate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
