export class CreateBoqItemDto {
  category?: string;
  item_name!: string;
  quantity!: number;
  unit?: string;
  rate?: number | null;
  specifications?: Record<string, any>;
  remarks?: string;
}

export class CreateBoqVersionDto {
  version?: number;
  prepared_date?: string;
  notes?: string;
  items: CreateBoqItemDto[] = [];
}

export class UpdateBoqVersionDto extends CreateBoqVersionDto {}
