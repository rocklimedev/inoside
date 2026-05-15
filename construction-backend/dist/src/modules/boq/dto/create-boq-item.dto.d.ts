export declare class CreateBoqItemDto {
    boq_id: string;
    section_id: string;
    subheading_id?: string;
    inventory_item_id?: string;
    unit_id?: string;
    item_name: string;
    sno?: string;
    item_code?: string;
    description?: string;
    specification?: string;
    brand?: string;
    qty?: number;
    rate?: number;
    wastage_percent?: number;
    discount_percent?: number;
    tax_percent?: number;
    remarks?: string;
    sort_order?: number;
}
