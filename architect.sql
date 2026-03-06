users
id                  SERIAL PK
full_name           VARCHAR(255)
email               VARCHAR(255) UNIQUE
phone               VARCHAR(20)
role                ENUM('client','architect','supervisor','admin','vendor','team_member')
preferred_comm      ENUM('Call','WhatsApp','Email')
password_hash       TEXT
is_active           BOOL DEFAULT true
created_at          TIMESTAMP DEFAULT now()

projects
id                  SERIAL PK
client_user_id      INT FK users
name                VARCHAR(255)
project_type        ENUM('New Construction','Renovation','Interior Fit-out','Single Floor','Multiple Floors','Entire Building')
purpose             ENUM('Residential','Commercial','Mixed')
num_floors          INT
approx_area         NUMERIC(12,2)          -- sqft
budget_range        VARCHAR(50)            -- e.g. "10-20L", "20-50L"
timeline_expectation ENUM(...)
design_preference   ENUM('Modern','Minimal','Luxury','Traditional','Not Sure')
is_first_project    BOOL
decision_readiness  ENUM('exploring','ready')
worked_with_before  BOOL
end_to_end          BOOL
status              VARCHAR(30) DEFAULT 'brief'   -- updated by triggers
current_stage       VARCHAR(50)
overall_completion  NUMERIC(5,2) DEFAULT 0
created_at          TIMESTAMP
updated_at          TIMESTAMP


sites
id                  SERIAL PK
project_id          INT UNIQUE FK projects
address             TEXT
city                VARCHAR(100)
ownership_status    ENUM('Owned','Rented','Under Process')
access_available    BOOL
existing_structure  BOOL


attachments
id                  SERIAL PK
entity_type         ENUM('reki_photo','design','execution_drawing','daily_photo','moodboard','pitch_ref','handover','boq','etc')
entity_id           INT
file_path           TEXT NOT NULL
file_type           ENUM('image','pdf','zip','doc')
uploaded_by         INT FK users
uploaded_at         TIMESTAMP DEFAULT now()

project_pitch
project_id          PK FK
preferred_style     VARCHAR
color_tone          ENUM('Light','Dark','Mixed','Not Sure')
luxury_level        ENUM('Low','Medium','High')
func_vs_aesth       NUMERIC(3,1)           -- slider
budget_flexible     BOOL
priority_areas      JSONB                   -- ["kitchen","bathroom",...]
likes_dislikes      TEXT
non_negotiables     TEXT
special_req         TEXT

site_reki_report
id                  SERIAL PK
project_id          INT UNIQUE FK
visit_date          DATE
supervisor_id       INT FK users
client_present      BOOL
-- ALL yes/no + text fields from pages 6-7 as columnsroad_access, unloading_space, plot_type, construction_type, cracks, dampness, termite, electrical_wiring, demolition_required, load_bearing_changes, power_supply, etc.)
remarks             TEXT
major_constraints   TEXT
risk_factors        TEXT
suggestions         TEXT
client_instructions TEXT
completed_at        TIMESTAMP

project_scopesheader)
id                  SERIAL PK
project_id          FK UNIQUE
service_type        VARCHAR
requirements_summary TEXT
site_summary        TEXT   -- auto-filled from reki

scope_itemsdetailed list)
id                  SERIAL PK
scope_id            FK
category            ENUM('Civil Works','MEP Works','Interior Works','Finishes')
sub_item            VARCHAR   -- "Demolition", "Masonry", ...
description         TEXT


 boq_versions
id                  SERIAL PK
project_id          FK
version             INT DEFAULT 1
prepared_by         INT FK users
prepared_date       DATE
grand_total         NUMERIC(15,2)
notes               TEXT

boq_items
id                  SERIAL PK
boq_id              FK
category            ENUM(...)
item_name           TEXT
quantity            NUMERIC(12,2)
unit                VARCHAR(20)
rate                NUMERIC(10,2)
amount              NUMERIC(12,2) GENERATED ALWAYS ASquantity*rate)
specifications      JSONB
remarks             TEXT

design_uploads
id                  SERIAL PK
project_id          FK
file_path           TEXT          -- via attachments or direct
design_type         VARCHAR
version             INT
description         TEXT
uploaded_by         INT FK

 design_approvalslog
id                  SERIAL PK
design_id           FK
client_user_id      INT FK
approved            BOOL
remarks             TEXT
reviewed_at         TIMESTAMP

-- 1. consultation_proposalsfor Consultation projects)
consultation_proposals 
    id                  SERIAL PRIMARY KEY,
    project_id          INTEGER UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
    scope_summary       TEXT,
    time_involvement_estimate INTERVAL,           -- e.g. "3 months"
    consultation_fee    NUMERIC(12,2),
    duration_months     INTEGER,
    deliverables        JSONB,                     -- array of strings
    terms_limitations   TEXT,
    created_at          TIMESTAMP DEFAULT now(),
    prepared_by         INTEGER REFERENCES users(id)


-- 2. turnkey_estimatesfor Turnkey projects)
 turnkey_estimates 
    id                  SERIAL PRIMARY KEY,
    project_id          INTEGER UNIQUE REFERENCES projects(id),
    material_labour_estimate JSONB,               -- { "cement": {"qty":5000,"unit":"bags","rate":350}, ... }
    tentative_cost_estimate NUMERIC(15,2),
    payment_plan_stages JSONB,                     -- [{stage:"Foundation", percent:20, amount:..., milestone:"..."}]
    notes               TEXT,
    created_at          TIMESTAMP DEFAULT now()


-- 3. builder_model_documentsfor Constructional Proposal / Builder Model)
 builder_model_documents 
    id                  SERIAL PRIMARY KEY,
    project_id          INTEGER UNIQUE REFERENCES projects(id),
    annexure_specs      JSONB,                     -- specifications, materials, finishes, inclusions_exclusions
    buyer_payment_plan  JSONB,                     -- [{booking:10, construction_linked:[...], possession:...}]
    contract_template   TEXT,                      -- or path to signed PDF
    buyer_name          VARCHAR(255),
    signed_by_client    BOOLEAN DEFAULT false,
    signed_by_builder   BOOLEAN DEFAULT false,
    created_at          TIMESTAMP DEFAULT now()



 execution_drawings
    id                  SERIAL PRIMARY KEY,
    project_id          INTEGER REFERENCES projects(id),
    drawing_type        ENUM('Electrical','Plumbing','Structural','Construction','Working','All') NOT NULL,
    version             INTEGER DEFAULT 1,
    area_floor_ref      VARCHAR(100),              -- e.g. "Ground Floor", "Unit 301"
    file_path           TEXT NOT NULL,             -- or reference to attachments table
    uploaded_by         INTEGER REFERENCES users(id),
    uploaded_at         TIMESTAMP DEFAULT now(),
    description         TEXT


 execution_approvals
    id                  SERIAL PRIMARY KEY,
    execution_drawing_id INTEGER REFERENCES execution_drawings(id),
    client_user_id      INTEGER REFERENCES users(id),
    approved            BOOLEAN DEFAULT false,
    remarks             TEXT,
    revision_requested  BOOLEAN DEFAULT false,
    reviewed_at         TIMESTAMP DEFAULT now()


 vendors
    id                  SERIAL PRIMARY KEY,
    name                VARCHAR(255) NOT NULL,
    trade_type          VARCHAR(100),              -- Civil, Electrical, Plumbing, Carpentry...
    contact_person      VARCHAR(100),
    phone               VARCHAR(20),
    email               VARCHAR(255),
    address             TEXT,
    rating              NUMERIC(3,1),
    past_performance    JSONB,                     -- last 3 projects summary
    is_active           BOOLEAN DEFAULT true


 vendor_quotations
    id                  SERIAL PRIMARY KEY,
    project_id          INTEGER REFERENCES projects(id),
    vendor_id           INTEGER REFERENCES vendors(id),
    trade_category      VARCHAR(100),
    raw_quote_data      JSONB,                     -- full quotation PDF data or scanned values
    total_amount        NUMERIC(12,2),
    submitted_at        TIMESTAMP DEFAULT now()


 selected_vendors
    id                  SERIAL PRIMARY KEY,
    project_id          INTEGER REFERENCES projects(id),
    vendor_id           INTEGER REFERENCES vendors(id),
    trade_category      VARCHAR(100),
    selected            BOOLEAN DEFAULT true,
    selection_reason    TEXT,                      -- internal note
    final_approved_estimate NUMERIC(12,2),
    selected_at         TIMESTAMP DEFAULT now()


-- Final visible to client
 final_vendor_estimates
    id                  SERIAL PRIMARY KEY,
    project_id          INTEGER REFERENCES projects(id),
    selected_vendor_id  INTEGER REFERENCES selected_vendors(id),
    scope_summary       TEXT,
    approved_estimate   NUMERIC(12,2),
    work_category       VARCHAR(100),
    remarks             TEXT,
    document_path       TEXT,                      -- consolidated PDF client sees
    generated_at        TIMESTAMP DEFAULT now()


 material_requests
    id                  SERIAL PRIMARY KEY,
    project_id          INTEGER REFERENCES projects(id),
    material_name       VARCHAR(255) NOT NULL,
    category            VARCHAR(100),
    quantity_required   NUMERIC(12,2),
    unit                VARCHAR(20),
    required_by_date    DATE,
    requested_by        INTEGER REFERENCES users(id),   -- supervisor
    vendor_id           INTEGER REFERENCES vendors(id), -- optional
    status              ENUM('Pending','Approved','Dispatched','Delivered','Cancelled') DEFAULT 'Pending',
    created_at          TIMESTAMP DEFAULT now()


 warehouse_stocks
    id                  SERIAL PRIMARY KEY,
    warehouse_name      VARCHAR(100),
    location            TEXT,
    material_name       VARCHAR(255),
    available_stock     NUMERIC(12,2),
    reserved_stock      NUMERIC(12,2) DEFAULT 0


 dispatches
    id                  SERIAL PRIMARY KEY,
    material_request_id INTEGER REFERENCES material_requests(id),
    dispatch_source     ENUM('Vendor','Warehouse'),
    dispatch_date       DATE,
    dispatch_quantity   NUMERIC(12,2),
    vehicle_challan     VARCHAR(100),
    dispatched_by       INTEGER REFERENCES users(id)


 deliveries
    id                  SERIAL PRIMARY KEY,
    dispatch_id         INTEGER REFERENCES dispatches(id),
    received_quantity   NUMERIC(12,2),
    damage_shortage     BOOLEAN DEFAULT false,
    damage_details      TEXT,
    supervisor_confirmed BOOLEAN DEFAULT false,
    photo_attachment_id INTEGER REFERENCES attachments(id),
    delivered_at        TIMESTAMP DEFAULT now(),
    remarks             TEXT


 daily_progress_reports
    id                  SERIAL PRIMARY KEY,
    project_id          INTEGER REFERENCES projects(id),
    report_date         DATE NOT NULL,
    current_stage       VARCHAR(100),
    work_executed       TEXT,
    manpower_count      INTEGER,
    materials_used      JSONB,
    issues_faced        TEXT,
    completion_percent_today NUMERIC(5,2),
    created_by          INTEGER REFERENCES users(id)


 stage_quality_checks
    id                  SERIAL PRIMARY KEY,
    project_id          INTEGER REFERENCES projects(id),
    stage_name          VARCHAR(100),              -- Civil, MEP, Finishing...
    quality_met         BOOLEAN,
    deviations          BOOLEAN,
    corrective_action   TEXT,
    supervisor_remarks  TEXT,
    checked_by          INTEGER REFERENCES users(id),
    checked_at          TIMESTAMP DEFAULT now()


 project_issues
    id                  SERIAL PRIMARY KEY,
    project_id          INTEGER REFERENCES projects(id),
    issue_description   TEXT NOT NULL,
    responsible_party   VARCHAR(100),
    target_resolution_date DATE,
    status              ENUM('Open','In Progress','Closed') DEFAULT 'Open',
    before_photo_id     INTEGER REFERENCES attachments(id),
    after_photo_id      INTEGER REFERENCES attachments(id),
    closed_at           TIMESTAMP


-- Dashboard viewcreated as MATERIALIZED VIEW or via trigger)
 project_progress_dashboard
    project_id          INTEGER PRIMARY KEY REFERENCES projects(id),
    overall_completion  NUMERIC(5,2) DEFAULT 0,
    current_stage       VARCHAR(100),
    next_stage          VARCHAR(100),
    delay_flag          BOOLEAN DEFAULT false,
    last_updated        TIMESTAMP DEFAULT now()


 handovers
    id                  SERIAL PRIMARY KEY,
    project_id          INTEGER UNIQUE REFERENCES projects(id),
    handover_date       DATE,
    planned_vs_actual_timeline JSONB,
    scope_summary       TEXT,
    completion_confirmation BOOLEAN DEFAULT false,
    outstanding_items   TEXT,
    warranty_months     INTEGER DEFAULT 12,
    maintenance_notes   TEXT,
    client_signed_at    TIMESTAMP,
    firm_signed_at      TIMESTAMP,
    handover_pdf_path   TEXT,
    drawings_zip_path   TEXT,
    autogenerated_at    TIMESTAMP DEFAULT now()   -- triggered when progress = 100%


