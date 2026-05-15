import { Model } from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute } from 'sequelize';
import { ProjectVendor } from './project-vendor.model';
import { VendorType } from './vendor-type.model';
export declare class Vendor extends Model<InferAttributes<Vendor>, InferCreationAttributes<Vendor>> {
    id: CreationOptional<string>;
    name: string;
    mobile_number: string;
    brand_company_id: CreationOptional<string | null>;
    company_name: CreationOptional<string | null>;
    position: CreationOptional<string | null>;
    type_of_business: CreationOptional<string | null>;
    optional_mobile: CreationOptional<string | null>;
    notes: CreationOptional<string | null>;
    area_covered: CreationOptional<string | null>;
    is_architect: CreationOptional<boolean>;
    is_interior: CreationOptional<boolean>;
    is_furniture: CreationOptional<boolean>;
    age: CreationOptional<number | null>;
    dob: CreationOptional<Date | null>;
    reference_name: CreationOptional<string | null>;
    reference_mobile: CreationOptional<string | null>;
    address: CreationOptional<Record<string, any> | null>;
    is_active: CreationOptional<boolean>;
    created_by: CreationOptional<string | null>;
    updated_by: CreationOptional<string | null>;
    projectVendors?: NonAttribute<ProjectVendor[]>;
    vendorTypes?: NonAttribute<VendorType[]>;
}
