import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const RegistrySection = () => {
  return (
    <section className="py-20 px-6 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
            Gift Registry
          </h2>
          <p className="text-xl text-foreground max-w-2xl mx-auto">
            Your presence is the greatest gift, but if you'd like to celebrate with a gift,
            we've registered at one of our favorite places
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <Card className="bg-card border-0 shadow-romantic hover:shadow-elegant transition-all duration-300 hover:scale-105 animate-fade-in-up max-w-sm w-full">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-rose rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-white text-2xl">🎁</span>
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                Registry
              </h3>
              <p className="text-foreground text-sm mb-6">
                Browse our wedding registry
              </p>
              <Button
                variant="default"
                className="bg-rose hover:bg-rose/90 text-rose-foreground font-semibold transition-colors"
                onClick={() => window.open('#', '_blank')}
              >
                View Registry
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
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