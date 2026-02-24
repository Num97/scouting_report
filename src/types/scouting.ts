import type { ScoutingReportItem } from "../utils/forms";

export interface AggregatedStats {
  onTime: number;      // Выполнено вовремя
  late: number;        // Выполнено с опозданием
  inProgress: number;  // В процессе (активные)
  overdue: number;     // Просрочено (не выполнены)
  total: number;
}

export interface FieldGroupAggregate {
  fieldGroupName: string;
  stats: AggregatedStats;
  reports: Map<string, TemplateAggregate>; // По шаблонам
}

export interface TemplateAggregate {
  templateName: string;
  templateDescription: string;
  stats: AggregatedStats;
  items: ScoutingReportItem[]; // Детальные записи
}

export type ExpandedRows = Set<string>;