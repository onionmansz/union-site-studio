import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Plus, Users } from "lucide-react";
import { z } from "zod";

interface Guest {
  id: string;
  party_id: string;
  name: string;
  email: string | null;
}

const guestSchema = z.object({
  party_id: z.string().uuid("Invalid party ID"),
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters").optional().nullable().or(z.literal("")),
});

const GuestListManager = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [newGuest, setNewGuest] = useState({
    name: "",
    email: "",
    party_id: "",
  });
  const [existingParties, setExistingParties] = useState<Array<{ party_id: string; names: string[] }>>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('guest_list')
      .select('*')
      .order('party_id', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load guest list.",
        variant: "destructive",
      });
    } else {
      setGuests(data || []);

      // Group parties for the dropdown
      const parties = (data || []).reduce((acc, guest) => {
        const existing = acc.find(p => p.party_id === guest.party_id);
        if (existing) {
          existing.names.push(guest.name);
        } else {
          acc.push({ party_id: guest.party_id, names: [guest.name] });
        }
        return acc;
      }, [] as Array<{ party_id: string; names: string[] }>);
      setExistingParties(parties);
    }
    setLoading(false);
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();

    // Use selected party_id or generate a new one
    const partyId = newGuest.party_id || crypto.randomUUID();

    const guestData = {
      party_id: partyId,
      name: newGuest.name.trim(),
      email: newGuest.email.trim() || null,
    };

    // Validate with zod schema
    try {
      guestSchema.parse(guestData);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: validationError.errors[0].message,
          variant: "destructive",
        });
      }
      return;
    }

    const { error } = await supabase.from('guest_list').insert(guestData);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add guest.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Guest added to the list!",
    });

    setNewGuest({ name: "", email: "", party_id: "" });
    fetchGuests();
  };

  const handleDeleteGuest = async (guestId: string) => {
    if (!confirm("Are you sure you want to remove this guest?")) return;

    const { error } = await supabase
      .from('guest_list')
      .delete()
      .eq('id', guestId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete guest.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Guest removed from the list.",
    });

    fetchGuests();
  };

  const groupedGuests = guests.reduce((acc, guest) => {
    if (!acc[guest.party_id]) {
      acc[guest.party_id] = [];
    }
    acc[guest.party_id].push(guest);
    return acc;
  }, {} as Record<string, Guest[]>);

  if (loading) {
    return <div className="text-center py-8 text-foreground">Loading guest list...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-serif mb-4 text-foreground flex items-center gap-2">
          <Plus className="w-6 h-6" />
          Add New Guest
        </h2>
        <form onSubmit={handleAddGuest} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Guest Name *</Label>
              <Input
                id="name"
                value={newGuest.name}
                onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email (optional)</Label>
              <Input
                id="email"
                type="email"
                value={newGuest.email}
                onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="party_id">Add to Party (optional)</Label>
              <select
                id="party_id"
                value={newGuest.party_id}
                onChange={(e) => setNewGuest({ ...newGuest, party_id: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Create new party</option>
                {existingParties.map((party) => (
                  <option key={party.party_id} value={party.party_id}>
                    {party.names.join(", ")}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">
                Select a party to add this guest to, or leave blank to create a new party
              </p>
            </div>
          </div>
          <Button type="submit">Add Guest</Button>
        </form>
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-serif mb-4 text-foreground flex items-center gap-2">
          <Users className="w-6 h-6" />
          Guest List ({guests.length} guests in {Object.keys(groupedGuests).length} parties)
        </h2>

        {guests.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No guests added yet. Add your first guest above!
          </p>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedGuests).map(([partyId, partyGuests]) => (
                <div key={partyId} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {partyGuests.length} {partyGuests.length === 1 ? 'guest' : 'guests'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {partyGuests.map((guest) => (
                      <div
                        key={guest.id}
                        className="flex items-center justify-between bg-muted/50 rounded-md p-3"
                      >
                        <div>
                          <p className="font-medium text-foreground">{guest.name}</p>
                          {guest.email && (
                            <p className="text-sm text-muted-foreground">{guest.email}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteGuest(guest.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default GuestListManager;
