import swansImage from "@/assets/swans.png";

const Footer = () => {
  return (
    <footer className="bg-background text-foreground py-12 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <img 
            src={swansImage} 
            alt="Genna and Julian" 
            className="h-24 md:h-32 mx-auto object-contain"
          />
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8 text-sm max-w-xl mx-auto">
          <div>
            <h4 className="font-semibold mb-2">Contact</h4>
            <p className="opacity-80">Questions? Email us at</p>
            <p className="text-champagne">GennaandJulian@gmail.com</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">RSVP Deadline</h4>
            <p className="opacity-80">Please respond by</p>
            <p className="text-rose">February 28th, 2026</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
