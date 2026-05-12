export interface ScoutingReportItem {
  id: number;
  history_item_id: number;
  scout_report_template_name: string;
  scout_report_templates_description: string;
  field_group_name: string | null;
  field_name: string | null;
  field_id: number | null;
  season: number;
  start_time: string; 
  end_time: string;   
  status: string;
  updated_at: string; 
  scout_report_id: number;
}

export interface TemplateView {
  id: number;
  scout_report_template_name: string | null;
}

export interface ScoutReportTemplate {
  id: number;
  name: string | null;
}

export interface ScoutReportTemplatesResponse {
  status: string;
  count: number;
  data: ScoutReportTemplate[];
}