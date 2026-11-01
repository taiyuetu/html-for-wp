import { Button } from "@/components/ui/button";
import catKitchen from "@/assets/cat-kitchen.jpg";
import catLaundry from "@/assets/cat-laundry.jpg";
import catCooling from "@/assets/cat-cooling.jpg";
import catAircare from "@/assets/cat-aircare.jpg";

const categories = [
  { title: "Kitchen", desc: "Ovens, cooktops & integrated systems", image: catKitchen },
  { title: "Laundry", desc: "Washing & drying perfected", image: catLaundry },
  { title: "Cooling", desc: "Refrigeration redefined", image: catCooling },
  { title: "Air Care", desc: "Purified living environments", image: catAircare },
];

const ProductCategories = () => {
  return (
    <section id="products" className="py-24 md:py-36 bg-secondary/50">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="reveal text-center mb-16">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4">Collections</p>
          <h2 className="text-foreground text-3xl md:text-4xl font-light">Explore by Category</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <div
              key={cat.title}
              className={`reveal reveal-delay-${i + 1} group cursor-pointer`}
            >
              <div className="aspect-[3/4] overflow-hidden mb-5">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                />
              </div>
              <h3 className="text-foreground text-lg font-normal mb-1">{cat.title}</h3>
              <p className="text-muted-foreground text-sm font-light mb-4">{cat.desc}</p>
              <Button variant="luxury-outline" size="sm" className="px-6">
                Explore
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;
