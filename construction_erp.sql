SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ================================================
-- DATABASE CREATION
-- ================================================
CREATE DATABASE IF NOT EXISTS spsyn8lm_construction_db;
USE spsyn8lm_construction_db;

-- ================================================
-- 1. RBAC TABLES
-- ================================================
CREATE TABLE IF NOT EXISTS roles (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS permissions (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    module VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS role_permissions (
    id CHAR(36) PRIMARY KEY,
    role_id CHAR(36) NOT NULL,
    permission_id CHAR(36) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_role_permission (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================
-- 2. CORE TABLES
-- ================================================
CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY,
    role_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS clients (
    id CHAR(36) PRIMARY KEY,
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
    id CHAR(36) PRIMARY KEY,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    ownership_status ENUM('Owned', 'Rented', 'Under Process'),
    access_available BOOLEAN DEFAULT TRUE,
    existing_structure BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================
-- 3. PROJECTS (Central Table)
-- ================================================
CREATE TABLE IF NOT EXISTS projects (
    id CHAR(36) PRIMARY KEY,
    client_id CHAR(36) NOT NULL,
    site_id CHAR(36) NULL,
    name VARCHAR(255) NOT NULL,
    project_type ENUM('New Construction', 'Renovation', 'Interior Fit-out') NOT NULL,
    service_type ENUM('Construction', 'Interior', 'Renovation'),
    purpose ENUM('Residential', 'Commercial', 'Mixed'),
    number_of_floors INT,
    approximate_area_sqft DECIMAL(12,2),
    budget_range VARCHAR(100),
    timeline_expectation ENUM('Immediate', 'Flexible', 'Fixed Date'),
    design_preference VARCHAR(50),
    status ENUM('brief','pitch','reki_pending','reki_done','scope_done','boq_done','design','execution','vendor_selection','inventory','quality','handover','completed') DEFAULT 'brief',
    current_stage VARCHAR(50),
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    token_received BOOLEAN DEFAULT FALSE,
    created_by CHAR(36),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================
-- 4. ADVANCED BOQ SYSTEM
-- ================================================
CREATE TABLE IF NOT EXISTS units (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    short_name VARCHAR(20) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS boq_categories (
    id CHAR(36) PRIMARY KEY,
    project_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS boqs (
    id CHAR(36) PRIMARY KEY,
    project_id CHAR(36) NOT NULL,
    boq_category_id CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    code VARCHAR(100),
    revision_no VARCHAR(50) DEFAULT 'Rev-01',
    status ENUM('draft', 'submitted', 'approved', 'rejected', 'revised') DEFAULT 'draft',
    notes TEXT,
    subtotal DECIMAL(16,2) DEFAULT 0,
    tax_amount DECIMAL(16,2) DEFAULT 0,
    grand_total DECIMAL(16,2) DEFAULT 0,
    prepared_by CHAR(36),
    approved_by CHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (boq_category_id) REFERENCES boq_categories(id) ON DELETE CASCADE,
    FOREIGN KEY (prepared_by) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS boq_sections (
    id CHAR(36) PRIMARY KEY,
    boq_id CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (boq_id) REFERENCES boqs(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS boq_items (
    id CHAR(36) PRIMARY KEY,
    boq_id CHAR(36) NOT NULL,
    section_id CHAR(36) NOT NULL,
    unit_id CHAR(36) NULL,
    sno VARCHAR(50),
    item_name TEXT NOT NULL,
    description TEXT,
    qty DECIMAL(14,2) DEFAULT 0,
    rate DECIMAL(14,2) DEFAULT 0,
    amount DECIMAL(16,2) GENERATED ALWAYS AS (qty * rate) STORED,
    remarks TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (boq_id) REFERENCES boqs(id) ON DELETE CASCADE,
    FOREIGN KEY (section_id) REFERENCES boq_sections(id) ON DELETE CASCADE,
    FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================
-- 5. ALL OTHER MODULE TABLES
-- ================================================
CREATE TABLE IF NOT EXISTS project_brief (
    id CHAR(36) PRIMARY KEY,
    project_id CHAR(36) UNIQUE NOT NULL,
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
    id CHAR(36) PRIMARY KEY,
    project_id CHAR(36) UNIQUE NOT NULL,
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
    id CHAR(36) PRIMARY KEY,
    project_id CHAR(36) NOT NULL,
    reference_type ENUM('image','link','portfolio'),
    url TEXT,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS reki_reports (
    id CHAR(36) PRIMARY KEY,
    project_id CHAR(36) UNIQUE NOT NULL,
    supervisor_id CHAR(36),
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
    id CHAR(36) PRIMARY KEY,
    reki_report_id CHAR(36) NOT NULL,
    photo_type VARCHAR(50),
    photo_url VARCHAR(500) NOT NULL,
    FOREIGN KEY (reki_report_id) REFERENCES reki_reports(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS scope_of_work (
    id CHAR(36) PRIMARY KEY,
    project_id CHAR(36) UNIQUE NOT NULL,
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
    id CHAR(36) PRIMARY KEY,
    project_id CHAR(36) NOT NULL,
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

CREATE TABLE IF NOT EXISTS project_drawings (
    id CHAR(36) PRIMARY KEY,
    project_id CHAR(36) NOT NULL,
    drawing_type ENUM('Design','Execution','Technical','Construction','Working'),
    version INT DEFAULT 1,
    area_floor VARCHAR(100),
    file_url VARCHAR(500) NOT NULL,
    uploaded_by CHAR(36),
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    approved BOOLEAN DEFAULT FALSE,
    approval_date DATETIME,
    approved_by CHAR(36),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS drawing_approval_logs (
    id CHAR(36) PRIMARY KEY,
    drawing_id CHAR(36) NOT NULL,
    client_id CHAR(36),
    approved BOOLEAN,
    remarks TEXT,
    revision_requested BOOLEAN,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (drawing_id) REFERENCES project_drawings(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES clients(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS vendors (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    trade_type VARCHAR(100),
    contact_details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS project_vendors (
    id CHAR(36) PRIMARY KEY,
    project_id CHAR(36) NOT NULL,
    vendor_id CHAR(36),
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
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS inventory_requests (
    id CHAR(36) PRIMARY KEY,
    project_id CHAR(36) NOT NULL,
    material_id CHAR(36),
    quantity_required DECIMAL(12,2),
    required_date DATE,
    vendor_id CHAR(36),
    source_type ENUM('Vendor','Warehouse'),
    status ENUM('requested','approved','dispatched','delivered') DEFAULT 'requested',
    requested_by CHAR(36),
    approved_by CHAR(36),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (material_id) REFERENCES materials(id),
    FOREIGN KEY (vendor_id) REFERENCES vendors(id),
    FOREIGN KEY (requested_by) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS inventory_dispatches (
    id CHAR(36) PRIMARY KEY,
    request_id CHAR(36) NOT NULL,
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
    id CHAR(36) PRIMARY KEY,
    project_id CHAR(36) NOT NULL,
    report_date DATE NOT NULL,
    supervisor_id CHAR(36),
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
    id CHAR(36) PRIMARY KEY,
    project_id CHAR(36) NOT NULL,
    stage_name VARCHAR(100),
    quality_met BOOLEAN,
    deviations BOOLEAN,
    corrective_action_required BOOLEAN,
    supervisor_remarks TEXT,
    checked_date DATE,
    checked_by CHAR(36),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (checked_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS issue_logs (
    id CHAR(36) PRIMARY KEY,
    project_id CHAR(36) NOT NULL,
    issue_description TEXT,
    responsible_party VARCHAR(100),
    target_resolution_date DATE,
    status ENUM('Open','Closed') DEFAULT 'Open',
    before_photo_url VARCHAR(500),
    after_photo_url VARCHAR(500),
    reported_by CHAR(36),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (reported_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS handovers (
    id CHAR(36) PRIMARY KEY,
    project_id CHAR(36) UNIQUE NOT NULL,
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
    id CHAR(36) PRIMARY KEY,
    project_id CHAR(36) NOT NULL,
    module_name VARCHAR(50),
    document_type VARCHAR(100),
    file_url VARCHAR(500) NOT NULL,
    version INT DEFAULT 1,
    uploaded_by CHAR(36),
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
CREATE INDEX idx_boq_categories_project ON boq_categories(project_id);
CREATE INDEX idx_boqs_project ON boqs(project_id);
CREATE INDEX idx_boq_sections_boq ON boq_sections(boq_id);
CREATE INDEX idx_boq_items_boq ON boq_items(boq_id);
CREATE INDEX idx_reki_project ON reki_reports(project_id);
CREATE INDEX idx_drawings_project ON project_drawings(project_id);
CREATE INDEX idx_inventory_project ON inventory_requests(project_id);

-- ================================================
-- SAMPLE DATA
-- ================================================
INSERT IGNORE INTO units (name, short_name) VALUES
('Number', 'Nos'), ('Square Feet', 'Sqft'), ('Square Meter', 'Sqm'),
('Running Feet', 'Rft'), ('Meter', 'M'), ('Kilogram', 'Kg'),
('Litre', 'Ltr'), ('Piece', 'Pcs'), ('Set', 'Set'), ('Hour', 'Hr');

SET FOREIGN_KEY_CHECKS = 1;

-- Success Message
SELECT '✅ FULL CONSTRUCTION PROJECT MANAGEMENT SYSTEM SCHEMA CREATED SUCCESSFULLY (with UUIDs)' AS status;