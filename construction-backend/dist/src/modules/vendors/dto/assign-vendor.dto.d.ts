declare class VendorTypeDto {
    type_id: string;
}
export declare class AssignVendorDto {
    project_id: string;
    vendor_id: string;
    selected?: boolean;
    selection_reason?: string;
    approved_estimate_value?: number;
    scope_summary?: string;
    final_estimate_url?: string;
    vendor_types?: VendorTypeDto[];
}
export {};
