import { Button } from "@/components/ui/button";
import heroImage from "@/assets/wedding-hero.jpg";
import namesImage from "@/assets/genna-julian-names.png";
import { useState, useEffect } from "react";

const HeroSection = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const weddingDate = new Date('2026-04-25T16:00:00');
    
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = weddingDate.getTime() - now.getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const scrollToRSVP = () => {
    const rsvpSection = document.getElementById('rsvp-section');
    if (rsvpSection) {
      rsvpSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative flex items-center justify-center overflow-hidden bg-background pt-12 md:pt-20">
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
        
        <div className="text-lg md:text-xl text-foreground mb-8 animate-fade-in-up">
          <p className="font-serif italic">Paletta Mansion</p>
          <p>4250 Lakeshore Road, Burlington</p>
        </div>

        {/* Countdown Timer */}
        <div className="flex justify-center items-center gap-3 md:gap-6 mb-10 animate-fade-in-up">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-foreground">{timeLeft.days}</div>
            <div className="text-sm text-foreground/70 uppercase tracking-wide">Days</div>
          </div>
          <span className="text-2xl md:text-3xl text-foreground/40 font-light self-start mt-1">:</span>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-foreground">{timeLeft.hours}</div>
            <div className="text-sm text-foreground/70 uppercase tracking-wide">Hours</div>
          </div>
          <span className="text-2xl md:text-3xl text-foreground/40 font-light self-start mt-1">:</span>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-foreground">{timeLeft.minutes}</div>
            <div className="text-sm text-foreground/70 uppercase tracking-wide">Minutes</div>
          </div>
          <span className="text-2xl md:text-3xl text-foreground/40 font-light self-start mt-1">:</span>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-foreground">{timeLeft.seconds}</div>
            <div className="text-sm text-foreground/70 uppercase tracking-wide">Seconds</div>
          </div>
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