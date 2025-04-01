-- Enable RLS on mentors table
ALTER TABLE mentors ENABLE ROW LEVEL SECURITY;

-- Create policies for mentors table
-- Allow users to read their own profile
CREATE POLICY "Users can read their own mentor profile"
ON mentors FOR SELECT
USING (auth.uid() = id);

-- Allow users to insert their own profile during signup
CREATE POLICY "Users can insert their own mentor profile"
ON mentors FOR INSERT
WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own mentor profile"
ON mentors FOR UPDATE
USING (auth.uid() = id);

-- Allow public read access to mentor profiles (for browsing)
CREATE POLICY "Public can read mentor profiles"
ON mentors FOR SELECT
USING (true); 