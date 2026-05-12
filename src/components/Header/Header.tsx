import type { FC } from "react";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SunIcon from "../LiveIcons/SunIcon/SunIcon";
import MoonIcon from "../LiveIcons/MoonIcon/MoonIcon";
import { Settings } from "lucide-react";

interface HeaderProps {
  onSeasonChange: (year: number) => void;
  onOpenTemplateManager: () => void;
}

export const Header: FC<HeaderProps> = ({ onSeasonChange, onOpenTemplateManager }) => {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  const urlSeason = Number(searchParams.get("season"));
  const currentYear = new Date().getFullYear();
  const initialSeason = !urlSeason ? currentYear : urlSeason;

  const years = [
    currentYear,
    currentYear - 1,
    currentYear - 2,
    currentYear - 3
  ];

  useEffect(() => {
    if (!urlSeason) {
      setSearchParams({ ...Object.fromEntries(searchParams), season: String(initialSeason) });
    }
  }, []);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;

  const toggleTheme = () => {
    setTheme(currentTheme === "dark" ? "light" : "dark");
  };

  const season = Number(searchParams.get("season")) || initialSeason;

  const handleSeasonChange = (newSeason: number) => {
    setSearchParams({ ...Object.fromEntries(searchParams), season: String(newSeason) });
    onSeasonChange(newSeason);
  };

  const goHub = () => window.location.assign('/hub');

  return (
    <header className="flex justify-between items-center p-4 bg-stone-200 dark:bg-stone-800">
      <div className="flex items-center gap-4">
        <Button
          onClick={goHub}
          variant="outline"
          className="cursor-pointer w-22 h-10"
        >
          Главная
        </Button>

        {/* Селектор года */}
        <select
          value={season}
          onChange={(e) => handleSeasonChange(Number(e.target.value))}
          className="px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-lg text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-500 dark:focus:ring-stone-400"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <h1 className="text-xl font-bold text-stone-900 dark:text-stone-100">
        Отчет осмотра 🌿
      </h1>

              {/* Кнопка управления шаблонами */}
      <div className="flex items-center gap-4">
        <Button
          onClick={onOpenTemplateManager}
          variant="outline"
          className="cursor-pointer w-30 h-10 gap-2"
        >
          <Settings className="w-4 h-4 animate-[spin_8s_linear_infinite]" />
          Шаблоны
        </Button>

      {/* Кнопка переключения темы */}
      <Button variant="outline" onClick={toggleTheme} className="cursor-pointer w-30 gap-2">
        {currentTheme === 'dark' ? <MoonIcon /> : <SunIcon />}
        {currentTheme === "dark" ? "Тёмная" : "Светлая"}
      </Button>
      </div>
    </header>
  );
};