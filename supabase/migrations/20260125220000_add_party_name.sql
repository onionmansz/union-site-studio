-- Add party_name column to guest_list table
ALTER TABLE guest_list ADD COLUMN IF NOT EXISTS party_name TEXT;

-- Create index for party_name lookups
CREATE INDEX IF NOT EXISTS idx_guest_list_party_name ON guest_list(party_name);
