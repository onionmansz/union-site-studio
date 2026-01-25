import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, Users, CheckCircle, XCircle, Clock, UserPlus } from "lucide-react";

interface GuestWithRSVP {
  id: string;
  name: string;
  email: string | null;
  party_id: string;
  rsvp_status: 'pending' | 'attending' | 'not_attending';
  meal_choice: string | null;
  dietary_restrictions: string | null;
  message: string | null;
  rsvp_created_at: string | null;
}

const Admin = () => {
  const [guests, setGuests] = useState<GuestWithRSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [newGuest, setNewGuest] = useState({ name: "", email: "", party_id: "" });
  const [bulkGuests, setBulkGuests] = useState("");
  const [existingParties, setExistingParties] = useState<Array<{ party_id: string; names: string[] }>>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (!isMounted) return;

      if (error || !session) {
        setLoading(false);
        setCheckingAuth(false);
        setTimeout(() => {
          if (isMounted) {
            navigate("/auth", { replace: true });
          }
        }, 300);
        return;
      }

      setUser(session.user);
      setCheckingAuth(false);
      await checkAdminStatus(session.user.id);
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const checkAdminStatus = async (userId: string) => {
    console.log('Checking admin status for user:', userId);

    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();

    if (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    console.log('Admin check result:', data);

    if (data) {
      console.log('User is admin, fetching guests');
      setIsAdmin(true);
      fetchGuests();
    } else {
      console.log('User is not admin');
      setIsAdmin(false);
      setLoading(false);
    }
  };

  const fetchGuests = async () => {
    setLoading(true);

    // Fetch all guests
    const { data: guestData, error: guestError } = await supabase
      .from('guest_list')
      .select('*')
      .order('party_id', { ascending: true })
      .order('name', { ascending: true });

    if (guestError) {
      toast({
        title: "Error",
        description: "Failed to load guest list.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Fetch all RSVPs
    const { data: rsvpData, error: rsvpError } = await supabase
      .from('rsvps')
      .select('*');

    console.log('Fetched RSVPs:', rsvpData);
    console.log('RSVPs with messages:', rsvpData?.filter(r => r.message).map(r => ({ id: r.id, message: r.message })));

    if (rsvpError) {
      toast({
        title: "Error",
        description: "Failed to load RSVPs.",
        variant: "destructive",
      });
    }

    // Merge guest and RSVP data
    const guestsWithRSVP: GuestWithRSVP[] = (guestData || []).map(guest => {
      const rsvp = (rsvpData || []).find(r => r.guest_list_id === guest.id);

      console.log(`Guest ${guest.name}:`, {
        hasRsvp: !!rsvp,
        message: rsvp?.message,
        dietary: rsvp?.dietary_restrictions,
        meal: rsvp?.meal_choice
      });

      return {
        id: guest.id,
        name: guest.name,
        email: guest.email,
        party_id: guest.party_id,
        rsvp_status: rsvp ? (rsvp.attendance === 'attending' ? 'attending' : 'not_attending') : 'pending',
        meal_choice: rsvp?.meal_choice || null,
        dietary_restrictions: rsvp?.dietary_restrictions || null,
        message: rsvp?.message || null,
        rsvp_created_at: rsvp?.created_at || null,
      };
    });

    setGuests(guestsWithRSVP);

    // Group parties for the dropdown
    const parties = guestsWithRSVP.reduce((acc, guest) => {
      const existing = acc.find(p => p.party_id === guest.party_id);
      if (existing) {
        existing.names.push(guest.name);
      } else {
        acc.push({ party_id: guest.party_id, names: [guest.name] });
      }
      return acc;
    }, [] as Array<{ party_id: string; names: string[] }>);
    setExistingParties(parties);

    setLoading(false);
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();

    const partyId = newGuest.party_id || crypto.randomUUID();

    const guestData = {
      party_id: partyId,
      name: newGuest.name.trim(),
      email: newGuest.email.trim() || null,
    };

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

  const handleBulkAddGuests = async (e: React.FormEvent) => {
    e.preventDefault();

    const names = bulkGuests
      .split(/[\n,]+/)
      .map(name => name.trim())
      .filter(name => name.length > 0);

    if (names.length === 0) {
      toast({
        title: "Error",
        description: "Please enter at least one guest name.",
        variant: "destructive",
      });
      return;
    }

    const partyId = crypto.randomUUID();

    const guestData = names.map(name => ({
      party_id: partyId,
      name,
      email: null,
    }));

    const { error } = await supabase.from('guest_list').insert(guestData);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add guests.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: `Added ${names.length} guest${names.length > 1 ? 's' : ''} as a party!`,
    });

    setBulkGuests("");
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const attendingCount = guests.filter(g => g.rsvp_status === 'attending').length;
  const pendingCount = guests.filter(g => g.rsvp_status === 'pending').length;
  const notAttendingCount = guests.filter(g => g.rsvp_status === 'not_attending').length;
  const mealSummary = guests.reduce((acc, guest) => {
    if (guest.rsvp_status !== 'attending') {
      return acc;
    }

    const choice = guest.meal_choice || 'not_selected';
    acc[choice] = (acc[choice] || 0) + 1;
    return acc;
  }, {
    chicken: 0,
    beef: 0,
    vegetarian: 0,
    not_selected: 0,
  } as Record<string, number>);

  // Group guests by party
  const groupedGuests = guests.reduce((acc, guest) => {
    if (!acc[guest.party_id]) {
      acc[guest.party_id] = [];
    }
    acc[guest.party_id].push(guest);
    return acc;
  }, {} as Record<string, GuestWithRSVP[]>);

  // Show loading while checking auth or loading data
  if (checkingAuth || (loading && isAdmin)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground text-lg">Loading...</p>
          <p className="text-muted-foreground text-sm mt-2">
            {checkingAuth ? 'Checking authentication...' : 'Loading data...'}
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <Card className="max-w-md p-8 text-center">
          <h1 className="font-serif text-3xl mb-4 text-foreground">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You don't have permission to access the admin dashboard. Please contact the site administrator to request access.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate("/")}>Back to Site</Button>
            <Button onClick={handleLogout} variant="outline">Logout</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-serif text-4xl text-foreground">Guest & RSVP Management</h1>
          <div className="flex gap-4">
            <Button onClick={() => navigate("/")}>Back to Site</Button>
            <Button onClick={handleLogout} variant="outline">Logout</Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Guests</h3>
            <p className="text-3xl font-bold text-foreground">{guests.length}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Attending
            </h3>
            <p className="text-3xl font-bold text-green-600">{attendingCount}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-600" />
              Pending
            </h3>
            <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-600" />
              Not Attending
            </h3>
            <p className="text-3xl font-bold text-red-600">{notAttendingCount}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Meal Selections</h3>
            <div className="space-y-2 text-sm text-foreground">
              <div className="flex items-center justify-between">
                <span>Chicken</span>
                <span className="font-semibold">{mealSummary.chicken}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Beef</span>
                <span className="font-semibold">{mealSummary.beef}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Vegetarian</span>
                <span className="font-semibold">{mealSummary.vegetarian}</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Not selected</span>
                <span className="font-semibold">{mealSummary.not_selected}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Add New Guest */}
        <Card className="p-6 mb-8">
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
              </div>
            </div>
            <Button type="submit">Add Guest</Button>
          </form>
        </Card>

        {/* Bulk Add Guests */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-serif mb-4 text-foreground flex items-center gap-2">
            <UserPlus className="w-6 h-6" />
            Bulk Add Guests
          </h2>
          <form onSubmit={handleBulkAddGuests} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bulkGuests">Guest Names (one per line or comma-separated)</Label>
              <Textarea
                id="bulkGuests"
                value={bulkGuests}
                onChange={(e) => setBulkGuests(e.target.value)}
                placeholder="John Doe&#10;Jane Doe&#10;Bob Smith"
                rows={5}
              />
              <p className="text-sm text-muted-foreground">
                All guests will be added as a single party.
              </p>
            </div>
            <Button type="submit">Add All as Party</Button>
          </form>
        </Card>

        {/* Guest List */}
        <Card className="p-6">
          <h2 className="text-2xl font-serif mb-6 text-foreground flex items-center gap-2">
            <Users className="w-6 h-6" />
            All Guests ({guests.length} guests in {Object.keys(groupedGuests).length} parties)
          </h2>

          {guests.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No guests added yet. Add your first guest above!
            </p>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedGuests).map(([partyId, partyGuests]) => {
                // Get party message from first guest who has one
                const partyMessage = partyGuests.find(g => g.message)?.message;

                return (
                  <div key={partyId} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {partyGuests.length} {partyGuests.length === 1 ? 'guest' : 'guests'}
                        </span>
                      </div>
                    </div>

                    {/* Party-level message */}
                    {partyMessage && (
                      <div className="mb-4 p-3 bg-muted/50 rounded-md border-l-4 border-rose">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Message from this party:</p>
                        <p className="text-sm italic text-foreground">{partyMessage}</p>
                      </div>
                    )}

                    <div className="space-y-3">
                      {partyGuests.map((guest) => (
                        <div
                          key={guest.id}
                          className="bg-muted/30 rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                              {/* Guest Info */}
                              <div>
                                <p className="font-semibold text-foreground text-lg">{guest.name}</p>
                                {guest.email && (
                                  <p className="text-sm text-muted-foreground">{guest.email}</p>
                                )}
                              </div>

                              {/* RSVP Status */}
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">RSVP Status</p>
                                <div className="flex items-center gap-2">
                                  {guest.rsvp_status === 'attending' && (
                                    <>
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                      <span className="text-green-600 font-medium">Attending</span>
                                    </>
                                  )}
                                  {guest.rsvp_status === 'not_attending' && (
                                    <>
                                      <XCircle className="w-4 h-4 text-red-600" />
                                      <span className="text-red-600 font-medium">Not Attending</span>
                                    </>
                                  )}
                                  {guest.rsvp_status === 'pending' && (
                                    <>
                                      <Clock className="w-4 h-4 text-yellow-600" />
                                      <span className="text-yellow-600 font-medium">Pending</span>
                                    </>
                                  )}
                                </div>
                                {guest.rsvp_created_at && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {new Date(guest.rsvp_created_at).toLocaleDateString()}
                                  </p>
                                )}
                              </div>

                              {/* Additional Info */}
                              <div>
                                <div className="mb-2">
                                  <p className="text-xs text-muted-foreground">Meal Choice</p>
                                  <p className="text-sm font-medium capitalize">
                                    {guest.meal_choice || "Not selected"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Dietary Restrictions</p>
                                  <p className="text-sm font-medium">
                                    {guest.dietary_restrictions || "None noted"}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Delete Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteGuest(guest.id)}
                              className="text-destructive hover:text-destructive ml-4"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Admin;
