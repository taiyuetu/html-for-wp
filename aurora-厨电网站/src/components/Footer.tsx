const Footer = () => {
  const columns = [
    { title: "Products", links: ["Kitchen", "Laundry", "Cooling", "Air Care"] },
    { title: "Company", links: ["Our Story", "Careers", "Press", "Sustainability"] },
    { title: "Support", links: ["Contact", "Warranty", "Service", "Find a Dealer"] },
  ];

  return (
    <footer className="bg-foreground text-ivory/80 py-16 md:py-24">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-5 gap-12 md:gap-8 mb-16">
          <div className="md:col-span-2">
            <p className="text-ivory font-semibold tracking-[0.3em] uppercase text-sm mb-4">Atelier</p>
            <p className="text-ivory/40 text-sm font-light leading-relaxed max-w-xs">
              Precision-crafted home appliances for those who appreciate the finer details of modern living.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-ivory/50 text-xs tracking-[0.2em] uppercase mb-4">{col.title}</p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-ivory/40 text-sm font-light hover:text-ivory transition-colors duration-300">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-ivory/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-ivory/30 text-xs font-light">
            © 2026 Atelier Home. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Cookies"].map((item) => (
              <a key={item} href="#" className="text-ivory/30 text-xs font-light hover:text-ivory/60 transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
