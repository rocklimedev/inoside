import { Model } from 'sequelize-typescript';
import { InventoryRequest } from './inventory-request.model';
export declare class InventoryDispatch extends Model<InventoryDispatch> {
    id: string;
    request_id: string;
    request: InventoryRequest;
    dispatch_date: Date;
    dispatch_quantity: number;
    vehicle_challan: string;
    received_quantity: number;
    damage_shortage: boolean;
    supervisor_confirmation: boolean;
    delivery_photo_url: string;
}
