const providers = [
  { name: "OSDE", logo: "/assets/images/card-header/osde.png" },
  { name: "Swiss Medical", logo: "/assets/images/card-header/swissmedical.webp" },
  { name: "Galeno", logo: "/assets/images/card-header/galeno.webp" },
  { name: "Medifé", logo: "/assets/images/card-header/medife.webp" },
  { name: "Omint", logo: "/assets/images/card-header/omint.webp" },
  { name: "Sancor Salud", logo: "/assets/images/card-header/sancorsalud.webp" },
];

const LogosGrid = () => {
  return (
    <section className="py-20 px-4 bg-secondary/30">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
          Prepagas destacadas
        </h2>
        <p className="text-center text-muted-foreground mb-12">
          Trabajamos con las mejores prepagas de Argentina
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {providers.map((provider) => (
            <div
              key={provider.name}
              className="bg-background rounded-lg p-6 flex items-center justify-center border border-border hover:shadow-lg transition-shadow"
            >
              <img
                src={provider.logo}
                alt={provider.name}
                className="max-h-12 max-w-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogosGrid;
