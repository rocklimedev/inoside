import { BoqItem } from '../models/boq-item.model';
import { Unit } from '../models/unit.model';
import { InventoryMaster } from '@/modules/inventory/models/inventory-master.model';
import { CreateBoqItemDto } from '../dto/create-boq-item.dto';
import { Boq } from '../models/boq.model';
import { BoqSection } from '../models/boq-section.model';
export declare class BoqItemService {
    private boqItemModel;
    private unitModel;
    private inventoryMasterModel;
    private boqModel;
    private boqSectionModel;
    constructor(boqItemModel: typeof BoqItem, unitModel: typeof Unit, inventoryMasterModel: typeof InventoryMaster, boqModel: typeof Boq, boqSectionModel: typeof BoqSection);
    private resolveUnitId;
    create(dto: CreateBoqItemDto): Promise<BoqItem | null>;
    update(id: string, updateData: Partial<CreateBoqItemDto>): Promise<BoqItem | null>;
    delete(id: string): Promise<{
        message: string;
    }>;
    private validateReferences;
    private getOrCreateInventoryMaster;
    private calculateBoqTotal;
    findOne(id: string): Promise<BoqItem | null>;
}
