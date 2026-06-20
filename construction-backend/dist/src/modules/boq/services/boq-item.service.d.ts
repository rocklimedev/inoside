import { BoqItem } from '../models/boq-item.model';
import { Unit } from '../models/unit.model';
import { InventoryMaster } from '@/modules/inventory/models/inventory-master.model';
import { CreateBoqItemDto } from '../dto/create-boq-item.dto';
export declare class BoqItemService {
    private boqItemModel;
    private unitModel;
    private inventoryMasterModel;
    constructor(boqItemModel: typeof BoqItem, unitModel: typeof Unit, inventoryMasterModel: typeof InventoryMaster);
    resolveUnitId(unitInput?: string): Promise<string | null>;
    private resolveInventoryMasterId;
    createItem(dto: CreateBoqItemDto, subheadingExists: boolean): Promise<BoqItem>;
    updateItem(id: string, updateData: Partial<CreateBoqItemDto>): Promise<{
        updatedItem: BoqItem | null;
        boqId: string;
    }>;
    deleteItem(id: string): Promise<{
        boqId: string;
    }>;
    findAllByBoq(boqId: string): Promise<BoqItem[]>;
    destroyAllByBoq(boqId: string): Promise<number>;
}
