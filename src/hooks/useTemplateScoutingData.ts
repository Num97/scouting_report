import { useMemo } from 'react'
import type { ScoutingReportItem } from '../utils/forms'
import type { TemplateAggregate } from '../types/scouting'
import { parseDate } from '../utils/dateUtils'

export function useTemplateScoutingData(items: ScoutingReportItem[]) {
  const templates = useMemo(() => {
    const templateMap = new Map<string, TemplateAggregate>()

    items.forEach(item => {
      const templateName = item.scout_report_template_name || 'Без шаблона'

      if (!templateMap.has(templateName)) {
        templateMap.set(templateName, {
          templateName,
          templateDescription: item.scout_report_templates_description,
          stats: {
            onTime: 0,
            late: 0,
            inProgress: 0,
            overdue: 0,
            total: 0
          },
          items: []
        })
      }

      const template = templateMap.get(templateName)!
      template.items.push(item)

      if (item.status !== 'canceled') {
        template.stats.total++
      }

      const now = new Date()
      const endTime = parseDate(item.end_time)
      const updatedAt = parseDate(item.updated_at)

      if (item.status === 'done') {
        if (updatedAt <= endTime) {
          template.stats.onTime++
        } else {
          template.stats.late++
        }
      } else if (item.status === 'planned') {
        if (endTime < now) {
          template.stats.overdue++
        } else {
          template.stats.inProgress++
        }
      }
    })

    return Array.from(templateMap.values())
  }, [items])

  return { templates }
}
