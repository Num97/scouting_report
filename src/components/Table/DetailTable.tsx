import React from 'react';
import type { ScoutingReportItem } from '../../utils/forms';
import { formatDateShort } from '../../utils/dateUtils';
import { parseDate } from '../../utils/dateUtils';

interface DetailTableProps {
  items: ScoutingReportItem[];
}

const DetailTable: React.FC<DetailTableProps> = ({ items }) => {
  // Вспомогательная функция для получения даты без времени
  const getDateOnly = (dateStr: string): Date => {
    const date = parseDate(dateStr);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  // Функция для расчёта разницы в днях между двумя датами (без учёта времени)
  const diffInDays = (from: Date, to: Date) => {
    // Обрезаем время у обеих дат для чистоты расчёта
    const fromDate = new Date(from.getFullYear(), from.getMonth(), from.getDate());
    const toDate = new Date(to.getFullYear(), to.getMonth(), to.getDate());
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.round((toDate.getTime() - fromDate.getTime()) / msPerDay);
  };

  const pluralDays = (days: number) => {
    if (days === 1) return "день";
    if (days < 5) return "дня";
    return "дней";
  };

  const getStatusBadge = (item: ScoutingReportItem) => {
    // Получаем текущую дату без времени
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Получаем даты без времени
    const endDateOnly = getDateOnly(item.end_time);
    const updatedDateOnly = getDateOnly(item.updated_at);

    // DONE
    if (item.status === "done") {
      if (updatedDateOnly <= endDateOnly) {
        return (
          <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            Выполнено вовремя
          </span>
        );
      }

      const daysLate = diffInDays(endDateOnly, updatedDateOnly);

      return (
        <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
          Выполнено с опозданием · {daysLate} {pluralDays(daysLate)}
        </span>
      );
    }

    // PLANNED (не выполнено)
    if (endDateOnly < today) {
      const daysOverdue = diffInDays(endDateOnly, today);

      return (
        <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
          Просрочено · {daysOverdue} {pluralDays(daysOverdue)}
        </span>
      );
    }

    return (
      <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
        В процессе
      </span>
    );
  };

  return (
    <tr>
      <td colSpan={7} className="p-0">
        <div className="bg-white dark:bg-stone-900 py-2 pl-12 pr-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-stone-600 dark:text-stone-400 text-xs">
                <th className="text-left px-4 py-2 font-medium">Поле</th>
                <th className="text-left px-4 py-2 font-medium">Дата начала</th>
                <th className="text-left px-4 py-2 font-medium">Дата окончания</th>
                <th className="text-left px-4 py-2 font-medium">Статус</th>
                <th className="text-left px-4 py-2 font-medium">Отчет</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {items
                .filter(item => item.status !== "canceled")
                .map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-stone-50 dark:hover:bg-stone-800/50"
                  >
                    <td className="px-4 py-2 text-stone-900 dark:text-stone-100">
                      {item.field_name || "—"}
                    </td>
                    <td className="px-4 py-2 text-stone-700 dark:text-stone-300">
                      {formatDateShort(item.start_time)}
                    </td>
                    <td className="px-4 py-2 text-stone-700 dark:text-stone-300">
                      {formatDateShort(item.end_time)}
                    </td>
                    <td className="px-4 py-2">
                      {getStatusBadge(item)}
                    </td>
                    <td className="px-4 py-2">
                      {item.scout_report_id && (
                        <a
                          href={`https://operations.cropwise.com/fields/${item.field_id}/scout_reports/${item.scout_report_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                        >
                          Отчет № {item.scout_report_id}
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </td>
    </tr>
  );
};

export default DetailTable;