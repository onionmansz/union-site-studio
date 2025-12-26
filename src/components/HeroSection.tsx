import { Button } from "@/components/ui/button";
import heroImage from "@/assets/wedding-hero.jpg";
import namesImage from "@/assets/genna-julian-names.png";

const HeroSection = () => {
  const scrollToRSVP = () => {
    const rsvpSection = document.getElementById('rsvp-section');
    if (rsvpSection) {
      rsvpSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6 animate-fade-in">
        <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-elegant">
        <img 
          src={namesImage} 
          alt="Genna and Julian" 
          className="w-full max-w-md md:max-w-lg mx-auto mb-6"
        />
        
        <p className="text-xl md:text-2xl text-foreground font-light mb-8 animate-fade-in-up">
          You are cordially invited to celebrate our wedding on the twenty-fifth of April, two thousand and twenty-six.
        </p>
        
        <div className="text-lg md:text-xl text-foreground mb-12 animate-fade-in-up">
          <p className="font-serif italic">Paletta Mansion</p>
          <p>4250 Lakeshore Road, Burlington</p>
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