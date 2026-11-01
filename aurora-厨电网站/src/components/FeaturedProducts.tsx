import { Button } from "@/components/ui/button";
import catKitchen from "@/assets/cat-kitchen.jpg";
import catCooling from "@/assets/cat-cooling.jpg";
import catAircare from "@/assets/cat-aircare.jpg";

const products = [
  {
    name: "Série Noire Oven",
    feature: "Dual convection · Self-cleaning · 72L capacity",
    image: catKitchen,
  },
  {
    name: "Frost-Free Column",
    feature: "BioFresh · Whisper-quiet 32dB · A+++ rated",
    image: catCooling,
  },
  {
    name: "AirSense Pro",
    feature: "HEPA 14 · Smart sensor · 68m² coverage",
    image: catAircare,
  },
];

const FeaturedProducts = () => {
  return (
    <section className="py-24 md:py-36 max-w-[1400px] mx-auto px-6 md:px-12">
      <div className="reveal text-center mb-16">
        <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4">Featured</p>
        <h2 className="text-foreground text-3xl md:text-4xl font-light">Signature Pieces</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {products.map((p, i) => (
          <div key={p.name} className={`reveal reveal-delay-${i + 1} group`}>
            <div className="aspect-square bg-secondary overflow-hidden mb-6 flex items-center justify-center p-8">
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-700"
              />
            </div>
            <h3 className="text-foreground text-lg font-normal mb-2">{p.name}</h3>
            <p className="text-muted-foreground text-sm font-light mb-5">{p.feature}</p>
            <Button variant="luxury-outline" size="sm" className="px-6">
              View Details
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
