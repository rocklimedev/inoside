import { InventoryRequestService } from './services/inventory-request.service';
import { CreateRequestDto } from './dto/create-request.dto';
export declare class InventoryRequestController {
    private readonly service;
    constructor(service: InventoryRequestService);
    create(dto: CreateRequestDto): Promise<import("./models/inventory-request.model").InventoryRequest>;
    approve(id: string): Promise<import("./models/inventory-request.model").InventoryRequest>;
    getAll(): Promise<import("./models/inventory-request.model").InventoryRequest[]>;
}
