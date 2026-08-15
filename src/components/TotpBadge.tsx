import React, { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { generateTOTP } from '../crypto/totp';

interface TotpBadgeProps {
  secret: string;
  onCopy?: (code: string) => void;
  showCode?: boolean;
}

export const TotpBadge: React.FC<TotpBadgeProps> = ({ secret, onCopy, showCode = false }) => {
  const [totpData, setTotpData] = useState<{ code: string; secondsRemaining: number; progress: number }>({
    code: '------',
    secondsRemaining: 30,
    progress: 100,
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const update = async () => {
      if (!secret) return;
      const res = await generateTOTP(secret);
      if (isMounted) {
        setTotpData(res);
      }
    };

    update();
    const interval = setInterval(update, 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [secret]);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(totpData.code);
    setCopied(true);
    if (onCopy) onCopy(totpData.code);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!secret) return null;

  return (
    <div
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-md cursor-pointer transition-all group font-mono text-xs"
      title="Click to copy 2FA OTP code"
    >
      <div className="relative w-3 h-3 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 20 20">
          <circle
            cx="10"
            cy="10"
            r="8"
            className="text-slate-300"
            strokeWidth="2.5"
            stroke="currentColor"
            fill="transparent"
          />
          <circle
            cx="10"
            cy="10"
            r="8"
            className={totpData.secondsRemaining <= 5 ? 'text-rose-500' : 'text-indigo-600'}
            strokeWidth="2.5"
            strokeDasharray={50.26}
            strokeDashoffset={50.26 - (50.26 * totpData.progress) / 100}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
      </div>

      <span className="font-bold text-slate-800 tracking-wider text-[11px]">
        {showCode ? totpData.code : `${totpData.code.slice(0, 3)} ${totpData.code.slice(3)}`}
      </span>

      {copied ? (
        <Check className="w-3 h-3 text-emerald-600 shrink-0" />
      ) : (
        <Copy className="w-3 h-3 text-slate-400 group-hover:text-slate-700 shrink-0" />
      )}
    </div>
  );
};
