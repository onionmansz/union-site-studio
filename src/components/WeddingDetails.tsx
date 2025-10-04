import { Card, CardContent } from "@/components/ui/card";
import LocationMap from "./LocationMap";

const WeddingDetails = () => {
  const details = [
    {
      title: "Ceremony",
      time: "4:00 PM",
      location: "Garden Grove Estate",
      address: "123 Vineyard Lane, Napa Valley, CA",
      icon: "🌸"
    },
    {
      title: "Cocktail Hour",
      time: "5:00 PM",
      location: "Terrace Gardens",
      address: "Same venue - Outdoor terrace",
      icon: "🥂"
    },
    {
      title: "Reception",
      time: "6:30 PM",
      location: "Grand Ballroom",
      address: "Same venue - Indoor reception hall",
      icon: "💃"
    }
  ];

  return (
    <section className="py-20 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
            Wedding Details
          </h2>
          <div className="w-24 h-px bg-champagne mx-auto mb-8" />
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join us for a celebration of love, laughter, and happily ever after
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {details.map((detail, index) => (
            <Card 
              key={detail.title}
              className="bg-card border-0 shadow-romantic hover:shadow-elegant transition-shadow duration-300 animate-fade-in-up"
              style={{animationDelay: `${index * 0.2}s`}}
            >
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4">{detail.icon}</div>
                <h3 className="font-serif text-2xl font-semibold text-foreground mb-2">
                  {detail.title}
                </h3>
                <div className="text-rose font-medium text-lg mb-4">{detail.time}</div>
                <div className="space-y-2">
                  <p className="text-foreground font-medium">{detail.location}</p>
                  <p className="text-muted-foreground text-sm">{detail.address}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center bg-sage-light p-8 rounded-lg">
          <h3 className="font-serif text-2xl font-semibold text-foreground mb-4">
            Important Information
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-left max-w-4xl mx-auto">
            <div>
              <h4 className="font-semibold text-foreground mb-2">RSVP Deadline</h4>
              <p className="text-muted-foreground">Kindly respond by <span className="text-rose font-semibold">May 1st, 2024</span></p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Adults-Only Celebration</h4>
              <p className="text-muted-foreground">We love your little ones, but this is an adults-only celebration. Thank you for understanding!</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Dress Code</h4>
              <p className="text-muted-foreground">Cocktail attire suggested. Think garden party elegance!</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Weather</h4>
              <p className="text-muted-foreground">Outdoor ceremony with indoor backup. Bring a light jacket for evening.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Parking</h4>
              <p className="text-muted-foreground">Complimentary valet parking available at the venue entrance.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Accommodations</h4>
              <p className="text-muted-foreground">Room blocks available at nearby hotels. Details in RSVP email.</p>
            </div>
          </div>
        </div>

        <LocationMap />
      </div>
    </section>
  );
};

export default WeddingDetails;