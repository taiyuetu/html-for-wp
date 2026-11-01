import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import BrandStory from "@/components/BrandStory";
import ProductCategories from "@/components/ProductCategories";
import FeaturedProducts from "@/components/FeaturedProducts";
import SmartLiving from "@/components/SmartLiving";
import Materials from "@/components/Materials";
import LifestyleGrid from "@/components/LifestyleGrid";
import Sustainability from "@/components/Sustainability";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const Index = () => {
  useScrollReveal();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <BrandStory />
      <ProductCategories />
      <FeaturedProducts />
      <SmartLiving />
      <Materials />
      <LifestyleGrid />
      <Sustainability />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
