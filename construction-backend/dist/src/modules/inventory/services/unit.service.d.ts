import { Unit } from '@/modules/boq/models/unit.model';
import { InventoryMaster } from '../models/inventory-master.model';
export declare class UnitService {
    private unitModel;
    private masterModel;
    constructor(unitModel: typeof Unit, masterModel: typeof InventoryMaster);
    createUnit(name: string, shortName: string): Promise<Unit>;
    findAllUnits(): Promise<Unit[]>;
    findUnitById(id: string): Promise<Unit>;
    findUnitByShortName(shortName: string): Promise<Unit>;
    updateUnit(id: string, name?: string, shortName?: string): Promise<Unit>;
    countTotal(): Promise<number>;
    deleteUnit(id: string): Promise<{
        message: string;
    }>;
}
