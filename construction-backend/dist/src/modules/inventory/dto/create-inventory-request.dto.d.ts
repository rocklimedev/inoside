export declare class CreateInventoryRequestDto {
    project_id: string;
    project_material_id: string;
    quantity_required: number;
    required_date?: string;
    vendor_id?: string;
    source_type: 'Vendor' | 'Warehouse';
    requested_by?: string;
}
