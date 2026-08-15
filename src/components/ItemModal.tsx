import React, { useState, useEffect } from 'react';
import {
  VaultItem,
  ItemType,
} from '../types/vault';
import {
  X,
  Eye,
  EyeOff,
  Copy,
  Check,
  Sparkles,
  Trash2,
  Lock,
  Fingerprint,
  FileText,
  CreditCard,
  Terminal,
  ExternalLink,
} from 'lucide-react';
import { ServiceIcon } from './ServiceIcon';
import { TotpBadge } from './TotpBadge';
import { generatePassword, analyzePassword } from '../crypto/vaultCrypto';

interface ItemModalProps {
  isOpen: boolean;
  item: VaultItem | null;
  mode: 'view' | 'edit' | 'create';
  initialType?: ItemType;
  onClose: () => void;
  onSave: (item: VaultItem) => void;
  onDelete: (itemId: string) => void;
  onCopyText: (text: string, label: string) => void;
}

export const ItemModal: React.FC<ItemModalProps> = ({
  isOpen,
  item,
  mode: initialMode,
  initialType = 'login',
  onClose,
  onSave,
  onDelete,
  onCopyText,
}) => {
  const [mode, setMode] = useState<'view' | 'edit' | 'create'>(initialMode);
  const [itemType, setItemType] = useState<ItemType>(item?.type || initialType);

  // Form states
  const [title, setTitle] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [secret, setSecret] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('General');
  const [notes, setNotes] = useState('');
  const [totpSecret, setTotpSecret] = useState('');
  const [favorite, setFavorite] = useState(false);

  // UI helpers
  const [showSecret, setShowSecret] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    setMode(initialMode);
    if (item) {
      setItemType(item.type);
      setTitle(item.title || '');
      setIdentifier(item.identifier || '');
      setSecret(item.secret || '');
      setUrl(item.url || '');
      setCategory(item.category || 'General');
      setNotes(item.notes || '');
      setTotpSecret(item.totpSecret || '');
      setFavorite(item.favorite || false);
    } else {
      setItemType(initialType);
      setTitle('');
      setIdentifier('');
      setSecret(
        initialType === 'login'
          ? generatePassword({
              length: 20,
              useUpper: true,
              useLower: true,
              useNumbers: true,
              useSpecial: true,
              avoidAmbiguous: true,
              mode: 'random',
            })
          : ''
      );
      setUrl('');
      setCategory(initialType === 'identity' ? 'Identity' : initialType === 'key' ? 'API Key' : 'General');
      setNotes('');
      setTotpSecret('');
      setFavorite(false);
    }
  }, [item, initialMode, initialType, isOpen]);

  if (!isOpen) return null;

  const handleCopy = (text: string, label: string, keyId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyId);
    onCopyText(text, label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleGeneratePassword = () => {
    const newPass = generatePassword({
      length: 20,
      useUpper: true,
      useLower: true,
      useNumbers: true,
      useSpecial: true,
      avoidAmbiguous: true,
      mode: 'random',
    });
    setSecret(newPass);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const analysis = analyzePassword(secret);
    let healthStatus: VaultItem['healthStatus'] = 'strong';
    if (analysis.strength === 'weak' || analysis.strength === 'very_weak') healthStatus = 'weak';

    const updatedItem: VaultItem = {
      id: item?.id || 'vault-item-' + Date.now(),
      type: itemType,
      title: title.trim(),
      identifier: identifier.trim() || 'Vault Item',
      secret: secret,
      url: url.trim(),
      category: category.trim(),
      notes: notes.trim(),
      tags: item?.tags || [],
      lastAccessed: 'Just now',
      createdAt: item?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      favorite: favorite,
      healthStatus: healthStatus,
      totpSecret: totpSecret.trim() || undefined,
    };

    onSave(updatedItem);
    onClose();
  };

  const analysis = analyzePassword(secret);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white border-t sm:border border-slate-200 rounded-t-3xl sm:rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-0 sm:fade-in flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ServiceIcon title={title || 'New Item'} type={itemType} size="md" />
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                {mode === 'create'
                  ? 'New Credential'
                  : mode === 'edit'
                  ? `Edit ${title || 'Credential'}`
                  : title || 'Credential Details'}
              </h3>
              <span className="text-[11px] text-slate-500 font-mono">
                {mode === 'view' ? 'AES-256 Encrypted' : 'Stored securely on device'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {mode === 'view' && (
              <button
                onClick={() => setMode('edit')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-mono font-bold transition-colors cursor-pointer"
              >
                Edit
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs sm:text-sm">
          {/* Type Selector for New Entry */}
          {mode === 'create' && (
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1.5 font-bold">
                Item Type
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['login', 'identity', 'note', 'key'] as ItemType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setItemType(t)}
                    className={`py-2 px-2 rounded-xl text-xs font-mono font-bold border capitalize transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      itemType === t
                        ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {t === 'login' && <Lock className="w-3.5 h-3.5" />}
                    {t === 'identity' && <Fingerprint className="w-3.5 h-3.5" />}
                    {t === 'note' && <FileText className="w-3.5 h-3.5" />}
                    {t === 'key' && <Terminal className="w-3.5 h-3.5" />}
                    <span>{t}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1 font-bold">
                Service / Title
              </label>
              {mode === 'view' ? (
                <div className="text-slate-900 font-bold bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-mono">
                  {title}
                </div>
              ) : (
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. GitHub, Google, Slack"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-800 focus:bg-white font-mono"
                />
              )}
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1 font-bold">
                Category
              </label>
              {mode === 'view' ? (
                <div className="text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-mono">
                  {category}
                </div>
              ) : (
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Work, Personal"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-800 focus:bg-white font-mono"
                />
              )}
            </div>
          </div>

          {/* Username / Identifier */}
          <div>
            <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1 font-bold">
              Username / Email
            </label>
            <div className="flex items-center gap-2">
              {mode === 'view' ? (
                <div className="text-slate-900 font-mono bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex-1 truncate">
                  {identifier || '—'}
                </div>
              ) : (
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="username or email"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-800 focus:bg-white font-mono"
                />
              )}
              {identifier && (
                <button
                  type="button"
                  onClick={() => handleCopy(identifier, 'Username', 'id-user')}
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
                  title="Copy Username"
                >
                  {copiedKey === 'id-user' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>

          {/* Password / Secret */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                Password
              </label>
              {mode !== 'view' && (
                <button
                  type="button"
                  onClick={handleGeneratePassword}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-mono flex items-center gap-1 cursor-pointer font-bold"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate New</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type={showSecret ? 'text' : 'password'}
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  readOnly={mode === 'view'}
                  placeholder="Password secret..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-800 focus:bg-white font-mono pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
                  title={showSecret ? 'Hide' : 'Reveal'}
                >
                  {showSecret ? <EyeOff className="w-4 h-4 text-indigo-600" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {secret && (
                <button
                  type="button"
                  onClick={() => handleCopy(secret, 'Password', 'id-pass')}
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
                  title="Copy Password"
                >
                  {copiedKey === 'id-pass' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>

            {secret && (
              <div className="mt-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[11px] font-mono flex items-center justify-between">
                <span className="text-slate-700 font-bold">
                  Strength: {analysis.strength.replace('_', ' ').toUpperCase()} ({analysis.entropyBits} bits)
                </span>
                <span className="text-slate-500">{analysis.crackTimeEstimate}</span>
              </div>
            )}
          </div>

          {/* Website URL */}
          <div>
            <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1 font-bold">
              Website URL
            </label>
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                readOnly={mode === 'view'}
                placeholder="https://..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-800 focus:bg-white font-mono"
              />
              {url && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                  title="Open link in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* 2FA TOTP Secret */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                2FA Authenticator Key
              </label>
              {totpSecret && <TotpBadge secret={totpSecret} showCode={true} />}
            </div>
            <input
              type="text"
              value={totpSecret}
              onChange={(e) => setTotpSecret(e.target.value)}
              readOnly={mode === 'view'}
              placeholder="Base32 secret (optional)"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-800 focus:bg-white font-mono"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1 font-bold">
              Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              readOnly={mode === 'view'}
              placeholder="Recovery codes, pin, or private notes..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-slate-800 focus:bg-white"
            />
          </div>
        </form>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div>
            {item && mode !== 'create' && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Delete this credential?')) {
                    onDelete(item.id);
                    onClose();
                  }
                }}
                className="text-xs text-rose-600 hover:text-rose-800 font-mono font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-mono font-bold transition-colors cursor-pointer"
            >
              {mode === 'view' ? 'Close' : 'Cancel'}
            </button>

            {mode !== 'view' && (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-bold uppercase tracking-wider shadow-xs transition-all cursor-pointer"
              >
                Save
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
