export class CreateVendorQuotationDto {
  project_id?: string;
  vendor_id?: string;
  trade_category?: string;
  raw_quote_data?: Record<string, any>;
  total_amount?: number;
}
