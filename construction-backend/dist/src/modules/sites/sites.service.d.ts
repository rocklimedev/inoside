import { Site } from './models/site.model';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
export declare class SitesService {
    private siteModel;
    constructor(siteModel: typeof Site);
    create(createSiteDto: CreateSiteDto): Promise<Site>;
    findAll(): Promise<Site[]>;
    findOne(id: number): Promise<Site>;
    update(id: number, updateSiteDto: UpdateSiteDto): Promise<Site>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
