import { Model } from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute } from 'sequelize';
import { Project } from '../../projects/models/project.model';
import { Site } from '@/modules/sites/models/site.model';
export declare class Client extends Model<InferAttributes<Client>, InferCreationAttributes<Client>> {
    id: CreationOptional<string>;
    name: string;
    contact_number: string;
    email: CreationOptional<string | null>;
    preferred_communication: CreationOptional<'Call' | 'WhatsApp' | 'Email' | null>;
    is_owner: CreationOptional<boolean>;
    representative_involved: CreationOptional<boolean>;
    representative_comment: CreationOptional<string | null>;
    created_at: CreationOptional<Date>;
    updated_at: CreationOptional<Date>;
    projects?: NonAttribute<Project[]>;
    sites?: NonAttribute<Site[]>;
}
