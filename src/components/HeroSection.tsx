import { Button } from "@/components/ui/button";
import heroImage from "@/assets/wedding-hero.jpg";

const HeroSection = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6 animate-fade-in">
        <h1 className="font-serif text-6xl md:text-8xl font-bold text-foreground mb-6 tracking-wide">
          Genna <span className="text-rose">&</span> Julian
        </h1>
        
        <div className="w-24 h-px bg-champagne mx-auto mb-8 animate-scale-in" />
        
        <p className="text-xl md:text-2xl text-muted-foreground font-light mb-8 animate-fade-in-up">
          Together with our families, we invite you to celebrate our love story
        </p>
        
        <div className="text-lg md:text-xl text-foreground mb-12 animate-fade-in-up">
          <p className="font-serif italic">April 25th, 2026</p>
          <p className="text-muted-foreground">Paletta Mansion, Burlington</p>
        </div>
        
        <Button 
          size="lg" 
          className="bg-rose hover:bg-rose/90 text-rose-foreground px-8 py-3 text-lg font-medium shadow-romantic animate-scale-in"
        >
          RSVP Now
        </Button>
      </div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-champagne rounded-full opacity-60 animate-float" />
      <div className="absolute bottom-32 right-16 w-3 h-3 bg-rose rounded-full opacity-40 animate-float" style={{animationDelay: '1s'}} />
      <div className="absolute top-1/3 right-8 w-2 h-2 bg-sage rounded-full opacity-50 animate-float" style={{animationDelay: '2s'}} />
    </section>
  );
};

export default HeroSection;