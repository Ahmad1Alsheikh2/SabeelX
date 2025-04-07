-- First, drop the foreign key constraints that depend on mentees_pkey
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'bookings_mentee_id_fkey') THEN
        ALTER TABLE bookings DROP CONSTRAINT bookings_mentee_id_fkey;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'reviews_mentee_id_fkey') THEN
        ALTER TABLE reviews DROP CONSTRAINT reviews_mentee_id_fkey;
    END IF;
END $$;

-- Drop existing constraints if they exist
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mentees_email_key') THEN
        ALTER TABLE mentees DROP CONSTRAINT mentees_email_key;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mentees_pkey') THEN
        ALTER TABLE mentees DROP CONSTRAINT mentees_pkey;
    END IF;
END $$;

-- Update mentees table schema
ALTER TABLE mentees
ADD COLUMN IF NOT EXISTS email TEXT NOT NULL,
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'MENTEE',
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS is_profile_complete BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add constraints
ALTER TABLE mentees
ADD CONSTRAINT mentees_email_key UNIQUE (email),
ADD CONSTRAINT mentees_pkey PRIMARY KEY (id);

-- Recreate the foreign key constraints
ALTER TABLE bookings
ADD CONSTRAINT bookings_mentee_id_fkey 
FOREIGN KEY (mentee_id) 
REFERENCES mentees(id) 
ON DELETE CASCADE;

ALTER TABLE reviews
ADD CONSTRAINT reviews_mentee_id_fkey 
FOREIGN KEY (mentee_id) 
REFERENCES mentees(id) 
ON DELETE CASCADE;

-- Enable RLS
ALTER TABLE mentees ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can read their own mentee profile"
ON mentees FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own mentee profile"
ON mentees FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own mentee profile"
ON mentees FOR UPDATE
USING (auth.uid() = id);

-- Allow public read access to mentee profiles
CREATE POLICY "Public can read mentee profiles"
ON mentees FOR SELECT
USING (true); 