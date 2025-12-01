import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const testimonials = [
  {
    name: "María González",
    text: "Encontré el plan perfecto para mi familia en minutos. La comparación fue muy clara y fácil de entender.",
    avatar: "MG"
  },
  {
    name: "Carlos Rodríguez",
    text: "Excelente servicio. Pude comparar todas las opciones sin complicaciones y elegir la mejor prepaga para mí.",
    avatar: "CR"
  },
  {
    name: "Laura Fernández",
    text: "Súper recomendable. Me ayudó a encontrar un plan con mejor cobertura y a un mejor precio.",
    avatar: "LF"
  }
];

const Testimonials = () => {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
          Lo que dicen nuestros usuarios
        </h2>
        <p className="text-center text-muted-foreground mb-12">
          Miles de personas ya encontraron su plan ideal
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <Card key={idx}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">"{testimonial.text}"</p>
                <div className="mt-4 text-warning">★★★★★</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
