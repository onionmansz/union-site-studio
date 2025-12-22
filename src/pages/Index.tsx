import HeroSection from "@/components/HeroSection";
// import AboutSection from "@/components/AboutSection";
import WeddingDetails from "@/components/WeddingDetails";
import RSVPSection from "@/components/RSVPSection";
import RegistrySection from "@/components/RegistrySection";
import Footer from "@/components/Footer";
import FloatingElements from "@/components/FloatingHearts";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <FloatingElements />
      <HeroSection />
      <WeddingDetails />
      <RSVPSection />
      <RegistrySection />
      <Footer />
    </div>
  );
};

export default Index;
