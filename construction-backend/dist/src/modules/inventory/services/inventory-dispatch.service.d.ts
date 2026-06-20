import { InventoryDispatch } from '../models/inventory-dispatch.model';
import { CreateInventoryDispatchDto } from '../dto/create-inventory-dispatch.dto';
import { UpdateInventoryDispatchDto } from '../dto/update-inventory-dispatch.dto';
export declare class InventoryDispatchService {
    private dispatchModel;
    constructor(dispatchModel: typeof InventoryDispatch);
    createDispatch(dto: CreateInventoryDispatchDto): Promise<InventoryDispatch>;
    findAllDispatches(): Promise<InventoryDispatch[]>;
    findDispatchById(id: string): Promise<InventoryDispatch>;
    updateDispatch(id: string, dto: UpdateInventoryDispatchDto): Promise<InventoryDispatch>;
    deleteDispatch(id: string): Promise<{
        message: string;
    }>;
    findDispatchesByProject(projectId: string): Promise<InventoryDispatch[]>;
    countByProject(projectId: string): Promise<number>;
    countTotal(): Promise<number>;
}
