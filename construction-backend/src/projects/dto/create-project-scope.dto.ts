export class CreateProjectScopeDto {
  service_type?: string;
  requirements_summary?: string;
  site_summary?: string;
  scope_items?: CreateScopeItemDto[];
}

export class CreateScopeItemDto {
  category!: string;
  sub_item?: string;
  description?: string;
}
