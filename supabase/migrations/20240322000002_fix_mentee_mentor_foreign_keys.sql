-- Drop existing foreign key constraints
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mentees_id_fkey') THEN
        ALTER TABLE mentees DROP CONSTRAINT mentees_id_fkey;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mentors_id_fkey') THEN
        ALTER TABLE mentors DROP CONSTRAINT mentors_id_fkey;
    END IF;
END $$;

-- Recreate the foreign key constraints with proper references to auth.users
ALTER TABLE mentees
ADD CONSTRAINT mentees_id_fkey 
FOREIGN KEY (id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

ALTER TABLE mentors
ADD CONSTRAINT mentors_id_fkey 
FOREIGN KEY (id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE; 