export class CreateSiteRekiReportDto {
  visit_date?: string;
  client_present?: boolean;
  road_access?: boolean;
  unloading_space?: boolean;
  plot_type?: string;
  construction_type?: string;
  cracks?: boolean;
  dampness?: boolean;
  termite?: boolean;
  electrical_wiring?: boolean;
  demolition_required?: boolean;
  load_bearing_changes?: boolean;
  power_supply?: boolean;
  remarks?: string;
  major_constraints?: string;
  risk_factors?: string;
  suggestions?: string;
  client_instructions?: string;
}
