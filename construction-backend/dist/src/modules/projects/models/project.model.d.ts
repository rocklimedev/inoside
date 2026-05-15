import { Model } from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute } from 'sequelize';
import { Client } from '@/modules/clients/models/client.model';
import { Site } from '@/modules/sites/models/site.model';
import { User } from '../../users/models/user.model';
export declare class Project extends Model<InferAttributes<Project>, InferCreationAttributes<Project>> {
    id: CreationOptional<string>;
    client_id: string;
    site_id: CreationOptional<string | null>;
    name: string;
    project_type: 'New Construction' | 'Renovation' | 'Interior Fit-out';
    service_type: 'Construction' | 'Interior' | 'Renovation' | null;
    purpose: 'Residential' | 'Commercial' | 'Mixed' | null;
    number_of_floors: CreationOptional<number | null>;
    approximate_area_sqft: CreationOptional<number | null>;
    budget_range: CreationOptional<string | null>;
    timeline_expectation: 'Immediate' | 'Flexible' | 'Fixed Date' | null;
    design_preference: CreationOptional<string | null>;
    status: CreationOptional<'brief' | 'pitch' | 'reki_pending' | 'reki_done' | 'scope_done' | 'boq_done' | 'design' | 'execution' | 'vendor_selection' | 'inventory' | 'quality' | 'handover' | 'completed'>;
    current_stage: CreationOptional<string | null>;
    progress_percentage: CreationOptional<number>;
    token_received: CreationOptional<boolean>;
    created_by: CreationOptional<string | null>;
    client?: NonAttribute<Client>;
    site?: NonAttribute<Site>;
    creator?: NonAttribute<User>;
}
