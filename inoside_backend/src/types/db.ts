// ── Enums (App-Level) ────────────────────────────────────────────────

export enum UserRole {
  CLIENT = "client",
  ARCHITECT = "architect",
  SUPERVISOR = "supervisor",
  ADMIN = "admin",
  VENDOR = "vendor",
  TEAM_MEMBER = "team_member",
}

export enum PreferredComm {
  CALL = "Call",
  WHATSAPP = "WhatsApp",
  EMAIL = "Email",
}

export enum ProjectType {
  NEW_CONSTRUCTION = "New Construction",
  RENOVATION = "Renovation",
  INTERIOR_FIT_OUT = "Interior Fit-out",
  SINGLE_FLOOR = "Single Floor",
  MULTIPLE_FLOORS = "Multiple Floors",
  ENTIRE_BUILDING = "Entire Building",
}

export enum ProjectPurpose {
  RESIDENTIAL = "Residential",
  COMMERCIAL = "Commercial",
  MIXED = "Mixed",
}

// ── PostgreSQL ENUM → TypeScript ENUM ────────────────────────────────

export enum DesignPreference {
  MODERN = "Modern",
  MINIMAL = "Minimal",
  LUXURY = "Luxury",
  TRADITIONAL = "Traditional",
  NOT_SURE = "Not Sure",
}

export enum DecisionReadiness {
  EXPLORING = "exploring",
  READY = "ready",
}

export enum ColorTone {
  LIGHT = "Light",
  DARK = "Dark",
  MIXED = "Mixed",
  NOT_SURE = "Not Sure",
}

export enum LuxuryLevel {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
}

export enum ProposalType {
  CONSULTATION = "consultation",
  TURNKEY = "turnkey",
  BUILDER_MODEL = "builder_model",
}

export enum AttachmentEntityType {
  REKI_PHOTO = "reki_photo",
  MOODBOARD = "moodboard",
  PITCH_REF = "pitch_ref",
  DESIGN_UPLOAD = "design_upload",
  EXECUTION_DRAWING = "execution_drawing",
  DAILY_PHOTO = "daily_photo",
  BOQ = "boq",
  HANDOVER_PDF = "handover_pdf",
  DRAWINGS_ZIP = "drawings_zip",
  ISSUE_BEFORE = "issue_before",
  ISSUE_AFTER = "issue_after",
  ETC = "etc",
}

export enum FileType {
  IMAGE = "image",
  PDF = "pdf",
  ZIP = "zip",
  DOC = "doc",
  OTHER = "other",
}

export enum AddressType {
  RESIDENTIAL = "residential",
  BILLING = "billing",
  CORRESPONDENCE = "correspondence",
  OFFICE = "office",
  PROJECT_SITE = "project_site",
  TEMPORARY = "temporary",
  WAREHOUSE = "warehouse",
  OTHER = "other",
}
