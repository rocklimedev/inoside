import { Model } from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute } from 'sequelize';
import { ProjectPitch } from './project_pitch.model';
import { User } from '@/modules/users/models/user.model';
export declare class PitchComment extends Model<InferAttributes<PitchComment>, InferCreationAttributes<PitchComment>> {
    id: CreationOptional<string>;
    pitch_id: string;
    user_id: CreationOptional<string | null>;
    content: string;
    pitch?: NonAttribute<ProjectPitch>;
    user?: NonAttribute<User>;
}
