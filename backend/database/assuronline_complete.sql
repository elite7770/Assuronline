-- =============================================
-- ASSURONLINE COMPLETE DATABASE - CLEAN VERSION
-- Comprehensive MySQL database with real Moroccan data
-- Import this single file to create everything
-- =============================================

-- Drop existing database if exists and create new one
DROP DATABASE IF EXISTS assuronline;
CREATE DATABASE assuronline CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE assuronline;

-- =============================================
-- USERS TABLE
-- =============================================
CREATE TABLE users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  role ENUM('client','admin','agent') NOT NULL DEFAULT 'client',
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  postal_code VARCHAR(10),
  birth_date DATE,
  driving_license_number VARCHAR(50),
  license_issue_date DATE,
  last_login TIMESTAMP NULL,
  status ENUM('active','suspended','inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email),
  INDEX idx_users_phone (phone),
  INDEX idx_users_role (role),
  INDEX idx_users_status (status)
);

-- =============================================
-- VEHICLE BRANDS TABLE
-- =============================================
CREATE TABLE vehicle_brands (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type ENUM('car','moto') NOT NULL,
  country VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_brand_type (name, type),
  INDEX idx_brands_type (type),
  INDEX idx_brands_country (country)
);

-- =============================================
-- VEHICLE MODELS TABLE
-- =============================================
CREATE TABLE vehicle_models (
  id INT AUTO_INCREMENT PRIMARY KEY,
  brand_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  type ENUM('car','moto') NOT NULL,
  average_value DECIMAL(10,2),
  min_year SMALLINT,
  max_year SMALLINT,
  fuel_types JSON,
  engine_sizes JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (brand_id) REFERENCES vehicle_brands(id) ON DELETE CASCADE,
  UNIQUE KEY unique_brand_model (brand_id, name),
  INDEX idx_models_brand (brand_id),
  INDEX idx_models_type (type),
  INDEX idx_models_value (average_value)
);

-- =============================================
-- VEHICLES TABLE
-- =============================================
CREATE TABLE vehicles (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year SMALLINT NOT NULL,
  color VARCHAR(50),
  license_plate VARCHAR(20) UNIQUE,
  chassis_number VARCHAR(50) UNIQUE,
  engine_number VARCHAR(50),
  purchase_date DATE,
  purchase_price DECIMAL(10,2),
  current_value DECIMAL(10,2),
  vehicle_type ENUM('car','moto') NOT NULL,
  fuel_type ENUM('essence','diesel','hybride','electrique') DEFAULT 'essence',
  engine_size DECIMAL(4,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_vehicles_user (user_id),
  INDEX idx_vehicles_plate (license_plate),
  INDEX idx_vehicles_type (vehicle_type),
  INDEX idx_vehicles_year (year)
);

-- =============================================
-- MOROCCAN CITIES TABLE
-- =============================================
CREATE TABLE moroccan_cities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  risk_factor DECIMAL(3,2) NOT NULL,
  population VARCHAR(20),
  region VARCHAR(100),
  postal_codes JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_cities_risk (risk_factor),
  INDEX idx_cities_region (region)
);

-- =============================================
-- COVERAGE TYPES TABLE
-- =============================================
CREATE TABLE coverage_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type ENUM('car','moto') NOT NULL,
  base_cost DECIMAL(10,2) DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_coverage (name, type),
  INDEX idx_coverage_type (type)
);

-- =============================================
-- QUOTES TABLE
-- =============================================
CREATE TABLE quotes (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  vehicle_id BIGINT UNSIGNED,
  quote_number VARCHAR(50) UNIQUE NOT NULL,
  type ENUM('car','moto') NOT NULL,
  coverage_type ENUM('basique','standard','premium','essentiel','confort','ultimate') NOT NULL,
  coverage_options JSON,
  base_premium DECIMAL(10,2) NOT NULL,
  risk_factors JSON,
  final_premium DECIMAL(10,2) NOT NULL,
  monthly_premium DECIMAL(10,2),
  status ENUM('pending','approved','rejected','expired') DEFAULT 'pending',
  admin_comment TEXT,
  valid_until DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE SET NULL,
  INDEX idx_quotes_user (user_id),
  INDEX idx_quotes_number (quote_number),
  INDEX idx_quotes_status (status),
  INDEX idx_quotes_created (created_at)
);

-- =============================================
-- POLICIES TABLE
-- =============================================
CREATE TABLE policies (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  vehicle_id BIGINT UNSIGNED NOT NULL,
  quote_id BIGINT UNSIGNED,
  policy_number VARCHAR(50) UNIQUE NOT NULL,
  type ENUM('car','moto') NOT NULL,
  coverage_type ENUM('basique','standard','premium','essentiel','confort','ultimate') NOT NULL,
  coverage_details JSON,
  premium_amount DECIMAL(10,2) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status ENUM('active','expired','cancelled','suspended') DEFAULT 'active',
  payment_frequency ENUM('monthly','quarterly','annually') DEFAULT 'annually',
  next_payment_date DATE,
  auto_renewal BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
  FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE SET NULL,
  INDEX idx_policies_user (user_id),
  INDEX idx_policies_number (policy_number),
  INDEX idx_policies_status (status),
  INDEX idx_policies_end_date (end_date)
);

-- =============================================
-- CLAIMS TABLE
-- =============================================
CREATE TABLE claims (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  policy_id BIGINT UNSIGNED NOT NULL,
  claim_number VARCHAR(50) UNIQUE NOT NULL,
  claim_type ENUM('accident','theft','fire','damage','other') NOT NULL,
  incident_date DATE NOT NULL,
  incident_location VARCHAR(255),
  incident_description TEXT NOT NULL,
  estimated_amount DECIMAL(10,2),
  approved_amount DECIMAL(10,2),
  status ENUM('pending','in_review','approved','rejected','settled') DEFAULT 'pending',
  admin_notes TEXT,
  investigation_required BOOLEAN DEFAULT false,
  investigator_assigned VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (policy_id) REFERENCES policies(id) ON DELETE CASCADE,
  INDEX idx_claims_user (user_id),
  INDEX idx_claims_policy (policy_id),
  INDEX idx_claims_number (claim_number),
  INDEX idx_claims_status (status),
  INDEX idx_claims_incident_date (incident_date)
);

-- =============================================
-- PAYMENTS TABLE
-- =============================================
CREATE TABLE payments (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  policy_id BIGINT UNSIGNED,
  amount DECIMAL(10,2) NOT NULL,
  payment_type ENUM('premium','claim_settlement','refund','penalty') NOT NULL,
  payment_method ENUM('card','bank_transfer','cash','check') NOT NULL,
  transaction_id VARCHAR(100) UNIQUE,
  status ENUM('pending','paid','failed','cancelled') DEFAULT 'pending',
  due_date DATE,
  paid_date TIMESTAMP NULL,
  gateway_response JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (policy_id) REFERENCES policies(id) ON DELETE SET NULL,
  INDEX idx_payments_user (user_id),
  INDEX idx_payments_policy (policy_id),
  INDEX idx_payments_status (status),
  INDEX idx_payments_due_date (due_date)
);

-- =============================================
-- INVOICES TABLE
-- =============================================
CREATE TABLE invoices (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  payment_id BIGINT UNSIGNED NOT NULL,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  file_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE,
  INDEX idx_invoices_payment (payment_id),
  INDEX idx_invoices_number (invoice_number)
);

-- =============================================
-- NOTIFICATIONS TABLE
-- =============================================
CREATE TABLE notifications (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('info','success','warning','error') DEFAULT 'info',
  channel ENUM('email','sms','push','in_app') DEFAULT 'in_app',
  read_at TIMESTAMP NULL,
  sent_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_notifications_user (user_id),
  INDEX idx_notifications_type (type),
  INDEX idx_notifications_created (created_at)
);

-- =============================================
-- SYSTEM SETTINGS TABLE
-- =============================================
CREATE TABLE system_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT,
  setting_type ENUM('string','number','boolean','json') DEFAULT 'string',
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- AUDIT LOGS TABLE
-- =============================================
CREATE TABLE audit_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED,
  action VARCHAR(100) NOT NULL,
  table_name VARCHAR(100),
  record_id BIGINT UNSIGNED,
  old_values JSON,
  new_values JSON,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_audit_user (user_id),
  INDEX idx_audit_action (action),
  INDEX idx_audit_table (table_name),
  INDEX idx_audit_created (created_at)
);

-- =============================================
-- FILE STORAGE TABLE
-- =============================================
CREATE TABLE file_storage (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED,
  file_name VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size BIGINT UNSIGNED,
  mime_type VARCHAR(100),
  file_type ENUM('document','image','pdf','other') DEFAULT 'document',
  related_table VARCHAR(100),
  related_id BIGINT UNSIGNED,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_files_user (user_id),
  INDEX idx_files_type (file_type),
  INDEX idx_files_related (related_table, related_id)
);

-- =============================================
-- USER SETTINGS TABLE
-- =============================================
CREATE TABLE user_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  theme ENUM('light', 'dark', 'auto') DEFAULT 'auto',
  font_size ENUM('small', 'medium', 'large') DEFAULT 'medium',
  compact_mode BOOLEAN DEFAULT FALSE,
  email_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  sms_notifications BOOLEAN DEFAULT FALSE,
  marketing_emails BOOLEAN DEFAULT FALSE,
  profile_visibility ENUM('public', 'private', 'friends') DEFAULT 'private',
  data_sharing BOOLEAN DEFAULT FALSE,
  analytics_enabled BOOLEAN DEFAULT TRUE,
  language VARCHAR(5) DEFAULT 'fr',
  timezone VARCHAR(50) DEFAULT 'Africa/Casablanca',
  currency VARCHAR(3) DEFAULT 'MAD',
  date_format VARCHAR(10) DEFAULT 'DD/MM/YYYY',
  high_contrast BOOLEAN DEFAULT FALSE,
  reduced_motion BOOLEAN DEFAULT FALSE,
  screen_reader BOOLEAN DEFAULT FALSE,
  sound_enabled BOOLEAN DEFAULT TRUE,
  volume INT DEFAULT 70 CHECK (volume >= 0 AND volume <= 100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_settings (user_id),
  INDEX idx_user_settings_user_id (user_id),
  INDEX idx_user_settings_theme (theme),
  INDEX idx_user_settings_language (language)
);

-- Continue with data insertion in next part...
