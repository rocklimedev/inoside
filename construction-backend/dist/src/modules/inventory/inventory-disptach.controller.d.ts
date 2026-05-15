import { InventoryDispatchService } from './services/inventory-dispatch.service';
import { DispatchMaterialDto } from './dto/dispatch-material.dto';
export declare class InventoryDispatchController {
    private readonly service;
    constructor(service: InventoryDispatchService);
    dispatch(dto: DispatchMaterialDto): Promise<import("./models/inventory-dispatch.model").InventoryDispatch>;
    markDelivered(id: string, qty: number): Promise<import("./models/inventory-dispatch.model").InventoryDispatch>;
}
