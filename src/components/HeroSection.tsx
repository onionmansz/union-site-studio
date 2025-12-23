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
          Genna<span className="font-serif text-xl md:text-3xl text-rose align-middle uppercase tracking-widest pl-2 pr-5"> AND </span>Julian
        </h1>
        
        <div className="w-24 h-px bg-champagne mx-auto mb-8 animate-scale-in" />
        
        <p className="text-xl md:text-2xl text-muted-foreground font-light mb-8 animate-fade-in-up">
          You are cordially invited to celebrate our wedding on the twenty-fifth of April, two thousand and twenty-six.
        </p>
        
        <div className="text-lg md:text-xl text-sage mb-12 animate-fade-in-up">
          <p className="font-script text-3xl md:text-4xl">Paletta Mansion</p>
          <p className="text-muted-foreground">4250 Lakeshore Road, Burlington</p>
        </div>
        
        <Button 
          size="lg" 
          onClick={scrollToRSVP}
          className="bg-foreground hover:bg-foreground/90 text-background px-8 py-3 text-lg font-semibold shadow-romantic animate-scale-in"
        >
          Répondez S'il Vous Plaît
        </Button>
        </div>
      </div>
      
    </section>
  );
};

export default HeroSection;