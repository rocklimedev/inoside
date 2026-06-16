
-- Dumping structure for table spsyn8lm_construction_db.inventory_categories
CREATE TABLE IF NOT EXISTS `inventory_categories` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` int(11) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_category_name` (`name`),
  KEY `idx_category_parent` (`parent_id`),
  CONSTRAINT `fk_category_parent` FOREIGN KEY (`parent_id`) REFERENCES `inventory_categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.inventory_dispatches
CREATE TABLE IF NOT EXISTS `inventory_dispatches` (
  `id` char(36) NOT NULL,
  `request_id` char(36) NOT NULL,
  `dispatch_date` datetime DEFAULT NULL,
  `dispatch_quantity` decimal(12,3) NOT NULL,
  `vehicle_challan` varchar(100) DEFAULT NULL,
  `driver_name` varchar(100) DEFAULT NULL,
  `received_quantity` decimal(12,2) DEFAULT NULL,
  `damage_shortage` tinyint(1) DEFAULT '0',
  `shortage_quantity` decimal(12,3) DEFAULT NULL,
  `supervisor_confirmation` tinyint(1) DEFAULT '0',
  `delivery_photo_url` varchar(500) DEFAULT NULL,
  `remarks` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_dispatch_request` (`request_id`),
  CONSTRAINT `inventory_dispatches_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `inventory_requests` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.inventory_master
CREATE TABLE IF NOT EXISTS `inventory_master` (
  `id` char(36) NOT NULL,
  `item_code` varchar(100) NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `category_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text,
  `unit_id` char(36) DEFAULT NULL,
  `default_rate` decimal(14,2) DEFAULT '0.00',
  `gst_percent` decimal(5,2) DEFAULT '18.00',
  `hsn_code` varchar(20) DEFAULT NULL,
  `min_stock_level` decimal(12,3) DEFAULT '0.000',
  `specification` text,
  `is_active` tinyint(1) DEFAULT '1',
  `is_serialized` tinyint(1) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` char(36) DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `brand_id` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `uk_inventory_item_code` (`item_code`) USING BTREE,
  KEY `idx_inventory_item_name` (`item_name`) USING BTREE,
  KEY `fk_inventory_unit` (`unit_id`) USING BTREE,
  KEY `idx_inventory_brand_id` (`brand_id`),
  KEY `idx_master_category` (`category_id`),
  CONSTRAINT `fk_inventory_brand` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_inventory_unit` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_master_category` FOREIGN KEY (`category_id`) REFERENCES `inventory_categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table spsyn8lm_construction_db.inventory_requests
CREATE TABLE IF NOT EXISTS `inventory_requests` (
  `id` char(36) NOT NULL,
  `project_id` char(36) NOT NULL,
  `project_material_id` char(36) NOT NULL,
  `quantity_required` decimal(12,2) DEFAULT NULL,
  `required_date` date DEFAULT NULL,
  `vendor_id` char(36) DEFAULT NULL,
  `source_type` enum('Vendor','Warehouse','Site Stock') DEFAULT 'Vendor',
  `status` enum('requested','approved','dispatched','delivered','rejected','cancelled') DEFAULT 'requested',
  `remarks` text,
  `requested_by` char(36) DEFAULT NULL,
  `approved_by` char(36) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `requested_by` (`requested_by`),
  KEY `approved_by` (`approved_by`),
  KEY `idx_inventory_project` (`project_id`),
  KEY `idx_req_project` (`project_id`),
  KEY `idx_req_project_material` (`project_material_id`),
  KEY `idx_req_vendor` (`vendor_id`),
  KEY `idx_req_status` (`status`),
  CONSTRAINT `fk_req_project_material` FOREIGN KEY (`project_material_id`) REFERENCES `project_materials` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_req_vendor` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`id`) ON DELETE SET NULL,
  CONSTRAINT `inventory_requests_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `inventory_requests_ibfk_4` FOREIGN KEY (`requested_by`) REFERENCES `users` (`id`),
  CONSTRAINT `inventory_requests_ibfk_5` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS `project_materials` (
  `id` char(36) NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `project_id` char(36) NOT NULL,
  `inventory_master_id` char(36) DEFAULT NULL,
  `item_code` varchar(100) DEFAULT NULL,
  `description` text,
  `specification` text,
  `unit_id` char(36) DEFAULT NULL,
  `brand_id` char(36) DEFAULT NULL,
  `quantity_estimated` decimal(14,3) DEFAULT '0.000',
  `quantity_required` decimal(14,3) DEFAULT '0.000',
  `quantity_received` decimal(14,3) DEFAULT '0.000',
  `quantity_used` decimal(14,3) DEFAULT '0.000',
  `rate` decimal(14,2) DEFAULT NULL,
  `gst_percent` decimal(5,2) DEFAULT '18.00',
  `status` enum('planned','ordered','received','in_use','closed') DEFAULT 'planned',
  `remarks` text,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_pm_unit` (`unit_id`),
  KEY `fk_pm_brand` (`brand_id`),
  KEY `idx_pm_project` (`project_id`),
  KEY `idx_pm_master` (`inventory_master_id`),
  KEY `idx_pm_status` (`status`),
  CONSTRAINT `fk_pm_brand` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_pm_master` FOREIGN KEY (`inventory_master_id`) REFERENCES `inventory_master` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_pm_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pm_unit` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
