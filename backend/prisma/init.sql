-- Set the default schema to public
ALTER SCHEMA public OWNER TO postgres;

-- Grant all privileges on the public schema to the postgres user
GRANT ALL PRIVILEGES ON SCHEMA public TO postgres;

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------
-- Users table
-- ----------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------
-- Tours table
-- ----------------------------
CREATE TABLE IF NOT EXISTS tours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    location VARCHAR(255) NOT NULL,
    image_url TEXT,
    duration INT NOT NULL,
    max_capacity INT NOT NULL,
    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------
-- Reservations table
-- ----------------------------
CREATE TABLE IF NOT EXISTS reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tour_id UUID NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    guests INT NOT NULL,
    total_price NUMERIC(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
