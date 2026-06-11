export declare class CreateExecutionActivityDto {
    project_id: string;
    stage_id?: string;
    title: string;
    description?: string;
    activity_date: Date;
    planned_quantity?: number;
    completed_quantity?: number;
    unit?: string;
}
