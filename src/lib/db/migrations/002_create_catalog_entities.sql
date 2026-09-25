-- Migration: 002_create_catalog_entities.sql
-- Description: Create brands, product_categories, and products tables with BaseEntity audit columns and foreign key relations

-- 1. BRANDS TABLE
CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL,
  created_by UUID NULL,
  updated_by UUID NULL,
  deleted_by UUID NULL,

  CONSTRAINT uq_brands_code UNIQUE (code)
);

CREATE INDEX IF NOT EXISTS idx_brands_active ON brands (id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_brands_code_active ON brands (code) WHERE deleted_at IS NULL;

DROP TRIGGER IF EXISTS set_brands_updated_at ON brands;
CREATE TRIGGER set_brands_updated_at
  BEFORE UPDATE ON brands
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_updated_at();

-- 2. PRODUCT CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL,
  created_by UUID NULL,
  updated_by UUID NULL,
  deleted_by UUID NULL,

  CONSTRAINT uq_product_categories_brand_code UNIQUE (brand_id, code)
);

CREATE INDEX IF NOT EXISTS idx_product_categories_active ON product_categories (id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_product_categories_brand_id_active ON product_categories (brand_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_product_categories_code_active ON product_categories (code) WHERE deleted_at IS NULL;

DROP TRIGGER IF EXISTS set_product_categories_updated_at ON product_categories;
CREATE TRIGGER set_product_categories_updated_at
  BEFORE UPDATE ON product_categories
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_updated_at();

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES product_categories(id) ON DELETE RESTRICT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL,
  created_by UUID NULL,
  updated_by UUID NULL,
  deleted_by UUID NULL,

  CONSTRAINT uq_products_category_code UNIQUE (category_id, code)
);

CREATE INDEX IF NOT EXISTS idx_products_active ON products (id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_products_category_id_active ON products (category_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_products_code_active ON products (code) WHERE deleted_at IS NULL;

DROP TRIGGER IF EXISTS set_products_updated_at ON products;
CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_updated_at();
