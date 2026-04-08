-- ================================================
-- CONSTRUCTION PROJECT MANAGEMENT SYSTEM
-- COMPLETE MySQL 8+ SCHEMA WITH RBAC
-- All 10 modules + Full Role-Based Access Control
-- ================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ================================================
-- 1. RBAC TABLES (NEW - Role Based Access Control)
-- ================================================

CREATE TABLE IF NOT EXISTS roles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,                    -- e.g., 'admin', 'architect', etc.
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS permissions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,                   -- e.g., 'project.create', 'boq.view', 'drawing.approve'
    module VARCHAR(50) NOT NULL,                         -- e.g., 'projects', 'brief', 'boq', 'drawings', 'inventory'
    action VARCHAR(50) NOT NULL,                         -- create, view, edit, delete, approve, manage
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS role_permissions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    role_id BIGINT UNSIGNED NOT NULL,
    permission_id BIGINT UNSIGNED NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_role_permission (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================
-- 2. CORE / MASTER TABLES (Updated with RBAC)
-- ================================================

CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    role_id BIGINT UNSIGNED NOT NULL,                    -- Changed from ENUM to FK
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    password_hash VARCHAR(255) NOT NULL,                 -- Added for authentication
    is_active BOOLEAN DEFAULT TRUE,
    last_login DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS clients (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_number VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE,
    preferred_communication ENUM('Call', 'WhatsApp', 'Email'),
    is_owner BOOLEAN DEFAULT TRUE,
    representative_involved BOOLEAN DEFAULT FALSE,
    representative_comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS sites (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    ownership_status ENUM('Owned', 'Rented', 'Under Process'),
    access_available BOOLEAN,
    existing_structure BOOLEAN,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================
-- 3. CENTRAL PROJECT TABLE
-- ================================================

CREATE TABLE IF NOT EXISTS projects (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    client_id BIGINT UNSIGNED NOT NULL,
    site_id BIGINT UNSIGNED,
    name VARCHAR(255) NOT NULL,
    project_type ENUM('New Construction', 'Renovation', 'Interior Fit-out') NOT NULL,
    service_type ENUM('Construction', 'Interior', 'Renovation'),
    purpose ENUM('Residential', 'Commercial', 'Mixed'),
    number_of_floors INT,
    approximate_area_sqft DECIMAL(12,2),
    budget_range VARCHAR(100),
    timeline_expectation ENUM('Immediate', 'Flexible', 'Fixed Date'),
    design_preference VARCHAR(50),
    status ENUM('brief','pitch','reki_pending','reki_done','scope_done','boq_done',
                'design','execution','vendor_selection','inventory','quality','handover','completed') 
        DEFAULT 'brief',
    current_stage VARCHAR(50),
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    token_received BOOLEAN DEFAULT FALSE,
    created_by BIGINT UNSIGNED,                          -- Who created the project
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================
-- 4. ALL OTHER MODULE TABLES (Same as your original with minor improvements)
-- ================================================

CREATE TABLE IF NOT EXISTS project_brief (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT UNSIGNED UNIQUE NOT NULL,
    rooms_spaces_required JSON,
    parking_required BOOLEAN,
    first_construction_project BOOLEAN,
    decision_readiness VARCHAR(50),
    end_to_end_services BOOLEAN,
    output_client_profile JSON,
    output_project_profile JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS project_pitch (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT UNSIGNED UNIQUE NOT NULL,
    preferred_design_style VARCHAR(100),
    color_tone ENUM('Light','Dark','Mixed','Not Sure'),
    luxury_level ENUM('Low','Medium','High'),
    functional_vs_aesthetic TEXT,
    budget_flexibility BOOLEAN,
    priority_areas JSON,
    likes_dislikes TEXT,
    non_negotiables TEXT,
    special_requirements TEXT,
    moodboard_pdf_url VARCHAR(500),
    pitch_pdf_url VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS pitch_references (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT UNSIGNED NOT NULL,
    reference_type ENUM('image','link','portfolio'),
    url TEXT,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS reki_reports (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT UNSIGNED UNIQUE NOT NULL,
    supervisor_id BIGINT UNSIGNED,
    visit_date DATE NOT NULL,
    client_present BOOLEAN,
    road_access BOOLEAN,
    unloading_space BOOLEAN,
    area_type VARCHAR(30),
    neighbouring_buildings BOOLEAN,
    working_time_restrictions TEXT,
    plot_type VARCHAR(50),
    existing_structure BOOLEAN,
    construction_type VARCHAR(50),
    existing_floors INT,
    structural_cracks BOOLEAN,
    built_up_area DECIMAL(12,2),
    floor_to_floor_height DECIMAL(6,2),
    slab_thickness DECIMAL(6,2),
    columns_beams_visible BOOLEAN,
    wall_condition VARCHAR(20),
    floor_condition VARCHAR(20),
    dampness BOOLEAN,
    dampness_location TEXT,
    termite_damage BOOLEAN,
    electrical_wiring BOOLEAN,
    electrical_panel_location TEXT,
    plumbing_lines BOOLEAN,
    water_inlet_outlet TEXT,
    tanks_present BOOLEAN,
    demolition_required BOOLEAN,
    demolition_type VARCHAR(20),
    safety_concerns BOOLEAN,
    load_bearing_changes VARCHAR(20),
    beam_cutting BOOLEAN,
    core_drilling BOOLEAN,
    structural_consultant_required BOOLEAN,
    power_supply BOOLEAN,
    water_supply BOOLEAN,
    drainage_available BOOLEAN,
    fire_safety_norms BOOLEAN,
    major_constraints TEXT,
    risk_factors TEXT,
    suggestions TEXT,
    client_instructions TEXT,
    reki_pdf_url VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (supervisor_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS reki_photos (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    reki_report_id BIGINT UNSIGNED NOT NULL,
    photo_type VARCHAR(50),
    photo_url VARCHAR(500) NOT NULL,
    FOREIGN KEY (reki_report_id) REFERENCES reki_reports(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS scope_of_work (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT UNSIGNED UNIQUE NOT NULL,
    scope_summary TEXT,
    civil_works JSON,
    mep_works JSON,
    interior_works JSON,
    finishes JSON,
    area_summary JSON,
    scope_pdf_url VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS project_cost_estimates (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT UNSIGNED NOT NULL,
    estimate_type ENUM('Consultation','Turnkey','Constructional'),
    consultation_fee DECIMAL(12,2),
    tentative_total_cost DECIMAL(15,2),
    material_labour_estimate JSON,
    payment_plan JSON,
    annexure_url VARCHAR(500),
    contract_url VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS boq (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT UNSIGNED NOT NULL,
    version INT DEFAULT 1,
    prepared_by BIGINT UNSIGNED,
    prepared_date DATE NOT NULL,
    total_amount DECIMAL(15,2),
    boq_pdf_url VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (prepared_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS boq_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    boq_id BIGINT UNSIGNED NOT NULL,
    category VARCHAR(100) NOT NULL,
    item_description TEXT NOT NULL,
    quantity DECIMAL(12,2),
    unit VARCHAR(30),
    rate DECIMAL(12,2),
    amount DECIMAL(15,2),
    material_spec TEXT,
    remarks TEXT,
    FOREIGN KEY (boq_id) REFERENCES boq(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS project_drawings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT UNSIGNED NOT NULL,
    drawing_type ENUM('Design','Execution','Technical','Construction','Working'),
    version INT DEFAULT 1,
    area_floor VARCHAR(100),
    file_url VARCHAR(500) NOT NULL,
    uploaded_by BIGINT UNSIGNED,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    approved BOOLEAN DEFAULT FALSE,
    approval_date DATETIME,
    approved_by BIGINT UNSIGNED,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS drawing_approval_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    drawing_id BIGINT UNSIGNED NOT NULL,
    client_id BIGINT UNSIGNED,
    approved BOOLEAN,
    remarks TEXT,
    revision_requested BOOLEAN,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (drawing_id) REFERENCES project_drawings(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES clients(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS vendors (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    trade_type VARCHAR(100),
    contact_details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS project_vendors (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT UNSIGNED NOT NULL,
    vendor_id BIGINT UNSIGNED,
    selected BOOLEAN DEFAULT FALSE,
    selection_reason TEXT,
    approved_estimate_value DECIMAL(15,2),
    scope_summary TEXT,
    final_estimate_url VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS materials (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS inventory_requests (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT UNSIGNED NOT NULL,
    material_id BIGINT UNSIGNED,
    quantity_required DECIMAL(12,2),
    required_date DATE,
    vendor_id BIGINT UNSIGNED,
    source_type ENUM('Vendor','Warehouse'),
    status ENUM('requested','approved','dispatched','delivered') DEFAULT 'requested',
    requested_by BIGINT UNSIGNED,
    approved_by BIGINT UNSIGNED,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (material_id) REFERENCES materials(id),
    FOREIGN KEY (vendor_id) REFERENCES vendors(id),
    FOREIGN KEY (requested_by) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS inventory_dispatches (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    request_id BIGINT UNSIGNED NOT NULL,
    dispatch_date DATETIME,
    dispatch_quantity DECIMAL(12,2),
    vehicle_challan VARCHAR(100),
    received_quantity DECIMAL(12,2),
    damage_shortage BOOLEAN,
    supervisor_confirmation BOOLEAN,
    delivery_photo_url VARCHAR(500),
    FOREIGN KEY (request_id) REFERENCES inventory_requests(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS daily_progress_reports (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT UNSIGNED NOT NULL,
    report_date DATE NOT NULL,
    supervisor_id BIGINT UNSIGNED,
    current_stage VARCHAR(100),
    work_executed TEXT,
    manpower_count INT,
    materials_used TEXT,
    issues_faced TEXT,
    progress_photos JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (supervisor_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS quality_checks (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT UNSIGNED NOT NULL,
    stage_name VARCHAR(100),
    quality_met BOOLEAN,
    deviations BOOLEAN,
    corrective_action_required BOOLEAN,
    supervisor_remarks TEXT,
    checked_date DATE,
    checked_by BIGINT UNSIGNED,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (checked_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS issue_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT UNSIGNED NOT NULL,
    issue_description TEXT,
    responsible_party VARCHAR(100),
    target_resolution_date DATE,
    status ENUM('Open','Closed') DEFAULT 'Open',
    before_photo_url VARCHAR(500),
    after_photo_url VARCHAR(500),
    reported_by BIGINT UNSIGNED,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (reported_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS handovers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT UNSIGNED UNIQUE NOT NULL,
    handover_date DATETIME,
    planned_vs_actual_timeline TEXT,
    completion_confirmation BOOLEAN DEFAULT TRUE,
    outstanding_items TEXT,
    warranty_notes TEXT,
    sign_off_client BOOLEAN DEFAULT FALSE,
    sign_off_firm BOOLEAN DEFAULT FALSE,
    handover_pdf_url VARCHAR(500),
    full_drawings_set_url VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS project_documents (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT UNSIGNED NOT NULL,
    module_name VARCHAR(50),
    document_type VARCHAR(100),
    file_url VARCHAR(500) NOT NULL,
    version INT DEFAULT 1,
    uploaded_by BIGINT UNSIGNED,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================
-- INDEXES
-- ================================================

CREATE INDEX idx_projects_client ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_by ON projects(created_by);
CREATE INDEX idx_reki_project ON reki_reports(project_id);
CREATE INDEX idx_boq_project ON boq(project_id);
CREATE INDEX idx_drawings_project ON project_drawings(project_id);
CREATE INDEX idx_inventory_project ON inventory_requests(project_id);
CREATE INDEX idx_role_permissions_role ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_perm ON role_permissions(permission_id);

SET FOREIGN_KEY_CHECKS = 1;
