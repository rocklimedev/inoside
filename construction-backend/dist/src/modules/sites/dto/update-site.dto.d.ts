import { OwnershipStatus } from '@/common/enums';
declare class UpdateAddressDto {
    line1?: string;
    line2?: string;
    landmark?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
    latitude?: number;
    longitude?: number;
    google_map_link?: string;
}
export declare class UpdateSiteDto {
    address?: UpdateAddressDto;
    ownership_status?: OwnershipStatus;
    access_available?: boolean;
    existing_structure?: boolean;
}
export {};
