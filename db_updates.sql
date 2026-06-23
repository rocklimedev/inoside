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
