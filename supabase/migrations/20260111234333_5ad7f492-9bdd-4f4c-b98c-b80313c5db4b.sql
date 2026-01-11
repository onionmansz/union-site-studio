-- Add party_code column to guest_list table
ALTER TABLE public.guest_list 
ADD COLUMN party_code text;

-- Create an index for faster lookups by party_code
CREATE INDEX idx_guest_list_party_code ON public.guest_list(party_code);