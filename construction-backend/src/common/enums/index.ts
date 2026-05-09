export enum UserRole {
  CLIENT = 'client',
  ARCHITECT = 'architect',
  SUPERVISOR = 'supervisor',
  ADMIN = 'admin',
  VENDOR = 'vendor',
  TEAM_MEMBER = 'team_member',
}

export enum PreferredCommunication {
  CALL = 'Call',
  WHATSAPP = 'WhatsApp',
  EMAIL = 'Email',
}
export enum AddressType {
  RESIDENTIAL = 'residential',
  BILLING = 'billing',
  CORRESPONDENCE = 'correspondence',
  OFFICE = 'office',
  PROJECT_SITE = 'project_site',
  TEMPORARY = 'temporary',
  WAREHOUSE = 'warehouse',
  OTHER = 'other',
}

export enum ProjectType {
  NEW_CONSTRUCTION = 'New Construction',
  RENOVATION = 'Renovation',
  INTERIOR_FITOUT = 'Interior Fit-out',
}

export enum ServiceType {
  CONSTRUCTION = 'Construction',
  INTERIOR = 'Interior',
  RENOVATION = 'Renovation',
}

export enum PurposeType {
  RESIDENTIAL = 'Residential',
  COMMERCIAL = 'Commercial',
  MIXED = 'Mixed',
}

export enum TimelineExpectation {
  IMMEDIATE = 'Immediate',
  FLEXIBLE = 'Flexible',
  FIXED_DATE = 'Fixed Date',
}
export enum OwnershipStatus {
  OWNED = 'Owned',
  RENTED = 'Rented',
  UNDER_PROCESS = 'Under Process',
}
