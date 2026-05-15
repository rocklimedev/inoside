import { Model } from 'sequelize-typescript';
import { Project } from './project.model';
import type { InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute } from 'sequelize';
export declare class ProjectPitch extends Model<InferAttributes<ProjectPitch>, InferCreationAttributes<ProjectPitch>> {
    id: CreationOptional<string>;
    project_id: string;
    preferred_design_style: string;
    color_tone: 'Light' | 'Dark' | 'Mixed' | 'Not Sure';
    luxury_level: 'Low' | 'Medium' | 'High';
    functional_vs_aesthetic: string;
    budget_flexibility: boolean;
    priority_areas: any;
    likes_dislikes: string;
    non_negotiables: string;
    special_requirements: string;
    moodboard_pdf_url: string;
    pitch_pdf_url: string;
    project?: NonAttribute<Project>;
}
