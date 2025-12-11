import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

const REVIEWS = [
  {
    name: "María González",
    role: "Monotributista",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces",
    text: "Encontré un plan de Galeno que me cubre todo lo que necesitaba y pago 30% menos que lo que me ofrecían directo. La atención de Hernán fue impecable.",
    stars: 5
  },
  {
    name: "Carlos Ruiz",
    role: "Relación de Dependencia",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=faces",
    text: "No sabía que podía derivar mis aportes de forma tan simple. Me ayudaron con todo el trámite en la AFIP y en 48hs ya tenía mi credencial provisoria.",
    stars: 5
  },
  {
    name: "Sofía Lemos",
    role: "Plan Familiar",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces",
    text: "El comparador es excelente, pero lo mejor es que te atiende una persona real. Me explicaron la letra chica de Sancor y Swiss Medical con total honestidad.",
    stars: 4
  }
];

export const Testimonials = () => {
  return (
    <section className="py-24 bg-white border-b border-slate-100">
      <div className="container mx-auto px-4">
        
        {/* Header de Sección con "Badge de Confianza" */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 px-4 py-1 rounded-full mb-6">
            <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => <Star key={i} size={12} className="fill-orange-500 text-orange-500" />)}
            </div>
            <span className="text-xs font-bold text-orange-700 uppercase tracking-wide">4.9/5 en Google Reviews</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
            La experiencia de elegir bien
          </h2>
          <p className="text-lg text-slate-500">
            Miles de argentinos ya mejoraron su cobertura médica con nosotros.
          </p>
        </div>

        {/* Grid de Testimonios */}
        <div className="grid md:grid-cols-3 gap-8">
          {REVIEWS.map((review, idx) => (
            <Card key={idx} className="border-0 shadow-lg shadow-slate-200/50 rounded-[2rem] bg-slate-50 hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden group">
              
              {/* Decoración de fondo (Comillas gigantes) */}
              <Quote className="absolute top-4 right-6 text-slate-200 w-24 h-24 rotate-12 opacity-50 group-hover:text-teal-100 group-hover:scale-110 transition-all duration-500" />

              <CardContent className="p-8 relative z-10 flex flex-col h-full">
                
                {/* Estrellas */}
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                        key={i} 
                        size={16} 
                        className={`${i < review.stars ? "fill-yellow-400 text-yellow-400" : "fill-slate-200 text-slate-200"}`} 
                    />
                  ))}
                </div>

                {/* Texto */}
                <p className="text-slate-700 leading-relaxed mb-8 flex-grow font-medium">
                  "{review.text}"
                </p>

                {/* Usuario */}
                <div className="flex items-center gap-4 mt-auto pt-6 border-t border-slate-200/60">
                  <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                    <AvatarImage src={review.image} alt={review.name} />
                    <AvatarFallback className="bg-teal-100 text-teal-700 font-bold">
                        {review.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{review.name}</p>
                    <p className="text-xs text-slate-500 font-medium">{review.role}</p>
                  </div>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
};