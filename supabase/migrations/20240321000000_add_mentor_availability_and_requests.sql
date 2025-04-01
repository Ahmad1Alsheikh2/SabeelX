-- Create mentor_availability table
CREATE TABLE IF NOT EXISTS mentor_availability (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    mentor_id UUID NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(mentor_id, date, start_time, end_time)
);

-- Create mentorship_requests table
CREATE TABLE IF NOT EXISTS mentorship_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    mentor_id UUID NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
    mentee_id UUID NOT NULL REFERENCES mentees(id) ON DELETE CASCADE,
    service_type TEXT NOT NULL,
    focus_area TEXT NOT NULL,
    preferred_date DATE NOT NULL,
    preferred_time TIME NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create mentorship_sessions table
CREATE TABLE IF NOT EXISTS mentorship_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    request_id UUID NOT NULL REFERENCES mentorship_requests(id) ON DELETE CASCADE,
    mentor_id UUID NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
    mentee_id UUID NOT NULL REFERENCES mentees(id) ON DELETE CASCADE,
    session_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create RLS policies for mentor_availability
ALTER TABLE mentor_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Mentors can view their own availability"
    ON mentor_availability FOR SELECT
    USING (auth.uid() = mentor_id);

CREATE POLICY "Mentors can insert their own availability"
    ON mentor_availability FOR INSERT
    WITH CHECK (auth.uid() = mentor_id);

CREATE POLICY "Mentors can update their own availability"
    ON mentor_availability FOR UPDATE
    USING (auth.uid() = mentor_id)
    WITH CHECK (auth.uid() = mentor_id);

CREATE POLICY "Mentors can delete their own availability"
    ON mentor_availability FOR DELETE
    USING (auth.uid() = mentor_id);

-- Create RLS policies for mentorship_requests
ALTER TABLE mentorship_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Mentors can view requests for them"
    ON mentorship_requests FOR SELECT
    USING (auth.uid() = mentor_id);

CREATE POLICY "Mentees can view their own requests"
    ON mentorship_requests FOR SELECT
    USING (auth.uid() = mentee_id);

CREATE POLICY "Mentees can create requests"
    ON mentorship_requests FOR INSERT
    WITH CHECK (auth.uid() = mentee_id);

CREATE POLICY "Mentors can update requests for them"
    ON mentorship_requests FOR UPDATE
    USING (auth.uid() = mentor_id)
    WITH CHECK (auth.uid() = mentor_id);

-- Create RLS policies for mentorship_sessions
ALTER TABLE mentorship_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Mentors can view their sessions"
    ON mentorship_sessions FOR SELECT
    USING (auth.uid() = mentor_id);

CREATE POLICY "Mentees can view their sessions"
    ON mentorship_sessions FOR SELECT
    USING (auth.uid() = mentee_id);

CREATE POLICY "Mentors can update their sessions"
    ON mentorship_sessions FOR UPDATE
    USING (auth.uid() = mentor_id)
    WITH CHECK (auth.uid() = mentor_id);

CREATE POLICY "Mentees can update their sessions"
    ON mentorship_sessions FOR UPDATE
    USING (auth.uid() = mentee_id)
    WITH CHECK (auth.uid() = mentee_id);

-- Create functions to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_mentor_availability_updated_at ON mentor_availability;
DROP TRIGGER IF EXISTS update_mentorship_requests_updated_at ON mentorship_requests;
DROP TRIGGER IF EXISTS update_mentorship_sessions_updated_at ON mentorship_sessions;

-- Create triggers for updated_at
CREATE TRIGGER update_mentor_availability_updated_at
    BEFORE UPDATE ON mentor_availability
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mentorship_requests_updated_at
    BEFORE UPDATE ON mentorship_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mentorship_sessions_updated_at
    BEFORE UPDATE ON mentorship_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 