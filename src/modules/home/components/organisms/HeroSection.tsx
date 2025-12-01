import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 md:py-32 px-4 bg-gradient-to-b from-secondary/30 to-background">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
              Encontrá el plan de salud perfecto para vos
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Compará planes de las mejores prepagas de Argentina y elegí el que mejor se adapte a tus necesidades.
            </p>
            <Button 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={() => navigate('/resultados')}
            >
              Cotizar ahora
            </Button>
          </div>
          <div className="relative">
            <div className="bg-muted rounded-lg shadow-2xl border border-border overflow-hidden">
              <div className="bg-accent p-3 border-b border-border flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive"></div>
                <div className="w-3 h-3 rounded-full bg-warning"></div>
                <div className="w-3 h-3 rounded-full bg-success"></div>
              </div>
              <div className="p-8 space-y-4">
                <div className="h-4 bg-primary/20 rounded w-3/4"></div>
                <div className="h-4 bg-primary/10 rounded w-1/2"></div>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-card p-4 rounded-lg border border-border">
                      <div className="h-12 w-12 bg-primary/20 rounded mb-2"></div>
                      <div className="h-3 bg-muted rounded w-full mb-2"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
