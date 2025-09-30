-- Create RSVPs table
CREATE TABLE public.rsvps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  attendance TEXT NOT NULL CHECK (attendance IN ('attending', 'not-attending')),
  guests INTEGER,
  dietary_restrictions TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit an RSVP (public insert)
CREATE POLICY "Anyone can submit RSVP" 
ON public.rsvps 
FOR INSERT 
WITH CHECK (true);

-- Only authenticated users (the couple) can view RSVPs
CREATE POLICY "Authenticated users can view all RSVPs" 
ON public.rsvps 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Create index for faster queries
CREATE INDEX idx_rsvps_created_at ON public.rsvps(created_at DESC);