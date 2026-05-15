export declare class CreateRequestDto {
    project_id: string;
    material_id: string;
    quantity_required: number;
    source_type: 'Vendor' | 'Warehouse';
    vendor_id?: string;
}
