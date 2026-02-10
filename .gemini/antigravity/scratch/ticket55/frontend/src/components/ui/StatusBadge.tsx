import React from 'react';

export type Status = 'new' | 'assigned' | 'in_progress' | 'resolved' | 'closed' | 'urgent';

interface StatusConfigItem {
  label: string;
  color: string;
  icon: string | React.ReactNode;
}

const statusConfig: Record<Status, StatusConfigItem> = {
  new: {
    label: 'Nouveau',
    color: 'bg-blue-100 text-blue-700',
    icon: '🆕',
  },
  assigned: {
    label: 'Assigné',
    color: 'bg-indigo-100 text-indigo-700',
    icon: '👤',
  },
  in_progress: {
    label: 'En cours',
    color: 'bg-amber-100 text-amber-700',
    icon: '⚙️',
  },
  resolved: {
    label: 'Résolu',
    color: 'bg-emerald-100 text-emerald-700',
    icon: '✅',
  },
  closed: {
    label: 'Fermé',
    color: 'bg-slate-100 text-slate-700',
    icon: '🔒',
  },
  urgent: {
    label: 'Urgent',
    color: 'bg-red-100 text-red-700',
    icon: '⚠',
  },
};

export interface StatusBadgeProps {
  status: Status;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export function StatusBadge({ status, size = 'md', showIcon = true }: StatusBadgeProps) {
  // Fallback to 'new' if status is not found in config
  const config = statusConfig[status] || statusConfig.new;
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  };

  return (
    <span className={`
      inline-flex items-center gap-1.5 rounded-full font-semibold
      ${config.color}
      ${sizeClasses[size]}
      ${showIcon ? '' : 'gap-0'}
    `}>
      {showIcon && <span className="text-[10px] leading-none">{config.icon}</span>}
      {config.label}
    </span>
  );
}
