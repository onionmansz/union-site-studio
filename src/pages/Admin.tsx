import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RSVP {
  id: string;
  name: string;
  email: string;
  attendance: string;
  guests: number | null;
  dietary_restrictions: string | null;
  message: string | null;
  created_at: string;
}

const Admin = () => {
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        fetchRSVPs();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchRSVPs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('rsvps')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load RSVPs.",
        variant: "destructive",
      });
    } else {
      setRsvps(data || []);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const attendingCount = rsvps.filter(r => r.attendance === 'attending').length;
  const totalGuests = rsvps
    .filter(r => r.attendance === 'attending')
    .reduce((sum, r) => sum + (r.guests || 1), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-serif text-4xl text-foreground">RSVP Dashboard</h1>
          <div className="flex gap-4">
            <Button onClick={() => navigate("/")}>Back to Site</Button>
            <Button onClick={handleLogout} variant="outline">Logout</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Responses</h3>
            <p className="text-3xl font-bold text-foreground">{rsvps.length}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Attending</h3>
            <p className="text-3xl font-bold text-foreground">{attendingCount}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Guests</h3>
            <p className="text-3xl font-bold text-foreground">{totalGuests}</p>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-2xl font-serif mb-6 text-foreground">All RSVPs</h2>
          <div className="space-y-4">
            {rsvps.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No RSVPs yet</p>
            ) : (
              rsvps.map((rsvp) => (
                <div
                  key={rsvp.id}
                  className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold text-foreground">{rsvp.name}</p>
                      <p className="text-sm text-muted-foreground">{rsvp.email}</p>
                      <p className="text-sm mt-2">
                        <span className="font-medium">Status: </span>
                        <span className={rsvp.attendance === 'attending' ? 'text-green-600' : 'text-red-600'}>
                          {rsvp.attendance === 'attending' ? 'Attending' : 'Not Attending'}
                        </span>
                      </p>
                      {rsvp.guests && (
                        <p className="text-sm">
                          <span className="font-medium">Guests: </span>
                          {rsvp.guests}
                        </p>
                      )}
                    </div>
                    <div>
                      {rsvp.dietary_restrictions && (
                        <p className="text-sm mb-2">
                          <span className="font-medium">Dietary Restrictions: </span>
                          {rsvp.dietary_restrictions}
                        </p>
                      )}
                      {rsvp.message && (
                        <p className="text-sm">
                          <span className="font-medium">Message: </span>
                          {rsvp.message}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(rsvp.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
