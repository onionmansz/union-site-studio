import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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

const MEAL_CHOICES = [
  { value: "chicken", label: "Chicken" },
  { value: "beef", label: "Beef" },
  { value: "vegetarian", label: "Vegetarian" },
] as const;

const rsvpSchema = z.object({
  guest_list_id: z.string().uuid("Invalid guest ID"),
  dietary_restrictions: z.string().max(500, "Dietary restrictions must be less than 500 characters").optional().nullable(),
  meal_choice: z.enum(["chicken", "beef", "vegetarian"], { required_error: "Please select a meal choice" }),
  message: z.string().max(1000, "Message must be less than 1000 characters").optional().nullable(),
  attendance: z.literal("attending"),
});

const RSVPSection = () => {
  const [searchName, setSearchName] = useState("");
  const [partyMembers, setPartyMembers] = useState<GuestListMember[]>([]);
  const [selectedGuests, setSelectedGuests] = useState<string[]>([]);
  const [mealChoices, setMealChoices] = useState<Record<string, string>>({});
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

    // Check that all selected guests have a meal choice
    const missingMealChoice = selectedGuests.find(guestId => !mealChoices[guestId]);
    if (missingMealChoice) {
      const guest = partyMembers.find(g => g.id === missingMealChoice);
      toast({
        title: "Missing meal choice",
        description: `Please select a meal choice for ${guest?.name || 'each guest'}.`,
        variant: "destructive",
      });
      return;
    }

    // Create RSVPs for selected guests
    const rsvpsToInsert = selectedGuests.map(guestId => ({
      guest_list_id: guestId,
      attendance: 'attending' as const,
      meal_choice: mealChoices[guestId] as "chicken" | "beef" | "vegetarian",
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
          mealChoice: mealChoices[guestId] || undefined,
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
      title: "RSVP Received!",
      description: "Thank you for your response. We'll send you more details soon!",
    });
    
    // Reset form
    setSearchName("");
    setPartyMembers([]);
    setSelectedGuests([]);
    setMealChoices({});
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
    <section id="rsvp-section" className="py-20 px-6 bg-gradient-romantic">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
            RSVP
          </h2>
          <p className="text-xl text-foreground">
            Please let us know if you can celebrate with us!
          </p>
        </div>

        <Card className="bg-card/95 backdrop-blur-sm border-0 shadow-elegant animate-scale-in">
          <CardContent className="pt-12 pb-8 flex flex-col justify-center">
            {!showPartyForm ? (
              <form onSubmit={handleNameSearch} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="searchName" className="text-foreground font-medium">
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
                  <p className="text-sm text-foreground">
                    We'll look up your party and show everyone invited with you.
                  </p>
                </div>

                <div className="text-center pt-4">
                  <Button 
                    type="submit"
                    className="bg-foreground hover:bg-foreground/90 text-background px-8 py-3 text-lg font-medium shadow-romantic"
                  >
                    Find My Party
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-foreground font-medium text-lg">
                    Your Party ({partyMembers.length} {partyMembers.length === 1 ? 'person' : 'people'})
                  </Label>
                  <p className="text-sm text-foreground">
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
                              className="text-foreground font-medium cursor-pointer block"
                            >
                              {member.name}
                            </label>
                            {member.email && (
                              <p className="text-sm text-foreground">{member.email}</p>
                            )}
                          </div>
                        </div>
                        
                        {selectedGuests.includes(member.id) && (
                          <div className="ml-8 animate-fade-in space-y-4">
                            <div>
                              <Label className="text-sm text-foreground font-medium">
                                Meal Choice *
                              </Label>
                              <RadioGroup
                                value={mealChoices[member.id] || ""}
                                onValueChange={(value) => setMealChoices(prev => ({
                                  ...prev,
                                  [member.id]: value
                                }))}
                                className="mt-2 flex flex-col space-y-2"
                              >
                                {MEAL_CHOICES.map((choice) => (
                                  <div key={choice.value} className="flex items-center space-x-2">
                                    <RadioGroupItem value={choice.value} id={`meal-${member.id}-${choice.value}`} />
                                    <Label 
                                      htmlFor={`meal-${member.id}-${choice.value}`}
                                      className="text-sm cursor-pointer"
                                    >
                                      {choice.label}
                                    </Label>
                                  </div>
                                ))}
                              </RadioGroup>
                            </div>
                            <div>
                              <Label htmlFor={`dietary-${member.id}`} className="text-sm text-foreground">
                                Dietary Restrictions / Allergies
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
                                placeholder="Allergies, special requirements, etc."
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-foreground font-medium">
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
                      setMealChoices({});
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