import type { ScoutingReportItem, ScoutReportTemplate, ScoutReportTemplatesResponse, TemplateView } from "./forms";

interface ScoutingReportsResponse {
  data: ScoutingReportItem[];
}

export async function getScoutingReports(season?: number): Promise<ScoutingReportItem[]> {
  const currentYear = new Date().getFullYear();
  const seasonParam = season ?? currentYear;

  const url = `/api/v1/scouting_report?season=${seasonParam}`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Ошибка запроса: ${res.status} ${res.statusText}`);
    }

    const json: ScoutingReportsResponse = await res.json();

    return json.data;
  } catch (error) {
    console.error("Не удалось получить scouting reports:", error);
    return [];
  }
}

// Функция для получения шаблонов
export async function getScoutReportTemplates(): Promise<ScoutReportTemplate[]> {
  const url = `/api/v1/scout_report_templates`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Ошибка запроса: ${res.status} ${res.statusText}`);
    }

    const json: ScoutReportTemplatesResponse = await res.json();

    return json.data;
  } catch (error) {
    console.error("Не удалось получить scout report templates:", error);
    return [];
  }
}

// GET: Получить все template views
export async function getTemplateViews(): Promise<TemplateView[]> {
  const url = "/api/v1/scouting_report/template_view";

  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Ошибка запроса: ${res.status} ${res.statusText}`);
    }

    // Бэкенд возвращает просто массив объектов
    const templateViews: TemplateView[] = await res.json();
    
    return templateViews || [];
  } catch (error) {
    console.error("Не удалось получить template views:", error);
    return [];
  }
}

// GET: Получить конкретный template view по id
export async function getTemplateViewById(id: number): Promise<TemplateView | null> {
  const url = `/api/v1/scouting_report/template_view/${id}`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Ошибка запроса: ${res.status} ${res.statusText}`);
    }

    // Бэкенд возвращает объект
    const templateView: TemplateView = await res.json();
    
    return templateView || null;
  } catch (error) {
    console.error(`Не удалось получить template view с id ${id}:`, error);
    return null;
  }
}

// POST: Создать новый template view
export async function createTemplateView(
  scout_report_template_name: string | null
): Promise<TemplateView | null> {
  const url = "/api/v1/scouting_report/template_view";

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ scout_report_template_name }),
    });

    if (!res.ok) {
      throw new Error(`Ошибка запроса: ${res.status} ${res.statusText}`);
    }

    const newTemplateView: TemplateView = await res.json();
    
    return newTemplateView;
  } catch (error) {
    console.error("Не удалось создать template view:", error);
    return null;
  }
}
// PUT: Обновить существующий template view
export async function updateTemplateView(
  id: number,
  scout_report_template_name: string
): Promise<TemplateView | null> {
  const url = `/api/v1/scouting_report/template_view/${id}`;

  try {
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ scout_report_template_name }),
    });

    if (!res.ok) {
      throw new Error(`Ошибка запроса: ${res.status} ${res.statusText}`);
    }

    // Бэкенд возвращает обновленный объект
    const updatedTemplateView: TemplateView = await res.json();
    
    return updatedTemplateView;
  } catch (error) {
    console.error(`Не удалось обновить template view с id ${id}:`, error);
    return null;
  }
}

// DELETE: Удалить template view
export async function deleteTemplateView(id: number): Promise<boolean> {
  const url = `/api/v1/scouting_report/template_view/${id}`;

  try {
    const res = await fetch(url, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error(`Ошибка запроса: ${res.status} ${res.statusText}`);
    }

    return true;
  } catch (error) {
    console.error(`Не удалось удалить template view с id ${id}:`, error);
    return false;
  }
}