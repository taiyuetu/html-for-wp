import heroImg from "@/assets/hero-kitchen.jpg";
import brandImg from "@/assets/brand-story.jpg";
import lifestyleImg from "@/assets/lifestyle-1.jpg";
import showroomImg from "@/assets/showroom.jpg";

const tiles = [
  { image: heroImg, label: "The Modern Kitchen", span: "md:col-span-2 md:row-span-2" },
  { image: brandImg, label: "Light & Space", span: "" },
  { image: lifestyleImg, label: "Open Living", span: "" },
  { image: showroomImg, label: "Curated Spaces", span: "md:col-span-2" },
];

const LifestyleGrid = () => {
  return (
    <section className="py-24 md:py-36 bg-secondary/50">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="reveal text-center mb-16">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4">Inspiration</p>
          <h2 className="text-foreground text-3xl md:text-4xl font-light">Live Beautifully</h2>
        </div>

        <div className="reveal grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[200px] md:auto-rows-[260px]">
          {tiles.map((tile, i) => (
            <div
              key={i}
              className={`${tile.span} relative overflow-hidden group cursor-pointer`}
            >
              <img
                src={tile.image}
                alt={tile.label}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-charcoal/20 group-hover:bg-charcoal/40 transition-colors duration-500" />
              <p className="absolute bottom-4 left-4 text-ivory text-xs tracking-[0.15em] uppercase font-light">
                {tile.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LifestyleGrid;
