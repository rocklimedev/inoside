import { Model } from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute } from 'sequelize';
import { ProjectDrawing } from './project-drawings.model';
import { Client } from '@/modules/clients/models/client.model';
import { User } from '@/modules/users/models/user.model';
export declare class DrawingApprovalLog extends Model<InferAttributes<DrawingApprovalLog>, InferCreationAttributes<DrawingApprovalLog>> {
    id: CreationOptional<string>;
    drawing_id: string;
    client_id: CreationOptional<string | null>;
    approved_by: CreationOptional<string | null>;
    action: 'approved' | 'rejected' | 'revision_requested' | 'commented';
    approved: CreationOptional<boolean>;
    revision_requested: CreationOptional<boolean>;
    remarks: CreationOptional<string | null>;
    internal_note: CreationOptional<string | null>;
    attachment_url: CreationOptional<string | null>;
    drawing_version: CreationOptional<number> | null;
    drawing?: NonAttribute<ProjectDrawing>;
    client?: NonAttribute<Client>;
    approver?: NonAttribute<User>;
}
