-- Add meal_choice column to rsvps table
ALTER TABLE public.rsvps 
ADD COLUMN meal_choice text;