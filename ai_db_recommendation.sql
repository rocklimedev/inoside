-- ============================================================
-- Construction Management Platform — Database Schema
-- Architect: Rewritten for correctness, normalization, and scale
-- Engine: MySQL 5.7+ / Percona Server
-- Charset: utf8mb4_unicode_ci throughout
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';

-- ============================================================
-- SECTION 1: FOUNDATION — Auth, Roles, Users
-- ============================================================

CREATE TABLE IF NOT EXISTS `roles` (
  `id`           CHAR(36)      NOT NULL,
  `name`         VARCHAR(50)   NOT NULL COMMENT 'Machine key: admin, project_manager, site_supervisor, designer, client',
  `display_name` VARCHAR(100)  NOT NULL,
  `description`  TEXT,
  `is_system`    TINYINT(1)    NOT NULL DEFAULT 0 COMMENT 'System roles cannot be deleted',
  `created_at`   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_roles_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `permissions` (
  `id`          CHAR(36)     NOT NULL,
  `name`        VARCHAR(100) NOT NULL COMMENT 'Format: module:action — e.g. boq:approve',
  `module`      VARCHAR(60)  NOT NULL,
  `action`      VARCHAR(60)  NOT NULL,
  `description` TEXT,
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_permissions_name` (`name`),
  KEY `idx_permissions_module` (`module`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `role_permissions` (
  `role_id`       CHAR(36) NOT NULL,
  `permission_id` CHAR(36) NOT NULL,
  `granted_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `granted_by`    CHAR(36) DEFAULT NULL,
  PRIMARY KEY (`role_id`, `permission_id`),
  KEY `idx_rp_permission` (`permission_id`),
  CONSTRAINT `fk_rp_role`       FOREIGN KEY (`role_id`)       REFERENCES `roles`       (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rp_permission` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `users` (
  `id`               CHAR(36)     NOT NULL,
  `role_id`          CHAR(36)     NOT NULL,
  `name`             VARCHAR(255) NOT NULL,
  `email`            VARCHAR(255) NOT NULL,
  `phone`            VARCHAR(20)  DEFAULT NULL,
  `whatsapp`         VARCHAR(20)  DEFAULT NULL,
  `password_hash`    VARCHAR(255) NOT NULL,
  `avatar_url`       VARCHAR(500) DEFAULT NULL,
  `avatar_thumbnail` VARCHAR(500) DEFAULT NULL,
  `is_active`        TINYINT(1)   NOT NULL DEFAULT 1,
  `is_email_verified` TINYINT(1)  NOT NULL DEFAULT 0,
  `last_login`       DATETIME     DEFAULT NULL,
  `timezone`         VARCHAR(60)  NOT NULL DEFAULT 'Asia/Kolkata',
  `created_at`       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_users_email` (`email`),
  KEY `idx_users_role` (`role_id`),
  KEY `idx_users_active` (`is_active`),
  CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Password reset and email verification tokens
CREATE TABLE IF NOT EXISTS `user_tokens` (
  `id`         CHAR(36)                                    NOT NULL,
  `user_id`    CHAR(36)                                    NOT NULL,
  `token_hash` VARCHAR(255)                                NOT NULL,
  `type`       ENUM('password_reset','email_verify','magic_link') NOT NULL,
  `expires_at` DATETIME                                    NOT NULL,
  `used_at`    DATETIME                                    DEFAULT NULL,
  `created_at` DATETIME                                    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_ut_user` (`user_id`),
  KEY `idx_ut_token` (`token_hash`),
  KEY `idx_ut_expires` (`expires_at`),
  CONSTRAINT `fk_ut_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SECTION 2: CLIENTS & SITES
-- ============================================================

CREATE TABLE IF NOT EXISTS `clients` (
  `id`                       CHAR(36)                          NOT NULL,
  `name`                     VARCHAR(255)                      NOT NULL,
  `email`                    VARCHAR(255)                      DEFAULT NULL,
  `phone`                    VARCHAR(20)                       DEFAULT NULL,
  `whatsapp`                 VARCHAR(20)                       DEFAULT NULL,
  `preferred_communication`  ENUM('call','whatsapp','email')   DEFAULT 'whatsapp',
  `is_owner`                 TINYINT(1)                        NOT NULL DEFAULT 1 COMMENT '0 = representative acting on behalf',
  `company_name`             VARCHAR(255)                      DEFAULT NULL,
  `gst_number`               VARCHAR(20)                       DEFAULT NULL,
  `pan_number`               VARCHAR(20)                       DEFAULT NULL,
  `notes`                    TEXT,
  `source`                   VARCHAR(100)                      DEFAULT NULL COMMENT 'How they found us: referral, social, walk-in…',
  `referred_by_client_id`    CHAR(36)                          DEFAULT NULL,
  `created_by`               CHAR(36)                          DEFAULT NULL,
  `created_at`               DATETIME                          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`               DATETIME                          NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_clients_email` (`email`),
  KEY `idx_clients_phone` (`phone`),
  KEY `idx_clients_referred` (`referred_by_client_id`),
  CONSTRAINT `fk_clients_referred` FOREIGN KEY (`referred_by_client_id`) REFERENCES `clients` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Client's representatives (normalize away from comment field in old schema)
CREATE TABLE IF NOT EXISTS `client_representatives` (
  `id`          CHAR(36)     NOT NULL,
  `client_id`   CHAR(36)     NOT NULL,
  `name`        VARCHAR(255) NOT NULL,
  `relation`    VARCHAR(100) DEFAULT NULL COMMENT 'son, wife, broker, lawyer…',
  `phone`       VARCHAR(20)  DEFAULT NULL,
  `email`       VARCHAR(255) DEFAULT NULL,
  `is_primary`  TINYINT(1)   NOT NULL DEFAULT 0,
  `notes`       TEXT,
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_cr_client` (`client_id`),
  CONSTRAINT `fk_cr_client` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `addresses` (
  `id`              CHAR(36)       NOT NULL,
  `line1`           VARCHAR(255)   NOT NULL,
  `line2`           VARCHAR(255)   DEFAULT NULL,
  `landmark`        VARCHAR(255)   DEFAULT NULL,
  `city`            VARCHAR(100)   NOT NULL,
  `district`        VARCHAR(100)   DEFAULT NULL,
  `state`           VARCHAR(100)   DEFAULT NULL,
  `country`         VARCHAR(100)   NOT NULL DEFAULT 'India',
  `pincode`         VARCHAR(20)    DEFAULT NULL,
  `latitude`        DECIMAL(10,8)  DEFAULT NULL,
  `longitude`       DECIMAL(11,8)  DEFAULT NULL,
  `google_map_link` TEXT,
  `created_at`      DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_addresses_city` (`city`),
  KEY `idx_addresses_pincode` (`pincode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `sites` (
  `id`                 CHAR(36)                                  NOT NULL,
  `client_id`          CHAR(36)                                  NOT NULL,
  `address_id`         CHAR(36)                                  NOT NULL,
  `name`               VARCHAR(255)                              DEFAULT NULL COMMENT 'Friendly name: "Banjara Hills Plot", "MG Road Office"',
  `ownership_status`   ENUM('owned','rented','under_process')    DEFAULT NULL,
  `plot_area_sqft`     DECIMAL(12,2)                             DEFAULT NULL,
  `access_available`   TINYINT(1)                                NOT NULL DEFAULT 1,
  `existing_structure` TINYINT(1)                                NOT NULL DEFAULT 0,
  `notes`              TEXT,
  `created_at`         DATETIME                                  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`         DATETIME                                  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_sites_client`  (`client_id`),
  KEY `idx_sites_address` (`address_id`),
  CONSTRAINT `fk_sites_client`  FOREIGN KEY (`client_id`)  REFERENCES `clients`   (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sites_address` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SECTION 3: PROJECTS & TEAM
-- ============================================================

CREATE TABLE IF NOT EXISTS `projects` (
  `id`                    CHAR(36)                                                              NOT NULL,
  `client_id`             CHAR(36)                                                              NOT NULL,
  `site_id`               CHAR(36)                                                              DEFAULT NULL,
  `name`                  VARCHAR(255)                                                          NOT NULL,
  `project_code`          VARCHAR(50)                                                           DEFAULT NULL COMMENT 'Human-readable code: PRJ-2024-001',
  `description`           TEXT,
  `project_type`          ENUM('new_construction','renovation','interior_fitout')               NOT NULL,
  `service_type`          ENUM('construction','interior','renovation','turnkey')                 DEFAULT NULL,
  `purpose`               ENUM('residential','commercial','mixed')                               DEFAULT NULL,
  `number_of_floors`      INT                                                                   DEFAULT NULL,
  `approximate_area_sqft` DECIMAL(12,2)                                                         DEFAULT NULL,
  `budget_range`          VARCHAR(100)                                                          DEFAULT NULL,
  `timeline_expectation`  ENUM('immediate','flexible','fixed_date')                             DEFAULT NULL,
  `design_preference`     VARCHAR(100)                                                          DEFAULT NULL,
  -- Stage-based lifecycle. Progresses forward; tracked in project_stage_history
  `stage`                 ENUM(
                            'brief',
                            'pitch',
                            'reki',
                            'scope',
                            'boq',
                            'design',
                            'vendor_selection',
                            'execution',
                            'quality',
                            'handover',
                            'completed',
                            'on_hold',
                            'cancelled'
                          )                                                                     NOT NULL DEFAULT 'brief',
  `progress_percentage`   DECIMAL(5,2)                                                          NOT NULL DEFAULT 0.00,
  `token_received`        TINYINT(1)                                                            NOT NULL DEFAULT 0,
  `is_archived`           TINYINT(1)                                                            NOT NULL DEFAULT 0,
  `estimated_start_date`  DATE                                                                  DEFAULT NULL,
  `estimated_end_date`    DATE                                                                  DEFAULT NULL,
  `actual_start_date`     DATE                                                                  DEFAULT NULL,
  `actual_end_date`       DATE                                                                  DEFAULT NULL,
  `estimated_budget`      DECIMAL(15,2)                                                         DEFAULT NULL,
  `final_budget`          DECIMAL(15,2)                                                         DEFAULT NULL,
  `created_by`            CHAR(36)                                                              DEFAULT NULL,
  `created_at`            DATETIME                                                              NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`            DATETIME                                                              NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_project_code` (`project_code`),
  KEY `idx_projects_client`   (`client_id`),
  KEY `idx_projects_site`     (`site_id`),
  KEY `idx_projects_stage`    (`stage`),
  KEY `idx_projects_archived` (`is_archived`),
  KEY `idx_projects_created`  (`created_at`),
  CONSTRAINT `fk_projects_client`     FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_projects_site`       FOREIGN KEY (`site_id`)   REFERENCES `sites`   (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_projects_created_by` FOREIGN KEY (`created_by`) REFERENCES `users`  (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Project stage history (replaces project_stage_history with proper audit)
CREATE TABLE IF NOT EXISTS `project_stage_history` (
  `id`          CHAR(36)     NOT NULL,
  `project_id`  CHAR(36)     NOT NULL,
  `from_stage`  VARCHAR(50)  DEFAULT NULL,
  `to_stage`    VARCHAR(50)  NOT NULL,
  `changed_by`  CHAR(36)     DEFAULT NULL,
  `notes`       TEXT,
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_psh_project` (`project_id`),
  KEY `idx_psh_created` (`created_at`),
  CONSTRAINT `fk_psh_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Team assignments per project (replaces single assigned_to on projects)
CREATE TABLE IF NOT EXISTS `project_team_members` (
  `id`          CHAR(36)                                             NOT NULL,
  `project_id`  CHAR(36)                                             NOT NULL,
  `user_id`     CHAR(36)                                             NOT NULL,
  `role`        ENUM('lead','co_lead','supervisor','designer','coordinator','support') NOT NULL DEFAULT 'support',
  `assigned_by` CHAR(36)                                             DEFAULT NULL,
  `assigned_at` DATETIME                                             NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `removed_at`  DATETIME                                             DEFAULT NULL,
  `notes`       TEXT,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_ptm_active` (`project_id`, `user_id`, `removed_at`),
  KEY `idx_ptm_user` (`user_id`),
  CONSTRAINT `fk_ptm_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ptm_user`    FOREIGN KEY (`user_id`)    REFERENCES `users`    (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SECTION 4: CDN / FILE STORAGE
-- ============================================================

-- Single authoritative files table; all modules reference this
CREATE TABLE IF NOT EXISTS `files` (
  `id`            CHAR(36)     NOT NULL,
  `original_name` VARCHAR(500) NOT NULL,
  `stored_name`   VARCHAR(500) NOT NULL,
  `url`           VARCHAR(1000) NOT NULL,
  `cdn_provider`  VARCHAR(50)  NOT NULL DEFAULT 'local' COMMENT 'local, s3, cloudflare',
  `size_bytes`    BIGINT       NOT NULL DEFAULT 0,
  `mime_type`     VARCHAR(100) NOT NULL,
  `checksum`      VARCHAR(64)  DEFAULT NULL COMMENT 'SHA-256 for dedup',
  `uploaded_by`   CHAR(36)     DEFAULT NULL,
  `created_at`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_files_mime`     (`mime_type`),
  KEY `idx_files_uploader` (`uploaded_by`),
  CONSTRAINT `fk_files_uploader` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Polymorphic file-to-entity association
CREATE TABLE IF NOT EXISTS `entity_files` (
  `id`            CHAR(36)     NOT NULL,
  `file_id`       CHAR(36)     NOT NULL,
  `entity_type`   VARCHAR(60)  NOT NULL COMMENT 'project, drawing, boq, vendor, reki_report…',
  `entity_id`     CHAR(36)     NOT NULL,
  `role`          VARCHAR(100) DEFAULT NULL COMMENT 'context within that entity: cover_photo, approval_doc, progress_photo',
  `sort_order`    INT          NOT NULL DEFAULT 0,
  `uploaded_by`   CHAR(36)     DEFAULT NULL,
  `created_at`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_ef_entity` (`entity_type`, `entity_id`),
  KEY `idx_ef_file`   (`file_id`),
  CONSTRAINT `fk_ef_file`     FOREIGN KEY (`file_id`)     REFERENCES `files` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ef_uploader` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SECTION 5: PROJECT LIFECYCLE MODULES
-- ============================================================

-- 5.1 Brief
CREATE TABLE IF NOT EXISTS `project_briefs` (
  `id`                      CHAR(36)                              NOT NULL,
  `project_id`              CHAR(36)                              NOT NULL,
  `rooms_spaces_required`   JSON                                  DEFAULT NULL,
  `parking_required`        TINYINT(1)                            DEFAULT NULL,
  `first_construction`      TINYINT(1)                            DEFAULT NULL,
  `decision_readiness`      ENUM('ready','evaluating','undecided') DEFAULT NULL,
  `end_to_end_services`     TINYINT(1)                            DEFAULT NULL,
  `client_profile_output`   JSON                                  DEFAULT NULL COMMENT 'Computed/derived output for display',
  `project_profile_output`  JSON                                  DEFAULT NULL,
  `status`                  ENUM('pending','submitted','approved','change_requested') NOT NULL DEFAULT 'pending',
  `approved_by`             CHAR(36)                              DEFAULT NULL,
  `approved_at`             DATETIME                              DEFAULT NULL,
  `change_requested_by`     CHAR(36)                              DEFAULT NULL,
  `change_requested_at`     DATETIME                              DEFAULT NULL,
  `change_notes`            TEXT,
  `created_at`              DATETIME                              NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`              DATETIME                              NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_pb_project` (`project_id`),
  KEY `idx_pb_status` (`status`),
  CONSTRAINT `fk_pb_project`       FOREIGN KEY (`project_id`)          REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pb_approved_by`   FOREIGN KEY (`approved_by`)         REFERENCES `users`    (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_pb_change_req_by` FOREIGN KEY (`change_requested_by`) REFERENCES `users`    (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5.2 Pitch / Design Concept
CREATE TABLE IF NOT EXISTS `project_pitches` (
  `id`                     CHAR(36)                                NOT NULL,
  `project_id`             CHAR(36)                                NOT NULL,
  `created_by`             CHAR(36)                                DEFAULT NULL,
  `preferred_design_style` VARCHAR(100)                            DEFAULT NULL,
  `color_tone`             ENUM('light','dark','mixed','not_sure')  DEFAULT NULL,
  `luxury_level`           ENUM('low','medium','high')              DEFAULT NULL,
  `functional_vs_aesthetic` TEXT,
  `budget_flexibility`     TINYINT(1)                              DEFAULT NULL,
  `priority_areas`         JSON                                    DEFAULT NULL,
  `likes_dislikes`         TEXT,
  `non_negotiables`        TEXT,
  `special_requirements`   TEXT,
  `status`                 ENUM('draft','pending_review','approved','rejected') NOT NULL DEFAULT 'draft',
  `reviewed_by`            CHAR(36)                                DEFAULT NULL,
  `reviewed_at`            DATETIME                                DEFAULT NULL,
  `review_notes`           TEXT,
  `created_at`             DATETIME                                NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`             DATETIME                                NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_pp_project` (`project_id`),
  KEY `idx_pp_status` (`status`),
  CONSTRAINT `fk_pp_project`     FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pp_created_by`  FOREIGN KEY (`created_by`) REFERENCES `users`    (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_pp_reviewed_by` FOREIGN KEY (`reviewed_by`) REFERENCES `users`   (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Pitch reference images/links (kept separate, normalized)
CREATE TABLE IF NOT EXISTS `pitch_references` (
  `id`             CHAR(36)                           NOT NULL,
  `pitch_id`       CHAR(36)                           NOT NULL,
  `reference_type` ENUM('image','link','portfolio')   NOT NULL,
  `url`            TEXT,
  `title`          VARCHAR(255)                       DEFAULT NULL,
  `description`    TEXT,
  `sort_order`     INT                                NOT NULL DEFAULT 0,
  `created_at`     DATETIME                           NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_pr_pitch` (`pitch_id`),
  CONSTRAINT `fk_pr_pitch` FOREIGN KEY (`pitch_id`) REFERENCES `project_pitches` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5.3 Reki (Site Reconnaissance)
CREATE TABLE IF NOT EXISTS `reki_reports` (
  `id`                          CHAR(36)     NOT NULL,
  `project_id`                  CHAR(36)     NOT NULL,
  `supervisor_id`               CHAR(36)     DEFAULT NULL,
  `visit_date`                  DATE         NOT NULL,
  `client_present`              TINYINT(1)   DEFAULT NULL,
  -- Access & logistics
  `road_access`                 TINYINT(1)   DEFAULT NULL,
  `unloading_space`             TINYINT(1)   DEFAULT NULL,
  `working_time_restrictions`   TEXT,
  -- Site characteristics
  `area_type`                   VARCHAR(50)  DEFAULT NULL COMMENT 'urban, suburban, rural',
  `neighbouring_buildings`      TINYINT(1)   DEFAULT NULL,
  `plot_type`                   VARCHAR(50)  DEFAULT NULL,
  -- Existing structure
  `existing_structure`          TINYINT(1)   DEFAULT NULL,
  `construction_type`           VARCHAR(50)  DEFAULT NULL,
  `existing_floors`             INT          DEFAULT NULL,
  `built_up_area`               DECIMAL(12,2) DEFAULT NULL,
  `floor_to_floor_height`       DECIMAL(6,2) DEFAULT NULL,
  `slab_thickness`              DECIMAL(6,2) DEFAULT NULL,
  -- Structural
  `structural_cracks`           TINYINT(1)   DEFAULT NULL,
  `columns_beams_visible`       TINYINT(1)   DEFAULT NULL,
  `wall_condition`              ENUM('good','fair','poor') DEFAULT NULL,
  `floor_condition`             ENUM('good','fair','poor') DEFAULT NULL,
  -- MEP
  `dampness`                    TINYINT(1)   DEFAULT NULL,
  `dampness_location`           TEXT,
  `termite_damage`              TINYINT(1)   DEFAULT NULL,
  `electrical_wiring`           TINYINT(1)   DEFAULT NULL,
  `electrical_panel_location`   TEXT,
  `plumbing_lines`              TINYINT(1)   DEFAULT NULL,
  `water_inlet_outlet`          TEXT,
  `tanks_present`               TINYINT(1)   DEFAULT NULL,
  `power_supply`                TINYINT(1)   DEFAULT NULL,
  `water_supply`                TINYINT(1)   DEFAULT NULL,
  `drainage_available`          TINYINT(1)   DEFAULT NULL,
  -- Demolition & risks
  `demolition_required`         TINYINT(1)   DEFAULT NULL,
  `demolition_type`             ENUM('partial','full','none') DEFAULT NULL,
  `safety_concerns`             TINYINT(1)   DEFAULT NULL,
  `load_bearing_changes`        ENUM('required','not_required','unsure') DEFAULT NULL,
  `beam_cutting`                TINYINT(1)   DEFAULT NULL,
  `core_drilling`               TINYINT(1)   DEFAULT NULL,
  `structural_consultant_required` TINYINT(1) DEFAULT NULL,
  `fire_safety_norms`           TINYINT(1)   DEFAULT NULL,
  -- Observations
  `major_constraints`           TEXT,
  `risk_factors`                TEXT,
  `suggestions`                 TEXT,
  `client_instructions`         TEXT,
  -- Output
  `status`                      ENUM('draft','submitted','reviewed') NOT NULL DEFAULT 'draft',
  `reviewed_by`                 CHAR(36)     DEFAULT NULL,
  `reviewed_at`                 DATETIME     DEFAULT NULL,
  `created_at`                  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`                  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_reki_project` (`project_id`),
  KEY `idx_reki_supervisor` (`supervisor_id`),
  CONSTRAINT `fk_reki_project`     FOREIGN KEY (`project_id`)   REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_reki_supervisor`  FOREIGN KEY (`supervisor_id`) REFERENCES `users`   (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_reki_reviewed_by` FOREIGN KEY (`reviewed_by`)  REFERENCES `users`   (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5.4 Scope of Work
CREATE TABLE IF NOT EXISTS `scope_of_work` (
  `id`             CHAR(36) NOT NULL,
  `project_id`     CHAR(36) NOT NULL,
  `scope_summary`  TEXT,
  `civil_works`    JSON     DEFAULT NULL,
  `mep_works`      JSON     DEFAULT NULL,
  `interior_works` JSON     DEFAULT NULL,
  `finishes`       JSON     DEFAULT NULL,
  `area_summary`   JSON     DEFAULT NULL,
  `status`         ENUM('draft','approved') NOT NULL DEFAULT 'draft',
  `approved_by`    CHAR(36) DEFAULT NULL,
  `approved_at`    DATETIME DEFAULT NULL,
  `created_at`     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_sow_project` (`project_id`),
  CONSTRAINT `fk_sow_project`     FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sow_approved_by` FOREIGN KEY (`approved_by`) REFERENCES `users`  (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SECTION 6: COST ESTIMATES & PAYMENT
-- ============================================================

CREATE TABLE IF NOT EXISTS `cost_estimates` (
  `id`                     CHAR(36)                                    NOT NULL,
  `project_id`             CHAR(36)                                    NOT NULL,
  `version`                INT                                         NOT NULL DEFAULT 1,
  `estimate_type`          ENUM('consultation','turnkey','constructional') NOT NULL,
  `consultation_fee`       DECIMAL(12,2)                               DEFAULT NULL,
  `tentative_total_cost`   DECIMAL(15,2)                               DEFAULT NULL,
  `material_cost`          DECIMAL(15,2)                               DEFAULT NULL,
  `labour_cost`            DECIMAL(15,2)                               DEFAULT NULL,
  `overhead_cost`          DECIMAL(15,2)                               DEFAULT NULL,
  `contingency_percent`    DECIMAL(5,2)                                DEFAULT NULL,
  `notes`                  TEXT,
  `status`                 ENUM('draft','sent','accepted','rejected')   NOT NULL DEFAULT 'draft',
  `prepared_by`            CHAR(36)                                    DEFAULT NULL,
  `approved_by`            CHAR(36)                                    DEFAULT NULL,
  `approved_at`            DATETIME                                    DEFAULT NULL,
  `created_at`             DATETIME                                    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`             DATETIME                                    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_ce_project_version` (`project_id`, `version`),
  KEY `idx_ce_status` (`status`),
  CONSTRAINT `fk_ce_project`     FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ce_prepared_by` FOREIGN KEY (`prepared_by`) REFERENCES `users`  (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_ce_approved_by` FOREIGN KEY (`approved_by`) REFERENCES `users`  (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Payment milestones (critical business logic, must not be JSON)
CREATE TABLE IF NOT EXISTS `payment_milestones` (
  `id`               CHAR(36)                                            NOT NULL,
  `project_id`       CHAR(36)                                            NOT NULL,
  `estimate_id`      CHAR(36)                                            DEFAULT NULL,
  `milestone_name`   VARCHAR(255)                                        NOT NULL COMMENT 'Token, Foundation, Slab, Plastering, Handover…',
  `description`      TEXT,
  `percentage`       DECIMAL(5,2)                                        DEFAULT NULL COMMENT 'Of total contract value',
  `amount`           DECIMAL(15,2)                                       NOT NULL,
  `due_date`         DATE                                                DEFAULT NULL,
  `status`           ENUM('pending','invoiced','partially_paid','paid','overdue') NOT NULL DEFAULT 'pending',
  `sort_order`       INT                                                 NOT NULL DEFAULT 0,
  `created_at`       DATETIME                                            NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       DATETIME                                            NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_pm_project`  (`project_id`),
  KEY `idx_pm_status`   (`status`),
  CONSTRAINT `fk_pm_project`  FOREIGN KEY (`project_id`) REFERENCES `projects`       (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pm_estimate` FOREIGN KEY (`estimate_id`) REFERENCES `cost_estimates` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Payment receipts against milestones
CREATE TABLE IF NOT EXISTS `payment_receipts` (
  `id`              CHAR(36)                                         NOT NULL,
  `milestone_id`    CHAR(36)                                         NOT NULL,
  `project_id`      CHAR(36)                                         NOT NULL,
  `amount_received` DECIMAL(15,2)                                    NOT NULL,
  `payment_mode`    ENUM('cash','cheque','neft','rtgs','upi','other') NOT NULL,
  `payment_date`    DATE                                             NOT NULL,
  `reference_number` VARCHAR(100)                                    DEFAULT NULL COMMENT 'Cheque no., UTR, UPI ref',
  `bank_name`       VARCHAR(100)                                     DEFAULT NULL,
  `notes`           TEXT,
  `received_by`     CHAR(36)                                         DEFAULT NULL,
  `created_at`      DATETIME                                         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_pr_milestone` (`milestone_id`),
  KEY `idx_pr_project`   (`project_id`),
  KEY `idx_pr_date`      (`payment_date`),
  CONSTRAINT `fk_pr_milestone`    FOREIGN KEY (`milestone_id`) REFERENCES `payment_milestones` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_pr_project`      FOREIGN KEY (`project_id`)   REFERENCES `projects`           (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_pr_received_by`  FOREIGN KEY (`received_by`)  REFERENCES `users`              (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SECTION 7: VENDORS
-- ============================================================

CREATE TABLE IF NOT EXISTS `vendor_types` (
  `id`   CHAR(36)    NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_vt_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `vendors` (
  `id`              CHAR(36)     NOT NULL,
  `name`            VARCHAR(255) NOT NULL,
  `company_name`    VARCHAR(255) DEFAULT NULL,
  `position`        VARCHAR(150) DEFAULT NULL,
  `trade_type`      VARCHAR(100) DEFAULT NULL COMMENT 'Civil, Electrical, Plumbing, HVAC…',
  `mobile_primary`  VARCHAR(20)  NOT NULL,
  `mobile_secondary` VARCHAR(20) DEFAULT NULL,
  `email`           VARCHAR(255) DEFAULT NULL,
  `whatsapp`        VARCHAR(20)  DEFAULT NULL,
  `gst_number`      VARCHAR(20)  DEFAULT NULL,
  `pan_number`      VARCHAR(20)  DEFAULT NULL,
  `area_covered`    VARCHAR(255) DEFAULT NULL,
  `address`         JSON         DEFAULT NULL,
  -- Flags (keep these as columns because they're queried)
  `is_architect`    TINYINT(1)   NOT NULL DEFAULT 0,
  `is_interior`     TINYINT(1)   NOT NULL DEFAULT 0,
  `is_furniture`    TINYINT(1)   NOT NULL DEFAULT 0,
  `is_active`       TINYINT(1)   NOT NULL DEFAULT 1,
  -- Reference
  `reference_name`  VARCHAR(255) DEFAULT NULL,
  `reference_phone` VARCHAR(20)  DEFAULT NULL,
  `notes`           TEXT,
  `created_by`      CHAR(36)     DEFAULT NULL,
  `updated_by`      CHAR(36)     DEFAULT NULL,
  `created_at`      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_vendors_trade`  (`trade_type`),
  KEY `idx_vendors_active` (`is_active`),
  CONSTRAINT `fk_vendors_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `vendor_type_map` (
  `vendor_id` CHAR(36) NOT NULL,
  `type_id`   CHAR(36) NOT NULL,
  PRIMARY KEY (`vendor_id`, `type_id`),
  CONSTRAINT `fk_vtm_vendor` FOREIGN KEY (`vendor_id`) REFERENCES `vendors`      (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_vtm_type`   FOREIGN KEY (`type_id`)   REFERENCES `vendor_types` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Vendor ratings/evaluations over time
CREATE TABLE IF NOT EXISTS `vendor_ratings` (
  `id`              CHAR(36)     NOT NULL,
  `vendor_id`       CHAR(36)     NOT NULL,
  `project_id`      CHAR(36)     DEFAULT NULL,
  `quality_score`   TINYINT      NOT NULL COMMENT '1-5',
  `delivery_score`  TINYINT      NOT NULL COMMENT '1-5',
  `cost_score`      TINYINT      NOT NULL COMMENT '1-5',
  `behaviour_score` TINYINT      NOT NULL COMMENT '1-5',
  `overall_score`   DECIMAL(3,1) GENERATED ALWAYS AS (
    (quality_score + delivery_score + cost_score + behaviour_score) / 4.0
  ) STORED,
  `comments`        TEXT,
  `rated_by`        CHAR(36)     NOT NULL,
  `created_at`      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_vr_vendor`  (`vendor_id`),
  KEY `idx_vr_project` (`project_id`),
  CONSTRAINT `fk_vr_vendor`   FOREIGN KEY (`vendor_id`)  REFERENCES `vendors`  (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_vr_project`  FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_vr_rated_by` FOREIGN KEY (`rated_by`)   REFERENCES `users`    (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `project_vendors` (
  `id`                    CHAR(36)    NOT NULL,
  `project_id`            CHAR(36)    NOT NULL,
  `vendor_id`             CHAR(36)    NOT NULL,
  `scope_summary`         TEXT,
  `quoted_amount`         DECIMAL(15,2) DEFAULT NULL,
  `approved_amount`       DECIMAL(15,2) DEFAULT NULL,
  `is_selected`           TINYINT(1)  NOT NULL DEFAULT 0,
  `selection_reason`      TEXT,
  `status`                ENUM('shortlisted','negotiating','selected','rejected') NOT NULL DEFAULT 'shortlisted',
  `created_at`            DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`            DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_pv_project_vendor` (`project_id`, `vendor_id`),
  KEY `idx_pv_vendor` (`vendor_id`),
  CONSTRAINT `fk_pv_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pv_vendor`  FOREIGN KEY (`vendor_id`)  REFERENCES `vendors`  (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SECTION 8: INVENTORY & MATERIALS
-- ============================================================

CREATE TABLE IF NOT EXISTS `units` (
  `id`         CHAR(36)    NOT NULL,
  `name`       VARCHAR(50) NOT NULL COMMENT 'Square Feet, Running Metre, Kilogram',
  `short_name` VARCHAR(20) NOT NULL COMMENT 'sft, rm, kg',
  `created_at` DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_units_short` (`short_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `brands` (
  `id`         CHAR(36)     NOT NULL,
  `name`       VARCHAR(150) NOT NULL,
  `is_active`  TINYINT(1)   NOT NULL DEFAULT 1,
  `created_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_brands_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `inventory_categories` (
  `id`         CHAR(36)     NOT NULL,
  `name`       VARCHAR(100) NOT NULL,
  `code`       VARCHAR(50)  DEFAULT NULL,
  `parent_id`  CHAR(36)     DEFAULT NULL,
  `sort_order` INT          NOT NULL DEFAULT 0,
  `is_active`  TINYINT(1)   NOT NULL DEFAULT 1,
  `created_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_ic_name` (`name`),
  KEY `idx_ic_parent` (`parent_id`),
  CONSTRAINT `fk_ic_parent` FOREIGN KEY (`parent_id`) REFERENCES `inventory_categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Master catalog of all materials/products
CREATE TABLE IF NOT EXISTS `inventory_master` (
  `id`              CHAR(36)      NOT NULL,
  `item_code`       VARCHAR(100)  NOT NULL,
  `item_name`       VARCHAR(255)  NOT NULL,
  `category_id`     CHAR(36)      DEFAULT NULL,
  `brand_id`        CHAR(36)      DEFAULT NULL,
  `unit_id`         CHAR(36)      DEFAULT NULL,
  `description`     TEXT,
  `specification`   TEXT,
  `hsn_code`        VARCHAR(20)   DEFAULT NULL,
  `gst_percent`     DECIMAL(5,2)  NOT NULL DEFAULT 18.00,
  `default_rate`    DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  `min_stock_level` DECIMAL(12,3) NOT NULL DEFAULT 0.000,
  `is_serialized`   TINYINT(1)    NOT NULL DEFAULT 0,
  `is_active`       TINYINT(1)    NOT NULL DEFAULT 1,
  `created_by`      CHAR(36)      DEFAULT NULL,
  `created_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_im_code`    (`item_code`),
  KEY `idx_im_name`          (`item_name`),
  KEY `idx_im_category`      (`category_id`),
  KEY `idx_im_brand`         (`brand_id`),
  KEY `idx_im_unit`          (`unit_id`),
  CONSTRAINT `fk_im_category` FOREIGN KEY (`category_id`) REFERENCES `inventory_categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_im_brand`    FOREIGN KEY (`brand_id`)    REFERENCES `brands`               (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_im_unit`     FOREIGN KEY (`unit_id`)     REFERENCES `units`                (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Project-specific material plan (replaces both project_materials + materials)
CREATE TABLE IF NOT EXISTS `project_materials` (
  `id`                  CHAR(36)                                                              NOT NULL,
  `project_id`          CHAR(36)                                                              NOT NULL,
  `inventory_master_id` CHAR(36)                                                              DEFAULT NULL COMMENT 'NULL if custom/unlisted item',
  `item_code`           VARCHAR(100)                                                          DEFAULT NULL,
  `item_name`           VARCHAR(255)                                                          NOT NULL,
  `description`         TEXT,
  `specification`       TEXT,
  `category`            VARCHAR(100)                                                          DEFAULT NULL,
  `unit_id`             CHAR(36)                                                              DEFAULT NULL,
  `brand_id`            CHAR(36)                                                              DEFAULT NULL,
  `quantity_estimated`  DECIMAL(14,3)                                                         NOT NULL DEFAULT 0.000,
  `quantity_ordered`    DECIMAL(14,3)                                                         NOT NULL DEFAULT 0.000,
  `quantity_received`   DECIMAL(14,3)                                                         NOT NULL DEFAULT 0.000,
  `quantity_used`       DECIMAL(14,3)                                                         NOT NULL DEFAULT 0.000,
  `rate`                DECIMAL(14,2)                                                         DEFAULT NULL,
  `gst_percent`         DECIMAL(5,2)                                                          NOT NULL DEFAULT 18.00,
  `status`              ENUM('planned','ordered','partially_received','received','in_use','closed') NOT NULL DEFAULT 'planned',
  `remarks`             TEXT,
  `created_at`          DATETIME                                                              NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`          DATETIME                                                              NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_pmat_project` (`project_id`),
  KEY `idx_pmat_master`  (`inventory_master_id`),
  KEY `idx_pmat_status`  (`status`),
  CONSTRAINT `fk_pmat_project` FOREIGN KEY (`project_id`)          REFERENCES `projects`         (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pmat_master`  FOREIGN KEY (`inventory_master_id`) REFERENCES `inventory_master` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_pmat_unit`    FOREIGN KEY (`unit_id`)             REFERENCES `units`            (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_pmat_brand`   FOREIGN KEY (`brand_id`)            REFERENCES `brands`           (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inventory purchase requests
CREATE TABLE IF NOT EXISTS `inventory_requests` (
  `id`                  CHAR(36)                                                           NOT NULL,
  `project_id`          CHAR(36)                                                           NOT NULL,
  `project_material_id` CHAR(36)                                                           NOT NULL,
  `vendor_id`           CHAR(36)                                                           DEFAULT NULL,
  `source_type`         ENUM('vendor','warehouse','site_stock')                             NOT NULL DEFAULT 'vendor',
  `quantity_required`   DECIMAL(12,3)                                                      NOT NULL,
  `required_date`       DATE                                                               DEFAULT NULL,
  `remarks`             TEXT,
  `status`              ENUM('requested','approved','dispatched','delivered','rejected','cancelled') NOT NULL DEFAULT 'requested',
  `requested_by`        CHAR(36)                                                           DEFAULT NULL,
  `approved_by`         CHAR(36)                                                           DEFAULT NULL,
  `approved_at`         DATETIME                                                           DEFAULT NULL,
  `created_at`          DATETIME                                                           NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`          DATETIME                                                           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_ir_project`  (`project_id`),
  KEY `idx_ir_material` (`project_material_id`),
  KEY `idx_ir_status`   (`status`),
  CONSTRAINT `fk_ir_project`       FOREIGN KEY (`project_id`)          REFERENCES `projects`          (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ir_material`      FOREIGN KEY (`project_material_id`) REFERENCES `project_materials` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ir_vendor`        FOREIGN KEY (`vendor_id`)           REFERENCES `vendors`           (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_ir_requested_by`  FOREIGN KEY (`requested_by`)        REFERENCES `users`             (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_ir_approved_by`   FOREIGN KEY (`approved_by`)         REFERENCES `users`             (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dispatch records against requests
CREATE TABLE IF NOT EXISTS `inventory_dispatches` (
  `id`                      CHAR(36)      NOT NULL,
  `request_id`              CHAR(36)      NOT NULL,
  `dispatch_date`           DATETIME      NOT NULL,
  `dispatch_quantity`       DECIMAL(12,3) NOT NULL,
  `vehicle_challan`         VARCHAR(100)  DEFAULT NULL,
  `driver_name`             VARCHAR(100)  DEFAULT NULL,
  `driver_phone`            VARCHAR(20)   DEFAULT NULL,
  `received_quantity`       DECIMAL(12,3) DEFAULT NULL,
  `shortage_quantity`       DECIMAL(12,3) DEFAULT NULL,
  `has_damage_shortage`     TINYINT(1)    NOT NULL DEFAULT 0,
  `supervisor_confirmed`    TINYINT(1)    NOT NULL DEFAULT 0,
  `supervisor_confirmed_by` CHAR(36)      DEFAULT NULL,
  `supervisor_confirmed_at` DATETIME      DEFAULT NULL,
  `remarks`                 TEXT,
  `created_at`              DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_id_request` (`request_id`),
  CONSTRAINT `fk_id_request` FOREIGN KEY (`request_id`) REFERENCES `inventory_requests` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_id_supervisor` FOREIGN KEY (`supervisor_confirmed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SECTION 9: BOQ (Bill of Quantities)
-- ============================================================

CREATE TABLE IF NOT EXISTS `boq_categories` (
  `id`          CHAR(36)     NOT NULL,
  `name`        VARCHAR(255) NOT NULL,
  `code`        VARCHAR(100) DEFAULT NULL,
  `description` TEXT,
  `sort_order`  INT          NOT NULL DEFAULT 0,
  `is_active`   TINYINT(1)   NOT NULL DEFAULT 1,
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_bc_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `boqs` (
  `id`              CHAR(36)                                               NOT NULL,
  `project_id`      CHAR(36)                                               DEFAULT NULL,
  `client_id`       CHAR(36)                                               DEFAULT NULL,
  `boq_category_id` CHAR(36)                                               NOT NULL,
  `title`           VARCHAR(255)                                           NOT NULL,
  `code`            VARCHAR(100)                                           DEFAULT NULL,
  `revision_no`     VARCHAR(50)                                            NOT NULL DEFAULT 'Rev-01',
  `status`          ENUM('draft','submitted','approved','rejected','revised') NOT NULL DEFAULT 'draft',
  `notes`           TEXT,
  `subtotal`        DECIMAL(16,2)                                          NOT NULL DEFAULT 0.00,
  `tax_amount`      DECIMAL(16,2)                                          NOT NULL DEFAULT 0.00,
  `discount_amount` DECIMAL(16,2)                                          NOT NULL DEFAULT 0.00,
  `grand_total`     DECIMAL(16,2)                                          NOT NULL DEFAULT 0.00,
  `prepared_by`     CHAR(36)                                               DEFAULT NULL,
  `approved_by`     CHAR(36)                                               DEFAULT NULL,
  `approved_at`     DATETIME                                               DEFAULT NULL,
  `created_at`      DATETIME                                               NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME                                               NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_boqs_project`     (`project_id`),
  KEY `idx_boqs_client`      (`client_id`),
  KEY `idx_boqs_status`      (`status`),
  CONSTRAINT `fk_boqs_project`      FOREIGN KEY (`project_id`)      REFERENCES `projects`       (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_boqs_client`       FOREIGN KEY (`client_id`)       REFERENCES `clients`        (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_boqs_category`     FOREIGN KEY (`boq_category_id`) REFERENCES `boq_categories` (`id`),
  CONSTRAINT `fk_boqs_prepared_by`  FOREIGN KEY (`prepared_by`)     REFERENCES `users`          (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_boqs_approved_by`  FOREIGN KEY (`approved_by`)     REFERENCES `users`          (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `boq_sections` (
  `id`          CHAR(36)     NOT NULL,
  `boq_id`      CHAR(36)     NOT NULL,
  `title`       VARCHAR(255) NOT NULL,
  `description` TEXT,
  `sort_order`  INT          NOT NULL DEFAULT 0,
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_bs_boq` (`boq_id`),
  CONSTRAINT `fk_bs_boq` FOREIGN KEY (`boq_id`) REFERENCES `boqs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `boq_subheadings` (
  `id`          CHAR(36)     NOT NULL,
  `boq_id`      CHAR(36)     NOT NULL,
  `section_id`  CHAR(36)     NOT NULL,
  `title`       VARCHAR(255) NOT NULL,
  `description` TEXT,
  `sort_order`  INT          NOT NULL DEFAULT 0,
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_bsh_boq`     (`boq_id`),
  KEY `idx_bsh_section` (`section_id`),
  CONSTRAINT `fk_bsh_boq`     FOREIGN KEY (`boq_id`)     REFERENCES `boqs`         (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_bsh_section` FOREIGN KEY (`section_id`) REFERENCES `boq_sections` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `boq_items` (
  `id`                  CHAR(36)      NOT NULL,
  `boq_id`              CHAR(36)      NOT NULL,
  `section_id`          CHAR(36)      NOT NULL,
  `subheading_id`       CHAR(36)      DEFAULT NULL,
  `inventory_master_id` CHAR(36)      DEFAULT NULL,
  `unit_id`             CHAR(36)      DEFAULT NULL,
  `sno`                 VARCHAR(50)   DEFAULT NULL,
  `item_code`           VARCHAR(100)  DEFAULT NULL,
  `item_name`           TEXT          NOT NULL,
  `description`         TEXT,
  `specification`       TEXT,
  `brand`               VARCHAR(255)  DEFAULT NULL,
  `qty`                 DECIMAL(14,3) NOT NULL DEFAULT 0.000,
  `rate`                DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  `wastage_percent`     DECIMAL(5,2)  NOT NULL DEFAULT 0.00,
  `discount_percent`    DECIMAL(5,2)  NOT NULL DEFAULT 0.00,
  `tax_percent`         DECIMAL(5,2)  NOT NULL DEFAULT 18.00,
  -- Computed columns: let DB enforce the math
  `base_amount`         DECIMAL(16,2) GENERATED ALWAYS AS (`qty` * `rate`) STORED,
  `discount_amount`     DECIMAL(16,2) GENERATED ALWAYS AS (
    (`qty` * `rate`) * `discount_percent` / 100
  ) STORED,
  `taxable_amount`      DECIMAL(16,2) GENERATED ALWAYS AS (
    (`qty` * `rate`) - ((`qty` * `rate`) * `discount_percent` / 100)
  ) STORED,
  `tax_amount`          DECIMAL(16,2) GENERATED ALWAYS AS (
    ((`qty` * `rate`) - ((`qty` * `rate`) * `discount_percent` / 100)) * `tax_percent` / 100
  ) STORED,
  `final_amount`        DECIMAL(16,2) GENERATED ALWAYS AS (
    ((`qty` * `rate`) - ((`qty` * `rate`) * `discount_percent` / 100)) *
    (1 + `tax_percent` / 100)
  ) STORED,
  `remarks`             TEXT,
  `sort_order`          INT           NOT NULL DEFAULT 0,
  `created_at`          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_bi_boq`       (`boq_id`),
  KEY `idx_bi_section`   (`section_id`),
  KEY `idx_bi_master`    (`inventory_master_id`),
  CONSTRAINT `fk_bi_boq`        FOREIGN KEY (`boq_id`)              REFERENCES `boqs`             (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_bi_section`    FOREIGN KEY (`section_id`)          REFERENCES `boq_sections`     (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_bi_subheading` FOREIGN KEY (`subheading_id`)       REFERENCES `boq_subheadings`  (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_bi_master`     FOREIGN KEY (`inventory_master_id`) REFERENCES `inventory_master` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_bi_unit`       FOREIGN KEY (`unit_id`)             REFERENCES `units`            (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SECTION 10: DRAWINGS
-- ============================================================

CREATE TABLE IF NOT EXISTS `project_drawings` (
  `id`           CHAR(36)                                                   NOT NULL,
  `project_id`   CHAR(36)                                                   NOT NULL,
  `drawing_type` ENUM('design','execution','technical','construction','working','as_built') NOT NULL,
  `title`        VARCHAR(255)                                               NOT NULL,
  `area_floor`   VARCHAR(100)                                               DEFAULT NULL,
  `version`      INT                                                        NOT NULL DEFAULT 1,
  `file_id`      CHAR(36)                                                   NOT NULL,
  `uploaded_by`  CHAR(36)                                                   DEFAULT NULL,
  `status`       ENUM('uploaded','under_review','approved','rejected','revision_requested') NOT NULL DEFAULT 'uploaded',
  `approved_by`  CHAR(36)                                                   DEFAULT NULL,
  `approved_at`  DATETIME                                                   DEFAULT NULL,
  `parent_id`    CHAR(36)                                                   DEFAULT NULL COMMENT 'Previous version reference',
  `created_at`   DATETIME                                                   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   DATETIME                                                   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_pd_project`  (`project_id`),
  KEY `idx_pd_status`   (`status`),
  KEY `idx_pd_parent`   (`parent_id`),
  CONSTRAINT `fk_pd_project`      FOREIGN KEY (`project_id`)  REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pd_file`         FOREIGN KEY (`file_id`)     REFERENCES `files`    (`id`),
  CONSTRAINT `fk_pd_uploaded_by`  FOREIGN KEY (`uploaded_by`) REFERENCES `users`    (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_pd_approved_by`  FOREIGN KEY (`approved_by`) REFERENCES `users`    (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_pd_parent`       FOREIGN KEY (`parent_id`)   REFERENCES `project_drawings` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Drawing approval workflow events
CREATE TABLE IF NOT EXISTS `drawing_review_logs` (
  `id`               CHAR(36)                                                           NOT NULL,
  `drawing_id`       CHAR(36)                                                           NOT NULL,
  `action`           ENUM('submitted','approved','rejected','revision_requested','commented') NOT NULL,
  `actor_type`       ENUM('user','client')                                              NOT NULL DEFAULT 'user',
  `actor_user_id`    CHAR(36)                                                           DEFAULT NULL,
  `actor_client_id`  CHAR(36)                                                           DEFAULT NULL,
  `remarks`          TEXT,
  `internal_note`    TEXT,
  `drawing_version`  INT                                                                DEFAULT NULL,
  `created_at`       DATETIME                                                           NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_drl_drawing` (`drawing_id`),
  KEY `idx_drl_action`  (`action`),
  KEY `idx_drl_created` (`created_at`),
  CONSTRAINT `fk_drl_drawing` FOREIGN KEY (`drawing_id`)     REFERENCES `project_drawings` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_drl_user`    FOREIGN KEY (`actor_user_id`)  REFERENCES `users`            (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_drl_client`  FOREIGN KEY (`actor_client_id`) REFERENCES `clients`         (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SECTION 11: EXECUTION
-- ============================================================

CREATE TABLE IF NOT EXISTS `execution_stages` (
  `id`                  CHAR(36)                                    NOT NULL,
  `project_id`          CHAR(36)                                    NOT NULL,
  `order`               INT                                         NOT NULL DEFAULT 1,
  `name`                VARCHAR(255)                                NOT NULL,
  `description`         TEXT,
  `planned_start_date`  DATE                                        DEFAULT NULL,
  `planned_end_date`    DATE                                        DEFAULT NULL,
  `actual_start_date`   DATE                                        DEFAULT NULL,
  `actual_end_date`     DATE                                        DEFAULT NULL,
  `progress_percentage` DECIMAL(5,2)                                NOT NULL DEFAULT 0.00,
  `status`              ENUM('pending','in_progress','completed','blocked') NOT NULL DEFAULT 'pending',
  `created_at`          DATETIME                                    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`          DATETIME                                    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_es_project` (`project_id`),
  KEY `idx_es_order`   (`project_id`, `order`),
  CONSTRAINT `fk_es_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `execution_activities` (
  `id`                   CHAR(36)                                      NOT NULL,
  `project_id`           CHAR(36)                                      NOT NULL,
  `stage_id`             CHAR(36)                                      DEFAULT NULL,
  `order`                INT                                           NOT NULL DEFAULT 1,
  `title`                VARCHAR(255)                                  NOT NULL,
  `description`          TEXT,
  `activity_date`        DATE                                          NOT NULL,
  `planned_start_date`   DATE                                          DEFAULT NULL,
  `planned_end_date`     DATE                                          DEFAULT NULL,
  `planned_quantity`     DECIMAL(12,2)                                 DEFAULT NULL,
  `completed_quantity`   DECIMAL(12,2)                                 DEFAULT NULL,
  `unit`                 VARCHAR(50)                                   DEFAULT NULL,
  `progress_percentage`  DECIMAL(5,2)                                  NOT NULL DEFAULT 0.00,
  `status`               ENUM('pending','ongoing','completed','delayed') NOT NULL DEFAULT 'pending',
  `created_by`           CHAR(36)                                      DEFAULT NULL,
  `created_at`           DATETIME                                      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`           DATETIME                                      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_ea_project` (`project_id`),
  KEY `idx_ea_stage`   (`stage_id`),
  KEY `idx_ea_date`    (`activity_date`),
  CONSTRAINT `fk_ea_project` FOREIGN KEY (`project_id`) REFERENCES `projects`         (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ea_stage`   FOREIGN KEY (`stage_id`)   REFERENCES `execution_stages` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_ea_user`    FOREIGN KEY (`created_by`) REFERENCES `users`            (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Daily progress reports
CREATE TABLE IF NOT EXISTS `daily_progress_reports` (
  `id`              CHAR(36) NOT NULL,
  `project_id`      CHAR(36) NOT NULL,
  `stage_id`        CHAR(36) DEFAULT NULL,
  `report_date`     DATE     NOT NULL,
  `supervisor_id`   CHAR(36) DEFAULT NULL,
  `current_stage`   VARCHAR(100) DEFAULT NULL,
  `work_executed`   TEXT,
  `manpower_count`  INT      DEFAULT NULL,
  `materials_used`  TEXT,
  `issues_faced`    TEXT,
  `weather`         VARCHAR(50) DEFAULT NULL COMMENT 'sunny, cloudy, rain, stopped',
  `created_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_dpr_project_date` (`project_id`, `report_date`),
  KEY `idx_dpr_supervisor` (`supervisor_id`),
  CONSTRAINT `fk_dpr_project`    FOREIGN KEY (`project_id`)    REFERENCES `projects`         (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_dpr_stage`      FOREIGN KEY (`stage_id`)      REFERENCES `execution_stages` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_dpr_supervisor` FOREIGN KEY (`supervisor_id`) REFERENCES `users`            (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SECTION 12: QUALITY & ISSUES
-- ============================================================

CREATE TABLE IF NOT EXISTS `quality_checks` (
  `id`                         CHAR(36)   NOT NULL,
  `project_id`                 CHAR(36)   NOT NULL,
  `stage_id`                   CHAR(36)   DEFAULT NULL,
  `stage_name`                 VARCHAR(100) DEFAULT NULL,
  `checked_date`               DATE       NOT NULL,
  `checked_by`                 CHAR(36)   DEFAULT NULL,
  `quality_met`                TINYINT(1) DEFAULT NULL,
  `has_deviations`             TINYINT(1) NOT NULL DEFAULT 0,
  `corrective_action_required` TINYINT(1) NOT NULL DEFAULT 0,
  `corrective_action_taken`    TEXT,
  `supervisor_remarks`         TEXT,
  `status`                     ENUM('open','resolved','escalated') NOT NULL DEFAULT 'open',
  `resolved_at`                DATETIME   DEFAULT NULL,
  `created_at`                 DATETIME   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_qc_project` (`project_id`),
  KEY `idx_qc_stage`   (`stage_id`),
  CONSTRAINT `fk_qc_project`    FOREIGN KEY (`project_id`) REFERENCES `projects`         (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_qc_stage`      FOREIGN KEY (`stage_id`)   REFERENCES `execution_stages` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_qc_checked_by` FOREIGN KEY (`checked_by`) REFERENCES `users`            (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `issue_logs` (
  `id`                     CHAR(36)               NOT NULL,
  `project_id`             CHAR(36)               NOT NULL,
  `stage_id`               CHAR(36)               DEFAULT NULL,
  `issue_type`             VARCHAR(100)           DEFAULT NULL COMMENT 'safety, quality, delay, material, labor…',
  `issue_description`      TEXT                   NOT NULL,
  `responsible_party`      VARCHAR(100)           DEFAULT NULL,
  `target_resolution_date` DATE                   DEFAULT NULL,
  `actual_resolution_date` DATE                   DEFAULT NULL,
  `priority`               ENUM('low','medium','high','critical') NOT NULL DEFAULT 'medium',
  `status`                 ENUM('open','in_progress','resolved','closed') NOT NULL DEFAULT 'open',
  `resolution_notes`       TEXT,
  `reported_by`            CHAR(36)               DEFAULT NULL,
  `resolved_by`            CHAR(36)               DEFAULT NULL,
  `created_at`             DATETIME               NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`             DATETIME               NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_il_project`  (`project_id`),
  KEY `idx_il_status`   (`status`),
  KEY `idx_il_priority` (`priority`),
  CONSTRAINT `fk_il_project`     FOREIGN KEY (`project_id`) REFERENCES `projects`         (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_il_stage`       FOREIGN KEY (`stage_id`)   REFERENCES `execution_stages` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_il_reported_by` FOREIGN KEY (`reported_by`) REFERENCES `users`           (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_il_resolved_by` FOREIGN KEY (`resolved_by`) REFERENCES `users`           (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SECTION 13: TASKS
-- ============================================================

CREATE TABLE IF NOT EXISTS `tasks` (
  `id`                 CHAR(36)                                                                                                                         NOT NULL,
  `project_id`         CHAR(36)                                                                                                                         NOT NULL,
  `parent_task_id`     CHAR(36)                                                                                                                         DEFAULT NULL COMMENT 'Sub-task support',
  `created_by`         CHAR(36)                                                                                                                         NOT NULL,
  `assigned_to`        CHAR(36)                                                                                                                         DEFAULT NULL,
  `title`              VARCHAR(255)                                                                                                                      NOT NULL,
  `description`        TEXT,
  `module`             VARCHAR(100)                                                                                                                      DEFAULT NULL COMMENT 'Contextual module: boq, drawing, reki…',
  `entity_type`        VARCHAR(60)                                                                                                                       DEFAULT NULL,
  `entity_id`          CHAR(36)                                                                                                                          DEFAULT NULL COMMENT 'Linked entity (drawing id, boq id…)',
  `task_type`          ENUM('general','design_upload','revision_response','site_visit','vendor_followup','inventory_dispatch','quality_check','client_response','internal_docs') NOT NULL DEFAULT 'general',
  `priority`           ENUM('low','medium','high','urgent')                                                                                               NOT NULL DEFAULT 'medium',
  `status`             ENUM('todo','in_progress','review','completed','blocked')                                                                          NOT NULL DEFAULT 'todo',
  `due_date`           DATE                                                                                                                              DEFAULT NULL,
  `completed_at`       DATETIME                                                                                                                          DEFAULT NULL,
  `created_at`         DATETIME                                                                                                                          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`         DATETIME                                                                                                                          NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_tasks_project`     (`project_id`),
  KEY `idx_tasks_assigned_to` (`assigned_to`),
  KEY `idx_tasks_status`      (`status`),
  KEY `idx_tasks_priority`    (`priority`),
  KEY `idx_tasks_entity`      (`entity_type`, `entity_id`),
  CONSTRAINT `fk_tasks_project`      FOREIGN KEY (`project_id`)     REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_tasks_created_by`   FOREIGN KEY (`created_by`)     REFERENCES `users`    (`id`),
  CONSTRAINT `fk_tasks_assigned_to`  FOREIGN KEY (`assigned_to`)    REFERENCES `users`    (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_tasks_parent`       FOREIGN KEY (`parent_task_id`) REFERENCES `tasks`    (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SECTION 14: COMMENTS (unified, threaded)
-- ============================================================

CREATE TABLE IF NOT EXISTS `comments` (
  `id`               CHAR(36)             NOT NULL,
  `project_id`       CHAR(36)             NOT NULL,
  `entity_type`      VARCHAR(60)          NOT NULL COMMENT 'drawing, task, boq, issue, reki…',
  `entity_id`        CHAR(36)             NOT NULL,
  `parent_id`        CHAR(36)             DEFAULT NULL COMMENT 'Thread reply',
  `comment`          TEXT                 NOT NULL,
  `author_type`      ENUM('user','client') NOT NULL DEFAULT 'user',
  `author_user_id`   CHAR(36)             DEFAULT NULL,
  `author_client_id` CHAR(36)             DEFAULT NULL,
  `is_internal`      TINYINT(1)           NOT NULL DEFAULT 1 COMMENT '0 = visible to client',
  `is_edited`        TINYINT(1)           NOT NULL DEFAULT 0,
  `edited_at`        DATETIME             DEFAULT NULL,
  `created_at`       DATETIME             NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_comments_entity`  (`entity_type`, `entity_id`),
  KEY `idx_comments_project` (`project_id`),
  KEY `idx_comments_parent`  (`parent_id`),
  CONSTRAINT `fk_comments_project` FOREIGN KEY (`project_id`)       REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_comments_user`    FOREIGN KEY (`author_user_id`)   REFERENCES `users`    (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_comments_client`  FOREIGN KEY (`author_client_id`) REFERENCES `clients`  (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SECTION 15: NOTIFICATIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS `notifications` (
  `id`             CHAR(36)                                  NOT NULL,
  `recipient_id`   CHAR(36)                                  NOT NULL COMMENT 'user or client depending on recipient_type',
  `recipient_type` ENUM('user','client')                     NOT NULL DEFAULT 'user',
  `type`           VARCHAR(100)                              NOT NULL COMMENT 'drawing_approved, task_assigned, payment_due…',
  `title`          VARCHAR(255)                              NOT NULL,
  `body`           TEXT,
  `data`           JSON                                      DEFAULT NULL COMMENT 'Deep-link context: {project_id, entity_type, entity_id}',
  `is_read`        TINYINT(1)                                NOT NULL DEFAULT 0,
  `read_at`        DATETIME                                  DEFAULT NULL,
  `created_at`     DATETIME                                  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_notif_recipient` (`recipient_type`, `recipient_id`, `is_read`),
  KEY `idx_notif_created`   (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SECTION 16: HANDOVER
-- ============================================================

CREATE TABLE IF NOT EXISTS `handovers` (
  `id`                     CHAR(36)   NOT NULL,
  `project_id`             CHAR(36)   NOT NULL,
  `handover_date`          DATE       DEFAULT NULL,
  `completion_confirmed`   TINYINT(1) NOT NULL DEFAULT 0,
  `outstanding_items`      TEXT,
  `warranty_notes`         TEXT,
  `warranty_expiry_date`   DATE       DEFAULT NULL,
  `client_signed_off`      TINYINT(1) NOT NULL DEFAULT 0,
  `client_signed_off_at`   DATETIME   DEFAULT NULL,
  `firm_signed_off`        TINYINT(1) NOT NULL DEFAULT 0,
  `firm_signed_off_by`     CHAR(36)   DEFAULT NULL,
  `firm_signed_off_at`     DATETIME   DEFAULT NULL,
  `planned_vs_actual_notes` TEXT,
  `created_at`             DATETIME   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`             DATETIME   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_handovers_project` (`project_id`),
  CONSTRAINT `fk_handovers_project`     FOREIGN KEY (`project_id`)       REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_handovers_signed_by`   FOREIGN KEY (`firm_signed_off_by`) REFERENCES `users`  (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Post-handover warranty claims
CREATE TABLE IF NOT EXISTS `warranty_claims` (
  `id`             CHAR(36)                                     NOT NULL,
  `project_id`     CHAR(36)                                     NOT NULL,
  `handover_id`    CHAR(36)                                     NOT NULL,
  `reported_by`    CHAR(36)                                     DEFAULT NULL COMMENT 'user who logged it',
  `client_id`      CHAR(36)                                     DEFAULT NULL,
  `description`    TEXT                                         NOT NULL,
  `category`       VARCHAR(100)                                 DEFAULT NULL COMMENT 'civil, electrical, plumbing, paint…',
  `status`         ENUM('open','scheduled','resolved','rejected') NOT NULL DEFAULT 'open',
  `resolution`     TEXT,
  `visit_date`     DATE                                         DEFAULT NULL,
  `resolved_at`    DATETIME                                     DEFAULT NULL,
  `created_at`     DATETIME                                     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     DATETIME                                     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_wc_project`  (`project_id`),
  KEY `idx_wc_handover` (`handover_id`),
  CONSTRAINT `fk_wc_project`     FOREIGN KEY (`project_id`)  REFERENCES `projects`  (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_wc_handover`    FOREIGN KEY (`handover_id`) REFERENCES `handovers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_wc_reported_by` FOREIGN KEY (`reported_by`) REFERENCES `users`    (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SECTION 17: ACTIVITY AUDIT LOG
-- ============================================================

CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id`                CHAR(36)                                                                          NOT NULL,
  `actor_type`        ENUM('user','client','system')                                                    NOT NULL DEFAULT 'user',
  `actor_id`          CHAR(36)                                                                          DEFAULT NULL,
  `actor_name`        VARCHAR(100)                                                                      DEFAULT NULL COMMENT 'Snapshot at time of action',
  `project_id`        CHAR(36)                                                                          DEFAULT NULL,
  `context_tag`       ENUM('auth','user','project','inventory','boq','vendor','client','site','task','drawing','cost_estimate','payment','handover','quality','reki','rbac') NOT NULL,
  `sub_context`       VARCHAR(100)                                                                      DEFAULT NULL,
  `action`            ENUM('create','update','delete','view','login','logout','assign','approve','reject','download','upload','comment','status_change') NOT NULL,
  `title`             VARCHAR(255)                                                                      NOT NULL,
  `description`       TEXT,
  `reference_id`      CHAR(36)                                                                          DEFAULT NULL,
  `reference_type`    VARCHAR(100)                                                                      DEFAULT NULL,
  `old_values`        JSON                                                                              DEFAULT NULL,
  `new_values`        JSON                                                                              DEFAULT NULL,
  `ip_address`        VARCHAR(45)                                                                       DEFAULT NULL,
  `user_agent`        TEXT,
  `severity`          ENUM('info','warning','error','critical')                                          NOT NULL DEFAULT 'info',
  `is_system`         TINYINT(1)                                                                        NOT NULL DEFAULT 0,
  `created_at`        DATETIME                                                                          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_al_actor`     (`actor_type`, `actor_id`),
  KEY `idx_al_project`   (`project_id`),
  KEY `idx_al_context`   (`context_tag`, `action`),
  KEY `idx_al_reference` (`reference_id`),
  KEY `idx_al_created`   (`created_at`),
  KEY `idx_al_severity`  (`severity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Insert-only table. Never UPDATE or DELETE rows.';

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- END OF SCHEMA
-- ============================================================