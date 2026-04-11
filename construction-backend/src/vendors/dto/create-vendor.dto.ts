export class CreateVendorDto {
  name!: string;
  trade_type?: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  primary_address_id?: string;
  rating?: number;
  past_performance?: Record<string, any>;
  is_active?: boolean;
}
