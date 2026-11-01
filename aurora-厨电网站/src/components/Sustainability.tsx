import sustainImg from "@/assets/sustainability.jpg";

const stats = [
  { value: "38%", label: "Energy Reduction Since 2018" },
  { value: "92%", label: "Recyclable Components" },
  { value: "A+++", label: "Efficiency Rating Standard" },
];

const Sustainability = () => {
  return (
    <section id="sustainability" className="py-24 md:py-36 max-w-[1400px] mx-auto px-6 md:px-12">
      <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
        <div className="reveal">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-6">Responsibility</p>
          <h2 className="text-foreground text-3xl md:text-4xl font-light leading-[1.15] mb-8" style={{ lineHeight: "1.15" }}>
            Innovation With
            <br />Purpose
          </h2>
          <p className="text-muted-foreground text-base font-light leading-relaxed max-w-md mb-10">
            Every appliance is designed with its full lifecycle in mind — from responsibly sourced materials to energy-efficient operation and end-of-life recyclability. We believe luxury and sustainability are inseparable.
          </p>
          <div className="flex flex-wrap gap-10">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-foreground text-2xl font-light">{s.value}</p>
                <p className="text-muted-foreground text-xs tracking-[0.1em] mt-1 max-w-[140px]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="reveal reveal-delay-2 aspect-[4/5] overflow-hidden">
          <img
            src={sustainImg}
            alt="Sustainable technology"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default Sustainability;
