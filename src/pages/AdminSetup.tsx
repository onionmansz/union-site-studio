import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminSetup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleMakeAdmin = async () => {
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to become an admin.",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      // Try to insert admin role
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: user.id, role: 'admin' });

      if (error && error.code !== '23505') { // 23505 is duplicate key error
        toast({
          title: "Error",
          description: `Failed to grant admin access: ${error.message}`,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      toast({
        title: "Success!",
        description: "You now have admin access.",
      });

      setTimeout(() => {
        navigate("/admin");
      }, 1000);

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <h1 className="font-serif text-3xl text-center mb-6 text-foreground">
          Admin Setup
        </h1>

        <p className="text-muted-foreground text-center mb-6">
          Click the button below to grant yourself admin access.
        </p>

        <Button
          onClick={handleMakeAdmin}
          className="w-full"
          disabled={loading}
        >
          {loading ? "Setting up..." : "Make Me Admin"}
        </Button>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Back to home
          </button>
        </div>
      </Card>
    </div>
  );
};

export default AdminSetup;
