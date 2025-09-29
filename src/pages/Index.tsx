import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import WeddingDetails from "@/components/WeddingDetails";
import RSVPSection from "@/components/RSVPSection";
import RegistrySection from "@/components/RegistrySection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <AboutSection />
      <WeddingDetails />
      <RSVPSection />
      <RegistrySection />
      <Footer />
    </div>
  );
};

export default Index;
