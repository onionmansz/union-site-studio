import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const RSVPSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    attendance: "",
    guests: "1",
    dietaryRestrictions: "",
    message: ""
  });
  
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send to a backend service
    toast({
      title: "RSVP Received! 💕",
      description: "Thank you for your response. We'll send you more details soon!",
    });
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      attendance: "",
      guests: "1",
      dietaryRestrictions: "",
      message: ""
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section className="py-20 px-6 bg-gradient-romantic">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
            RSVP
          </h2>
          <div className="w-24 h-px bg-champagne mx-auto mb-8" />
          <p className="text-xl text-muted-foreground">
            Please let us know if you can celebrate with us!
          </p>
          <p className="text-lg text-rose font-medium mt-4">
            Kindly respond by May 1st, 2024
          </p>
        </div>

        <Card className="bg-card/95 backdrop-blur-sm border-0 shadow-elegant animate-scale-in">
          <CardHeader className="text-center pb-6">
            <CardTitle className="font-serif text-2xl text-foreground">
              We Can't Wait to Celebrate With You!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground font-medium">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="border-sage/30 focus:border-rose"
                    placeholder="Your name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground font-medium">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="border-sage/30 focus:border-rose"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-foreground font-medium">Will you be attending? *</Label>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="attendance"
                      value="yes"
                      checked={formData.attendance === "yes"}
                      onChange={handleChange}
                      className="text-rose focus:ring-rose"
                      required
                    />
                    <span className="text-foreground">Yes, I'll be there! 🎉</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="attendance"
                      value="no"
                      checked={formData.attendance === "no"}
                      onChange={handleChange}
                      className="text-rose focus:ring-rose"
                      required
                    />
                    <span className="text-foreground">Sorry, can't make it 😢</span>
                  </label>
                </div>
              </div>

              {formData.attendance === "yes" && (
                <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
                  <div className="space-y-2">
                    <Label htmlFor="guests" className="text-foreground font-medium">
                      Number of Guests (including yourself)
                    </Label>
                    <Input
                      id="guests"
                      name="guests"
                      type="number"
                      min="1"
                      max="5"
                      value={formData.guests}
                      onChange={handleChange}
                      className="border-sage/30 focus:border-rose"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dietaryRestrictions" className="text-foreground font-medium">
                      Dietary Restrictions
                    </Label>
                    <Input
                      id="dietaryRestrictions"
                      name="dietaryRestrictions"
                      value={formData.dietaryRestrictions}
                      onChange={handleChange}
                      className="border-sage/30 focus:border-rose"
                      placeholder="None, vegetarian, allergies, etc."
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="message" className="text-foreground font-medium">
                  Message for the Happy Couple
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="border-sage/30 focus:border-rose min-h-[100px]"
                  placeholder="Share your excitement, memories, or well wishes..."
                />
              </div>

              <div className="text-center pt-4">
                <Button 
                  type="submit"
                  className="bg-rose hover:bg-rose/90 text-rose-foreground px-8 py-3 text-lg font-medium shadow-romantic"
                >
                  Send RSVP
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default RSVPSection;