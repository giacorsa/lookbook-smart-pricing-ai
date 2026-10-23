
-- =====================================================
-- LookBook Smart Pricing AI
-- Migration: 001_initial_schema.sql
-- =====================================================

BEGIN;

CREATE TABLE evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    category VARCHAR(50) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    condition VARCHAR(20) NOT NULL,

    suggested_price NUMERIC(10,2) NOT NULL,
    price_min NUMERIC(10,2) NOT NULL,
    price_max NUMERIC(10,2) NOT NULL,

    motivation TEXT NOT NULL,
    selling_tips JSONB NOT NULL,

    model_name VARCHAR(100) NOT NULL,
    prompt_version VARCHAR(20) NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_evaluations_condition
        CHECK (condition IN ('nuovo', 'buono', 'usato')),

    CONSTRAINT chk_evaluations_prices
        CHECK (
            price_min >= 0
            AND price_max > price_min
            AND suggested_price BETWEEN price_min AND price_max
        ),

    CONSTRAINT chk_evaluations_tips
        CHECK (
            jsonb_typeof(selling_tips) = 'array'
            AND jsonb_array_length(selling_tips) = 3
        ),

    CONSTRAINT chk_evaluations_brand
        CHECK (length(trim(brand)) > 0),

    CONSTRAINT chk_evaluations_motivation
        CHECK (length(trim(motivation)) > 0)
);

CREATE INDEX idx_evaluations_created_at
    ON evaluations (created_at DESC);

COMMIT;
