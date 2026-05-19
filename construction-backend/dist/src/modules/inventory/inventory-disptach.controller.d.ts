import { InventoryDispatchService } from './services/inventory-dispatch.service';
import { DispatchMaterialDto } from './dto/dispatch-material.dto';
export declare class InventoryDispatchController {
    private readonly service;
    constructor(service: InventoryDispatchService);
    dispatch(dto: DispatchMaterialDto): any;
    markDelivered(id: string, qty: number): any;
}
