import { Model } from 'sequelize-typescript';
export declare class CdnFile extends Model {
    original_name: string;
    filename: string;
    url: string;
    size: number;
    mime_type: string;
}
