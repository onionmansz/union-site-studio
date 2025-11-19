import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Fuse from "fuse.js";
import { z } from "zod";

interface GuestListMember {
  id: string;
  name: string;
  email: string | null;
  party_id: string;
}

const rsvpSchema = z.object({
  guest_list_id: z.string().uuid("Invalid guest ID"),
  dietary_restrictions: z.string().max(500, "Dietary restrictions must be less than 500 characters").optional().nullable(),
  message: z.string().max(1000, "Message must be less than 1000 characters").optional().nullable(),
  attendance: z.literal("attending"),
});

const RSVPSection = () => {
  const [searchName, setSearchName] = useState("");
  const [partyMembers, setPartyMembers] = useState<GuestListMember[]>([]);
  const [selectedGuests, setSelectedGuests] = useState<string[]>([]);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [showPartyForm, setShowPartyForm] = useState(false);
  
  const { toast } = useToast();

  const handleNameSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchName.trim()) {
      toast({
        title: "Please enter a name",
        description: "Enter your name to find your party.",
        variant: "destructive",
      });
      return;
    }

    // Fetch all guests for fuzzy matching
    const { data: allGuests, error: fetchError } = await supabase
      .from('guest_list')
      .select('*');

    if (fetchError || !allGuests || allGuests.length === 0) {
      toast({
        title: "Error",
        description: "Failed to load guest list. Please try again.",
        variant: "destructive",
      });
      return;
    }

    // Use Fuse.js for fuzzy name matching
    const fuse = new Fuse(allGuests, {
      keys: ['name'],
      threshold: 0.4, // Lower = stricter matching (0.0 = exact, 1.0 = match anything)
      includeScore: true,
    });

    const results = fuse.search(searchName.trim());

    if (results.length === 0) {
      // Add artificial delay to prevent timing attacks
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Unable to find your information",
        description: "Please check your spelling or contact the couple.",
        variant: "destructive",
      });
      return;
    }

    const foundGuest = results[0].item;

    // Fetch all party members
    const { data: party, error: partyError } = await supabase
      .from('guest_list')
      .select('*')
      .eq('party_id', foundGuest.party_id);

    if (partyError || !party) {
      toast({
        title: "Error",
        description: "Failed to load party information. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setPartyMembers(party);
    setShowPartyForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedGuests.length === 0) {
      toast({
        title: "No guests selected",
        description: "Please select who will be attending.",
        variant: "destructive",
      });
      return;
    }

    // Create RSVPs for selected guests
    const rsvpsToInsert = selectedGuests.map(guestId => ({
      guest_list_id: guestId,
      attendance: 'attending' as const,
      dietary_restrictions: dietaryRestrictions[guestId] || null,
      message: message || null,
    }));

    // Validate each RSVP with zod schema
    try {
      rsvpsToInsert.forEach(rsvp => rsvpSchema.parse(rsvp));
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

    const { error } = await supabase.from('rsvps').insert(rsvpsToInsert);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to submit RSVP. Please try again.",
        variant: "destructive",
      });
      return;
    }

    // Send email notification
    try {
      const guestDetails = selectedGuests.map(guestId => {
        const guest = partyMembers.find(g => g.id === guestId);
        return {
          name: guest?.name || 'Unknown',
          dietaryRestrictions: dietaryRestrictions[guestId] || undefined,
        };
      });

      await supabase.functions.invoke('send-rsvp-email', {
        body: {
          guests: guestDetails,
          message: message || undefined,
          recipientEmail: 'julian3216@gmail.com',
        },
      });
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Don't fail the RSVP if email fails
    }

    toast({
      title: "RSVP Received! 💕",
      description: "Thank you for your response. We'll send you more details soon!",
    });
    
    // Reset form
    setSearchName("");
    setPartyMembers([]);
    setSelectedGuests([]);
    setDietaryRestrictions({});
    setMessage("");
    setShowPartyForm(false);
  };

  const toggleGuest = (guestId: string) => {
    setSelectedGuests(prev => 
      prev.includes(guestId) 
        ? prev.filter(id => id !== guestId)
        : [...prev, guestId]
    );
  };

  return (
    <section className="py-20 px-6 bg-gradient-romantic">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-sage mb-6">
            RSVP
          </h2>
          <div className="w-24 h-px bg-champagne mx-auto mb-8" />
          <p className="text-xl text-muted-foreground">
            Please let us know if you can celebrate with us!
          </p>
        </div>

        <Card className="bg-card/95 backdrop-blur-sm border-0 shadow-elegant animate-scale-in">
          <CardHeader className="text-center pb-6">
            <CardTitle className="font-serif text-2xl text-sage">
              We Can't Wait to Celebrate With You!
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!showPartyForm ? (
              <form onSubmit={handleNameSearch} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="searchName" className="text-sage font-medium">
                    Enter Your Name *
                  </Label>
                  <Input
                    id="searchName"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    required
                    className="border-sage/30 focus:border-rose"
                    placeholder="Your full name"
                  />
                  <p className="text-sm text-muted-foreground">
                    We'll look up your party and show everyone invited with you.
                  </p>
                </div>

                <div className="text-center pt-4">
                  <Button 
                    type="submit"
                    className="bg-rose hover:bg-rose/90 text-rose-foreground px-8 py-3 text-lg font-medium shadow-romantic"
                  >
                    Find My Party
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-sage font-medium text-lg">
                    Your Party ({partyMembers.length} {partyMembers.length === 1 ? 'person' : 'people'})
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Select who will be attending:
                  </p>
                  
                  <div className="space-y-4 border border-border rounded-lg p-4">
                    {partyMembers.map((member) => (
                      <div key={member.id} className="space-y-3 pb-4 border-b last:border-b-0 last:pb-0">
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id={member.id}
                            checked={selectedGuests.includes(member.id)}
                            onCheckedChange={() => toggleGuest(member.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <label
                              htmlFor={member.id}
                              className="text-sage font-medium cursor-pointer block"
                            >
                              {member.name}
                            </label>
                            {member.email && (
                              <p className="text-sm text-muted-foreground">{member.email}</p>
                            )}
                          </div>
                        </div>
                        
                        {selectedGuests.includes(member.id) && (
                          <div className="ml-8 animate-fade-in">
                            <Label htmlFor={`dietary-${member.id}`} className="text-sm text-muted-foreground">
                              Dietary Restrictions
                            </Label>
                             <Input
                              id={`dietary-${member.id}`}
                              value={dietaryRestrictions[member.id] || ""}
                              onChange={(e) => setDietaryRestrictions(prev => ({
                                ...prev,
                                [member.id]: e.target.value
                              }))}
                              maxLength={500}
                              className="border-sage/30 focus:border-rose mt-1"
                              placeholder="None, vegetarian, allergies, etc."
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sage font-medium">
                    Message for the Happy Couple
                  </Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={1000}
                    className="border-sage/30 focus:border-rose min-h-[100px]"
                    placeholder="Share your excitement, memories, or well wishes..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowPartyForm(false);
                      setPartyMembers([]);
                      setSelectedGuests([]);
                      setDietaryRestrictions({});
                    }}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-rose hover:bg-rose/90 text-rose-foreground flex-1 shadow-romantic"
                  >
                    Send RSVP
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default RSVPSection;