import brandImg from "@/assets/brand-story.jpg";

const BrandStory = () => {
  return (
    <section className="py-24 md:py-36 px-6 md:px-12 max-w-[1400px] mx-auto">
      <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
        <div className="reveal aspect-[4/5] overflow-hidden">
          <img
            src={brandImg}
            alt="Designer kitchen with natural light"
            className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700"
          />
        </div>

        <div className="reveal reveal-delay-2">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-6">Our Heritage</p>
          <h2 className="text-foreground text-3xl md:text-4xl font-light leading-[1.15] mb-8" style={{ lineHeight: "1.15" }}>
            A Legacy of
            <br />Quiet Excellence
          </h2>
          <div className="space-y-5 text-muted-foreground text-base font-light leading-relaxed max-w-md">
            <p>
              For over four decades, we have pursued a singular vision: to create home appliances that are as beautiful as they are intelligent. Every product begins with the understanding that your home deserves nothing less than perfection.
            </p>
            <p>
              Our engineers and designers work in concert, balancing form with function, innovation with intuition. The result is a collection that transforms daily rituals into moments of quiet luxury.
            </p>
          </div>
          <div className="mt-10 flex items-center gap-12">
            <div>
              <p className="text-foreground text-2xl font-light">43</p>
              <p className="text-muted-foreground text-xs tracking-[0.15em] uppercase mt-1">Years of Craft</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div>
              <p className="text-foreground text-2xl font-light">2.4M</p>
              <p className="text-muted-foreground text-xs tracking-[0.15em] uppercase mt-1">Homes Worldwide</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div>
              <p className="text-foreground text-2xl font-light">17</p>
              <p className="text-muted-foreground text-xs tracking-[0.15em] uppercase mt-1">Design Awards</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
