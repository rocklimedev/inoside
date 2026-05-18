import { Model } from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute } from 'sequelize';
import { Project } from './project.model';
import { User } from '@/modules/users/models/user.model';
import { PitchComment } from './pitch-comment.model';
export declare class ProjectPitch extends Model<InferAttributes<ProjectPitch>, InferCreationAttributes<ProjectPitch>> {
    id: CreationOptional<string>;
    project_id: string;
    created_by: CreationOptional<string | null>;
    preferred_design_style: CreationOptional<string | null>;
    color_tone: 'Light' | 'Dark' | 'Mixed' | 'Not Sure' | null;
    luxury_level: 'Low' | 'Medium' | 'High' | null;
    functional_vs_aesthetic: CreationOptional<string | null>;
    budget_flexibility: CreationOptional<boolean | null>;
    priority_areas: CreationOptional<any | null>;
    likes_dislikes: CreationOptional<string | null>;
    non_negotiables: CreationOptional<string | null>;
    special_requirements: CreationOptional<string | null>;
    moodboard_pdf_url: CreationOptional<string | null>;
    pitch_pdf_url: CreationOptional<string | null>;
    status: 'Draft' | 'Pending Review' | 'Approved' | 'Rejected';
    project?: NonAttribute<Project>;
    createdByUser?: NonAttribute<User>;
    comments?: NonAttribute<PitchComment[]>;
}
