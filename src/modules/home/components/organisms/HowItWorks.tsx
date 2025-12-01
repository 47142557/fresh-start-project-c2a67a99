import { Search, FileCheck, Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const HowItWorks = () => {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
          ¿Cómo funciona?
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          En solo tres simples pasos podés encontrar el plan ideal
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Search className="w-8 h-8 text-primary" />
              </div>
              <CardTitle>1. Explorá</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Navegá por todos los planes disponibles y filtrá por precio, cobertura y clínicas
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <FileCheck className="w-8 h-8 text-primary" />
              </div>
              <CardTitle>2. Compará</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Seleccioná hasta 3 planes y comparalos lado a lado para ver diferencias
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <CardTitle>3. Elegí</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Tomá la mejor decisión con toda la información a tu alcance
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
