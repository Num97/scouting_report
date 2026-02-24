// components/DateRangeSliderV2/DateRangeSliderV2.tsx
"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { format, startOfMonth, endOfMonth, eachWeekOfInterval, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, getMonth, areIntervalsOverlapping } from "date-fns";
import { ru } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

interface DateRangeSliderV2Props {
  range: { start: Date; end: Date };
  onRangeChange: (range: { start: Date; end: Date }) => void;
  season: number;
  minDate?: Date;
  maxDate?: Date;
}

type ViewMode = "months" | "weeks";

interface Week {
  start: Date;
  end: Date;
  days: Date[];
}

export function DateRangeSliderV2({
  range,
  onRangeChange,
  season,
  minDate = new Date(season, 0, 1),
  maxDate = new Date(season, 11, 31),
}: DateRangeSliderV2Props) {
  // Используем ref для хранения предыдущего range
  const prevRangeRef = useRef(range);
  const isInternalUpdate = useRef(false);
  
  const [viewMode, setViewMode] = useState<ViewMode>("months");
  const [selectedMonth, setSelectedMonth] = useState<number>(() => getMonth(range.start));
  const [selectedYear] = useState<number>(season);
  
  // Вычисляем sliderValue на основе range, но без useEffect
  const sliderValue = useMemo(() => {
    if (viewMode === "months") {
      const totalDays = (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24);
      const startOffset = Math.max(0, (range.start.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
      const endOffset = Math.min(totalDays, (range.end.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
      
      return [
        (startOffset / totalDays) * 100,
        (endOffset / totalDays) * 100
      ];
    } else {
      const monthStart = new Date(selectedYear, selectedMonth, 1);
      const monthEnd = endOfMonth(monthStart);
      const totalDays = (monthEnd.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24);
      
      const startOffset = Math.max(0, (range.start.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24));
      const endOffset = Math.min(totalDays, (range.end.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24));
      
      return [
        (startOffset / totalDays) * 100,
        (endOffset / totalDays) * 100
      ];
    }
  }, [range, minDate, maxDate, viewMode, selectedMonth, selectedYear]);

  // Мемоизируем months
  const months = useMemo(() => 
    Array.from({ length: 12 }, (_, i) => ({
      index: i,
      name: format(new Date(season, i, 1), "LLLL", { locale: ru }),
      start: new Date(season, i, 1),
      end: endOfMonth(new Date(season, i, 1)),
    })), [season]
  );

  // Мемоизируем weeks
  const weeks = useMemo(() => {
    if (viewMode !== "weeks") return [];
    
    const monthStart = new Date(selectedYear, selectedMonth, 1);
    const monthEnd = endOfMonth(monthStart);
    
    const weeksInMonth = eachWeekOfInterval(
      { start: monthStart, end: monthEnd },
      { weekStartsOn: 1 }
    ).map(weekStart => {
      const weekStartDate = startOfWeek(weekStart, { weekStartsOn: 1 });
      const weekEndDate = endOfWeek(weekStart, { weekStartsOn: 1 });
      const days = eachDayOfInterval({ start: weekStartDate, end: weekEndDate });
      
      return {
        start: weekStartDate,
        end: weekEndDate,
        days,
      };
    });
    
    return weeksInMonth.filter((week, index, self) =>
      index === self.findIndex(w => isSameDay(w.start, week.start))
    );
  }, [selectedMonth, selectedYear, viewMode]);

  // Следим за изменением season и обновляем selectedMonth
  useEffect(() => {
    setSelectedMonth(getMonth(range.start));
  }, [season, range.start]);

  // Обработка изменения слайдера
  const handleSliderChange = useCallback((values: number[]) => {
    // Ничего не делаем, просто позволим слайдеру двигаться
    // Значение будет обновлено через useMemo
  }, []);

  // Обработка завершения изменения слайдера
  const handleSliderCommit = useCallback((values: number[]) => {
    // Проверяем, действительно ли изменился range
    let newStart: Date, newEnd: Date;
    
    if (viewMode === "months") {
      const totalDays = (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24);
      newStart = new Date(minDate.getTime() + (values[0] / 100) * totalDays * 24 * 60 * 60 * 1000);
      newEnd = new Date(minDate.getTime() + (values[1] / 100) * totalDays * 24 * 60 * 60 * 1000);
    } else {
      const monthStart = new Date(selectedYear, selectedMonth, 1);
      const monthEnd = endOfMonth(monthStart);
      const totalDays = (monthEnd.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24);
      
      newStart = new Date(monthStart.getTime() + (values[0] / 100) * totalDays * 24 * 60 * 60 * 1000);
      newEnd = new Date(monthStart.getTime() + (values[1] / 100) * totalDays * 24 * 60 * 60 * 1000);
    }

    // Проверяем, действительно ли изменились даты
    if (isSameDay(newStart, range.start) && isSameDay(newEnd, range.end)) {
      return; // ничего не менялось
    }

    isInternalUpdate.current = true;
    onRangeChange({ start: newStart, end: newEnd });
  }, [viewMode, minDate, maxDate, selectedYear, selectedMonth, onRangeChange, range]);

  const handleMonthSelect = useCallback((monthIndex: number) => {
    const monthStart = new Date(season, monthIndex, 1);
    const monthEnd = endOfMonth(monthStart);
    
    // Проверяем, не выбран ли уже этот месяц
    if (isSameDay(monthStart, range.start) && isSameDay(monthEnd, range.end)) {
      setViewMode("weeks");
      setSelectedMonth(monthIndex);
      return;
    }
    
    isInternalUpdate.current = true;
    setSelectedMonth(monthIndex);
    setViewMode("weeks");
    onRangeChange({ start: monthStart, end: monthEnd });
  }, [season, onRangeChange, range]);

  const handleWeekSelect = useCallback((week: Week) => {
    // Проверяем, не выбрана ли уже эта неделя
    if (isSameDay(week.start, range.start) && isSameDay(week.end, range.end)) {
      return;
    }
    
    isInternalUpdate.current = true;
    onRangeChange({ start: week.start, end: week.end });
  }, [onRangeChange, range]);

  const handleBackToMonths = useCallback(() => {
    setViewMode("months");
  }, []);

  const handlePrevMonth = useCallback(() => {
    setSelectedMonth(prev => prev === 0 ? 11 : prev - 1);
  }, []);

  const handleNextMonth = useCallback(() => {
    setSelectedMonth(prev => prev === 11 ? 0 : prev + 1);
  }, []);

  return (
    <div className="w-full space-y-6 p-4 rounded-lg bg-background border border-border">
      {/* Заголовок и навигация */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-foreground">
            {viewMode === "months" ? "Выберите период" : format(new Date(selectedYear, selectedMonth, 1), "LLLL yyyy", { locale: ru })}
          </h3>
          {viewMode === "weeks" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToMonths}
              className="h-7 px-2 text-xs"
            >
              <CalendarDays className="h-3.5 w-3.5 mr-1" />
              Все месяцы
            </Button>
          )}
        </div>
        
        {viewMode === "weeks" && (
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-7 w-7" onClick={handlePrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-7 w-7" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Слайдер */}
      <div className="relative pt-6 pb-2">
        <Slider
          value={sliderValue}
          onValueChange={handleSliderChange}
          onValueCommit={handleSliderCommit}
          min={0}
          max={100}
          step={0.1}
          className="w-full"
        />
        
        {/* Шкала времени */}
        {viewMode === "months" ? (
          // Шкала месяцев
          <div className="absolute top-0 left-0 right-0 flex justify-between text-xs text-muted-foreground">
            {months.map((month, i) => (
              <div
                key={i}
                className="flex flex-col items-center cursor-pointer group"
                onClick={() => handleMonthSelect(i)}
              >
                <span className="text-[10px] uppercase tracking-wider group-hover:text-foreground transition-colors">
                  {month.name.slice(0, 3)}
                </span>
                <span className="h-5 w-full px-1 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity text-primary">
                  выбрать
                </span>
              </div>
            ))}
          </div>
        ) : (
          // Шкала недель
          <div className="absolute top-0 left-0 right-0">
            <div className="flex justify-between text-[10px] text-muted-foreground mb-1 px-1">
              {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map(day => (
                <span key={day} className="w-8 text-center">{day}</span>
              ))}
            </div>
            
            <div className="space-y-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="relative group">
                  <div className="flex justify-between">
                    {week.days.map((day, dayIndex) => {
                      const isCurrentMonth = isSameMonth(day, new Date(selectedYear, selectedMonth, 1));
                      const isSelected = day >= range.start && day <= range.end;
                      
                      return (
                        <div
                          key={dayIndex}
                          className={`
                            w-8 h-6 flex items-center justify-center text-xs rounded
                            ${isCurrentMonth ? 'text-foreground' : 'text-muted-foreground/30'}
                            ${isSelected ? 'bg-primary/10 font-medium' : ''}
                            ${isSameDay(day, new Date()) ? 'ring-1 ring-primary' : ''}
                          `}
                        >
                          {format(day, "d")}
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Кнопка выбора недели */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleWeekSelect(week)}
                    className="absolute inset-x-0 -bottom-1 h-4 text-[8px] py-0 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm"
                  >
                    {format(week.start, "d MMM", { locale: ru })} - {format(week.end, "d MMM", { locale: ru })}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Отображение выбранного диапазона */}
      <div className="flex items-center justify-between pt-2 text-sm border-t border-border">
        <div className="space-y-0.5">
          <div className="text-muted-foreground text-xs">Начало</div>
          <div className="font-medium">{format(range.start, "dd MMM yyyy", { locale: ru })}</div>
        </div>
        <div className="text-muted-foreground">→</div>
        <div className="space-y-0.5 text-right">
          <div className="text-muted-foreground text-xs">Конец</div>
          <div className="font-medium">{format(range.end, "dd MMM yyyy", { locale: ru })}</div>
        </div>
      </div>
    </div>
  );
}