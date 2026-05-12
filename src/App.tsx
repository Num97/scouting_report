import { useState, useEffect, useMemo } from "react";
import { ThemeProvider } from "./components/ui/theme-provider";
import { Header } from "./components/Header/Header";
import ScoutingTabs from "./components/ScoutingTabs/ScoutingTabs";
import ScoutingOverview from "./components/ScoutingOverview/ScoutingOverview";
import { TemplateManagerModal } from "./components/TemplateManager/TemplateManagerModal";
import { getScoutingReports, getScoutReportTemplates, getTemplateViews} from "./utils/api";
import type { ScoutingReportItem, ScoutReportTemplate, TemplateView } from "./utils/forms";
import DateRangeSlider from "./components/DateRangeSlider/DateRangeSlider";
import { useSearchParams } from "react-router-dom";

function App() {
  const [data, setData] = useState<ScoutingReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [templateViews, setTemplateViews] = useState<TemplateView[]>([]);
  const [templates, setTemplates] = useState<ScoutReportTemplate[]>([]);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const currentYear = new Date().getFullYear();

  const urlSeason = Number(searchParams.get("season")) || currentYear;

  useEffect(() => {
    if (!searchParams.get("season")) {
      setSearchParams({ ...Object.fromEntries(searchParams), season: String(currentYear) });
    }
  }, []);

  const [season, setSeason] = useState(urlSeason);

  const [range, setRange] = useState({
    start: new Date(season, 0, 1),
    end: new Date(season, 11, 31),
  });

  useEffect(() => {
    setRange({
      start: new Date(season, 0, 1),
      end: new Date(season, 11, 31),
    });
  }, [season]);

  // Загрузка template views
  useEffect(() => {
    const fetchTemplateViews = async () => {
      try {
        const views = await getTemplateViews();
        setTemplateViews(views);
      } catch (error) {
        console.error("Ошибка загрузки template views:", error);
      }
    };

    fetchTemplateViews();
  }, []);

  // Загрузка шаблонов
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const templatesData = await getScoutReportTemplates();
        setTemplates(templatesData);
      } catch (error) {
        console.error("Ошибка загрузки шаблонов:", error);
      }
    };

    fetchTemplates();
  }, []);

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const reports = await getScoutingReports(season);
        if (!active) return;
        setData(reports.filter(r => r.status !== "canceled"));
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchData();

    const intervalId = setInterval(async () => {
      const reports = await getScoutingReports(season);
      if (!active) return;
      setData(reports.filter(r => r.status !== "canceled"));
    }, 30_000);

    return () => {
      active = false;
      clearInterval(intervalId);
    };
  }, [season]);

  // Создаем Set с названиями шаблонов для быстрого поиска
  const templateNamesSet = useMemo(() => {
    return new Set(templateViews.map(tv => tv.scout_report_template_name));
  }, [templateViews]);

  // Фильтруем данные: исключаем записи, у которых scout_report_template_name есть в templateNamesSet
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const itemStart = new Date(item.start_time);
      const itemEnd = new Date(item.end_time);
      const isInDateRange = itemStart <= range.end && itemEnd >= range.start;
      
      if (!isInDateRange) return false;
      
      const shouldExclude = templateNamesSet.has(item.scout_report_template_name);
      
      return !shouldExclude;
    });
  }, [data, range, templateNamesSet]);

  const handleSeasonChange = (newSeason: number) => {
    setSeason(newSeason);
    setSearchParams({ ...Object.fromEntries(searchParams), season: String(newSeason) });
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-stone-50 dark:bg-stone-900 transition-colors duration-300">
        <Header 
          onSeasonChange={handleSeasonChange} 
          onOpenTemplateManager={() => setIsTemplateModalOpen(true)}
        />

        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-stone-300 dark:border-stone-600 border-t-stone-600 dark:border-t-stone-300"></div>
                <p className="mt-2 text-stone-600 dark:text-stone-400">Загрузка данных...</p>
              </div>
            ) : (
              <>
                <DateRangeSlider
                  start={range.start}
                  end={range.end}
                  min={new Date(season, 0, 1)}
                  max={new Date(season, 11, 31)}
                  onChange={(start, end) => setRange({ start, end })}
                />
                <ScoutingOverview data={filteredData} />
                <ScoutingTabs data={filteredData} />
              </>
            )}
          </div>
        </main>

        {/* Модальное окно управления шаблонами */}
        <TemplateManagerModal
          isOpen={isTemplateModalOpen}
          onClose={() => setIsTemplateModalOpen(false)}
          templates={templates}
          templateViews={templateViews}
          onTemplateViewsChange={setTemplateViews}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;