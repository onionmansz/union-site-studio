const AboutSection = () => {
  return (
    <section className="py-20 px-6 bg-gradient-romantic">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-16">
          Our Love Story
        </h2>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-left">
            <div className="animate-fade-in-up">
              <h3 className="font-serif text-2xl font-semibold text-rose mb-3">How We Met</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our paths crossed at a coffee shop in downtown San Francisco on a rainy Tuesday morning. 
                Sarah was reading her favorite novel while Michael was sketching architectural designs. 
                A shared love for creativity sparked our first conversation.
              </p>
            </div>
            
            <div className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <h3 className="font-serif text-2xl font-semibold text-sage mb-3">The Proposal</h3>
              <p className="text-muted-foreground leading-relaxed">
                Three years later, during a sunset hike at our favorite trail, Michael got down on one knee 
                with a ring he designed himself. Sarah said yes before he could even finish asking the question!
              </p>
            </div>
          </div>
          
          <div className="animate-scale-in">
            <div className="bg-card p-8 rounded-lg shadow-elegant">
              <div className="text-center">
                <div className="w-16 h-16 bg-champagne rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">💕</span>
                </div>
                <h4 className="font-serif text-xl font-semibold text-foreground mb-2">
                  Together for 5 years
                </h4>
                <p className="text-muted-foreground">
                  "We've grown together, laughed together, and built a beautiful life. 
                  Now we can't wait to make it official and celebrate with all of you!"
                </p>
                <div className="mt-4 text-sm text-sage font-medium">
                  — Sarah & Michael
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;