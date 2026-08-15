import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Zap,
} from 'lucide-react';
import {
  generatePassword,
  analyzePassword,
  GeneratorOptions,
  PasswordAnalysis
} from '../crypto/vaultCrypto';

interface PasswordGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPassword?: (password: string) => void;
  onCreateNewWithPassword?: (password: string) => void;
}

export const PasswordGeneratorModal: React.FC<PasswordGeneratorModalProps> = ({
  isOpen,
  onClose,
  onSelectPassword,
  onCreateNewWithPassword,
}) => {
  const [options, setOptions] = useState<GeneratorOptions>({
    length: 20,
    useUpper: true,
    useLower: true,
    useNumbers: true,
    useSpecial: true,
    avoidAmbiguous: true,
    mode: 'random',
    wordCount: 4,
  });

  const [password, setPassword] = useState('');
  const [analysis, setAnalysis] = useState<PasswordAnalysis | null>(null);
  const [copied, setCopied] = useState(false);

  const regenerate = () => {
    const p = generatePassword(options);
    setPassword(p);
    setAnalysis(analyzePassword(p));
  };

  useEffect(() => {
    if (isOpen) {
      regenerate();
    }
  }, [isOpen, options]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Password Generator</h3>
              <span className="text-xs text-slate-500 font-mono">
                Cryptographically randomized
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

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Output Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500 mb-1 flex items-center justify-between">
              <span>Entropy: {analysis?.entropyBits || 0} bits</span>
              <span className="text-emerald-600 font-bold">{analysis?.crackTimeEstimate}</span>
            </div>

            <div className="flex items-center justify-between gap-3 mt-2">
              <div className="font-mono text-base sm:text-lg font-bold text-slate-900 break-all select-all">
                {password}
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={regenerate}
                  className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
                  title="Generate new"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-colors"
                  title="Copy password"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            {/* Length Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-600 font-bold">Password Length:</span>
                <span className="text-slate-900 font-bold">{options.length} characters</span>
              </div>
              <input
                type="range"
                min={12}
                max={48}
                value={options.length}
                onChange={(e) => setOptions({ ...options, length: parseInt(e.target.value) })}
                className="w-full accent-slate-900"
              />
            </div>

            {/* Checkboxes */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-700">
              <label className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.useUpper}
                  onChange={(e) => setOptions({ ...options, useUpper: e.target.checked })}
                  className="accent-slate-900"
                />
                <span>A-Z Uppercase</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.useNumbers}
                  onChange={(e) => setOptions({ ...options, useNumbers: e.target.checked })}
                  className="accent-slate-900"
                />
                <span>0-9 Numbers</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.useSpecial}
                  onChange={(e) => setOptions({ ...options, useSpecial: e.target.checked })}
                  className="accent-slate-900"
                />
                <span>!@# Symbols</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.avoidAmbiguous}
                  onChange={(e) => setOptions({ ...options, avoidAmbiguous: e.target.checked })}
                  className="accent-slate-900"
                />
                <span>Avoid Ambiguous</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-mono font-bold"
          >
            Done
          </button>

          {onCreateNewWithPassword && (
            <button
              onClick={() => {
                onCreateNewWithPassword(password);
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-bold flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Use in New Entry</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
