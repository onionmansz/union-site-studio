-- Fix duplicate RLS policies on rsvps table
-- Remove the duplicate policy
DROP POLICY IF EXISTS "Anyone can submit RSVP" ON public.rsvps;

-- Drop the other duplicate policy so we can recreate it with validation
DROP POLICY IF EXISTS "Anyone can submit RSVPs" ON public.rsvps;

-- Create a new policy that validates guest_list_id exists
CREATE POLICY "Verified guests can submit RSVP"
ON public.rsvps
FOR INSERT
WITH CHECK (
  guest_list_id IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM public.guest_list 
    WHERE id = guest_list_id
  )
);

-- Add database-level constraints for data integrity
ALTER TABLE public.rsvps 
ADD CONSTRAINT check_dietary_length 
CHECK (length(dietary_restrictions) <= 500);

ALTER TABLE public.rsvps 
ADD CONSTRAINT check_message_length 
CHECK (length(message) <= 1000);