import React, { useState } from 'react'
import { ChevronRight, ChevronDown } from 'lucide-react'
import type { ScoutingReportItem } from '../../utils/forms'
import { useScoutingData } from '../../hooks/useScoutingData'
import type { ExpandedRows } from '../../types/scouting'
import StatsCell from './StatsCell'
import DetailTable from './DetailTable'

interface ScoutingTableProps {
  data: ScoutingReportItem[]
}

const ScoutingTable: React.FC<ScoutingTableProps> = ({ data }) => {
  const [expandedGroups, setExpandedGroups] = useState<ExpandedRows>(new Set())
  const [expandedTemplates, setExpandedTemplates] = useState<ExpandedRows>(new Set())
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null)

  const { fieldGroups } = useScoutingData(data)

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev)
      next.has(groupName) ? next.delete(groupName) : next.add(groupName)
      return next
    })
  }

  const toggleTemplate = (templateKey: string) => {
    setExpandedTemplates(prev => {
      const next = new Set(prev)
      next.has(templateKey) ? next.delete(templateKey) : next.add(templateKey)
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
        {/* Фиксируем ширины колонок */}
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
            <th className="px-2 py-3" />
            <th className="text-left px-4 py-3 font-medium text-stone-700 dark:text-stone-200">
              Хозяйство
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
          {fieldGroups.map(group => (
            <React.Fragment key={group.fieldGroupName}>

              {/* ================== GROUP ROW ================== */}
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                <td className="px-2 py-3">
                  <button
                    onClick={() => toggleGroup(group.fieldGroupName)}
                    className="p-1 rounded hover:bg-stone-200 dark:hover:bg-stone-700"
                  >
                    {expandedGroups.has(group.fieldGroupName) ? (
                      <ChevronDown className="w-4 h-4 text-stone-600 dark:text-stone-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-stone-600 dark:text-stone-400" />
                    )}
                  </button>
                </td>

                <td className="px-4 py-3 font-semibold text-stone-900 dark:text-stone-100">
                  {group.fieldGroupName}
                </td>

                <StatsCell
                  value={group.stats.onTime}
                  total={group.stats.total}
                  type="onTime"
                  isHighlighted={hoveredColumn === 'onTime'}
                />
                <StatsCell
                  value={group.stats.late}
                  total={group.stats.total}
                  type="late"
                  isHighlighted={hoveredColumn === 'late'}
                />
                <StatsCell
                  value={group.stats.inProgress}
                  total={group.stats.total}
                  type="inProgress"
                  isHighlighted={hoveredColumn === 'inProgress'}
                />
                <StatsCell
                  value={group.stats.overdue}
                  total={group.stats.total}
                  type="overdue"
                  isHighlighted={hoveredColumn === 'overdue'}
                />

                <td className="text-center px-3 py-3 font-semibold text-stone-900 dark:text-stone-100">
                  {group.stats.total}
                </td>
              </tr>

              {/* ================== TEMPLATE ROWS ================== */}
              {expandedGroups.has(group.fieldGroupName) &&
                Array.from(group.reports.values()).map(template => {
                  const templateKey = `${group.fieldGroupName}::${template.templateName}`

                  return (
                    <React.Fragment key={templateKey}>

                      {/* ================== TEMPLATE ROW ================== */}
                      <tr className="bg-stone-50/60 dark:bg-stone-800/40 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
                        <td className="px-2 py-2">
                          <button
                            onClick={() => toggleTemplate(templateKey)}
                            className="p-1 rounded hover:bg-stone-200 dark:hover:bg-stone-700"
                          >
                            {expandedTemplates.has(templateKey) ? (
                              <ChevronDown className="w-3 h-3 text-stone-600 dark:text-stone-400" />
                            ) : (
                              <ChevronRight className="w-3 h-3 text-stone-600 dark:text-stone-400" />
                            )}
                          </button>
                        </td>

                        <td className="px-4 py-2 pl-10 text-stone-800 dark:text-stone-200">
                          {template.templateName}
                        </td>

                        <StatsCell
                          value={template.stats.onTime}
                          total={template.stats.total}
                          type="onTime"
                          small
                          isHighlighted={hoveredColumn === 'onTime'}
                        />
                        <StatsCell
                          value={template.stats.late}
                          total={template.stats.total}
                          type="late"
                          small
                          isHighlighted={hoveredColumn === 'late'}
                        />
                        <StatsCell
                          value={template.stats.inProgress}
                          total={template.stats.total}
                          type="inProgress"
                          small
                          isHighlighted={hoveredColumn === 'inProgress'}
                        />
                        <StatsCell
                          value={template.stats.overdue}
                          total={template.stats.total}
                          type="overdue"
                          small
                          isHighlighted={hoveredColumn === 'overdue'}
                        />

                        <td className="text-center px-3 py-2 text-stone-900 dark:text-stone-100">
                          {template.stats.total}
                        </td>
                      </tr>

                      {/* ================== DETAIL ROW ================== */}
                      {expandedTemplates.has(templateKey) && (
                        <DetailTable items={template.items} />
                      )}

                    </React.Fragment>
                  )
                })
              }

            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ScoutingTable
