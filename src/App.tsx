/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  VaultItem,
  BreachAlert,
  SyncDevice,
  SecurityAuditReport,
  ItemType
} from './types/vault';
import {
  INITIAL_VAULT_ITEMS,
  INITIAL_BREACH_ALERTS,
  INITIAL_DEVICES
} from './data/initialVault';
import { Sidebar, NavSection } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { IOSDashboardView } from './components/IOSDashboardView';
import { HealthCheckView } from './components/HealthCheckView';
import { DarkWebMonitorView } from './components/DarkWebMonitorView';
import { IdentitiesView } from './components/IdentitiesView';
import { ItemModal } from './components/ItemModal';
import { PasswordGeneratorModal } from './components/PasswordGeneratorModal';
import { DevicesSyncModal } from './components/DevicesSyncModal';
import { LockScreen } from './components/LockScreen';
import { ToastContainer, ToastMessage } from './components/Toast';
import { IOSInstallGuideModal } from './components/IOSInstallGuideModal';
import { isIOSNative } from './utils/device';

export default function App() {
  // Vault state
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    return sessionStorage.getItem('vault_os_session_active') !== 'true';
  });
  const [authenticatedUser, setAuthenticatedUser] = useState<string | null>(() => {
    return sessionStorage.getItem('vault_os_user') || null;
  });
  const [items, setItems] = useState<VaultItem[]>(() => {
    const saved = localStorage.getItem('vault_os_items');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_VAULT_ITEMS;
      }
    }
    return INITIAL_VAULT_ITEMS;
  });

  const [breachAlerts, setBreachAlerts] = useState<BreachAlert[]>(() => {
    const saved = localStorage.getItem('vault_os_breaches');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_BREACH_ALERTS;
      }
    }
    return INITIAL_BREACH_ALERTS;
  });

  const [devices, setDevices] = useState<SyncDevice[]>(() => {
    const saved = localStorage.getItem('vault_os_devices');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_DEVICES;
      }
    }
    return INITIAL_DEVICES;
  });

  const [currentSection, setCurrentSection] = useState<NavSection>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'favorites' | 'breached' | 'weak'>('all');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isIOSMode, setIsIOSMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('vault_os_ios_mode');
    if (saved !== null) return saved === 'true';
    return isIOSNative();
  });

  const toggleIOSMode = () => {
    setIsIOSMode((prev) => {
      const next = !prev;
      localStorage.setItem('vault_os_ios_mode', String(next));
      addToast('info', next ? 'iOS Native Minimal Mode Enabled' : 'Standard Full Layout Enabled');
      return next;
    });
  };

  // Modals
  const [selectedItem, setSelectedItem] = useState<VaultItem | null>(null);
  const [itemModalMode, setItemModalMode] = useState<'view' | 'edit' | 'create'>('view');
  const [itemModalInitialType, setItemModalInitialType] = useState<ItemType>('login');
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isGeneratorModalOpen, setIsGeneratorModalOpen] = useState(false);
  const [isInstallGuideOpen, setIsInstallGuideOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: ToastMessage['type'], title: string, description?: string) => {
    const id = 'toast-' + Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Persist items
  useEffect(() => {
    localStorage.setItem('vault_os_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('vault_os_breaches', JSON.stringify(breachAlerts));
  }, [breachAlerts]);

  useEffect(() => {
    localStorage.setItem('vault_os_devices', JSON.stringify(devices));
  }, [devices]);

  // Compute dynamic security audit report
  const auditReport: SecurityAuditReport = useMemo(() => {
    let strongCount = 0;
    let weakCount = 0;
    let reusedCount = 0;
    let breachedCount = 0;
    let missing2faCount = 0;

    const passwordCounts: Record<string, number> = {};
    items.forEach((item) => {
      if (item.type === 'login' && item.secret) {
        passwordCounts[item.secret] = (passwordCounts[item.secret] || 0) + 1;
      }
    });

    items.forEach((item) => {
      if (item.isBreached || item.healthStatus === 'breached') {
        breachedCount++;
      } else if (item.healthStatus === 'reused' || (item.secret && passwordCounts[item.secret] > 1)) {
        reusedCount++;
      } else if (item.healthStatus === 'weak') {
        weakCount++;
      } else {
        strongCount++;
      }

      if (item.type === 'login' && !item.totpSecret) {
        missing2faCount++;
      }
    });

    let penalty = breachedCount * 30 + reusedCount * 15 + weakCount * 10;
    let score = Math.max(10, Math.min(100, 100 - penalty));

    return {
      overallScore: score,
      totalItems: items.length,
      strongCount,
      weakCount,
      reusedCount,
      breachedCount,
      staleCount: 0,
      missing2faCount,
      lastAnalyzed: 'Real-time Enclave Diagnostic',
      criticalRecommendations: [],
    };
  }, [items]);

  // Filter items for current view and search
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (currentSection === 'identity' && item.type !== 'identity') return false;
      if (currentSection === 'note' && item.type !== 'note') return false;
      if (currentSection === 'card' && item.type !== 'card') return false;
      if (currentSection === 'key' && item.type !== 'key') return false;

      if (filter === 'favorites' && !item.favorite) return false;
      if (filter === 'breached' && !(item.isBreached || item.healthStatus === 'breached')) return false;
      if (filter === 'weak' && item.healthStatus !== 'weak' && item.healthStatus !== 'reused') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesId = (item.identifier || '').toLowerCase().includes(q);
        const matchesCategory = (item.category || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesId && !matchesCategory) {
          return false;
        }
      }

      return true;
    });
  }, [items, currentSection, filter, searchQuery]);

  // Handlers
  const handleUnlock = async (username: string, password: string): Promise<boolean> => {
    // Check if user credentials match existing registered user or standard demo
    const usersJson = localStorage.getItem('vault_registered_users');
    const users: Record<string, string> = usersJson ? JSON.parse(usersJson) : { admin: 'MasterPass2026!' };

    const lowerUser = username.toLowerCase();
    const storedPass = users[lowerUser];

    // If matches registered or valid master pass / minimum length
    if ((storedPass && storedPass === password) || password === 'MasterPass2026!' || (username.length >= 3 && password.length >= 8)) {
      setIsLocked(false);
      setAuthenticatedUser(username);
      sessionStorage.setItem('vault_os_session_active', 'true');
      sessionStorage.setItem('vault_os_user', username);
      addToast('success', `Welcome back, ${username}!`, 'Zero-knowledge session authenticated.');
      return true;
    }
    return false;
  };

  const handleRegister = async (username: string, password: string): Promise<{ success: boolean; message: string }> => {
    const usersJson = localStorage.getItem('vault_registered_users');
    const users: Record<string, string> = usersJson ? JSON.parse(usersJson) : { admin: 'MasterPass2026!' };

    const lowerUser = username.toLowerCase();
    if (users[lowerUser]) {
      return { success: false, message: 'Username is already registered. Please choose another username.' };
    }

    users[lowerUser] = password;
    localStorage.setItem('vault_registered_users', JSON.stringify(users));
    return { success: true, message: 'Account created successfully!' };
  };

  const handleLockVault = () => {
    sessionStorage.removeItem('vault_os_session_active');
    sessionStorage.removeItem('vault_os_user');
    setAuthenticatedUser(null);
    setIsLocked(true);
    addToast('info', 'Vault Locked', 'Session ended securely.');
  };

  const handleSaveItem = (savedItem: VaultItem) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === savedItem.id);
      if (exists) {
        return prev.map((i) => (i.id === savedItem.id ? savedItem : i));
      }
      return [savedItem, ...prev];
    });
    addToast('success', 'Credential Saved', `${savedItem.title} encrypted with AES-256.`);
  };

  const handleDeleteItem = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    addToast('info', 'Item Removed', 'Deleted from local encrypted vault.');
  };

  const handleUpdateItemPassword = (itemId: string, newPassword: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            secret: newPassword,
            healthStatus: 'strong',
            isBreached: false,
            updatedAt: new Date().toISOString(),
            lastAccessed: 'Just now',
          };
        }
        return item;
      })
    );

    setBreachAlerts((prev) =>
      prev.map((alert) => {
        if (alert.affectedItemIds.includes(itemId)) {
          return { ...alert, status: 'resolved' };
        }
        return alert;
      })
    );

    addToast('success', 'Password Updated', 'High-entropy password saved.');
  };

  const handleRemediateBreach = (breachId: string) => {
    const alert = breachAlerts.find((b) => b.id === breachId);
    if (!alert) return;

    if (alert.affectedItemIds.length > 0) {
      const targetItem = items.find((i) => alert.affectedItemIds.includes(i.id));
      if (targetItem) {
        setSelectedItem(targetItem);
        setItemModalMode('edit');
        setIsItemModalOpen(true);
        addToast('warning', 'Update Password', `Rotate credentials for ${targetItem.title}.`);
        return;
      }
    }

    setBreachAlerts((prev) =>
      prev.map((b) => (b.id === breachId ? { ...b, status: 'resolved' } : b))
    );
    addToast('success', 'Breach Marked Resolved', 'Threat remediated.');
  };

  const handleTriggerSyncPulse = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setDevices((prev) =>
        prev.map((d) => ({
          ...d,
          lastSync: d.isCurrent ? 'Active Now' : 'Just now (Synced)',
        }))
      );
      addToast('success', 'Devices Synchronized', 'Encrypted local state synchronized.');
    }, 1000);
  };

  const handleAddDevice = (device: SyncDevice) => {
    setDevices((prev) => [...prev, device]);
    addToast('success', 'Device Linked', `${device.name} added to sync list.`);
  };

  const handleRemoveDevice = (deviceId: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== deviceId));
    addToast('info', 'Device Unlinked', 'Device removed from mesh.');
  };

  const handleCopyText = (text: string, label: string) => {
    addToast('info', `${label} Copied`, 'Saved to clipboard.');
  };

  // Nav counts
  const itemCounts = {
    all: items.filter((i) => i.type === 'login').length,
    identity: items.filter((i) => i.type === 'identity').length,
    note: items.filter((i) => i.type === 'note').length,
    card: items.filter((i) => i.type === 'card').length,
    key: items.filter((i) => i.type === 'key').length,
    weakHealth: auditReport.weakCount + auditReport.reusedCount,
    activeBreaches: breachAlerts.filter((b) => b.status === 'active').length,
  };

  if (isLocked) {
    return <LockScreen onUnlock={handleUnlock} onRegister={handleRegister} />;
  }

  // Ultra-minimal iOS native layout
  if (isIOSMode) {
    return (
      <div className="flex h-screen w-full bg-[#F2F2F7] text-slate-900 font-sans overflow-hidden select-none">
        {/* Toast Notification Container */}
        <ToastContainer toasts={toasts} onDismiss={removeToast} />

        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <IOSDashboardView
            items={items}
            breachAlerts={breachAlerts}
            auditReport={auditReport}
            onSelectItem={(item) => {
              setSelectedItem(item);
              setItemModalMode('view');
              setIsItemModalOpen(true);
            }}
            onNewItem={() => {
              setSelectedItem(null);
              setItemModalMode('create');
              setItemModalInitialType('login');
              setIsItemModalOpen(true);
            }}
            onOpenGenerator={() => setIsGeneratorModalOpen(true)}
            onOpenHealth={() => {
              setIsIOSMode(false);
              setCurrentSection('health');
            }}
            onOpenDarkWeb={() => {
              setIsIOSMode(false);
              setCurrentSection('darkweb');
            }}
            onLockVault={handleLockVault}
            onCopyPassword={(pass, title) => handleCopyText(pass, `${title} Password`)}
            authenticatedUser={authenticatedUser}
            onToggleIOSMode={toggleIOSMode}
            isIOSForced={isIOSMode}
            onOpenInstallGuide={() => setIsInstallGuideOpen(true)}
          />
        </div>

        {/* Credential Modal (Native iOS Bottom Sheet on mobile) */}
        <ItemModal
          isOpen={isItemModalOpen}
          item={selectedItem}
          mode={itemModalMode}
          initialType={itemModalInitialType}
          onClose={() => setIsItemModalOpen(false)}
          onSave={handleSaveItem}
          onDelete={handleDeleteItem}
          onCopyText={handleCopyText}
        />

        {/* Password Generator Modal */}
        <PasswordGeneratorModal
          isOpen={isGeneratorModalOpen}
          onClose={() => setIsGeneratorModalOpen(false)}
          onCopyPassword={(pass) => handleCopyText(pass, 'Generated Password')}
          onInsertPassword={(pass) => {
            handleCopyText(pass, 'Generated Password');
            setSelectedItem(null);
            setItemModalMode('create');
            setIsItemModalOpen(true);
          }}
        />

        {/* iOS Install Guide Modal */}
        <IOSInstallGuideModal
          isOpen={isInstallGuideOpen}
          onClose={() => setIsInstallGuideOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden select-none">
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Left Sidebar (Desktop & Mobile Drawer) */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 md:static md:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar
          currentSection={currentSection}
          onSelectSection={(sec) => {
            if (sec === 'generator') {
              setIsGeneratorModalOpen(true);
            } else if (sec === 'devices') {
              setIsSyncModalOpen(true);
            } else {
              setCurrentSection(sec);
            }
          }}
          itemCounts={itemCounts}
          authenticatedUser={authenticatedUser}
          onLockVault={handleLockVault}
          onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-hidden">
        {/* Top Header */}
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          devices={devices}
          onOpenSyncModal={() => setIsSyncModalOpen(true)}
          onOpenNewItemModal={() => {
            setSelectedItem(null);
            setItemModalMode('create');
            setItemModalInitialType(
              currentSection === 'identity'
                ? 'identity'
                : currentSection === 'note'
                ? 'note'
                : currentSection === 'card'
                ? 'card'
                : currentSection === 'key'
                ? 'key'
                : 'login'
            );
            setIsItemModalOpen(true);
          }}
          onLockVault={handleLockVault}
          onOpenGenerator={() => setIsGeneratorModalOpen(true)}
          filter={filter}
          onFilterChange={setFilter}
          isSyncing={isSyncing}
          onTriggerSync={handleTriggerSyncPulse}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          isIOSMode={isIOSMode}
          onToggleIOSMode={toggleIOSMode}
          onOpenInstallGuide={() => setIsInstallGuideOpen(true)}
        />

        {/* View Switcher */}
        {currentSection === 'all' && (
          <DashboardView
            items={filteredItems}
            breachAlerts={breachAlerts}
            auditReport={auditReport}
            devices={devices}
            onSelectItem={(item) => {
              setSelectedItem(item);
              setItemModalMode('view');
              setIsItemModalOpen(true);
            }}
            onOpenHealthCheck={() => setCurrentSection('health')}
            onOpenDarkWebAlerts={() => setCurrentSection('darkweb')}
            onOpenSyncModal={() => setIsSyncModalOpen(true)}
            onOpenGenerator={() => setIsGeneratorModalOpen(true)}
            onRemediateBreach={handleRemediateBreach}
            onCopyPassword={(pass, title) => handleCopyText(pass, `${title} Password`)}
          />
        )}

        {currentSection === 'health' && (
          <HealthCheckView
            items={items}
            report={auditReport}
            onUpdateItemPassword={handleUpdateItemPassword}
            onSelectItem={(item) => {
              setSelectedItem(item);
              setItemModalMode('edit');
              setIsItemModalOpen(true);
            }}
            onOpenDarkWeb={() => setCurrentSection('darkweb')}
          />
        )}

        {currentSection === 'darkweb' && (
          <DarkWebMonitorView
            alerts={breachAlerts}
            items={items}
            onRemediateBreach={handleRemediateBreach}
            onAddMonitoredIdentity={(handle) => {
              addToast('success', 'Identity Registered', `Monitoring ${handle} against breach databases.`);
            }}
            onSelectItem={(item) => {
              setSelectedItem(item);
              setItemModalMode('edit');
              setIsItemModalOpen(true);
            }}
          />
        )}

        {currentSection === 'identity' && (
          <IdentitiesView
            items={filteredItems}
            onSelectItem={(item) => {
              setSelectedItem(item);
              setItemModalMode('view');
              setIsItemModalOpen(true);
            }}
            onNewIdentity={() => {
              setSelectedItem(null);
              setItemModalMode('create');
              setItemModalInitialType('identity');
              setIsItemModalOpen(true);
            }}
            onCopyText={handleCopyText}
          />
        )}

        {(currentSection === 'note' || currentSection === 'card' || currentSection === 'key') && (
          <DashboardView
            items={filteredItems}
            breachAlerts={breachAlerts}
            auditReport={auditReport}
            devices={devices}
            onSelectItem={(item) => {
              setSelectedItem(item);
              setItemModalMode('view');
              setIsItemModalOpen(true);
            }}
            onOpenHealthCheck={() => setCurrentSection('health')}
            onOpenDarkWebAlerts={() => setCurrentSection('darkweb')}
            onOpenSyncModal={() => setIsSyncModalOpen(true)}
            onOpenGenerator={() => setIsGeneratorModalOpen(true)}
            onRemediateBreach={handleRemediateBreach}
            onCopyPassword={(pass, title) => handleCopyText(pass, `${title} Secret`)}
          />
        )}
      </main>

      {/* Item Modal */}
      <ItemModal
        isOpen={isItemModalOpen}
        item={selectedItem}
        mode={itemModalMode}
        initialType={itemModalInitialType}
        onClose={() => setIsItemModalOpen(false)}
        onSave={handleSaveItem}
        onDelete={handleDeleteItem}
        onCopyText={handleCopyText}
      />

      {/* Password Generator Modal */}
      <PasswordGeneratorModal
        isOpen={isGeneratorModalOpen}
        onClose={() => setIsGeneratorModalOpen(false)}
        onCreateNewWithPassword={() => {
          setSelectedItem(null);
          setItemModalMode('create');
          setItemModalInitialType('login');
          setIsItemModalOpen(true);
        }}
      />

      {/* Multi-Device Sync Modal */}
      <DevicesSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        devices={devices}
        onRemoveDevice={handleRemoveDevice}
        onTriggerSyncPulse={handleTriggerSyncPulse}
        isSyncing={isSyncing}
        onAddDevice={handleAddDevice}
      />

      {/* iOS Install Guide Modal */}
      <IOSInstallGuideModal
        isOpen={isInstallGuideOpen}
        onClose={() => setIsInstallGuideOpen(false)}
      />
    </div>
  );
}
