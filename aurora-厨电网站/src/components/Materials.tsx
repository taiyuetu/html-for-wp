import steelImg from "@/assets/material-steel.jpg";
import glassImg from "@/assets/material-glass.jpg";

const materials = [
  { name: "Brushed Steel", desc: "Hand-finished, fingerprint-resistant", image: steelImg },
  { name: "Matte Glass", desc: "Scratch-resistant ceramic coating", image: glassImg },
  { name: "Warm Bronze", desc: "PVD-coated titanium alloy", image: steelImg },
  { name: "Arctic White", desc: "Anti-microbial enamel surface", image: glassImg },
];

const Materials = () => {
  return (
    <section id="craftsmanship" className="py-24 md:py-36 max-w-[1400px] mx-auto px-6 md:px-12">
      <div className="reveal text-center mb-16">
        <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4">Materials</p>
        <h2 className="text-foreground text-3xl md:text-4xl font-light">Crafted to Perfection</h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {materials.map((m, i) => (
          <div key={m.name} className={`reveal reveal-delay-${i + 1} group cursor-pointer`}>
            <div className="aspect-square overflow-hidden mb-4">
              <img
                src={m.image}
                alt={m.name}
                className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
              />
            </div>
            <h4 className="text-foreground text-sm font-medium mb-1">{m.name}</h4>
            <p className="text-muted-foreground text-xs font-light">{m.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Materials;
