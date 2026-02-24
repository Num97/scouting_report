import type { ScoutingReportItem } from "./forms";

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
