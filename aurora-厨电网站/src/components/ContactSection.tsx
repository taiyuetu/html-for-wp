import { Button } from "@/components/ui/button";
import showroomImg from "@/assets/showroom.jpg";

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 md:py-36 bg-charcoal">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div className="reveal">
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-6">Experience</p>
            <h2 className="text-ivory text-3xl md:text-4xl font-light leading-[1.15] mb-8" style={{ lineHeight: "1.15" }}>
              Visit Our Showroom
            </h2>
            <p className="text-ivory/60 text-base font-light leading-relaxed max-w-md mb-10">
              Experience our collection in person. Our design consultants are available to guide you through every detail.
            </p>

            <form className="space-y-5 max-w-md" onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full bg-transparent border-b border-ivory/20 text-ivory text-sm py-3 placeholder:text-ivory/30 focus:outline-none focus:border-gold transition-colors"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-transparent border-b border-ivory/20 text-ivory text-sm py-3 placeholder:text-ivory/30 focus:outline-none focus:border-gold transition-colors"
              />
              <textarea
                placeholder="Your Message"
                rows={3}
                className="w-full bg-transparent border-b border-ivory/20 text-ivory text-sm py-3 placeholder:text-ivory/30 focus:outline-none focus:border-gold transition-colors resize-none"
              />
              <Button variant="hero" size="lg" className="mt-4">
                Book a Visit
              </Button>
            </form>
          </div>

          <div className="reveal reveal-delay-2 aspect-[4/5] overflow-hidden">
            <img
              src={showroomImg}
              alt="Luxury appliance showroom"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
