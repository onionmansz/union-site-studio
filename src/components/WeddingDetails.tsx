import { Card, CardContent } from "@/components/ui/card";

const WeddingDetails = () => {
  const details = [
    {
      title: "Ceremony",
      time: "4:00 PM",
      icon: "🌸"
    },
    {
      title: "Cocktail Hour",
      time: "4:30 PM",
      icon: "🥂"
    },
    {
      title: "Reception",
      time: "5:30 PM",
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
          <p className="text-xl text-foreground max-w-2xl mx-auto">
            We can't wait to celebrate with you!
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
                <div className="text-foreground font-medium text-lg">{detail.time}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center bg-sage-light p-8 rounded-lg">
          <h3 className="font-serif text-2xl font-semibold text-foreground mb-6">
            Important Information
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-center max-w-5xl mx-auto mb-6">
            <div>
              <h4 className="font-semibold text-foreground mb-2">RSVP Deadline</h4>
              <p className="text-foreground">Kindly respond by <span className="text-rose font-semibold">February 28th, 2026</span></p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Dress Code</h4>
              <p className="text-foreground">Cocktail attire suggested. Think garden party elegance!</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Parking</h4>
              <p className="text-foreground">Complimentary valet parking available at the venue entrance.</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6 text-center max-w-3xl mx-auto">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Adults-Only Reception</h4>
              <p className="text-foreground">Little ones are welcome to join us for the ceremony! However, our reception will be an adults-only celebration. Thank you for understanding!</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Weather</h4>
              <p className="text-foreground">Outdoor ceremony with indoor backup. Bring a light jacket for evening.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeddingDetails;