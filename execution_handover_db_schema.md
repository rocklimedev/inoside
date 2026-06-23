# Execution & Handover — Database Schema

Scope: net-new tables for **Module 6 (Execution)** and **Module 10 (Handover)** only.
Modules 1–5, 7, 8, 9 are assumed already built and live — we reference their tables by FK,
we don't redefine them. Syntax is PostgreSQL (UUID PKs, `gen_random_uuid()`); swap for
`BIGSERIAL`/`AUTO_INCREMENT` if you're on MySQL/another engine.

---

## 1. Upstream tables this schema depends on

These already exist from earlier modules. Listed here only so the FKs below make sense —
do not create these, just confirm the column names line up with what you actually built.

| Table              | Comes from                                  | Columns this schema needs                |
| ------------------ | ------------------------------------------- | ---------------------------------------- |
| `projects`         | Module 1 (Brief)                            | `project_id` PK, `client_id`, `site_id`  |
| `clients`          | Module 1 (Brief)                            | `client_id` PK                           |
| `users`            | shared (architect/team/supervisor accounts) | `user_id` PK, `role`                     |
| `design_files`     | Module 5 (Design)                           | `design_id` PK, `project_id`, `file_url` |
| `quality_progress` | Module 9 (Quality Check & Progress)         | `project_id`, `completion_percentage`    |
| `payment_plans`    | Module 3c (Time & Cost)                     | `project_id`, `stage_number`, `status`   |

If any of those column names differ in your real implementation, only the FK target needs
adjusting — table shapes below don't change.

---

## 2. Execution module (6)

### 2.1 `execution_drawing_sets`

One row per logical drawing "slot" — a discipline + area/floor combination. This is what
the brief calls "drawing type" + "area/floor reference."

```sql
CREATE TABLE execution_drawing_sets (
    drawing_set_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id          UUID NOT NULL REFERENCES projects(project_id),
    drawing_category    VARCHAR(20) NOT NULL
                         CHECK (drawing_category IN ('Technical','Construction','Working')),
    drawing_discipline  VARCHAR(20) NOT NULL
                         CHECK (drawing_discipline IN ('Electrical','Plumbing','Structural','Working','Other')),
    area_floor_reference VARCHAR(100),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (project_id, drawing_discipline, area_floor_reference)
);

CREATE INDEX idx_execution_drawing_sets_project ON execution_drawing_sets(project_id);
```

### 2.2 `execution_drawing_versions`

Every actual file upload. `version_number` increments per set; `is_latest` flags the
current one. This is what gives you revision history for free.

```sql
CREATE TABLE execution_drawing_versions (
    version_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    drawing_set_id  UUID NOT NULL REFERENCES execution_drawing_sets(drawing_set_id) ON DELETE CASCADE,
    version_number  INT NOT NULL,
    file_url        TEXT NOT NULL,
    description     TEXT,
    uploaded_by     UUID NOT NULL REFERENCES users(user_id),
    uploaded_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    is_latest       BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE (drawing_set_id, version_number)
);

-- enforce exactly one "current" version per set
CREATE UNIQUE INDEX uq_execution_one_latest_version
    ON execution_drawing_versions (drawing_set_id)
    WHERE is_latest = TRUE;

CREATE INDEX idx_execution_versions_set ON execution_drawing_versions(drawing_set_id);
```

> App-layer note: when a new version is uploaded, flip the previous `is_latest` row to
> `FALSE` in the same transaction before inserting the new one (the partial unique index
> above will reject a second `TRUE` row otherwise — which is the point, it catches bugs).

### 2.3 `execution_drawing_approvals`

Client approve/reject/remarks against a specific version. Kept separate from versions
so approval history survives even after a newer version supersedes the reviewed one.

```sql
CREATE TABLE execution_drawing_approvals (
    approval_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_id        UUID NOT NULL REFERENCES execution_drawing_versions(version_id) ON DELETE CASCADE,
    reviewed_by       UUID NOT NULL REFERENCES clients(client_id),
    approval_status   VARCHAR(20) NOT NULL
                       CHECK (approval_status IN ('Approved','Revision_Requested','Rejected')),
    comments          TEXT,
    revision_request  TEXT,
    reviewed_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_execution_approvals_version ON execution_drawing_approvals(version_id);
```

### 2.4 Output views

The brief's two Execution outputs are queries, not stored tables — no duplication, no
risk of the view going stale relative to the source rows.

```sql
-- OUTPUT 1: Approved Execution Drawings
CREATE VIEW execution_approved_drawings AS
SELECT
    ds.drawing_set_id, ds.project_id, ds.drawing_category, ds.drawing_discipline,
    ds.area_floor_reference,
    v.version_id, v.version_number, v.file_url,
    a.reviewed_at AS approval_date
FROM execution_drawing_sets ds
JOIN execution_drawing_versions v
    ON v.drawing_set_id = ds.drawing_set_id AND v.is_latest = TRUE
JOIN execution_drawing_approvals a
    ON a.version_id = v.version_id AND a.approval_status = 'Approved';

-- OUTPUT 2: Approval & Revision Log
CREATE VIEW execution_approval_revision_log AS
SELECT
    ds.drawing_set_id,
    ds.project_id,
    COUNT(DISTINCT v.version_id) AS revision_count,
    (
        SELECT a2.approval_status
        FROM execution_drawing_approvals a2
        JOIN execution_drawing_versions v2 ON v2.version_id = a2.version_id
        WHERE v2.drawing_set_id = ds.drawing_set_id
        ORDER BY a2.reviewed_at DESC
        LIMIT 1
    ) AS final_approval_status
FROM execution_drawing_sets ds
JOIN execution_drawing_versions v ON v.drawing_set_id = ds.drawing_set_id
GROUP BY ds.drawing_set_id, ds.project_id;
```

---

## 3. Handover module (10)

### 3.1 `handover_activation_checks`

Snapshot of the three gating conditions from the brief — execution complete, quality
cleared, payments settled. Re-insert a row every time you re-evaluate (e.g. on every
`quality_progress` update); this gives you an audit trail of exactly when each condition
flipped, instead of one mutable row that overwrites its own history.

```sql
CREATE TABLE handover_activation_checks (
    check_id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id             UUID NOT NULL REFERENCES projects(project_id),
    execution_complete     BOOLEAN NOT NULL DEFAULT FALSE,
    quality_check_cleared  BOOLEAN NOT NULL DEFAULT FALSE,
    payments_settled       BOOLEAN NOT NULL DEFAULT FALSE,
    all_conditions_met     BOOLEAN GENERATED ALWAYS AS
                           (execution_complete AND quality_check_cleared AND payments_settled) STORED,
    checked_at             TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_handover_checks_project ON handover_activation_checks(project_id, checked_at DESC);
```

### 3.2 `handover_documents`

The main Handover & Sign-Off Agreement. One per project.

```sql
CREATE TABLE handover_documents (
    handover_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id              UUID NOT NULL UNIQUE REFERENCES projects(project_id),
    scope_summary           TEXT,         -- snapshot of Module 3b Scope of Work at generation time
    planned_start           DATE,
    planned_end             DATE,
    actual_start            DATE,
    actual_end              DATE,
    completion_confirmed    BOOLEAN NOT NULL DEFAULT FALSE,
    warranty_notes          TEXT,
    client_signoff_by       UUID REFERENCES clients(client_id),
    client_signoff_date     DATE,
    firm_signoff_by         UUID REFERENCES users(user_id),
    firm_signoff_date       DATE,
    document_url            TEXT,
    status                  VARCHAR(20) NOT NULL DEFAULT 'Draft'
                            CHECK (status IN ('Draft','Generated','Signed','Archived')),
    generated_at             TIMESTAMPTZ
);
```

### 3.3 `handover_outstanding_items`

```sql
CREATE TABLE handover_outstanding_items (
    item_id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    handover_id               UUID NOT NULL REFERENCES handover_documents(handover_id) ON DELETE CASCADE,
    description               TEXT NOT NULL,
    status                    VARCHAR(20) NOT NULL DEFAULT 'Open' CHECK (status IN ('Open','Resolved')),
    target_resolution_date    DATE,
    resolved_date              DATE
);

CREATE INDEX idx_handover_items_handover ON handover_outstanding_items(handover_id);
```

### 3.4 `handover_drawing_package`

The "Construction Drawings (soft copy set)" output — bundles approved Design files
(Module 5) and approved Execution drawings (above) into one handover package.

```sql
CREATE TABLE handover_drawing_package (
    package_item_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    handover_id           UUID NOT NULL REFERENCES handover_documents(handover_id) ON DELETE CASCADE,
    source_type           VARCHAR(20) NOT NULL CHECK (source_type IN ('Design','Execution')),
    design_id              UUID REFERENCES design_files(design_id),
    execution_version_id    UUID REFERENCES execution_drawing_versions(version_id),
    file_url                TEXT NOT NULL,
    drawing_label            VARCHAR(150),
    included_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (
        (source_type = 'Design'    AND design_id IS NOT NULL AND execution_version_id IS NULL) OR
        (source_type = 'Execution' AND execution_version_id IS NOT NULL AND design_id IS NULL)
    )
);

CREATE INDEX idx_handover_package_handover ON handover_drawing_package(handover_id);
```

---

## 4. Auto-generation trigger logic

The brief says: _"Document will be autogenerated when the work progress will be 100%
marked and finished."_ Implement as an app-layer job (or DB trigger on `quality_progress`
inserts) that runs this sequence whenever `completion_percentage` for a project hits 100:

1. Re-evaluate the three conditions:
   - `execution_complete` ← `quality_progress.completion_percentage = 100` for that project
   - `quality_check_cleared` ← latest stage-wise quality checklist has no open
     "Corrective action required" flags
   - `payments_settled` ← no `payment_plans` row for that project with `status != 'Paid'`
2. Insert a row into `handover_activation_checks` with the result.
3. If `all_conditions_met = TRUE` and no `handover_documents` row exists yet for the
   project, insert one with `status = 'Draft'` — pulling `scope_summary` from the
   Module 3b Scope of Work record and `planned_start`/`planned_end` from the project
   timeline.
4. Firm reviews the draft, fills `outstanding_items` if any remain, then flips
   `status` to `'Generated'` once the PDF is rendered, and to `'Signed'` once both
   signoff columns are populated.

---

## 5. Why a few things are shaped this way

- **Sets vs. versions, not one flat table.** A single `drawings` table with a
  `version` integer column works until you need approval history per version — then
  you're stuffing version-specific data into a row that gets overwritten. Splitting
  them means `execution_drawing_approvals` always points at the exact version it
  reviewed, even after three more revisions land.
- **Views instead of output tables.** The brief lists "outputs" like _Approved
  Execution Drawings_ — these are reporting cuts of data you already have, not new
  facts. Materializing them as tables would mean keeping two copies in sync. If you
  later need the speed of a materialized view (large projects, slow joins), convert
  `execution_approved_drawings` to `CREATE MATERIALIZED VIEW` with a refresh trigger —
  the query itself doesn't change.
- **`handover_activation_checks` as an append-only log, not a single mutable row.**
  Handover delays are common enough in construction that you'll want to know exactly
  when each of the three conditions individually became true, not just the final
  state.
