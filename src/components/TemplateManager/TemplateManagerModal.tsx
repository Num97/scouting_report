import { useState, useMemo } from "react";
import { X, Check, Loader2, Eye, EyeOff, Sparkles } from "lucide-react";
import type { TemplateView, ScoutReportTemplate } from "../../utils/forms";
import { deleteTemplateView, createTemplateView } from "../../utils/api";

interface TemplateManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: ScoutReportTemplate[];
  templateViews: TemplateView[];
  onTemplateViewsChange: (
    updater: TemplateView[] | ((prev: TemplateView[]) => TemplateView[])
  ) => void;
}

export function TemplateManagerModal({
  isOpen,
  onClose,
  templates,
  templateViews,
  onTemplateViewsChange,
}: TemplateManagerModalProps) {
  const [togglingId, setTogglingId] = useState<number | "null" | null>(null);

  const excludedNamesSet = useMemo(() => {
    return new Set(templateViews.map((tv) => tv.scout_report_template_name));
  }, [templateViews]);

  const isNullExcluded = excludedNamesSet.has(null);

  const excludedCount = templateViews.length;

  const handleToggle = async (templateName: string | null) => {
    const templateView = templateViews.find(
      (tv) => tv.scout_report_template_name === templateName
    );

    const template = templates.find((t) => t.name === templateName);
    const toggleKey = templateName === null ? "null" : (template?.id ?? templateName);

    setTogglingId(toggleKey as number | "null");

    try {
      if (templateView) {
        const success = await deleteTemplateView(templateView.id);
        if (success) {
          onTemplateViewsChange((prev: TemplateView[]) =>
            prev.filter((tv) => tv.id !== templateView.id)
          );
        }
      } else {
        const newView = await createTemplateView(templateName);
        if (newView) {
          const newTemplateView: TemplateView = {
            id: newView.id,
            scout_report_template_name: templateName,
          };

          onTemplateViewsChange((prev: TemplateView[]) => {
            const alreadyExists = prev.some(
              (tv) => tv.scout_report_template_name === templateName
            );
            if (alreadyExists) return prev;
            return [...prev, newTemplateView];
          });
        }
      }
    } catch (error) {
      console.error("Ошибка переключения шаблона:", error);
    } finally {
      setTogglingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Оверлей с градиентом */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/70 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Модальное окно */}
      <div className="relative w-full max-w-xl bg-white dark:bg-stone-900 rounded-3xl shadow-[0_20px_70px_-15px_rgba(0,0,0,0.5)] border border-stone-200/50 dark:border-stone-700/50 overflow-hidden animate-in zoom-in-95 fade-in duration-300">
        
        {/* Декоративный градиент сверху */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500" />
        
        {/* Заголовок */}
        <div className="relative flex items-center justify-between px-8 py-6 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 rounded-xl">
              <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 tracking-tight">
                Управление шаблонами
              </h2>
              <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">
                Выберите шаблоны для отображения в отчётах
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-all duration-200 hover:scale-110 active:scale-95 group"
          >
            <X className="w-5 h-5 text-stone-400 dark:text-stone-500 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors cursor-pointer" />
          </button>
        </div>

        {/* Статистика */}
        <div className="px-8 py-4 bg-stone-50/50 dark:bg-stone-800/30 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl shadow-sm border border-emerald-200/50 dark:border-emerald-800/30">
              <Eye className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400">Активно</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-300">{templates.length - excludedCount + (isNullExcluded ? 0 : 1)}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 rounded-xl shadow-sm border border-red-200/50 dark:border-red-800/30">
              <EyeOff className="w-3.5 h-3.5 text-red-400" />
              <span className="text-red-500 dark:text-red-400">Скрыто</span>
              <span className="font-bold text-red-600 dark:text-red-300">{excludedCount}</span>
            </div>
          </div>
        </div>

        {/* Содержимое */}
        <div className="px-6 py-4 max-h-[50vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-1">
            {/* "Без шаблона" */}
            <label
              className={`
                group flex items-center gap-4 px-5 py-4 rounded-2xl cursor-pointer 
                transition-all duration-200 ease-out
                hover:shadow-md
                ${isNullExcluded 
                  ? "bg-red-50/50 dark:bg-red-900/10 border border-red-200/50 dark:border-red-800/30" 
                  : "bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-200/50 dark:border-emerald-800/30"
                }
              `}
            >
              <div className="relative flex-shrink-0">
                <input
                  type="checkbox"
                  checked={isNullExcluded}
                  onChange={() => handleToggle(null)}
                  disabled={togglingId === "null"}
                  className="sr-only"
                />
                <div
                  className={`
                    w-7 h-7 rounded-xl flex items-center justify-center 
                    transition-all duration-300 ease-out
                    ${isNullExcluded
                      ? "bg-gradient-to-br from-red-400 to-red-500 shadow-lg shadow-red-500/25"
                      : "bg-gradient-to-br from-emerald-400 to-green-500 shadow-lg shadow-emerald-500/25"
                    }
                    ${togglingId === "null" ? "opacity-70 scale-95" : ""}
                  `}
                >
                  {isNullExcluded && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                  {!isNullExcluded && <Eye className="w-3.5 h-3.5 text-white" />}
                </div>
                {togglingId === "null" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin text-stone-400" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <span className={`text-sm font-semibold transition-colors ${isNullExcluded ? "text-red-600 dark:text-red-400" : "text-emerald-700 dark:text-emerald-300"}`}>
                  Без шаблона
                </span>
                <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">
                  Записи без привязанного шаблона
                </p>
              </div>

              <div className="flex items-center gap-2">
                {togglingId === "null" ? (
                  <span className="text-xs px-3 py-1.5 rounded-full bg-stone-100 dark:bg-stone-700 text-stone-500 dark:text-stone-400 font-medium flex items-center gap-1.5">
                    <Loader2 className="w-3 h-3 animate-spin" />
                  </span>
                ) : isNullExcluded ? (
                  <span className="text-xs px-3 py-1.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-medium flex items-center gap-1.5 shadow-sm">
                    <EyeOff className="w-3 h-3" />
                    Скрыто
                  </span>
                ) : (
                  <span className="text-xs px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5 shadow-sm">
                    <Eye className="w-3 h-3" />
                    Активно
                  </span>
                )}
              </div>
            </label>

            {/* Разделитель */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-100 dark:border-stone-800" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 py-1 text-[10px] font-semibold uppercase tracking-widest text-stone-400 dark:text-stone-500 bg-white dark:bg-stone-900">
                  Шаблоны
                </span>
              </div>
            </div>

            {/* Шаблоны из templates */}
            {templates.map((template) => {
              const isExcluded = excludedNamesSet.has(template.name);
              const toggleKey = template.id;

              return (
                <label
                  key={template.id}
                  className={`
                    group flex items-center gap-4 px-5 py-4 rounded-2xl cursor-pointer 
                    transition-all duration-200 ease-out
                    hover:shadow-md
                    ${isExcluded 
                      ? "bg-red-50/50 dark:bg-red-900/10 border border-red-200/50 dark:border-red-800/30" 
                      : "bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-200/50 dark:border-emerald-800/30"
                    }
                  `}
                >
                  <div className="relative flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={isExcluded}
                      onChange={() => handleToggle(template.name)}
                      disabled={togglingId === toggleKey}
                      className="sr-only"
                    />
                    <div
                      className={`
                        w-7 h-7 rounded-xl flex items-center justify-center 
                        transition-all duration-300 ease-out
                        ${isExcluded
                          ? "bg-gradient-to-br from-red-400 to-red-500 shadow-lg shadow-red-500/25"
                          : "bg-gradient-to-br from-emerald-400 to-green-500 shadow-lg shadow-emerald-500/25"
                        }
                        ${togglingId === toggleKey ? "opacity-70 scale-95" : ""}
                      `}
                    >
                      {isExcluded && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                      {!isExcluded && <Eye className="w-3.5 h-3.5 text-white" />}
                    </div>
                    {togglingId === toggleKey && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-5 h-5 animate-spin text-stone-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <span className={`text-sm font-semibold transition-colors ${isExcluded ? "text-red-600 dark:text-red-400" : "text-emerald-700 dark:text-emerald-300"}`}>
                      {template.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {togglingId === toggleKey ? (
                      <span className="text-xs px-3 py-1.5 rounded-full bg-stone-100 dark:bg-stone-700 text-stone-500 dark:text-stone-400 font-medium flex items-center gap-1.5">
                        <Loader2 className="w-3 h-3 animate-spin" />
                      </span>
                    ) : isExcluded ? (
                      <span className="text-xs px-3 py-1.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-medium flex items-center gap-1.5 shadow-sm">
                        <EyeOff className="w-3 h-3" />
                        Скрыто
                      </span>
                    ) : (
                      <span className="text-xs px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5 shadow-sm">
                        <Eye className="w-3 h-3" />
                        Активно
                      </span>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Футер */}
        <div className="px-8 py-4 border-t border-stone-100 dark:border-stone-800 bg-gradient-to-r from-stone-50 to-stone-100 dark:from-stone-800/50 dark:to-stone-800/30">
          <div className="flex items-center justify-between">
            <p className="text-xs text-stone-400 dark:text-stone-500">
              Скрытые шаблоны не отображаются в отчётах
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2 text-sm font-medium text-stone-600 dark:text-stone-300 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-700 hover:shadow-md transition-all duration-200 active:scale-95 cursor-pointer"
            >
              Готово
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}