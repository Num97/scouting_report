import React, { useMemo } from "react"
import { motion } from "framer-motion"
import type { ScoutingReportItem } from "../../utils/forms"

interface Props {
  data: ScoutingReportItem[]
}

const COLORS: Record<string, string> = {
  onTime: "bg-green-500",
  late: "bg-orange-500",
  inProgress: "bg-blue-500",
  overdue: "bg-red-500",
}

const LABELS: Record<string, string> = {
  onTime: "Вовремя",
  late: "С опозданием",
  inProgress: "В процессе",
  overdue: "Просрочено",
}

const ScoutingOverview: React.FC<Props> = ({ data }) => {
  const stats = useMemo(() => {
    const result: Record<string, number> = {
      onTime: 0,
      late: 0,
      inProgress: 0,
      overdue: 0,
      total: 0,
    }

    const now = new Date()

    data.forEach((item) => {
      if (item.status === "canceled") return
      result.total++

      const end = new Date(item.end_time)
      const updated = new Date(item.updated_at)

      if (item.status === "done") {
        updated <= end ? result.onTime++ : result.late++
      } else if (item.status === "planned") {
        end < now ? result.overdue++ : result.inProgress++
      }
    })

    return result
  }, [data])

  return (
  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
    {(["onTime", "late", "inProgress", "overdue"] as const).map((key) => {
      const value = stats[key]
      const percentage = stats.total ? Math.round((value / stats.total) * 100) : 0

      return (
        <div
          key={key}
          className="relative p-4 bg-stone-100 dark:bg-stone-800 rounded-2xl shadow hover:shadow-lg transition-shadow"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-stone-600 dark:text-stone-300">
              {LABELS[key]}
            </span>
            <span className="text-sm font-semibold text-stone-900 dark:text-white">
              {value}
            </span>
          </div>

          <div className="w-full h-2 bg-stone-300 dark:bg-stone-700 rounded-full overflow-hidden">
            <motion.div
              className={`${COLORS[key]} h-2 rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>

          <div className="mt-1 text-xs text-stone-500 dark:text-stone-400 text-right">
            {percentage}%
          </div>
        </div>
      )
    })}

    {/* Total блок */}
    <div className="relative p-4 bg-stone-100 dark:bg-stone-800 rounded-2xl shadow col-span-1 flex flex-col justify-center text-center">
      <span className="text-sm font-medium text-stone-600 dark:text-stone-300 mb-1">
        Всего заданий 
      </span>
      <span className="text-lg font-semibold text-stone-900 dark:text-white">
        {stats.total}
      </span>
    </div>
  </div>
)
}

export default ScoutingOverview
