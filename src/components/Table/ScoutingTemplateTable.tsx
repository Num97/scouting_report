import React, { useState } from 'react'
import { ChevronRight, ChevronDown } from 'lucide-react'
import type { ScoutingReportItem } from '../../utils/forms'
import { useTemplateScoutingData } from '../../hooks/useTemplateScoutingData'
import type { ExpandedRows } from '../../types/scouting'
import StatsCell from './StatsCell'
import DetailTable from './DetailTable'

interface Props {
  data: ScoutingReportItem[]
}

const ScoutingTemplateTable: React.FC<Props> = ({ data }) => {
  const [expandedTemplates, setExpandedTemplates] = useState<ExpandedRows>(new Set())
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null)

  const { templates } = useTemplateScoutingData(data)

  const toggleTemplate = (templateName: string) => {
    setExpandedTemplates(prev => {
      const next = new Set(prev)
      next.has(templateName) ? next.delete(templateName) : next.add(templateName)
      return next
    })
  }

  if (!data.length) {
    return (
      <div className="text-center py-8 text-stone-500 dark:text-stone-400">
        Нет данных для отображения
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-stone-200 dark:border-stone-700">
      <table className="w-full text-sm table-fixed">

        <colgroup>
          <col style={{ width: '5%' }} />
          <col style={{ width: '20%' }} />
          <col style={{ width: '15%' }} />
          <col style={{ width: '15%' }} />
          <col style={{ width: '15%' }} />
          <col style={{ width: '15%' }} />
          <col style={{ width: '15%' }} />
        </colgroup>

        <thead className="bg-stone-100 dark:bg-stone-800 sticky top-0 z-10">
          <tr>
            <th />
            <th className="text-left px-4 py-3 font-medium text-stone-700 dark:text-stone-200">
              Вид задания
            </th>

            {['onTime', 'late', 'inProgress', 'overdue'].map(type => (
              <th
                key={type}
                className="text-center px-3 py-3 font-medium text-stone-700 dark:text-stone-200"
                onMouseEnter={() => setHoveredColumn(type)}
                onMouseLeave={() => setHoveredColumn(null)}
              >
                {type === 'onTime' && 'Вовремя'}
                {type === 'late' && 'С опозданием'}
                {type === 'inProgress' && 'В процессе'}
                {type === 'overdue' && 'Просрочено'}
              </th>
            ))}

            <th className="text-center px-3 py-3 font-medium">
              Всего
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-stone-200 dark:divide-stone-700">
          {templates.map(template => (
            <React.Fragment key={template.templateName}>

              <tr className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                <td className="px-2 py-3">
                  <button
                    onClick={() => toggleTemplate(template.templateName)}
                    className="p-1 rounded hover:bg-stone-200 dark:hover:bg-stone-700"
                  >
                    {expandedTemplates.has(template.templateName) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                </td>

                <td className="px-4 py-3 font-semibold">
                  {template.templateName}
                </td>

                <StatsCell
                  value={template.stats.onTime}
                  total={template.stats.total}
                  type="onTime"
                  isHighlighted={hoveredColumn === 'onTime'}
                />
                <StatsCell
                  value={template.stats.late}
                  total={template.stats.total}
                  type="late"
                  isHighlighted={hoveredColumn === 'late'}
                />
                <StatsCell
                  value={template.stats.inProgress}
                  total={template.stats.total}
                  type="inProgress"
                  isHighlighted={hoveredColumn === 'inProgress'}
                />
                <StatsCell
                  value={template.stats.overdue}
                  total={template.stats.total}
                  type="overdue"
                  isHighlighted={hoveredColumn === 'overdue'}
                />

                <td className="text-center px-3 py-3 font-semibold">
                  {template.stats.total}
                </td>
              </tr>

              {expandedTemplates.has(template.templateName) && (
                <DetailTable items={template.items} />
              )}

            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ScoutingTemplateTable
