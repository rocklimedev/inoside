export declare class UpdateProjectMaterialDto {
    item_name?: string;
    inventory_master_id?: string;
    item_code?: string;
    description?: string;
    specification?: string;
    unit_id?: string;
    brand_id?: string;
    quantity_estimated?: number;
    quantity_required?: number;
    quantity_received?: number;
    quantity_used?: number;
    rate?: number;
    gst_percent?: number;
    status?: 'planned' | 'ordered' | 'received' | 'in_use' | 'closed';
    remarks?: string;
    category?: string;
}
