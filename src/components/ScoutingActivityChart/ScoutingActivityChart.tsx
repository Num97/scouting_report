import React, { useMemo } from "react"
import Chart from "react-apexcharts"
import type { ScoutingReportItem } from "../../utils/forms"

interface Props {
  data: ScoutingReportItem[]
}

const ScoutingActivityChart: React.FC<Props> = ({ data }) => {
  const chartData = useMemo(() => {
    const map: Record<string, any> = {}

    const now = new Date()

    data.forEach((item) => {
      if (item.status === "canceled") return

      const date = new Date(item.end_time)
        .toISOString()
        .split("T")[0]

      if (!map[date]) {
        map[date] = {
          onTime: 0,
          late: 0,
          overdue: 0,
          planned: 0,
        }
      }

      const end = new Date(item.end_time)
      const updated = new Date(item.updated_at)

      if (item.status === "done") {
        updated <= end ? map[date].onTime++ : map[date].late++
      } else if (item.status === "planned") {
        end < now ? map[date].overdue++ : map[date].planned++
      }
    })

    const sortedDates = Object.keys(map).sort()

    return {
      categories: sortedDates,
      series: [
        {
          name: "Вовремя",
          data: sortedDates.map((d) => map[d].onTime),
        },
        {
          name: "С опозданием",
          data: sortedDates.map((d) => map[d].late),
        },
        {
          name: "В процессе",
          data: sortedDates.map((d) => map[d].planned),
        },
        {
          name: "Просрочено",
          data: sortedDates.map((d) => map[d].overdue),
        },
      ],
    }
  }, [data])

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "area",
      stacked: false,
      toolbar: { show: false },
      animations: { enabled: true },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.6,
        opacityTo: 0.1,
      },
    },
    xaxis: {
        categories: chartData.categories,
        labels: {
        style: {
            colors: "#838383",
        },
        },
    },

    yaxis: {
        labels: {
        style: {
            colors: "#838383",
        },
        },
    },
    colors: ["#16a34a", "#f97316", "#08b5ea", "#dc2626"],
    legend: {
      position: "top",
    labels: {
      colors: "#838383", // <-- вот здесь задаём цвет подписей серий
    },
    },
    grid: {
      borderColor: "#e5e7eb",
    },
  }

  return (
    <div className="bg-stone-100/80 dark:bg-stone-800/60 p-6 rounded-2xl shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-stone-700 dark:text-stone-300">
        Активность
      </h2>

      <Chart
        options={options}
        series={chartData.series}
        type="area"
        height={320}
      />
    </div>
  )
}

export default ScoutingActivityChart