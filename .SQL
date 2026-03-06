-- =============================================================================
-- Construction Project Management Database
-- Optimized Single-File Schema with UUIDs Everywhere + Centralized Addresses
-- Version: 2025-03 + UUIDs + Centralized Addresses
-- =============================================================================

-- Recommended: enable pgcrypto if not using built-in gen_random_uuid() (PG ≥ 13)
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- HELPER FUNCTION (updated_at trigger)
-- =============================================================================

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- 1. ENUM TYPES (unchanged)
-- =============================================================================

CREATE TYPE user_role AS ENUM (
    'client', 'architect', 'supervisor', 'admin', 'vendor', 'team_member'
);

CREATE TYPE preferred_comm AS ENUM ('Call', 'WhatsApp', 'Email');

CREATE TYPE project_type_enum AS ENUM (
    'New Construction', 'Renovation', 'Interior Fit-out',
    'Single Floor', 'Multiple Floors', 'Entire Building'
);

CREATE TYPE project_purpose_enum AS ENUM ('Residential', 'Commercial', 'Mixed');

CREATE TYPE design_preference_enum AS ENUM (
    'Modern', 'Minimal', 'Luxury', 'Traditional', 'Not Sure'
);

CREATE TYPE decision_readiness_enum AS ENUM ('exploring', 'ready');

CREATE TYPE color_tone_enum AS ENUM ('Light', 'Dark', 'Mixed', 'Not Sure');

CREATE TYPE luxury_level_enum AS ENUM ('Low', 'Medium', 'High');

CREATE TYPE proposal_type_enum AS ENUM ('consultation', 'turnkey', 'builder_model');

CREATE TYPE attachment_entity_type AS ENUM (
    'reki_photo', 'moodboard', 'pitch_ref', 'design_upload',
    'execution_drawing', 'daily_photo', 'boq', 'handover_pdf',
    'drawings_zip', 'issue_before', 'issue_after', 'etc'
);

CREATE TYPE file_type_enum AS ENUM ('image', 'pdf', 'zip', 'doc', 'other');

CREATE TYPE address_type_enum AS ENUM (
    'residential', 'billing', 'correspondence', 'office',
    'project_site', 'temporary', 'warehouse', 'other'
);

-- =============================================================================
-- 2. USERS
-- =============================================================================

CREATE TABLE users (
    id                  UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name           VARCHAR(255)        NOT NULL,
    email               VARCHAR(255)        UNIQUE NOT NULL,
    phone               VARCHAR(20),
    role                user_role           NOT NULL,
    preferred_comm      preferred_comm      DEFAULT 'Email',
    password_hash       TEXT                NOT NULL,
    is_active           BOOLEAN             DEFAULT true,

    primary_address_id  UUID                REFERENCES addresses(id) ON DELETE SET NULL,

    created_at          TIMESTAMPTZ         DEFAULT now(),
    updated_at          TIMESTAMPTZ         DEFAULT now(),
    lock_version        INT                 DEFAULT 0 NOT NULL
);

CREATE TRIGGER set_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- =============================================================================
-- 3. CENTRALIZED ADDRESSES
-- =============================================================================

CREATE TABLE addresses (
    id              UUID                PRIMARY KEY DEFAULT gen_random_uuid(),

    entity_type     VARCHAR(50)         NOT NULL,   -- 'users', 'projects', 'vendors'
    entity_id       UUID                NOT NULL,

    line1           VARCHAR(255)        NOT NULL,
    line2           VARCHAR(255),
    landmark        VARCHAR(150),
    locality_area   VARCHAR(150),
    city            VARCHAR(100)        NOT NULL,
    state_province  VARCHAR(100),
    postal_code     VARCHAR(20),
    country         VARCHAR(100)        DEFAULT 'India' NOT NULL,

    address_type    address_type_enum   DEFAULT 'project_site',
    is_primary      BOOLEAN             DEFAULT true,
    notes           TEXT,

    created_at      TIMESTAMPTZ         DEFAULT now(),
    updated_at      TIMESTAMPTZ         DEFAULT now(),
    lock_version    INT                 DEFAULT 0   NOT NULL,

    CONSTRAINT unique_entity_address UNIQUE (entity_type, entity_id, address_type, is_primary)
);

CREATE INDEX idx_addresses_entity    ON addresses(entity_type, entity_id);
CREATE INDEX idx_addresses_primary   ON addresses(entity_type, entity_id) WHERE is_primary;
CREATE INDEX idx_addresses_location  ON addresses(country, state_province, city, postal_code);

CREATE TRIGGER set_addresses_updated_at
    BEFORE UPDATE ON addresses
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- =============================================================================
-- 4. PROJECTS
-- =============================================================================

CREATE TABLE projects (
    id                          UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    client_user_id              UUID                REFERENCES users(id) ON DELETE SET NULL,
    name                        VARCHAR(255)        NOT NULL,
    project_type                project_type_enum,
    purpose                     project_purpose_enum,
    num_floors                  INT,
    approx_area                 NUMERIC(12,2),
    budget_range                VARCHAR(50),
    timeline_expectation        VARCHAR(50),
    design_preference           design_preference_enum,
    is_first_project            BOOLEAN             DEFAULT true,
    decision_readiness          decision_readiness_enum,
    worked_with_before          BOOLEAN             DEFAULT false,
    end_to_end                  BOOLEAN             DEFAULT true,
    status                      VARCHAR(30)         DEFAULT 'brief',
    current_stage               VARCHAR(50),
    overall_completion          NUMERIC(5,2)        DEFAULT 0,

    preferred_style             VARCHAR(100),
    color_tone                  color_tone_enum,
    luxury_level                luxury_level_enum,
    func_vs_aesth               NUMERIC(3,1),
    budget_flexible             BOOLEAN             DEFAULT true,
    priority_areas              JSONB,
    likes_dislikes              TEXT,
    non_negotiables             TEXT,
    special_req                 TEXT,

    primary_site_address_id     UUID                REFERENCES addresses(id) ON DELETE SET NULL,

    created_at                  TIMESTAMPTZ         DEFAULT now(),
    updated_at                  TIMESTAMPTZ         DEFAULT now(),
    lock_version                INT                 DEFAULT 0 NOT NULL
);

CREATE TRIGGER set_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE INDEX idx_projects_client_status ON projects(client_user_id, status);
CREATE INDEX idx_projects_completion    ON projects(overall_completion);

-- =============================================================================
-- 5. ATTACHMENTS
-- =============================================================================

CREATE TABLE attachments (
    id              UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type     attachment_entity_type NOT NULL,
    entity_id       UUID                NOT NULL,
    file_path       TEXT                NOT NULL,
    file_type       file_type_enum      NOT NULL,
    uploaded_by     UUID                REFERENCES users(id),
    uploaded_at     TIMESTAMPTZ         DEFAULT now()
);

CREATE INDEX idx_attachments_entity   ON attachments(entity_type, entity_id);
CREATE INDEX idx_attachments_uploader ON attachments(uploaded_by);

-- =============================================================================
-- 6. PROJECT PROPOSALS
-- =============================================================================

CREATE TABLE project_proposals (
    id                          UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id                  UUID                UNIQUE NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    proposal_type               proposal_type_enum  NOT NULL,
    scope_summary               TEXT,
    notes                       TEXT,
    prepared_by                 UUID                REFERENCES users(id),

    time_involvement_estimate   INTERVAL,
    consultation_fee            NUMERIC(12,2),
    duration_months             INTEGER,
    deliverables                JSONB,
    terms_limitations           TEXT,

    material_labour_estimate    JSONB,
    tentative_cost_estimate     NUMERIC(15,2),
    payment_plan_stages         JSONB,

    annexure_specs              JSONB,
    buyer_payment_plan          JSONB,
    contract_template           TEXT,
    buyer_name                  VARCHAR(255),
    signed_by_client            BOOLEAN             DEFAULT false,
    signed_by_builder           BOOLEAN             DEFAULT false,

    created_at                  TIMESTAMPTZ         DEFAULT now(),
    updated_at                  TIMESTAMPTZ         DEFAULT now(),
    lock_version                INT                 DEFAULT 0 NOT NULL
);

CREATE TRIGGER set_proposals_updated_at
    BEFORE UPDATE ON project_proposals
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- =============================================================================
-- 7. SITE REKI REPORT
-- =============================================================================

CREATE TABLE site_reki_report (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id          UUID            UNIQUE NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    visit_date          DATE,
    supervisor_id       UUID            REFERENCES users(id),
    client_present      BOOLEAN         DEFAULT false,

    road_access         BOOLEAN,
    unloading_space     BOOLEAN,
    plot_type           VARCHAR(100),
    construction_type   VARCHAR(100),
    cracks              BOOLEAN,
    dampness            BOOLEAN,
    termite             BOOLEAN,
    electrical_wiring   BOOLEAN,
    demolition_required BOOLEAN,
    load_bearing_changes BOOLEAN,
    power_supply        BOOLEAN,

    remarks             TEXT,
    major_constraints   TEXT,
    risk_factors        TEXT,
    suggestions         TEXT,
    client_instructions TEXT,

    completed_at        TIMESTAMPTZ     DEFAULT now()
);

-- =============================================================================
-- 8. SCOPE
-- =============================================================================

CREATE TABLE project_scopes (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id          UUID        UNIQUE NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    service_type        VARCHAR(100),
    requirements_summary TEXT,
    site_summary        TEXT
);

CREATE TABLE scope_items (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    scope_id    UUID        NOT NULL REFERENCES project_scopes(id) ON DELETE CASCADE,
    category    VARCHAR(100),
    sub_item    VARCHAR(150),
    description TEXT
);

-- =============================================================================
-- 9. BOQ
-- =============================================================================

CREATE TABLE boq_versions (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id      UUID            NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    version         INT             DEFAULT 1,
    prepared_by     UUID            REFERENCES users(id),
    prepared_date   DATE,
    grand_total     NUMERIC(15,2),
    notes           TEXT,
    created_at      TIMESTAMPTZ     DEFAULT now()
);

CREATE TABLE boq_items (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    boq_id          UUID            NOT NULL REFERENCES boq_versions(id) ON DELETE CASCADE,
    category        VARCHAR(100),
    item_name       TEXT            NOT NULL,
    quantity        NUMERIC(12,2)   NOT NULL,
    unit            VARCHAR(20),
    rate            NUMERIC(10,2),
    amount          NUMERIC(12,2)   GENERATED ALWAYS AS (quantity * rate) STORED,
    specifications  JSONB,
    remarks         TEXT
);

-- =============================================================================
-- 10. DESIGN & EXECUTION DRAWINGS
-- =============================================================================

CREATE TABLE design_uploads (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id      UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    design_type     VARCHAR(100),
    version         INT         DEFAULT 1,
    description     TEXT,
    uploaded_by     UUID        REFERENCES users(id)
);

CREATE TABLE execution_drawings (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id          UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    drawing_type        VARCHAR(50) NOT NULL,
    version             INT         DEFAULT 1,
    area_floor_ref      VARCHAR(100),
    description         TEXT,
    uploaded_by         UUID        REFERENCES users(id)
);

-- =============================================================================
-- 11. VENDORS
-- =============================================================================

CREATE TABLE vendors (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    name                VARCHAR(255)    NOT NULL,
    trade_type          VARCHAR(100),
    contact_person      VARCHAR(100),
    phone               VARCHAR(20),
    email               VARCHAR(255),

    primary_address_id  UUID            REFERENCES addresses(id) ON DELETE SET NULL,

    rating              NUMERIC(3,1),
    past_performance    JSONB,
    is_active           BOOLEAN         DEFAULT true,

    created_at          TIMESTAMPTZ     DEFAULT now(),
    updated_at          TIMESTAMPTZ     DEFAULT now(),
    lock_version        INT             DEFAULT 0 NOT NULL
);

CREATE TRIGGER set_vendors_updated_at
    BEFORE UPDATE ON vendors
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- =============================================================================
-- 12. VENDOR QUOTATIONS
-- =============================================================================

CREATE TABLE vendor_quotations (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id      UUID        REFERENCES projects(id) ON DELETE CASCADE,
    vendor_id       UUID        REFERENCES vendors(id) ON DELETE SET NULL,
    trade_category  VARCHAR(100),
    raw_quote_data  JSONB,
    total_amount    NUMERIC(12,2),
    submitted_at    TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- 13. PROGRESS, QUALITY, ISSUES, HANDOVER
-- =============================================================================

CREATE TABLE daily_progress_reports (
    id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id              UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    report_date             DATE        NOT NULL,
    current_stage           VARCHAR(100),
    work_executed           TEXT,
    manpower_count          INT,
    materials_used          JSONB,
    issues_faced            TEXT,
    completion_percent_today NUMERIC(5,2),
    created_by              UUID        REFERENCES users(id),
    created_at              TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE stage_quality_checks (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id          UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    stage_name          VARCHAR(100),
    quality_met         BOOLEAN,
    deviations          BOOLEAN,
    corrective_action   TEXT,
    supervisor_remarks  TEXT,
    checked_by          UUID        REFERENCES users(id),
    checked_at          TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE project_issues (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id          UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    issue_description   TEXT        NOT NULL,
    responsible_party   VARCHAR(100),
    target_resolution_date DATE,
    status              VARCHAR(30) DEFAULT 'Open',
    before_photo_id     UUID        REFERENCES attachments(id),
    after_photo_id      UUID        REFERENCES attachments(id),
    closed_at           TIMESTAMPTZ
);

CREATE TABLE handovers (
    id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id              UUID        UNIQUE NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    handover_date           DATE,
    planned_vs_actual_timeline JSONB,
    scope_summary           TEXT,
    completion_confirmation BOOLEAN     DEFAULT false,
    outstanding_items       TEXT,
    warranty_months         INT         DEFAULT 12,
    maintenance_notes       TEXT,
    client_signed_at        TIMESTAMPTZ,
    firm_signed_at          TIMESTAMPTZ,
    handover_pdf_id         UUID        REFERENCES attachments(id),
    drawings_zip_id         UUID        REFERENCES attachments(id),
    autogenerated_at        TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- 14. MATERIAL REQUESTS
-- =============================================================================

CREATE TABLE material_requests (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id          UUID        REFERENCES projects(id) ON DELETE CASCADE,
    material_name       VARCHAR(255) NOT NULL,
    category            VARCHAR(100),
    quantity_required   NUMERIC(12,2),
    unit                VARCHAR(20),
    required_by_date    DATE,
    requested_by        UUID        REFERENCES users(id),
    status              VARCHAR(30) DEFAULT 'Pending',
    created_at          TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- 15. MATERIALIZED VIEW – Dashboard (updated to UUID)
-- =============================================================================

CREATE MATERIALIZED VIEW project_progress_dashboard AS
SELECT
    p.id                        AS project_id,
    p.name,
    p.status,
    p.overall_completion,
    p.current_stage,
    a.city                      AS project_city,
    MAX(dpr.report_date)        AS last_report_date,
    COUNT(dpr.id)               AS report_count,
    BOOL_OR(pi.status = 'Open') AS has_open_issues
FROM projects p
LEFT JOIN addresses a ON a.id = p.primary_site_address_id AND a.is_primary
LEFT JOIN daily_progress_reports dpr ON dpr.project_id = p.id
LEFT JOIN project_issues pi ON pi.project_id = p.id
GROUP BY p.id, p.name, p.status, p.overall_completion, p.current_stage, a.city;

CREATE UNIQUE INDEX idx_dashboard_project ON project_progress_dashboard(project_id);

-- =============================================================================
-- End of schema
-- =============================================================================

-- Example: inserting a project + address
/*
INSERT INTO addresses (entity_type, entity_id, line1, city, address_type, is_primary)
VALUES ('projects', gen_random_uuid(), 'Plot 42, Sector 18', 'Noida', 'project_site', true)
RETURNING id;   -- copy this uuid

-- then
INSERT INTO projects (name, primary_site_address_id, ...) VALUES (... , <the_uuid_above>, ...);
*/