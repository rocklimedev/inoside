import { Model } from 'sequelize-typescript';
export declare class Material extends Model<Material> {
    id: string;
    name: string;
    category: string;
    created_at: Date;
}
