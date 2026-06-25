
CREATE TABLE IF NOT EXISTS `execution_drawing_sets` (
  `id`                   char(36)     NOT NULL,
  `project_id`           char(36)     NOT NULL,
  `drawing_category`     enum('Technical','Construction','Working') NOT NULL,
  `drawing_discipline`   enum('Electrical','Plumbing','Structural','Working','Other') NOT NULL,
  `area_floor_reference` varchar(100) DEFAULT NULL,
  `stage_id`             char(36)     DEFAULT NULL COMMENT 'optional link to execution_stages.id',
  `created_at`           datetime     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`           datetime     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_execution_set_discipline_area` (`project_id`,`drawing_discipline`,`area_floor_reference`),
  KEY `idx_execution_drawing_sets_project` (`project_id`),
  KEY `idx_execution_drawing_sets_stage` (`stage_id`),
  CONSTRAINT `fk_execution_set_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_execution_set_stage`   FOREIGN KEY (`stage_id`)   REFERENCES `execution_stages` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS `execution_drawing_versions` (
  `id`             char(36)  NOT NULL,
  `drawing_set_id` char(36)  NOT NULL,
  `version_number` int(11)   NOT NULL,
  `file_url`       text      NOT NULL,
  `description`    text,
  `uploaded_by`    char(36)  NOT NULL,
  `uploaded_at`    datetime  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_latest`      tinyint(1) NOT NULL DEFAULT '1',
  `latest_lock` char(36) GENERATED ALWAYS AS
                 (IF(`is_latest` = 1, `drawing_set_id`, NULL)) STORED
                 COMMENT 'non-null only when is_latest=1; unique index below enforces one-latest-per-set',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_execution_version_set_number` (`drawing_set_id`,`version_number`),
  UNIQUE KEY `uk_execution_one_latest_version` (`latest_lock`),
  KEY `idx_execution_versions_set` (`drawing_set_id`),
  KEY `idx_execution_versions_uploaded_by` (`uploaded_by`),
  CONSTRAINT `fk_execution_version_set`  FOREIGN KEY (`drawing_set_id`) REFERENCES `execution_drawing_sets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_execution_version_user` FOREIGN KEY (`uploaded_by`)    REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `execution_drawing_approvals` (
  `id`               char(36)  NOT NULL,
  `version_id`       char(36)  NOT NULL,
  `reviewed_by`      char(36)  NOT NULL,
  `approval_status`  enum('Approved','Revision_Requested','Rejected') NOT NULL,
  `comments`         text,
  `revision_request` text,
  `reviewed_at`      datetime  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_execution_approvals_version` (`version_id`),
  KEY `idx_execution_approvals_reviewed_by` (`reviewed_by`),
  CONSTRAINT `fk_execution_approval_version` FOREIGN KEY (`version_id`)  REFERENCES `execution_drawing_versions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_execution_approval_client`  FOREIGN KEY (`reviewed_by`) REFERENCES `clients` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



ALTER TABLE `team_tasks`
  ADD COLUMN `execution_stage_id`           char(36) DEFAULT NULL AFTER `module`,
  ADD COLUMN `execution_activity_id`        char(36) DEFAULT NULL AFTER `execution_stage_id`,
  ADD COLUMN `execution_drawing_set_id`     char(36) DEFAULT NULL AFTER `execution_activity_id`,
  ADD COLUMN `execution_drawing_version_id` char(36) DEFAULT NULL AFTER `execution_drawing_set_id`;

-- C2. Indexes for the new columns
ALTER TABLE `team_tasks`
  ADD KEY `idx_team_tasks_execution_stage`           (`execution_stage_id`),
  ADD KEY `idx_team_tasks_execution_activity`        (`execution_activity_id`),
  ADD KEY `idx_team_tasks_execution_drawing_set`     (`execution_drawing_set_id`),
  ADD KEY `idx_team_tasks_execution_drawing_version` (`execution_drawing_version_id`);


ALTER TABLE `team_tasks`
  ADD CONSTRAINT `fk_team_tasks_execution_stage`
    FOREIGN KEY (`execution_stage_id`) REFERENCES `execution_stages` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_team_tasks_execution_activity`
    FOREIGN KEY (`execution_activity_id`) REFERENCES `execution_activities` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_team_tasks_execution_drawing_set`
    FOREIGN KEY (`execution_drawing_set_id`) REFERENCES `execution_drawing_sets` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_team_tasks_execution_drawing_version`
    FOREIGN KEY (`execution_drawing_version_id`) REFERENCES `execution_drawing_versions` (`id`) ON DELETE SET NULL;

ALTER TABLE `team_tasks`
  MODIFY COLUMN `task_type` enum(
    'General',
    'Design upload',
    'Revision response',
    'Site visit',
    'Vendor follow-up',
    'Inventory dispatch',
    'Quality check',
    'Client response',
    'Internal documentation',
    'Execution Drawing Upload',
    'Execution Drawing Revision'
  ) NOT NULL DEFAULT 'General';


CREATE TABLE IF NOT EXISTS `project_stages` (
  `id`           char(36)     NOT NULL,
  `code`         varchar(50)  NOT NULL COMMENT 'matches projects.status enum value exactly',
  `name`         varchar(100) NOT NULL,
  `module_group` varchar(50)  DEFAULT NULL COMMENT 'Pre-Construction / Execution / Closure / Exception',
  `description`  text,
  `sort_order`   int(11)      NOT NULL DEFAULT '0',
  `is_terminal`  tinyint(1)   NOT NULL DEFAULT '0' COMMENT '1 = project lifecycle ends here',
  `is_active`    tinyint(1)   NOT NULL DEFAULT '1',
  `created_at`   datetime     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   datetime     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_project_stages_code` (`code`),
  KEY `idx_project_stages_sort` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO `project_stages`
  (`id`, `code`, `name`, `module_group`, `description`, `sort_order`, `is_terminal`)
VALUES
  (UUID(), 'brief',            'Brief',             'Pre-Construction', 'Initial client brief and requirements capture', 10, 0),
  (UUID(), 'pitch',            'Pitch',             'Pre-Construction', 'Design pitch / mood board presented to client', 20, 0),
  (UUID(), 'reki_pending',     'Reki Pending',       'Pre-Construction', 'Site visit (reki) scheduled but not yet done', 30, 0),
  (UUID(), 'reki_done',        'Reki Done',          'Pre-Construction', 'Site visit completed, report filed', 40, 0),
  (UUID(), 'scope_done',       'Scope Finalized',    'Pre-Construction', 'Scope of work finalized', 50, 0),
  (UUID(), 'boq_done',         'BOQ Finalized',      'Pre-Construction', 'Bill of quantities finalized and approved', 60, 0),
  (UUID(), 'design',           'Design',             'Pre-Construction', 'Detailed design / drawings in progress', 70, 0),
  (UUID(), 'execution',        'Execution',          'Execution',        'Construction execution in progress', 80, 0),
  (UUID(), 'vendor_selection', 'Vendor Selection',   'Execution',        'Vendors being selected/onboarded for execution', 90, 0),
  (UUID(), 'inventory',        'Inventory',          'Execution',        'Material procurement and inventory dispatch active', 100, 0),
  (UUID(), 'quality',          'Quality Check',      'Execution',        'Quality checks and progress verification active', 110, 0),
  (UUID(), 'handover',         'Handover',           'Closure',          'Handover documentation and sign-off in progress', 120, 0),
  (UUID(), 'completed',        'Completed',          'Closure',          'Project fully handed over and closed', 130, 1),
  (UUID(), 'cancelled',        'Cancelled',          'Exception',        'Project cancelled before completion', 140, 1),
  (UUID(), 'on_hold',          'On Hold',            'Exception',        'Project temporarily paused', 150, 0);



CREATE TABLE IF NOT EXISTS `project_stage_history` (
  `id`           char(36) NOT NULL,
  `project_id`   char(36) NOT NULL,
  `stage_id`     char(36) NOT NULL,
  `status`       enum('in_progress','completed','skipped') NOT NULL DEFAULT 'in_progress',
  `started_at`   datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `completed_at` datetime DEFAULT NULL,
  `changed_by`   char(36) DEFAULT NULL,
  `remarks`      text,
  `created_at`   datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_project_stage_history_project` (`project_id`,`started_at`),
  KEY `idx_project_stage_history_stage` (`stage_id`),
  KEY `idx_project_stage_history_status` (`project_id`,`status`),
  CONSTRAINT `fk_psh_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_psh_stage`   FOREIGN KEY (`stage_id`)   REFERENCES `project_stages` (`id`),
  CONSTRAINT `fk_psh_user`    FOREIGN KEY (`changed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



ALTER TABLE `projects`
  ADD COLUMN `current_stage_id` char(36) DEFAULT NULL AFTER `status`;

ALTER TABLE `projects`
  ADD KEY `idx_projects_current_stage` (`current_stage_id`);

ALTER TABLE `projects`
  ADD CONSTRAINT `fk_projects_current_stage`
    FOREIGN KEY (`current_stage_id`) REFERENCES `project_stages` (`id`);


ALTER TABLE `projects`
  MODIFY COLUMN `current_stage` varchar(50) DEFAULT NULL
    COMMENT 'DEPRECATED: superseded by current_stage_id. Kept for backward compatibility; safe to drop after app cutover.';

ALTER TABLE `daily_progress_reports`
  ADD COLUMN `execution_stage_id` char(36) DEFAULT NULL AFTER `current_stage`;
ALTER TABLE `daily_progress_reports`
  ADD KEY `idx_dpr_execution_stage` (`execution_stage_id`);
ALTER TABLE `daily_progress_reports`
  ADD CONSTRAINT `fk_dpr_execution_stage`
    FOREIGN KEY (`execution_stage_id`) REFERENCES `execution_stages` (`id`) ON DELETE SET NULL;

ALTER TABLE `quality_checks`
  ADD COLUMN `execution_stage_id` char(36) DEFAULT NULL AFTER `stage_name`;
ALTER TABLE `quality_checks`
  ADD KEY `idx_quality_checks_execution_stage` (`execution_stage_id`);
ALTER TABLE `quality_checks`
  ADD CONSTRAINT `fk_quality_checks_execution_stage`
    FOREIGN KEY (`execution_stage_id`) REFERENCES `execution_stages` (`id`) ON DELETE SET NULL;

ALTER TABLE `team_tasks`
  ADD COLUMN `project_stage_id` char(36) DEFAULT NULL AFTER `execution_drawing_version_id`;
ALTER TABLE `team_tasks`
  ADD KEY `idx_team_tasks_project_stage` (`project_stage_id`);
ALTER TABLE `team_tasks`
  ADD CONSTRAINT `fk_team_tasks_project_stage`
    FOREIGN KEY (`project_stage_id`) REFERENCES `project_stages` (`id`) ON DELETE SET NULL;



UPDATE `projects` p
JOIN `project_stages` ps ON ps.`code` = p.`status`
SET p.`current_stage_id` = ps.`id`
WHERE p.`current_stage_id` IS NULL;

INSERT INTO `project_stage_history` (`id`, `project_id`, `stage_id`, `status`, `started_at`, `created_at`)
SELECT UUID(), p.`id`, ps.`id`, 'in_progress', COALESCE(p.`updated_at`, NOW()), NOW()
FROM `projects` p
JOIN `project_stages` ps ON ps.`id` = p.`current_stage_id`
WHERE NOT EXISTS (
  SELECT 1 FROM `project_stage_history` h WHERE h.`project_id` = p.`id`
);


