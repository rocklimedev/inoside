import { Client } from './models/client.model';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientEngagementService } from '@/modules/engagement/services/client-engagement.service';
export declare class ClientsService {
    private clientModel;
    private readonly clientEngagementService;
    constructor(clientModel: typeof Client, clientEngagementService: ClientEngagementService);
    create(dto: CreateClientDto, actor: {
        id: string;
        name: string;
    }): Promise<Client>;
    findAll(actor?: {
        id: string;
        name: string;
    }): Promise<Client[]>;
    findOne(id: string, actor?: {
        id: string;
        name: string;
    }): Promise<Client>;
    update(id: string, dto: UpdateClientDto, actor: {
        id: string;
        name: string;
    }): Promise<Client>;
    remove(id: string, actor: {
        id: string;
        name: string;
    }): Promise<{
        message: string;
    }>;
}
