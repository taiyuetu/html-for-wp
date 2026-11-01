import smartImg from "@/assets/smart-living.jpg";
import lifestyleImg from "@/assets/lifestyle-1.jpg";

const blocks = [
  {
    image: smartImg,
    eyebrow: "Connected Home",
    title: "Every Appliance, One Touch Away",
    text: "Our intelligent ecosystem connects every appliance through a single, intuitive interface. Monitor, adjust, and optimize your home from anywhere in the world.",
    reverse: false,
  },
  {
    image: lifestyleImg,
    eyebrow: "Seamless Integration",
    title: "Designed to Disappear Into Your Home",
    text: "Flush-mount installations, custom panel-ready finishes, and whisper-quiet operation mean our appliances become part of your architecture — never an afterthought.",
    reverse: true,
  },
];

const SmartLiving = () => {
  return (
    <section id="smart-living" className="py-24 md:py-36 bg-charcoal">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 space-y-24">
        <div className="reveal text-center">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4">Technology</p>
          <h2 className="text-ivory text-3xl md:text-4xl font-light">Intelligent by Design</h2>
        </div>

        {blocks.map((block, i) => (
          <div
            key={i}
            className={`reveal grid md:grid-cols-2 gap-12 md:gap-20 items-center ${block.reverse ? "md:direction-rtl" : ""}`}
          >
            <div className={`aspect-[16/10] overflow-hidden ${block.reverse ? "md:order-2" : ""}`}>
              <img
                src={block.image}
                alt={block.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className={block.reverse ? "md:order-1" : ""}>
              <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4">{block.eyebrow}</p>
              <h3 className="text-ivory text-2xl md:text-3xl font-light leading-[1.2] mb-6" style={{ lineHeight: "1.2" }}>
                {block.title}
              </h3>
              <p className="text-ivory/60 text-base font-light leading-relaxed max-w-md">
                {block.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SmartLiving;
