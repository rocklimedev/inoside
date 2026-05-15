import { ProjectType, ServiceType, PurposeType, TimelineExpectation } from '@/common/enums';
export declare class UpdateProjectDto {
    client_id?: string;
    site_id?: string;
    name?: string;
    project_type?: ProjectType;
    service_type?: ServiceType;
    purpose?: PurposeType;
    number_of_floors?: number;
    approximate_area_sqft?: number;
    budget_range?: string;
    timeline_expectation?: TimelineExpectation;
    design_preference?: string;
    progress_percentage?: number;
    created_by?: string;
}
