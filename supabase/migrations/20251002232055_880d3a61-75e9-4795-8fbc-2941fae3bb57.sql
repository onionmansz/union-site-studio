-- Create guest_list table with party groupings
CREATE TABLE public.guest_list (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  party_id uuid NOT NULL,
  name text NOT NULL,
  email text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.guest_list ENABLE ROW LEVEL SECURITY;

-- Anyone can read the guest list to look up their party
CREATE POLICY "Anyone can view guest list"
ON public.guest_list
FOR SELECT
USING (true);

-- Only admins can manage guest list
CREATE POLICY "Admins can manage guest list"
ON public.guest_list
FOR ALL
USING (public.is_admin(auth.uid()));

-- Update rsvps table structure
ALTER TABLE public.rsvps 
DROP COLUMN IF EXISTS name,
DROP COLUMN IF EXISTS email,
DROP COLUMN IF EXISTS guests,
ADD COLUMN guest_list_id uuid REFERENCES public.guest_list(id);

-- Update RLS policy for RSVPs to allow checking by guest_list_id
DROP POLICY IF EXISTS "Anyone can submit RSVP" ON public.rsvps;

CREATE POLICY "Anyone can submit RSVP"
ON public.rsvps
FOR INSERT
WITH CHECK (true);