import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { AssignVendorDto } from './dto/assign-vendor.dto';
export declare class VendorsController {
    private readonly vendorsService;
    constructor(vendorsService: VendorsService);
    create(createVendorDto: CreateVendorDto): Promise<import("./models/vendor.model").Vendor>;
    findAll(): Promise<import("./models/vendor.model").Vendor[]>;
    findOne(id: string): Promise<import("./models/vendor.model").Vendor>;
    update(id: string, updateVendorDto: UpdateVendorDto): Promise<import("./models/vendor.model").Vendor>;
    remove(id: string): Promise<{
        message: string;
    }>;
    createVendorType(name: string): Promise<import("./models/vendor-type.model").VendorType>;
    getVendorTypes(): Promise<import("./models/vendor-type.model").VendorType[]>;
    assignToProject(assignVendorDto: AssignVendorDto): Promise<import("./models/project-vendor.model").ProjectVendor>;
    getByProject(projectId: string): Promise<import("./models/project-vendor.model").ProjectVendor[]>;
    updateProjectVendor(id: string, updateData: Partial<AssignVendorDto>): Promise<import("./models/project-vendor.model").ProjectVendor>;
    removeVendorFromProject(id: string): Promise<{
        message: string;
    }>;
}
