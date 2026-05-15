import { Repository } from 'typeorm';
import { InventoryMaster } from '../models/inventory-master.model';
import { CreateInventoryItemDto } from '../dto/create-inventory-item.dto';
export declare class InventoryMasterService {
    private repo;
    constructor(repo: Repository<InventoryMaster>);
    create(dto: CreateInventoryItemDto): Promise<InventoryMaster>;
    findAll(): Promise<InventoryMaster[]>;
    findOne(id: string): Promise<InventoryMaster | null>;
}
