export declare class CreateDailyProgressReportDto {
    project_id: string;
    report_date: string;
    supervisor_id?: string;
    current_stage?: string;
    work_executed?: string;
    manpower_count?: number;
    materials_used?: string;
    issues_faced?: string;
    progress_photos?: string[];
}
