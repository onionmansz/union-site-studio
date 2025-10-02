import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Plus, Users } from "lucide-react";

interface Guest {
  id: string;
  party_id: string;
  name: string;
  email: string | null;
}

const GuestListManager = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [newGuest, setNewGuest] = useState({
    name: "",
    email: "",
    party_id: ""
  });
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
    }
    setLoading(false);
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newGuest.name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a guest name.",
        variant: "destructive",
      });
      return;
    }

    // Use existing party_id or generate a new one
    const partyId = newGuest.party_id.trim() || crypto.randomUUID();

    const { error } = await supabase.from('guest_list').insert({
      party_id: partyId,
      name: newGuest.name.trim(),
      email: newGuest.email.trim() || null,
    });

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
              <Label htmlFor="party_id">Party ID (optional)</Label>
              <Input
                id="party_id"
                value={newGuest.party_id}
                onChange={(e) => setNewGuest({ ...newGuest, party_id: e.target.value })}
                placeholder="Leave blank for new party"
              />
              <p className="text-xs text-muted-foreground">
                Use same Party ID to group guests together
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
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Party ID: {partyId.substring(0, 8)}... ({partyGuests.length} {partyGuests.length === 1 ? 'guest' : 'guests'})
                  </span>
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
