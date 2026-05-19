import { InventoryDispatch } from '../models/inventory-dispatch.model';
import { InventoryRequest } from '../models/inventory-request.model';
import { DispatchMaterialDto } from '../dto/dispatch-material.dto';
export declare class InventoryDispatchService {
    private dispatchRepo;
    private requestRepo;
    constructor(dispatchRepo: typeof InventoryDispatch, requestRepo: typeof InventoryRequest);
    dispatch(dto: DispatchMaterialDto): Promise<InventoryDispatch>;
    markDelivered(dispatchId: string, received_quantity: number): Promise<InventoryDispatch>;
}
