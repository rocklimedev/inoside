-- --------------------------------------------------------
-- Host:                         116.206.104.225
-- Server version:               5.7.23-23 - Percona Server (GPL), Release 23, Revision 500fcf5
-- Server OS:                    Linux
-- HeidiSQL Version:             12.11.0.7065
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for spsyn8lm_construction_db
CREATE DATABASE IF NOT EXISTS `spsyn8lm_construction_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `spsyn8lm_construction_db`;

-- Dumping structure for table spsyn8lm_construction_db.boqs
CREATE TABLE IF NOT EXISTS `boqs` (
  `id` char(36) NOT NULL,
  `project_id` char(36) NOT NULL,
  `boq_category_id` char(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `code` varchar(100) DEFAULT NULL,
  `revision_no` varchar(50) DEFAULT 'Rev-01',
  `status` enum('draft','submitted','approved','rejected','revised') DEFAULT 'draft',
  `notes` text,
  `subtotal` decimal(16,2) DEFAULT '0.00',
  `tax_amount` decimal(16,2) DEFAULT '0.00',
  `grand_total` decimal(16,2) DEFAULT '0.00',
  `prepared_by` char(36) DEFAULT NULL,
  `approved_by` char(36) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_boqs_project` (`project_id`),
  KEY `fk_boq_category` (`boq_category_id`),
  KEY `fk_boq_prepared_by` (`prepared_by`),
  KEY `fk_boq_approved_by` (`approved_by`),
  CONSTRAINT `fk_boq_approved_by` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_boq_category` FOREIGN KEY (`boq_category_id`) REFERENCES `boq_categories` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_boq_prepared_by` FOREIGN KEY (`prepared_by`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_boq_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.boq_categories
CREATE TABLE IF NOT EXISTS `boq_categories` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(100) DEFAULT NULL,
  `description` text,
  `sort_order` int(11) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_boq_category_code` (`code`) USING BTREE,
  KEY `idx_boq_categories_name` (`name`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.boq_items
CREATE TABLE IF NOT EXISTS `boq_items` (
  `id` char(36) NOT NULL,
  `boq_id` char(36) NOT NULL,
  `section_id` char(36) NOT NULL,
  `subheading_id` char(36) DEFAULT NULL,
  `inventory_item_id` char(36) DEFAULT NULL,
  `unit_id` char(36) DEFAULT NULL,
  `sno` varchar(50) DEFAULT NULL,
  `item_code` varchar(100) DEFAULT NULL,
  `item_name` text NOT NULL,
  `description` text,
  `specification` text,
  `brand` varchar(255) DEFAULT NULL,
  `qty` decimal(14,3) DEFAULT '0.000',
  `rate` decimal(14,2) DEFAULT '0.00',
  `wastage_percent` decimal(5,2) DEFAULT '0.00',
  `discount_percent` decimal(5,2) DEFAULT '0.00',
  `tax_percent` decimal(5,2) DEFAULT '0.00',
  `base_amount` decimal(16,2) GENERATED ALWAYS AS ((`qty` * `rate`)) STORED,
  `tax_amount` decimal(16,2) GENERATED ALWAYS AS ((((`qty` * `rate`) * `tax_percent`) / 100)) STORED,
  `final_amount` decimal(16,2) GENERATED ALWAYS AS (((`qty` * `rate`) + (((`qty` * `rate`) * `tax_percent`) / 100))) STORED,
  `remarks` text,
  `sort_order` int(11) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_boq_items_boq` (`boq_id`),
  KEY `fk_boq_items_section` (`section_id`),
  KEY `fk_boq_items_unit` (`unit_id`),
  KEY `idx_boq_items_subheading` (`subheading_id`) USING BTREE,
  KEY `idx_boq_items_inventory` (`inventory_item_id`) USING BTREE,
  CONSTRAINT `fk_boq_items_boq` FOREIGN KEY (`boq_id`) REFERENCES `boqs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_boq_items_inventory` FOREIGN KEY (`inventory_item_id`) REFERENCES `inventory_master` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_boq_items_section` FOREIGN KEY (`section_id`) REFERENCES `boq_sections` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_boq_items_subheading` FOREIGN KEY (`subheading_id`) REFERENCES `boq_subheadings` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_boq_items_unit` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.boq_sections
CREATE TABLE IF NOT EXISTS `boq_sections` (
  `id` char(36) NOT NULL,
  `boq_id` char(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `sort_order` int(11) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_boq_sections_boq` (`boq_id`),
  CONSTRAINT `fk_boq_sections_boq` FOREIGN KEY (`boq_id`) REFERENCES `boqs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.boq_subheadings
CREATE TABLE IF NOT EXISTS `boq_subheadings` (
  `id` char(36) NOT NULL,
  `boq_id` char(36) NOT NULL,
  `section_id` char(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `sort_order` int(11) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_boq_subheadings_boq` (`boq_id`),
  KEY `idx_boq_subheadings_section` (`section_id`),
  CONSTRAINT `fk_boq_subheadings_boq` FOREIGN KEY (`boq_id`) REFERENCES `boqs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_boq_subheadings_section` FOREIGN KEY (`section_id`) REFERENCES `boq_sections` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.clients
CREATE TABLE IF NOT EXISTS `clients` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `contact_number` varchar(50) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `preferred_communication` enum('Call','WhatsApp','Email') DEFAULT NULL,
  `is_owner` tinyint(1) DEFAULT '1',
  `representative_involved` tinyint(1) DEFAULT '0',
  `representative_comment` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.daily_progress_reports
CREATE TABLE IF NOT EXISTS `daily_progress_reports` (
  `id` char(36) NOT NULL,
  `project_id` char(36) NOT NULL,
  `report_date` date NOT NULL,
  `supervisor_id` char(36) DEFAULT NULL,
  `current_stage` varchar(100) DEFAULT NULL,
  `work_executed` text,
  `manpower_count` int(11) DEFAULT NULL,
  `materials_used` text,
  `issues_faced` text,
  `progress_photos` json DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  KEY `supervisor_id` (`supervisor_id`),
  CONSTRAINT `daily_progress_reports_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `daily_progress_reports_ibfk_2` FOREIGN KEY (`supervisor_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.drawing_approval_logs
CREATE TABLE IF NOT EXISTS `drawing_approval_logs` (
  `id` char(36) NOT NULL,
  `drawing_id` char(36) NOT NULL,
  `client_id` char(36) DEFAULT NULL,
  `approved` tinyint(1) DEFAULT NULL,
  `remarks` text,
  `revision_requested` tinyint(1) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `drawing_id` (`drawing_id`),
  KEY `client_id` (`client_id`),
  CONSTRAINT `drawing_approval_logs_ibfk_1` FOREIGN KEY (`drawing_id`) REFERENCES `project_drawings` (`id`) ON DELETE CASCADE,
  CONSTRAINT `drawing_approval_logs_ibfk_2` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.handovers
CREATE TABLE IF NOT EXISTS `handovers` (
  `id` char(36) NOT NULL,
  `project_id` char(36) NOT NULL,
  `handover_date` datetime DEFAULT NULL,
  `planned_vs_actual_timeline` text,
  `completion_confirmation` tinyint(1) DEFAULT '1',
  `outstanding_items` text,
  `warranty_notes` text,
  `sign_off_client` tinyint(1) DEFAULT '0',
  `sign_off_firm` tinyint(1) DEFAULT '0',
  `handover_pdf_url` varchar(500) DEFAULT NULL,
  `full_drawings_set_url` varchar(500) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `project_id` (`project_id`),
  CONSTRAINT `handovers_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.inventory_dispatches
CREATE TABLE IF NOT EXISTS `inventory_dispatches` (
  `id` char(36) NOT NULL,
  `request_id` char(36) NOT NULL,
  `dispatch_date` datetime DEFAULT NULL,
  `dispatch_quantity` decimal(12,2) DEFAULT NULL,
  `vehicle_challan` varchar(100) DEFAULT NULL,
  `received_quantity` decimal(12,2) DEFAULT NULL,
  `damage_shortage` tinyint(1) DEFAULT NULL,
  `supervisor_confirmation` tinyint(1) DEFAULT NULL,
  `delivery_photo_url` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `request_id` (`request_id`),
  CONSTRAINT `inventory_dispatches_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `inventory_requests` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.inventory_master
CREATE TABLE IF NOT EXISTS `inventory_master` (
  `id` char(36) NOT NULL,
  `item_code` varchar(100) NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `description` text,
  `unit_id` char(36) DEFAULT NULL,
  `default_rate` decimal(14,2) DEFAULT '0.00',
  `brand` varchar(255) DEFAULT NULL,
  `specification` text,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `uk_inventory_item_code` (`item_code`) USING BTREE,
  KEY `idx_inventory_item_name` (`item_name`) USING BTREE,
  KEY `fk_inventory_unit` (`unit_id`) USING BTREE,
  CONSTRAINT `fk_inventory_unit` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.inventory_requests
CREATE TABLE IF NOT EXISTS `inventory_requests` (
  `id` char(36) NOT NULL,
  `project_id` char(36) NOT NULL,
  `material_id` char(36) DEFAULT NULL,
  `quantity_required` decimal(12,2) DEFAULT NULL,
  `required_date` date DEFAULT NULL,
  `vendor_id` char(36) DEFAULT NULL,
  `source_type` enum('Vendor','Warehouse') DEFAULT NULL,
  `status` enum('requested','approved','dispatched','delivered') DEFAULT 'requested',
  `requested_by` char(36) DEFAULT NULL,
  `approved_by` char(36) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `material_id` (`material_id`),
  KEY `vendor_id` (`vendor_id`),
  KEY `requested_by` (`requested_by`),
  KEY `approved_by` (`approved_by`),
  KEY `idx_inventory_project` (`project_id`),
  CONSTRAINT `inventory_requests_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `inventory_requests_ibfk_2` FOREIGN KEY (`material_id`) REFERENCES `materials` (`id`),
  CONSTRAINT `inventory_requests_ibfk_3` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`id`),
  CONSTRAINT `inventory_requests_ibfk_4` FOREIGN KEY (`requested_by`) REFERENCES `users` (`id`),
  CONSTRAINT `inventory_requests_ibfk_5` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.issue_logs
CREATE TABLE IF NOT EXISTS `issue_logs` (
  `id` char(36) NOT NULL,
  `project_id` char(36) NOT NULL,
  `issue_description` text,
  `responsible_party` varchar(100) DEFAULT NULL,
  `target_resolution_date` date DEFAULT NULL,
  `status` enum('Open','Closed') DEFAULT 'Open',
  `before_photo_url` varchar(500) DEFAULT NULL,
  `after_photo_url` varchar(500) DEFAULT NULL,
  `reported_by` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  KEY `reported_by` (`reported_by`),
  CONSTRAINT `issue_logs_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `issue_logs_ibfk_2` FOREIGN KEY (`reported_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.materials
CREATE TABLE IF NOT EXISTS `materials` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.permissions
CREATE TABLE IF NOT EXISTS `permissions` (
  `id` char(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `module` varchar(50) NOT NULL,
  `action` varchar(50) NOT NULL,
  `description` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.pitch_references
CREATE TABLE IF NOT EXISTS `pitch_references` (
  `id` char(36) NOT NULL,
  `project_id` char(36) NOT NULL,
  `reference_type` enum('image','link','portfolio') DEFAULT NULL,
  `url` text,
  `description` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `pitch_references_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.projects
CREATE TABLE IF NOT EXISTS `projects` (
  `id` char(36) NOT NULL,
  `client_id` char(36) NOT NULL,
  `site_id` char(36) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `project_type` enum('New Construction','Renovation','Interior Fit-out') NOT NULL,
  `service_type` enum('Construction','Interior','Renovation') DEFAULT NULL,
  `purpose` enum('Residential','Commercial','Mixed') DEFAULT NULL,
  `number_of_floors` int(11) DEFAULT NULL,
  `approximate_area_sqft` decimal(12,2) DEFAULT NULL,
  `budget_range` varchar(100) DEFAULT NULL,
  `timeline_expectation` enum('Immediate','Flexible','Fixed Date') DEFAULT NULL,
  `design_preference` varchar(50) DEFAULT NULL,
  `status` enum('brief','pitch','reki_pending','reki_done','scope_done','boq_done','design','execution','vendor_selection','inventory','quality','handover','completed') DEFAULT 'brief',
  `current_stage` varchar(50) DEFAULT NULL,
  `progress_percentage` decimal(5,2) DEFAULT '0.00',
  `token_received` tinyint(1) DEFAULT '0',
  `created_by` char(36) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `site_id` (`site_id`),
  KEY `idx_projects_client` (`client_id`),
  KEY `idx_projects_status` (`status`),
  KEY `idx_projects_created_by` (`created_by`),
  CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE,
  CONSTRAINT `projects_ibfk_2` FOREIGN KEY (`site_id`) REFERENCES `sites` (`id`) ON DELETE SET NULL,
  CONSTRAINT `projects_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.project_brief
CREATE TABLE IF NOT EXISTS `project_brief` (
  `id` char(36) NOT NULL,
  `project_id` char(36) NOT NULL,
  `rooms_spaces_required` json DEFAULT NULL,
  `parking_required` tinyint(1) DEFAULT NULL,
  `first_construction_project` tinyint(1) DEFAULT NULL,
  `decision_readiness` varchar(50) DEFAULT NULL,
  `end_to_end_services` tinyint(1) DEFAULT NULL,
  `output_client_profile` json DEFAULT NULL,
  `output_project_profile` json DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `project_id` (`project_id`),
  CONSTRAINT `project_brief_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.project_cost_estimates
CREATE TABLE IF NOT EXISTS `project_cost_estimates` (
  `id` char(36) NOT NULL,
  `project_id` char(36) NOT NULL,
  `estimate_type` enum('Consultation','Turnkey','Constructional') DEFAULT NULL,
  `consultation_fee` decimal(12,2) DEFAULT NULL,
  `tentative_total_cost` decimal(15,2) DEFAULT NULL,
  `material_labour_estimate` json DEFAULT NULL,
  `payment_plan` json DEFAULT NULL,
  `annexure_url` varchar(500) DEFAULT NULL,
  `contract_url` varchar(500) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `project_cost_estimates_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.project_documents
CREATE TABLE IF NOT EXISTS `project_documents` (
  `id` char(36) NOT NULL,
  `project_id` char(36) NOT NULL,
  `module_name` varchar(50) DEFAULT NULL,
  `document_type` varchar(100) DEFAULT NULL,
  `file_url` varchar(500) NOT NULL,
  `version` int(11) DEFAULT '1',
  `uploaded_by` char(36) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  KEY `uploaded_by` (`uploaded_by`),
  CONSTRAINT `project_documents_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `project_documents_ibfk_2` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.project_drawings
CREATE TABLE IF NOT EXISTS `project_drawings` (
  `id` char(36) NOT NULL,
  `project_id` char(36) NOT NULL,
  `drawing_type` enum('Design','Execution','Technical','Construction','Working') DEFAULT NULL,
  `version` int(11) DEFAULT '1',
  `area_floor` varchar(100) DEFAULT NULL,
  `file_url` varchar(500) NOT NULL,
  `uploaded_by` char(36) DEFAULT NULL,
  `uploaded_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `approved` tinyint(1) DEFAULT '0',
  `approval_date` datetime DEFAULT NULL,
  `approved_by` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `uploaded_by` (`uploaded_by`),
  KEY `approved_by` (`approved_by`),
  KEY `idx_drawings_project` (`project_id`),
  CONSTRAINT `project_drawings_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `project_drawings_ibfk_2` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`),
  CONSTRAINT `project_drawings_ibfk_3` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.project_pitch
CREATE TABLE IF NOT EXISTS `project_pitch` (
  `id` char(36) NOT NULL,
  `project_id` char(36) NOT NULL,
  `preferred_design_style` varchar(100) DEFAULT NULL,
  `color_tone` enum('Light','Dark','Mixed','Not Sure') DEFAULT NULL,
  `luxury_level` enum('Low','Medium','High') DEFAULT NULL,
  `functional_vs_aesthetic` text,
  `budget_flexibility` tinyint(1) DEFAULT NULL,
  `priority_areas` json DEFAULT NULL,
  `likes_dislikes` text,
  `non_negotiables` text,
  `special_requirements` text,
  `moodboard_pdf_url` varchar(500) DEFAULT NULL,
  `pitch_pdf_url` varchar(500) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `project_id` (`project_id`),
  CONSTRAINT `project_pitch_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.project_vendors
CREATE TABLE IF NOT EXISTS `project_vendors` (
  `id` char(36) NOT NULL,
  `project_id` char(36) NOT NULL,
  `vendor_id` char(36) DEFAULT NULL,
  `selected` tinyint(1) DEFAULT '0',
  `selection_reason` text,
  `approved_estimate_value` decimal(15,2) DEFAULT NULL,
  `scope_summary` text,
  `final_estimate_url` varchar(500) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  KEY `vendor_id` (`vendor_id`),
  CONSTRAINT `project_vendors_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `project_vendors_ibfk_2` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.quality_checks
CREATE TABLE IF NOT EXISTS `quality_checks` (
  `id` char(36) NOT NULL,
  `project_id` char(36) NOT NULL,
  `stage_name` varchar(100) DEFAULT NULL,
  `quality_met` tinyint(1) DEFAULT NULL,
  `deviations` tinyint(1) DEFAULT NULL,
  `corrective_action_required` tinyint(1) DEFAULT NULL,
  `supervisor_remarks` text,
  `checked_date` date DEFAULT NULL,
  `checked_by` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  KEY `checked_by` (`checked_by`),
  CONSTRAINT `quality_checks_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `quality_checks_ibfk_2` FOREIGN KEY (`checked_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.reki_photos
CREATE TABLE IF NOT EXISTS `reki_photos` (
  `id` char(36) NOT NULL,
  `reki_report_id` char(36) NOT NULL,
  `photo_type` varchar(50) DEFAULT NULL,
  `photo_url` varchar(500) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `reki_report_id` (`reki_report_id`),
  CONSTRAINT `reki_photos_ibfk_1` FOREIGN KEY (`reki_report_id`) REFERENCES `reki_reports` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.reki_reports
CREATE TABLE IF NOT EXISTS `reki_reports` (
  `id` char(36) NOT NULL,
  `project_id` char(36) NOT NULL,
  `supervisor_id` char(36) DEFAULT NULL,
  `visit_date` date NOT NULL,
  `client_present` tinyint(1) DEFAULT NULL,
  `road_access` tinyint(1) DEFAULT NULL,
  `unloading_space` tinyint(1) DEFAULT NULL,
  `area_type` varchar(30) DEFAULT NULL,
  `neighbouring_buildings` tinyint(1) DEFAULT NULL,
  `working_time_restrictions` text,
  `plot_type` varchar(50) DEFAULT NULL,
  `existing_structure` tinyint(1) DEFAULT NULL,
  `construction_type` varchar(50) DEFAULT NULL,
  `existing_floors` int(11) DEFAULT NULL,
  `structural_cracks` tinyint(1) DEFAULT NULL,
  `built_up_area` decimal(12,2) DEFAULT NULL,
  `floor_to_floor_height` decimal(6,2) DEFAULT NULL,
  `slab_thickness` decimal(6,2) DEFAULT NULL,
  `columns_beams_visible` tinyint(1) DEFAULT NULL,
  `wall_condition` varchar(20) DEFAULT NULL,
  `floor_condition` varchar(20) DEFAULT NULL,
  `dampness` tinyint(1) DEFAULT NULL,
  `dampness_location` text,
  `termite_damage` tinyint(1) DEFAULT NULL,
  `electrical_wiring` tinyint(1) DEFAULT NULL,
  `electrical_panel_location` text,
  `plumbing_lines` tinyint(1) DEFAULT NULL,
  `water_inlet_outlet` text,
  `tanks_present` tinyint(1) DEFAULT NULL,
  `demolition_required` tinyint(1) DEFAULT NULL,
  `demolition_type` varchar(20) DEFAULT NULL,
  `safety_concerns` tinyint(1) DEFAULT NULL,
  `load_bearing_changes` varchar(20) DEFAULT NULL,
  `beam_cutting` tinyint(1) DEFAULT NULL,
  `core_drilling` tinyint(1) DEFAULT NULL,
  `structural_consultant_required` tinyint(1) DEFAULT NULL,
  `power_supply` tinyint(1) DEFAULT NULL,
  `water_supply` tinyint(1) DEFAULT NULL,
  `drainage_available` tinyint(1) DEFAULT NULL,
  `fire_safety_norms` tinyint(1) DEFAULT NULL,
  `major_constraints` text,
  `risk_factors` text,
  `suggestions` text,
  `client_instructions` text,
  `reki_pdf_url` varchar(500) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `project_id` (`project_id`),
  KEY `supervisor_id` (`supervisor_id`),
  KEY `idx_reki_project` (`project_id`),
  CONSTRAINT `reki_reports_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reki_reports_ibfk_2` FOREIGN KEY (`supervisor_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.roles
CREATE TABLE IF NOT EXISTS `roles` (
  `id` char(36) NOT NULL,
  `name` varchar(50) NOT NULL,
  `display_name` varchar(100) NOT NULL,
  `description` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.role_permissions
CREATE TABLE IF NOT EXISTS `role_permissions` (
  `id` char(36) NOT NULL,
  `role_id` char(36) NOT NULL,
  `permission_id` char(36) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_role_permission` (`role_id`,`permission_id`),
  KEY `permission_id` (`permission_id`),
  CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.scope_of_work
CREATE TABLE IF NOT EXISTS `scope_of_work` (
  `id` char(36) NOT NULL,
  `project_id` char(36) NOT NULL,
  `scope_summary` text,
  `civil_works` json DEFAULT NULL,
  `mep_works` json DEFAULT NULL,
  `interior_works` json DEFAULT NULL,
  `finishes` json DEFAULT NULL,
  `area_summary` json DEFAULT NULL,
  `scope_pdf_url` varchar(500) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `project_id` (`project_id`),
  CONSTRAINT `scope_of_work_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.sites
CREATE TABLE IF NOT EXISTS `sites` (
  `id` char(36) NOT NULL,
  `address` text NOT NULL,
  `city` varchar(100) NOT NULL,
  `ownership_status` enum('Owned','Rented','Under Process') DEFAULT NULL,
  `access_available` tinyint(1) DEFAULT '1',
  `existing_structure` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.units
CREATE TABLE IF NOT EXISTS `units` (
  `id` char(36) NOT NULL,
  `name` varchar(50) NOT NULL,
  `short_name` varchar(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `short_name` (`short_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` char(36) NOT NULL,
  `role_id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `last_login` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.vendors
CREATE TABLE IF NOT EXISTS `vendors` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `mobile_number` varchar(20) NOT NULL,
  `brand_company_id` char(36) DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `position` varchar(150) DEFAULT NULL,
  `type_of_business` varchar(150) DEFAULT NULL,
  `optional_mobile` varchar(20) DEFAULT NULL,
  `notes` text,
  `area_covered` varchar(255) DEFAULT NULL,
  `is_architect` tinyint(1) DEFAULT '0',
  `is_interior` tinyint(1) DEFAULT '0',
  `is_furniture` tinyint(1) DEFAULT '0',
  `age` int(11) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `reference_name` varchar(255) DEFAULT NULL,
  `reference_mobile` varchar(20) DEFAULT NULL,
  `address` json DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_by` char(36) DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `trade_type` varchar(100) DEFAULT NULL,
  `contact_details` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.vendor_types
CREATE TABLE IF NOT EXISTS `vendor_types` (
  `id` char(36) NOT NULL,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_vendor_type_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.vendor_type_vendor
CREATE TABLE IF NOT EXISTS `vendor_type_vendor` (
  `vendor_id` char(36) NOT NULL,
  `type_id` char(36) NOT NULL,
  PRIMARY KEY (`vendor_id`,`type_id`),
  KEY `fk_vendor_type_vendor_type` (`type_id`),
  CONSTRAINT `fk_vendor_type_vendor_type` FOREIGN KEY (`type_id`) REFERENCES `vendor_types` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_vendor_type_vendor_vendor` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
