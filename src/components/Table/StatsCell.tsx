import React from 'react';
import StatIcon from './StatIcon';

interface StatsCellProps {
  value: number;
  total: number;
  type: 'onTime' | 'late' | 'inProgress' | 'overdue';
  small?: boolean;
  isHighlighted?: boolean;
}

const StatsCell: React.FC<StatsCellProps> = ({ 
  value, 
  total, 
  type, 
  small = false,
  isHighlighted = false 
}) => {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  
  const bgColors = {
    onTime: 'bg-emerald-50 dark:bg-emerald-950/30',
    late: 'bg-amber-50 dark:bg-amber-950/30',
    inProgress: 'bg-blue-50 dark:bg-blue-950/30',
    overdue: 'bg-rose-50 dark:bg-rose-950/30'
  };
  
  return (
    <td className={`text-center ${small ? 'px-2 py-1' : 'px-3 py-3'}`}>
      <div className={`
        flex flex-col items-center gap-1 rounded-lg transition-colors duration-150
        ${isHighlighted ? bgColors[type] : ''}
      `}>
        <div className="flex items-center gap-1">
          <StatIcon type={type} />
          <span className="font-medium text-stone-900 dark:text-stone-100">
            {value}
          </span>
        </div>
        <span className={`text-stone-500 dark:text-stone-400 ${small ? 'text-[10px]' : 'text-xs'}`}>
          ({percentage}%)
        </span>
      </div>
    </td>
  );
};

export default StatsCell;