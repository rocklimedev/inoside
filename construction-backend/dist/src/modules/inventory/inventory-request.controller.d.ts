import { InventoryRequestService } from './services/inventory-request.service';
import { CreateRequestDto } from './dto/create-request.dto';
export declare class InventoryRequestController {
    private readonly service;
    constructor(service: InventoryRequestService);
    create(dto: CreateRequestDto): any;
    approve(id: string): any;
    getAll(): any;
}
