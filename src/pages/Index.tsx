import HeroSection from "@/components/HeroSection";
// import AboutSection from "@/components/AboutSection";
import WeddingDetails from "@/components/WeddingDetails";
import RSVPSection from "@/components/RSVPSection";
import RegistrySection from "@/components/RegistrySection";
import Footer from "@/components/Footer";
import FloatingElements from "@/components/FloatingHearts";
import LocationMap from "@/components/LocationMap";
import palettaMansion from "@/assets/paletta-mansion-illustration.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <FloatingElements />
      <HeroSection />
      <div className="px-6 bg-background">
        <img 
          src={palettaMansion} 
          alt="Paletta Mansion illustration" 
          className="max-w-4xl w-full mx-auto"
        />
      </div>
      <WeddingDetails />
      <RSVPSection />
      <section className="py-20 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <LocationMap />
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Index;
