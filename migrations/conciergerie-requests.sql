ALTER TABLE IF EXISTS conciergerie_requests DROP CONSTRAINT IF EXISTS conciergerie_requests_pkey;
CREATE TABLE IF NOT EXISTS conciergerie_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  besoin TEXT NOT NULL,
  budget VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE conciergerie_requests (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), nom VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, besoin TEXT NOT NULL, budget VARCHAR(100), created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP);
