import React, { useState } from 'react';
import { SyncDevice } from '../types/vault';
import {
  X,
  Smartphone,
  Laptop,
  Server,
  Tablet,
  RefreshCw,
  Plus,
  Trash2,
  Wifi,
} from 'lucide-react';

interface DevicesSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  devices: SyncDevice[];
  onRemoveDevice: (deviceId: string) => void;
  onTriggerSyncPulse: () => void;
  isSyncing: boolean;
  onAddDevice: (newDevice: SyncDevice) => void;
}

export const DevicesSyncModal: React.FC<DevicesSyncModalProps> = ({
  isOpen,
  onClose,
  devices,
  onRemoveDevice,
  onTriggerSyncPulse,
  isSyncing,
  onAddDevice,
}) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDeviceType, setNewDeviceType] = useState<'macos' | 'ios' | 'linux' | 'windows' | 'android'>('ios');

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeviceName.trim()) return;

    const newDev: SyncDevice = {
      id: 'dev-' + Date.now(),
      name: newDeviceName.trim(),
      platform: newDeviceType,
      lastSync: 'Just now (Synced)',
      ipAddress: '192.168.1.' + Math.floor(Math.random() * 200 + 10),
      fingerprint: 'SHA256:' + Math.random().toString(36).substring(2, 12),
      isCurrent: false,
      trusted: true,
    };

    onAddDevice(newDev);
    setNewDeviceName('');
    setShowAdd(false);
  };

  const getPlatformIcon = (platform: SyncDevice['platform']) => {
    switch (platform) {
      case 'macos':
      case 'windows':
        return <Laptop className="w-4 h-4 text-slate-700" />;
      case 'ios':
      case 'android':
        return <Smartphone className="w-4 h-4 text-indigo-600" />;
      case 'linux':
        return <Server className="w-4 h-4 text-emerald-600" />;
      default:
        return <Tablet className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <Wifi className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Multi-Device Synchronization
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                End-to-End Encrypted Relay
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-mono text-slate-700 uppercase">
              Linked Devices ({devices.length})
            </span>
            <button
              onClick={onTriggerSyncPulse}
              disabled={isSyncing}
              className="text-xs font-mono font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {devices.map((device) => (
              <div
                key={device.id}
                className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                    {getPlatformIcon(device.platform)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{device.name}</span>
                      {device.isCurrent && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold">
                          THIS DEVICE
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      {device.lastSync}
                    </div>
                  </div>
                </div>

                {!device.isCurrent && (
                  <button
                    onClick={() => onRemoveDevice(device.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Revoke device"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {showAdd ? (
            <form onSubmit={handleAdd} className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 font-mono">Link New Device</h4>
              <input
                type="text"
                placeholder="Device Name (e.g. Work MacBook, iPhone 15)"
                value={newDeviceName}
                onChange={(e) => setNewDeviceName(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-slate-800"
              />
              <div className="flex items-center gap-2">
                <select
                  value={newDeviceType}
                  onChange={(e) => setNewDeviceType(e.target.value as any)}
                  className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-800"
                >
                  <option value="ios">iOS</option>
                  <option value="android">Android</option>
                  <option value="macos">macOS</option>
                  <option value="windows">Windows</option>
                  <option value="linux">Linux</option>
                </select>
                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => setShowAdd(false)}
                    className="px-3 py-1.5 text-xs font-mono text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-mono font-bold"
                  >
                    Authorize
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowAdd(true)}
              className="w-full py-2.5 border border-dashed border-slate-300 hover:border-slate-400 rounded-xl text-xs font-mono font-bold text-slate-600 flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Link Another Device</span>
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-mono font-bold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
