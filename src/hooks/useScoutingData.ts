import { useMemo } from 'react';
import type { ScoutingReportItem } from '../utils/forms';
import type { FieldGroupAggregate } from '../types/scouting';
import { parseDate } from '../utils/dateUtils';

export function useScoutingData(items: ScoutingReportItem[]) {
  const fieldGroups = useMemo(() => {
    const groups = new Map<string, FieldGroupAggregate>();

    items.forEach(item => {
      const groupName = item.field_group_name || 'Без хозяйства';
      
      if (!groups.has(groupName)) {
        groups.set(groupName, {
          fieldGroupName: groupName,
          stats: { onTime: 0, late: 0, inProgress: 0, overdue: 0, total: 0 },
          reports: new Map()
        });
      }

      const group = groups.get(groupName)!;
      if (item.status != 'canceled') {
        group.stats.total++;
      }
      // Агрегация по шаблонам
      const templateName = item.scout_report_template_name;
      if (!group.reports.has(templateName)) {
        group.reports.set(templateName, {
          templateName,
          templateDescription: item.scout_report_templates_description,
          stats: { onTime: 0, late: 0, inProgress: 0, overdue: 0, total: 0 },
          items: []
        });
      }

      const template = group.reports.get(templateName)!;
      template.items.push(item);
      if (item.status != 'canceled') {
        template.stats.total++;
      }

      // Подсчет статусов
      const now = new Date();
      const endTime = parseDate(item.end_time);
      const updatedAt = parseDate(item.updated_at);
      
      if (item.status === 'done') {
        if (updatedAt <= endTime) {
          group.stats.onTime++;
          template.stats.onTime++;
        } else {
          group.stats.late++;
          template.stats.late++;
        }
      } else if (item.status === 'planned') {
        if (endTime < now) {
          group.stats.overdue++;
          template.stats.overdue++;
        } else {
          group.stats.inProgress++;
          template.stats.inProgress++;
        }
      }
    });

    return Array.from(groups.values());
  }, [items]);

  return { fieldGroups };
}