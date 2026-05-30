export declare enum TaskPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    URGENT = "urgent"
}
export declare enum TaskType {
    GENERAL = "General",
    DESIGN_UPLOAD = "Design upload",
    REVISION_RESPONSE = "Revision response",
    SITE_VISIT = "Site visit",
    VENDOR_FOLLOW_UP = "Vendor follow-up",
    INVENTORY_DISPATCH = "Inventory dispatch",
    QUALITY_CHECK = "Quality check",
    CLIENT_RESPONSE = "Client response",
    INTERNAL_DOCUMENTATION = "Internal documentation"
}
export declare enum TaskStatus {
    TODO = "todo",
    IN_PROGRESS = "in_progress",
    REVIEW = "review",
    COMPLETED = "completed",
    BLOCKED = "blocked"
}
export declare class CreateTaskDto {
    project_id: string;
    title: string;
    module?: string;
    description?: string;
    assigned_to_user_id?: string;
    due_date?: string;
    priority?: TaskPriority;
    task_type?: TaskType;
    status?: TaskStatus;
}
