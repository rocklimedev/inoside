import { Site } from './models/site.model';
import { Address } from '../address/models/address.model';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { SiteEngagementService } from '../engagement/services/site-engagement.service';
export declare class SitesService {
    private siteModel;
    private addressModel;
    private readonly siteEngagementService;
    constructor(siteModel: typeof Site, addressModel: typeof Address, siteEngagementService: SiteEngagementService);
    create(createSiteDto: CreateSiteDto, actor: {
        id: string;
        name: string;
    }): Promise<Site | null>;
    findAll(): Promise<Site[]>;
    findOne(id: string): Promise<Site>;
    findByClient(clientId: string): Promise<Site[]>;
    update(id: string, updateSiteDto: UpdateSiteDto, actor: {
        id: string;
        name: string;
    }): Promise<Site>;
    remove(id: string, actor: {
        id: string;
        name: string;
    }): Promise<{
        message: string;
    }>;
}
