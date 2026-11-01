import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const links = ["Products", "Smart Living", "Craftsmanship", "Sustainability", "Contact"];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between h-16 md:h-20">
        <a href="#" className="text-foreground font-semibold tracking-[0.3em] uppercase text-sm">
          Atelier
        </a>

        <div className="hidden md:flex items-center gap-10">
          {links.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(" ", "-")}`}
              className="text-muted-foreground text-xs tracking-[0.15em] uppercase hover:text-foreground transition-colors duration-300"
            >
              {link}
            </a>
          ))}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-foreground active:scale-95 transition-transform"
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-background border-t border-border px-6 py-6 space-y-4">
          {links.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(" ", "-")}`}
              className="block text-muted-foreground text-sm tracking-[0.12em] uppercase hover:text-foreground transition-colors"
              onClick={() => setOpen(false)}
            >
              {link}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
