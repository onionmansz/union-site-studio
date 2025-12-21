import { Button } from "@/components/ui/button";
import heroImage from "@/assets/wedding-hero.jpg";

const HeroSection = () => {
  const scrollToRSVP = () => {
    const rsvpSection = document.getElementById('rsvp-section');
    if (rsvpSection) {
      rsvpSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6 animate-fade-in">
        <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-elegant">
        <h1 className="font-script font-bold text-6xl md:text-8xl text-sage mb-6 tracking-wide drop-shadow-lg">
          Genna <span className="font-script text-rose">&</span> Julian
        </h1>
        
        <div className="w-24 h-px bg-champagne mx-auto mb-8 animate-scale-in" />
        
        <p className="text-xl md:text-2xl text-muted-foreground font-light mb-8 animate-fade-in-up">
          Together with our families, we invite you to celebrate our love story
        </p>
        
        <div className="text-lg md:text-xl text-sage mb-12 animate-fade-in-up">
          <p className="font-serif italic">April 25th, 2026</p>
          <p className="text-muted-foreground">Paletta Mansion, Burlington</p>
        </div>
        
        <Button 
          size="lg" 
          onClick={scrollToRSVP}
          className="bg-foreground hover:bg-foreground/90 text-cream px-8 py-3 text-lg font-semibold shadow-romantic animate-scale-in"
        >
          Répondez S'il Vous Plaît
        </Button>
        </div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute bottom-32 right-16 w-3 h-3 bg-rose rounded-full opacity-40 animate-float" style={{animationDelay: '1s'}} />
      <div className="absolute top-1/3 right-8 w-2 h-2 bg-sage rounded-full opacity-50 animate-float" style={{animationDelay: '2s'}} />
    </section>
  );
};

export default HeroSection;