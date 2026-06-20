export declare enum PitchStatus {
    DRAFT = "Draft",
    PENDING_REVIEW = "Pending Review",
    APPROVED = "Approved",
    REJECTED = "Rejected"
}
export declare class CreateProjectPitchDto {
    preferred_design_style?: string;
    color_tone?: 'Light' | 'Dark' | 'Mixed' | 'Not Sure';
    luxury_level?: 'Low' | 'Medium' | 'High';
    functional_vs_aesthetic?: string;
    budget_flexibility?: boolean;
    priority_areas?: string[];
    likes_dislikes?: string;
    non_negotiables?: string;
    special_requirements?: string;
    status?: PitchStatus;
    pitch_pdf_url?: string;
    moodboard_pdf_url?: string;
}
