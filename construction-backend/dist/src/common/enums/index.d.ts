export declare enum UserRole {
    CLIENT = "client",
    ARCHITECT = "architect",
    SUPERVISOR = "supervisor",
    ADMIN = "admin",
    VENDOR = "vendor",
    TEAM_MEMBER = "team_member"
}
export declare enum PreferredCommunication {
    CALL = "Call",
    WHATSAPP = "WhatsApp",
    EMAIL = "Email"
}
export declare enum AddressType {
    RESIDENTIAL = "residential",
    BILLING = "billing",
    CORRESPONDENCE = "correspondence",
    OFFICE = "office",
    PROJECT_SITE = "project_site",
    TEMPORARY = "temporary",
    WAREHOUSE = "warehouse",
    OTHER = "other"
}
export declare enum ProjectType {
    NEW_CONSTRUCTION = "New Construction",
    RENOVATION = "Renovation",
    INTERIOR_FITOUT = "Interior Fit-out"
}
export declare enum ServiceType {
    CONSTRUCTION = "Construction",
    INTERIOR = "Interior",
    RENOVATION = "Renovation"
}
export declare enum PurposeType {
    RESIDENTIAL = "Residential",
    COMMERCIAL = "Commercial",
    MIXED = "Mixed"
}
export declare enum TimelineExpectation {
    IMMEDIATE = "Immediate",
    FLEXIBLE = "Flexible",
    FIXED_DATE = "Fixed Date"
}
export declare enum OwnershipStatus {
    OWNED = "Owned",
    RENTED = "Rented",
    UNDER_PROCESS = "Under Process"
}
export declare enum ContextTag {
    AUTH = "AUTH",
    USER = "USER",
    PROJECT = "PROJECT",
    INVENTORY = "INVENTORY",
    BOQ = "BOQ",
    VENDOR = "VENDOR",
    CLIENT = "CLIENT",
    SITE = "SITE",
    TASK = "TASK",
    DRAWING = "DRAWING",
    COST_ESTIMATE = "COST_ESTIMATE"
}
export declare enum ActivityAction {
    CREATE = "CREATE",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
    VIEW = "VIEW",
    LOGIN = "LOGIN",
    LOGOUT = "LOGOUT",
    ASSIGN = "ASSIGN",
    APPROVE = "APPROVE",
    REJECT = "REJECT",
    DOWNLOAD = "DOWNLOAD",
    UPLOAD = "UPLOAD"
}
export declare enum ActivitySeverity {
    INFO = "INFO",
    WARNING = "WARNING",
    ERROR = "ERROR",
    CRITICAL = "CRITICAL"
}
export declare enum CommentEntityType {
    PROJECT = "project",
    BOQ = "boq",
    DRAWING = "drawing",
    REKI_REPORT = "reki_report",
    SCOPE_OF_WORK = "scope_of_work",
    COST_ESTIMATE = "cost_estimate",
    INVENTORY_REQUEST = "inventory_request",
    ISSUE_LOG = "issue_log",
    QUALITY_CHECK = "quality_check",
    SITE_COORDINATION = "site_coordination",
    TASK = "task",
    VENDOR = "vendor"
}
