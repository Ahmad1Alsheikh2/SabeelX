-- First, drop the foreign key constraints that depend on mentors_pkey
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'availability_slots_mentor_id_fkey') THEN
        ALTER TABLE availability_slots DROP CONSTRAINT availability_slots_mentor_id_fkey;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'bookings_mentor_id_fkey') THEN
        ALTER TABLE bookings DROP CONSTRAINT bookings_mentor_id_fkey;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'reviews_mentor_id_fkey') THEN
        ALTER TABLE reviews DROP CONSTRAINT reviews_mentor_id_fkey;
    END IF;
END $$;

-- Drop existing constraints if they exist
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mentors_email_key') THEN
        ALTER TABLE mentors DROP CONSTRAINT mentors_email_key;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mentors_pkey') THEN
        ALTER TABLE mentors DROP CONSTRAINT mentors_pkey;
    END IF;
END $$;

-- Update mentors table schema
ALTER TABLE mentors
ADD COLUMN IF NOT EXISTS email TEXT NOT NULL,
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'MENTOR',
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS is_profile_complete BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add constraints
ALTER TABLE mentors
ADD CONSTRAINT mentors_email_key UNIQUE (email),
ADD CONSTRAINT mentors_pkey PRIMARY KEY (id);

-- Recreate the foreign key constraints
ALTER TABLE availability_slots
ADD CONSTRAINT availability_slots_mentor_id_fkey 
FOREIGN KEY (mentor_id) 
REFERENCES mentors(id) 
ON DELETE CASCADE;

ALTER TABLE bookings
ADD CONSTRAINT bookings_mentor_id_fkey 
FOREIGN KEY (mentor_id) 
REFERENCES mentors(id) 
ON DELETE CASCADE;

ALTER TABLE reviews
ADD CONSTRAINT reviews_mentor_id_fkey 
FOREIGN KEY (mentor_id) 
REFERENCES mentors(id) 
ON DELETE CASCADE;

-- Enable RLS
ALTER TABLE mentors ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can read their own mentor profile"
ON mentors FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own mentor profile"
ON mentors FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own mentor profile"
ON mentors FOR UPDATE
USING (auth.uid() = id);

-- Allow public read access to mentor profiles
CREATE POLICY "Public can read mentor profiles"
ON mentors FOR SELECT
USING (true); 