import { Model } from 'sequelize-typescript';
import { Project } from './project.model';
import type { InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute } from 'sequelize';
export declare class PitchReference extends Model<InferAttributes<PitchReference>, InferCreationAttributes<PitchReference>> {
    id: CreationOptional<string>;
    project_id: string;
    reference_type: 'image' | 'link' | 'portfolio';
    url: string;
    description: string;
    project?: NonAttribute<Project>;
}
