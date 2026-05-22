import { Model } from 'sequelize-typescript';
import type { CreationOptional } from 'sequelize';
export declare class Address extends Model {
    id: string;
    line1: string;
    line2: CreationOptional<string>;
    landmark: CreationOptional<string>;
    city: string;
    state: CreationOptional<string>;
    country: CreationOptional<string>;
    pincode: CreationOptional<string>;
    latitude: CreationOptional<number>;
    longitude: CreationOptional<number>;
    google_map_link: CreationOptional<string>;
    created_at: CreationOptional<Date>;
    updated_at: CreationOptional<Date>;
}
