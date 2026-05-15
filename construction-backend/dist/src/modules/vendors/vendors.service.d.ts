import { Vendor } from './models/vendor.model';
import { VendorType } from './models/vendor-type.model';
import { VendorTypeVendor } from './models/vendor-type-vendor.model';
import { ProjectVendor } from './models/project-vendor.model';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { AssignVendorDto } from './dto/assign-vendor.dto';
export declare class VendorsService {
    private vendorModel;
    private vendorTypeModel;
    private vendorTypeVendorModel;
    private projectVendorModel;
    constructor(vendorModel: typeof Vendor, vendorTypeModel: typeof VendorType, vendorTypeVendorModel: typeof VendorTypeVendor, projectVendorModel: typeof ProjectVendor);
    createVendor(dto: CreateVendorDto): Promise<Vendor>;
    findAllVendors(): Promise<Vendor[]>;
    findVendorById(id: string): Promise<Vendor>;
    updateVendor(id: string, dto: UpdateVendorDto): Promise<Vendor>;
    deleteVendor(id: string): Promise<{
        message: string;
    }>;
    createVendorType(name: string): Promise<VendorType>;
    getVendorTypes(): Promise<VendorType[]>;
    assignVendorToProject(dto: AssignVendorDto): Promise<ProjectVendor>;
    getVendorsByProject(projectId: string): Promise<ProjectVendor[]>;
    updateProjectVendor(id: string, updateData: Partial<AssignVendorDto>): Promise<ProjectVendor>;
    removeVendorFromProject(id: string): Promise<{
        message: string;
    }>;
}
