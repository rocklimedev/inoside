import { OwnershipStatus } from '@/common/enums';
export declare class CreateSiteDto {
    address: string;
    city: string;
    ownership_status?: OwnershipStatus;
    access_available?: boolean;
    existing_structure?: boolean;
}
