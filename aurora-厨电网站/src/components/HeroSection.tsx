import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-kitchen.jpg";

const HeroSection = () => {
  return (
    <section className="relative w-full h-screen min-h-[600px] max-h-[1100px] overflow-hidden">
      <img
        src={heroImg}
        alt="Premium kitchen with built-in appliances"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-charcoal/40" />

      <div className="relative z-10 flex flex-col justify-end h-full max-w-[1400px] mx-auto px-6 md:px-12 pb-20 md:pb-32">
        <p className="text-ivory/70 text-xs tracking-[0.3em] uppercase mb-4 animate-fade-up" style={{ animationDelay: "200ms" }}>
          The Art of Living Well
        </p>
        <h1
          className="text-ivory text-4xl md:text-6xl lg:text-7xl font-light leading-[1.05] max-w-3xl mb-6 animate-fade-up"
          style={{ animationDelay: "400ms", lineHeight: "1.05" }}
        >
          Precision Crafted
          <br />
          for Modern Living
        </h1>
        <p
          className="text-ivory/70 text-base md:text-lg font-light max-w-lg mb-10 animate-fade-up"
          style={{ animationDelay: "600ms" }}
        >
          Where engineering excellence meets timeless design. Appliances that elevate every moment at home.
        </p>
        <div className="flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: "800ms" }}>
          <Button variant="hero" size="xl">Discover Collection</Button>
          <Button variant="hero-outline" size="xl">Our Story</Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
