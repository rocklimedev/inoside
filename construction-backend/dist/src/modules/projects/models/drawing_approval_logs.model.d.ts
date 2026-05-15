import { Model } from 'sequelize-typescript';
import { ProjectDrawing } from './project-drawings.model';
import type { InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute } from 'sequelize';
export declare class DrawingApprovalLog extends Model<InferAttributes<DrawingApprovalLog>, InferCreationAttributes<DrawingApprovalLog>> {
    id: CreationOptional<string>;
    drawing_id: string;
    client_id: string;
    approved: boolean;
    remarks: string;
    revision_requested: boolean;
    drawing?: NonAttribute<ProjectDrawing>;
}
