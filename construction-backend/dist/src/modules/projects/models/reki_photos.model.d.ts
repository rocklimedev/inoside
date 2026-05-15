import { Model } from 'sequelize-typescript';
import { RekiReport } from './reki_reports.model';
import type { InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute } from 'sequelize';
export declare class RekiPhoto extends Model<InferAttributes<RekiPhoto>, InferCreationAttributes<RekiPhoto>> {
    id: CreationOptional<string>;
    reki_report_id: string;
    photo_type: string;
    photo_url: string;
    report?: NonAttribute<RekiReport>;
}
