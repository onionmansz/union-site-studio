-- Allow public users to read from guest_list for RSVP purposes
CREATE POLICY "Public users can search guest list for RSVP"
ON public.guest_list
FOR SELECT
USING (true);
