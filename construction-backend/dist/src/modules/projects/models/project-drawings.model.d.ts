import { Model } from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
export declare class ProjectDrawing extends Model<InferAttributes<ProjectDrawing>, InferCreationAttributes<ProjectDrawing>> {
    id: CreationOptional<string>;
    project_id: string;
    drawing_type: any;
    version: number;
    area_floor: string;
    file_url: string;
    uploaded_by: string;
    approved: boolean;
    approval_date: Date;
    approved_by: string;
}
