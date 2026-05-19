export declare class UpdateInventoryRequestDto {
    material_id?: string;
    quantity_required?: number;
    required_date?: string;
    vendor_id?: string;
    source_type?: 'Vendor' | 'Warehouse';
    status?: 'requested' | 'approved' | 'dispatched' | 'delivered';
    approved_by?: string;
}
