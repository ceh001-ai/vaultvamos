import React from 'react';
import {
  FileText,
  CreditCard,
  Terminal,
  Fingerprint,
} from 'lucide-react';
import { ItemType } from '../types/vault';

interface ServiceIconProps {
  title: string;
  type?: ItemType;
  platformIcon?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ServiceIcon: React.FC<ServiceIconProps> = ({
  title,
  type = 'login',
  platformIcon,
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
  }[size];

  const lower = (platformIcon || title || '').toLowerCase();

  if (type === 'identity') {
    return (
      <div className={`${sizeClasses} rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold shrink-0 ${className}`}>
        <Fingerprint className="w-4 h-4" />
      </div>
    );
  }

  if (type === 'note') {
    return (
      <div className={`${sizeClasses} rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold shrink-0 ${className}`}>
        <FileText className="w-4 h-4" />
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className={`${sizeClasses} rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-bold shrink-0 ${className}`}>
        <CreditCard className="w-4 h-4" />
      </div>
    );
  }

  if (type === 'key') {
    return (
      <div className={`${sizeClasses} rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center font-bold shrink-0 ${className}`}>
        <Terminal className="w-4 h-4" />
      </div>
    );
  }

  // Brand letter / icon matcher for light theme
  let badgeColor = 'bg-slate-100 text-slate-800 border-slate-200';
  let letter = title ? title.charAt(0).toUpperCase() : 'V';

  if (lower.includes('github')) {
    badgeColor = 'bg-slate-900 text-white border-slate-900';
    letter = 'GH';
  } else if (lower.includes('google')) {
    badgeColor = 'bg-blue-50 text-blue-700 border-blue-200';
    letter = 'G';
  } else if (lower.includes('apple') || lower.includes('icloud')) {
    badgeColor = 'bg-slate-100 text-slate-900 border-slate-300';
    letter = '';
  } else if (lower.includes('stripe')) {
    badgeColor = 'bg-indigo-50 text-indigo-700 border-indigo-200';
    letter = 'S';
  } else if (lower.includes('aws') || lower.includes('amazon')) {
    badgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
    letter = 'AWS';
  }

  return (
    <div
      className={`${sizeClasses} rounded-xl ${badgeColor} border flex items-center justify-center font-bold font-mono shrink-0 shadow-xs`}
    >
      {letter}
    </div>
  );
};
