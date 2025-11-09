-- Create an enum for user roles (skip if exists)
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create user_roles table (skip if exists)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can manage roles" ON public.user_roles;

-- Policy: Users can view their own role
CREATE POLICY "Users can view their own role"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Only admins can insert/update/delete roles
CREATE POLICY "Only admins can manage roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Drop existing overly permissive policies on guest_list
DROP POLICY IF EXISTS "Enable read access for all users" ON public.guest_list;
DROP POLICY IF EXISTS "Anyone can view guest list" ON public.guest_list;
DROP POLICY IF EXISTS "Public read access" ON public.guest_list;
DROP POLICY IF EXISTS "Only admins can view guest list" ON public.guest_list;
DROP POLICY IF EXISTS "Only admins can insert guests" ON public.guest_list;
DROP POLICY IF EXISTS "Only admins can update guests" ON public.guest_list;
DROP POLICY IF EXISTS "Only admins can delete guests" ON public.guest_list;

-- Create secure policy: Only admins can view guest list
CREATE POLICY "Only admins can view guest list"
ON public.guest_list
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create secure policy: Only admins can insert guests
CREATE POLICY "Only admins can insert guests"
ON public.guest_list
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create secure policy: Only admins can update guests
CREATE POLICY "Only admins can update guests"
ON public.guest_list
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create secure policy: Only admins can delete guests
CREATE POLICY "Only admins can delete guests"
ON public.guest_list
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Update rsvps table policies
DROP POLICY IF EXISTS "Enable read access for all users" ON public.rsvps;
DROP POLICY IF EXISTS "Anyone can view RSVPs" ON public.rsvps;
DROP POLICY IF EXISTS "Public read access" ON public.rsvps;
DROP POLICY IF EXISTS "Only admins can view RSVPs" ON public.rsvps;
DROP POLICY IF EXISTS "Anyone can submit RSVPs" ON public.rsvps;
DROP POLICY IF EXISTS "Only admins can update RSVPs" ON public.rsvps;
DROP POLICY IF EXISTS "Only admins can delete RSVPs" ON public.rsvps;

-- Create secure policy: Only admins can view all RSVPs
CREATE POLICY "Only admins can view RSVPs"
ON public.rsvps
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Policy: Anyone can submit RSVPs (for the public form)
CREATE POLICY "Anyone can submit RSVPs"
ON public.rsvps
FOR INSERT
WITH CHECK (true);

-- Create secure policy: Only admins can update RSVPs
CREATE POLICY "Only admins can update RSVPs"
ON public.rsvps
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create secure policy: Only admins can delete RSVPs
CREATE POLICY "Only admins can delete RSVPs"
ON public.rsvps
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));