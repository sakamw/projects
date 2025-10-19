import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import HowItWorksSection from "../components/HowItWorksSection";
import AboutSection from "../components/AboutSection";
import ContactSection from "../components/ContactSection";
import CareersSection from "../components/CareersSection";
import LegalSection from "../components/LegalSection";
import Footer from "../components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <AboutSection />
      <ContactSection />
      <CareersSection />
      <LegalSection />
      <Footer />
    </div>
  );
};

export default Index;
