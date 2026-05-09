-- =========================================================
-- EXTENSIONS
-- =========================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";



-- =========================================================
-- BOQ PROJECTS
-- =========================================================

CREATE TABLE boq_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    name VARCHAR(255) NOT NULL,
    code VARCHAR(100),

    description TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- =========================================================
-- BOQ CATEGORIES
-- =========================================================

CREATE TABLE boq_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    project_id UUID NOT NULL
        REFERENCES boq_projects(id)
        ON DELETE CASCADE,

    name VARCHAR(255) NOT NULL,
    description TEXT,

    sort_order INT DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- =========================================================
-- BOQS
-- =========================================================

CREATE TABLE boqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    project_id UUID NOT NULL
        REFERENCES boq_projects(id)
        ON DELETE CASCADE,

    boq_category_id UUID NOT NULL
        REFERENCES boq_categories(id)
        ON DELETE CASCADE,

    title VARCHAR(255) NOT NULL,

    code VARCHAR(100),

    revision_no VARCHAR(50),

    status VARCHAR(50) DEFAULT 'draft',

    notes TEXT,

    subtotal DECIMAL(16,2) DEFAULT 0,
    tax_amount DECIMAL(16,2) DEFAULT 0,
    grand_total DECIMAL(16,2) DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- =========================================================
-- BOQ SECTIONS
-- =========================================================

CREATE TABLE boq_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    boq_id UUID NOT NULL
        REFERENCES boqs(id)
        ON DELETE CASCADE,

    title VARCHAR(255) NOT NULL,

    description TEXT,

    sort_order INT DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- =========================================================
-- UNITS MASTER
-- =========================================================

CREATE TABLE units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    name VARCHAR(50) NOT NULL,
    short_name VARCHAR(20) NOT NULL UNIQUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- =========================================================
-- BOQ ITEMS
-- =========================================================

CREATE TABLE boq_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    boq_id UUID NOT NULL
        REFERENCES boqs(id)
        ON DELETE CASCADE,

    section_id UUID NOT NULL
        REFERENCES boq_sections(id)
        ON DELETE CASCADE,

    unit_id UUID
        REFERENCES units(id)
        ON DELETE SET NULL,

    sno VARCHAR(50),

    item_name TEXT NOT NULL,

    description TEXT,

    qty DECIMAL(14,2) DEFAULT 0,

    rate DECIMAL(14,2) DEFAULT 0,

    amount DECIMAL(16,2)
        GENERATED ALWAYS AS (qty * rate) STORED,

    remarks TEXT,

    sort_order INT DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- =========================================================
-- INDEXES
-- =========================================================

CREATE INDEX idx_boq_categories_project_id
ON boq_categories(project_id);

CREATE INDEX idx_boqs_project_id
ON boqs(project_id);

CREATE INDEX idx_boqs_category_id
ON boqs(boq_category_id);

CREATE INDEX idx_boq_sections_boq_id
ON boq_sections(boq_id);

CREATE INDEX idx_boq_items_boq_id
ON boq_items(boq_id);

CREATE INDEX idx_boq_items_section_id
ON boq_items(section_id);

CREATE INDEX idx_boq_items_unit_id
ON boq_items(unit_id);



-- =========================================================
-- SAMPLE UNITS
-- =========================================================

INSERT INTO units (name, short_name)
VALUES
('Number', 'nos'),
('Square Feet', 'sqft'),
('Square Meter', 'sqm'),
('Running Feet', 'rft'),
('Meter', 'm'),
('Kilogram', 'kg'),
('Litre', 'ltr'),
('Bag', 'bag'),
('Piece', 'pcs'),
('Set', 'set');