import { Model } from 'sequelize-typescript';
import { InventoryRequest } from './inventory-request.model';
export declare class InventoryDispatch extends Model {
    id: string;
    request_id: string;
    request: InventoryRequest;
    dispatch_date: Date | null;
    dispatch_quantity: number;
    vehicle_challan: string | null;
    driver_name: string | null;
    received_quantity: number | null;
    damage_shortage: boolean;
    shortage_quantity: number | null;
    supervisor_confirmation: boolean;
    delivery_photo_url: string | null;
    remarks: string | null;
    created_at: Date;
}
