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

-- Drop the experience column if it exists
ALTER TABLE mentors DROP COLUMN IF EXISTS experience;

-- Update mentors table schema
ALTER TABLE mentors
ADD COLUMN IF NOT EXISTS university TEXT NOT NULL,
ADD COLUMN IF NOT EXISTS expertise TEXT[] NOT NULL DEFAULT '{}',
ADD COLUMN IF NOT EXISTS bio TEXT NOT NULL,
ADD COLUMN IF NOT EXISTS hourly_rate INTEGER,
ADD COLUMN IF NOT EXISTS country TEXT NOT NULL,
ADD COLUMN IF NOT EXISTS years_of_experience INTEGER NOT NULL,
ADD COLUMN IF NOT EXISTS image TEXT,
ADD COLUMN IF NOT EXISTS is_profile_complete BOOLEAN NOT NULL DEFAULT false;

-- Add any missing columns from the original schema
ALTER TABLE mentors
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS email TEXT NOT NULL;

-- Add constraints
ALTER TABLE mentors
ADD CONSTRAINT mentors_email_key UNIQUE (email),
ADD CONSTRAINT mentors_pkey PRIMARY KEY (id); 