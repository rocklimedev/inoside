-- =====================================================
-- EXECUTION MODULE MIGRATION
-- =====================================================

---

-- EXECUTION STAGES

---

CREATE TABLE IF NOT EXISTS execution_stages (
id CHAR(36) NOT NULL,


project_id CHAR(36) NOT NULL,

name VARCHAR(255) NOT NULL,
description TEXT,

planned_start_date DATE,
planned_end_date DATE,

actual_start_date DATE,
actual_end_date DATE,

progress_percentage DECIMAL(5,2) DEFAULT 0.00,

status ENUM(
    'pending',
    'in_progress',
    'completed',
    'blocked'
) DEFAULT 'pending',

created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

PRIMARY KEY (id),

KEY idx_execution_stages_project(project_id),
KEY idx_execution_stages_status(status),

CONSTRAINT fk_execution_stage_project
    FOREIGN KEY (project_id)
    REFERENCES projects(id)
    ON DELETE CASCADE


) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

---

-- EXECUTION ACTIVITIES

---

CREATE TABLE IF NOT EXISTS execution_activities (
id CHAR(36) NOT NULL,


project_id CHAR(36) NOT NULL,
stage_id CHAR(36) DEFAULT NULL,

title VARCHAR(255) NOT NULL,
description TEXT,

activity_date DATE NOT NULL,

planned_quantity DECIMAL(12,2) DEFAULT NULL,
completed_quantity DECIMAL(12,2) DEFAULT NULL,

unit VARCHAR(50) DEFAULT NULL,

status ENUM(
    'pending',
    'ongoing',
    'completed',
    'delayed'
) DEFAULT 'pending',

created_by CHAR(36) DEFAULT NULL,

created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

PRIMARY KEY(id),

KEY idx_execution_activities_project(project_id),
KEY idx_execution_activities_stage(stage_id),
KEY idx_execution_activities_date(activity_date),

CONSTRAINT fk_execution_activity_project
    FOREIGN KEY(project_id)
    REFERENCES projects(id)
    ON DELETE CASCADE,

CONSTRAINT fk_execution_activity_stage
    FOREIGN KEY(stage_id)
    REFERENCES execution_stages(id)
    ON DELETE SET NULL,

CONSTRAINT fk_execution_activity_user
    FOREIGN KEY(created_by)
    REFERENCES users(id)
    ON DELETE SET NULL


) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

---

-- SITE ATTENDANCE

---

CREATE TABLE IF NOT EXISTS site_attendance (
id CHAR(36) NOT NULL,


project_id CHAR(36) NOT NULL,

attendance_date DATE NOT NULL,

labour_count INT DEFAULT 0,

mason_count INT DEFAULT 0,
helper_count INT DEFAULT 0,
electrician_count INT DEFAULT 0,
plumber_count INT DEFAULT 0,
carpenter_count INT DEFAULT 0,
painter_count INT DEFAULT 0,

remarks TEXT,

created_by CHAR(36) DEFAULT NULL,

created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

PRIMARY KEY(id),

KEY idx_site_attendance_project(project_id),
KEY idx_site_attendance_date(attendance_date),

CONSTRAINT fk_site_attendance_project
    FOREIGN KEY(project_id)
    REFERENCES projects(id)
    ON DELETE CASCADE,

CONSTRAINT fk_site_attendance_user
    FOREIGN KEY(created_by)
    REFERENCES users(id)
    ON DELETE SET NULL


) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

---

-- MATERIAL CONSUMPTION

---

CREATE TABLE IF NOT EXISTS material_consumption (
id CHAR(36) NOT NULL,


project_id CHAR(36) NOT NULL,

inventory_master_id CHAR(36) NOT NULL,

quantity_used DECIMAL(12,2) NOT NULL DEFAULT 0,

usage_date DATE NOT NULL,

remarks TEXT,

recorded_by CHAR(36) DEFAULT NULL,

created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

PRIMARY KEY(id),

KEY idx_material_consumption_project(project_id),
KEY idx_material_consumption_inventory(inventory_master_id),
KEY idx_material_consumption_date(usage_date),

CONSTRAINT fk_material_consumption_project
    FOREIGN KEY(project_id)
    REFERENCES projects(id)
    ON DELETE CASCADE,

CONSTRAINT fk_material_consumption_inventory
    FOREIGN KEY(inventory_master_id)
    REFERENCES inventory_master(id)
    ON DELETE CASCADE,

CONSTRAINT fk_material_consumption_user
    FOREIGN KEY(recorded_by)
    REFERENCES users(id)
    ON DELETE SET NULL


) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

---

-- SITE PHOTOS

---

CREATE TABLE IF NOT EXISTS site_photos (
id CHAR(36) NOT NULL,


project_id CHAR(36) NOT NULL,

stage_id CHAR(36) DEFAULT NULL,

title VARCHAR(255),
description TEXT,

photo_url VARCHAR(500) NOT NULL,

photo_type ENUM(
    'before',
    'during',
    'after',
    'issue',
    'quality'
) DEFAULT 'during',

uploaded_by CHAR(36) DEFAULT NULL,

created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

PRIMARY KEY(id),

KEY idx_site_photos_project(project_id),
KEY idx_site_photos_stage(stage_id),

CONSTRAINT fk_site_photos_project
    FOREIGN KEY(project_id)
    REFERENCES projects(id)
    ON DELETE CASCADE,

CONSTRAINT fk_site_photos_stage
    FOREIGN KEY(stage_id)
    REFERENCES execution_stages(id)
    ON DELETE SET NULL,

CONSTRAINT fk_site_photos_user
    FOREIGN KEY(uploaded_by)
    REFERENCES users(id)
    ON DELETE SET NULL


) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

---

-- WORK ORDERS

---

CREATE TABLE IF NOT EXISTS work_orders (
id CHAR(36) NOT NULL,


project_id CHAR(36) NOT NULL,

vendor_id CHAR(36) DEFAULT NULL,

title VARCHAR(255) NOT NULL,

description TEXT,

order_value DECIMAL(15,2) DEFAULT 0.00,

start_date DATE,
end_date DATE,

status ENUM(
    'draft',
    'issued',
    'ongoing',
    'completed',
    'cancelled'
) DEFAULT 'draft',

created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

PRIMARY KEY(id),

KEY idx_work_orders_project(project_id),
KEY idx_work_orders_vendor(vendor_id),
KEY idx_work_orders_status(status),

CONSTRAINT fk_work_order_project
    FOREIGN KEY(project_id)
    REFERENCES projects(id)
    ON DELETE CASCADE,

CONSTRAINT fk_work_order_vendor
    FOREIGN KEY(vendor_id)
    REFERENCES vendors(id)
    ON DELETE SET NULL


) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

---

-- EXECUTION MILESTONES

---

CREATE TABLE IF NOT EXISTS execution_milestones (
id CHAR(36) NOT NULL,


project_id CHAR(36) NOT NULL,

title VARCHAR(255) NOT NULL,

description TEXT,

planned_date DATE,
achieved_date DATE,

status ENUM(
    'pending',
    'achieved',
    'delayed'
) DEFAULT 'pending',

created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

PRIMARY KEY(id),

KEY idx_execution_milestones_project(project_id),
KEY idx_execution_milestones_status(status),

CONSTRAINT fk_execution_milestones_project
    FOREIGN KEY(project_id)
    REFERENCES projects(id)
    ON DELETE CASCADE


) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
