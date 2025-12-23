import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <h3 className="font-script text-4xl md:text-5xl text-sage tracking-wide">
            Genna<span className="font-serif text-sm md:text-base text-rose align-middle uppercase tracking-widest px-2"> AND </span>Julian
          </h3>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-8 text-sm">
          <div>
            <h4 className="font-semibold mb-2">Contact</h4>
            <p className="opacity-80">Questions? Email us at</p>
            <p className="text-champagne">hello@vajayjayandgeeeners.com</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">RSVP Deadline</h4>
            <p className="opacity-80">Please respond by</p>
            <p className="text-rose">February 28th, 2026</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Follow Our Journey</h4>
            <p className="opacity-80">Wedding hashtag:</p>
            <p className="text-sage">#VajayjayAndGeenersSayIDo</p>
          </div>
        </div>
        
        <div className="border-t border-background/20 pt-6">
          <p className="text-sm opacity-60">
            Made with love for our special day ❤️
          </p>
          <Link 
            to="/auth" 
            className="text-xs opacity-40 hover:opacity-60 transition-opacity mt-2 inline-block"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;