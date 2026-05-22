import { Site } from './models/site.model';
import { Address } from '../address/models/address.model';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
export declare class SitesService {
    private siteModel;
    private addressModel;
    constructor(siteModel: typeof Site, addressModel: typeof Address);
    create(createSiteDto: CreateSiteDto): Promise<Site | null>;
    findAll(): Promise<Site[]>;
    findOne(id: string): Promise<Site>;
    update(id: string, updateSiteDto: UpdateSiteDto): Promise<Site>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
