import React from 'react';

interface StatIconProps {
  type: 'onTime' | 'late' | 'inProgress' | 'overdue';
  showLabel?: boolean;
}

const StatIcon: React.FC<StatIconProps> = ({ type, showLabel = false }) => {
  const config = {
    onTime: {
      icon: '✓',
      label: 'Вовремя',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30'
    },
    late: {
      icon: '⚠',
      label: 'С опозданием',
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30'
    },
    inProgress: {
      icon: '⟳',
      label: 'В процессе',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30'
    },
    overdue: {
      icon: '!',
      label: 'Просрочено',
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900/30'
    }
  };

  const { icon, label, color, bgColor } = config[type];

  if (showLabel) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs ${bgColor} ${color}`}>
        <span>{icon}</span>
        <span>{label}</span>
      </div>
    );
  }

  return (
    <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs ${bgColor} ${color}`} title={label}>
      {icon}
    </span>
  );
};

export default StatIcon;