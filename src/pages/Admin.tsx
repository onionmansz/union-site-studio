import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import GuestListManager from "@/components/GuestListManager";

interface GuestInfo {
  id: string;
  name: string;
  email: string | null;
  party_id: string;
}

interface RSVP {
  id: string;
  guest_list_id: string;
  attendance: string;
  dietary_restrictions: string | null;
  message: string | null;
  created_at: string;
  guest_list?: GuestInfo;
}

const Admin = () => {
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check authentication and admin status
    supabase.auth.getSession().then(async ({ data: { session }, error: sessionError }) => {
      if (sessionError) {
        console.error('Session error:', sessionError);
        setLoading(false);
        navigate("/auth");
        return;
      }

      if (!session) {
        console.log('No session found, redirecting to auth');
        setLoading(false);
        navigate("/auth");
      } else {
        console.log('Session found for user:', session.user.id);
        setUser(session.user);
        await checkAdminStatus(session.user.id);
      }
    }).catch(err => {
      console.error('Error getting session:', err);
      setLoading(false);
      navigate("/auth");
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session) {
        setLoading(false);
        navigate("/auth");
      } else {
        setUser(session.user);
        await checkAdminStatus(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
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
      console.log('User is admin, fetching RSVPs');
      setIsAdmin(true);
      fetchRSVPs();
    } else {
      console.log('User is not admin');
      setIsAdmin(false);
      setLoading(false);
    }
  };

  const fetchRSVPs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('rsvps')
      .select('*, guest_list(*)')
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <Card className="max-w-md p-8 text-center">
          <h1 className="font-serif text-3xl mb-4 text-foreground">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You don't have permission to access the admin dashboard.
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
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-serif text-4xl text-foreground">RSVP Dashboard</h1>
          <div className="flex gap-4">
            <Button onClick={() => navigate("/")}>Back to Site</Button>
            <Button onClick={handleLogout} variant="outline">Logout</Button>
          </div>
        </div>

        <Tabs defaultValue="rsvps" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="rsvps">RSVPs</TabsTrigger>
            <TabsTrigger value="guests">Guest List</TabsTrigger>
          </TabsList>
          
          <TabsContent value="rsvps">
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
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Attending Guests</h3>
                <p className="text-3xl font-bold text-foreground">{attendingCount}</p>
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
                          <p className="font-semibold text-foreground">{rsvp.guest_list?.name || 'Unknown Guest'}</p>
                          {rsvp.guest_list?.email && (
                            <p className="text-sm text-muted-foreground">{rsvp.guest_list.email}</p>
                          )}
                          <p className="text-sm mt-2">
                            <span className="font-medium">Status: </span>
                            <span className="text-green-600">Attending</span>
                          </p>
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
          </TabsContent>

          <TabsContent value="guests">
            <GuestListManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
