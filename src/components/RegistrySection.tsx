import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const RegistrySection = () => {
  const registries = [
    {
      name: "Williams Sonoma",
      description: "Kitchen essentials and home decor for our new life together",
      url: "#",
      color: "bg-rose"
    },
    {
      name: "Crate & Barrel",
      description: "Furniture and home accessories for our dream home",
      url: "#", 
      color: "bg-sage"
    },
    {
      name: "Target",
      description: "Everyday items and practical gifts for newlyweds",
      url: "#",
      color: "bg-champagne"
    }
  ];

  return (
    <section className="py-20 px-6 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
            Gift Registry
          </h2>
          <p className="text-xl text-foreground max-w-2xl mx-auto">
            Your presence is the greatest gift, but if you'd like to celebrate with a gift, 
            we've registered at a few of our favorite places
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {registries.map((registry, index) => (
            <Card 
              key={registry.name}
              className="bg-card border-0 shadow-romantic hover:shadow-elegant transition-all duration-300 hover:scale-105 animate-fade-in-up"
              style={{animationDelay: `${index * 0.2}s`}}
            >
              <CardContent className="p-8 text-center">
                <div className={`w-16 h-16 ${registry.color} rounded-full mx-auto mb-6 flex items-center justify-center`}>
                  <span className="text-white text-2xl">🎁</span>
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                  {registry.name}
                </h3>
                <p className="text-foreground text-sm mb-6">
                  {registry.description}
                </p>
                <Button 
                  variant="default"
                  className="bg-rose hover:bg-rose/90 text-rose-foreground font-semibold transition-colors"
                  onClick={() => window.open(registry.url, '_blank')}
                >
                  View Registry
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center bg-sage-light p-8 rounded-lg animate-scale-in">
          <h3 className="font-serif text-2xl font-semibold text-foreground mb-4">
            Honeymoon Fund
          </h3>
          <p className="text-foreground mb-6 max-w-2xl mx-auto">
            We're also saving for our dream honeymoon in Italy! If you'd prefer to contribute 
            to our adventure fund, we've set up a special honeymoon registry.
          </p>
          <Button 
            className="bg-champagne hover:bg-champagne/90 text-champagne-foreground font-semibold shadow-romantic"
          >
            Contribute to Honeymoon
          </Button>
        </div>

        <div className="mt-12 text-center">
          <p className="text-foreground italic">
            "The best gifts are those that come from the heart. Thank you for being part of our special day!"
          </p>
          <p className="text-foreground font-medium mt-2">— Genna & Julian</p>
        </div>
      </div>
    </section>
  );
};

export default RegistrySection;