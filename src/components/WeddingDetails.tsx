import { Card, CardContent } from "@/components/ui/card";

const WeddingDetails = () => {
  const details = [
    {
      title: "Ceremony",
      time: "4:00 PM"
    },
    {
      title: "Cocktail Hour",
      time: "4:30 PM"
    },
    {
      title: "Reception",
      time: "5:30 PM"
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
                <h3 className="font-serif text-2xl font-semibold text-foreground mb-2">
                  {detail.title}
                </h3>
                <div className="text-foreground font-medium text-lg">{detail.time}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center bg-card p-8 rounded-lg shadow-romantic">
          <h3 className="font-serif text-2xl font-semibold text-foreground mb-6">
            Important Information
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-center max-w-5xl mx-auto mb-6">
            <div>
              <h4 className="font-semibold text-foreground mb-2">RSVP Deadline</h4>
              <p className="text-foreground">Kindly respond by <span className="font-semibold">February 28th, 2026</span></p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Dress Code</h4>
              <p className="text-foreground">Cocktail attire suggested.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Parking</h4>
              <p className="text-foreground">Overnight parking available on site. Cars must be removed by 9:30am the next morning.</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6 text-center max-w-5xl mx-auto">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Adults-Only Reception</h4>
              <p className="text-foreground">Our wedding will be an adults-only celebration. Thank you for understanding!</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Weather</h4>
              <p className="text-foreground">Ceremony will be held under a covered porch outdoors.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Accommodations</h4>
              <p className="text-foreground">
                <a 
                  href="https://maps.app.goo.gl/oahHDieuEoFREPRt6" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-foreground underline hover:text-foreground/80 transition-colors"
                >
                  Nearby hotels list
                </a>
              </p>
            </div>
          </div>

          {/* Menu Section */}
          <div className="mt-10 pt-8 border-t border-border">
            <h4 className="font-serif text-2xl font-semibold text-foreground mb-8 text-center">
              Menu
            </h4>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Cocktail Hour */}
              <div className="text-center">
                <h5 className="font-semibold text-foreground text-lg mb-4">Cocktail Hour</h5>
                <ul className="space-y-2 text-foreground">
                  <li>Coconut shrimp with pineapple ginger dip</li>
                  <li>Spanakopita - cheese and spinach, with tzatziki</li>
                  <li>Fried chicken and cornbread with jalapeño and slaw</li>
                  <li>BBQ pulled chicken slider with crunchy pickle slaw</li>
                  <li>Korean beef skewers with sweet ginger sauce</li>
                </ul>
              </div>

              {/* Dinner */}
              <div className="text-center">
                <h5 className="font-semibold text-foreground text-lg mb-4">Dinner</h5>
                <div className="text-foreground space-y-4">
                  <p>To start, a kale and brussels sprout caesar salad with smoked bacon (optional), asiago and lemon chia yogurt dressing.</p>
                  <div>
                    <p className="mb-2">Followed by your choice of:</p>
                    <ul className="space-y-1">
                      <li>• Prime rib roast with crispy onion and red wine jus</li>
                      <li>• Crispy chicken supreme stuffed with basil pesto, fontina and goat cheese</li>
                    </ul>
                    <p className="mt-2">Served with mashed potatoes and seasonal vegetables</p>
                  </div>
                  <p>For dessert, chef's homemade crème brûlée served with fresh berries and biscotti.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeddingDetails;