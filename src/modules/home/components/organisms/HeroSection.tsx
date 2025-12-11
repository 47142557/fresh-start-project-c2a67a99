import { ArrowRight, Star, Users, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onQuoteClick: () => void;
}

export const HeroSection = ({ onQuoteClick }: HeroSectionProps) => {
  return (
    <section className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      
      {/* 1. VIDEO DE FONDO (Efecto Netflix) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-slate-900/50 z-10"></div> {/* Overlay oscuro */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          // Poster mientras carga el video
          poster="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop"
          className="w-full h-full object-cover"
        >
          {/* Video de stock gratuito (Pexels/Coverr) - Reemplázalo con el tuyo si tienes */}
          <source src="https://assets.mixkit.co/videos/preview/mixkit-family-walking-together-in-nature-39767-large.mp4" type="video/mp4" />
        </video>
      </div>

      {/* 2. CONTENIDO */}
      <div className="container mx-auto px-4 relative z-20 flex flex-col md:flex-row items-center justify-between gap-12">
        
        {/* Texto de Impacto */}
        <div className="text-white max-w-2xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-4 py-1.5 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Star className="text-yellow-400 w-4 h-4 fill-yellow-400" />
            <span className="text-sm font-medium">Elegido por +10.000 familias</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6 drop-shadow-lg animate-in fade-in slide-in-from-bottom-6 duration-1000">
            La salud que querés,<br />
            al precio que podés.
          </h1>
          
          <p className="text-lg md:text-xl text-slate-100 mb-8 font-medium drop-shadow-md max-w-lg animate-in fade-in slide-in-from-bottom-8 duration-1000 mx-auto md:mx-0">
            Comparamos todas las prepagas del país para que encuentres tu plan ideal en menos de 2 minutos.
          </p>
          
          {/* Botón Móvil (Solo visible en celular) */}
          <div className="md:hidden w-full">
            <Button 
              onClick={onQuoteClick}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold h-14 rounded-full text-lg shadow-xl"
            >
              Cotizar Ahora
            </Button>
          </div>
        </div>

        {/* 3. TARJETA FLOTANTE (Solo Desktop) */}
        <div className="hidden md:block w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 animate-in slide-in-from-right-10 duration-1000">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Encontrá tu Plan</h3>
          <p className="text-slate-500 mb-6 text-sm">Completá tus datos y recibí una comparativa personalizada.</p>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button onClick={onQuoteClick} className="p-4 rounded-2xl border-2 border-teal-600 bg-teal-50 text-teal-900 font-bold text-sm flex flex-col items-center gap-2 transition-all hover:scale-105">
                <Users size={24} /> Para Mí / Pareja
              </button>
              <button onClick={onQuoteClick} className="p-4 rounded-2xl border-2 border-slate-100 hover:border-teal-200 text-slate-500 font-bold text-sm flex flex-col items-center gap-2 transition-all hover:bg-slate-50">
                <Users size={24} /> Con Hijos
              </button>
            </div>
            
            <div className="pt-4">
              <Button 
                onClick={onQuoteClick}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold h-14 rounded-xl text-lg shadow-lg shadow-orange-100 transition-transform hover:scale-105"
              >
                Comenzar Cotización <ArrowRight className="ml-2" />
              </Button>
            </div>
            
            <p className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center gap-1">
              <ShieldCheck size={12} /> Tus datos están 100% protegidos
            </p>
          </div>
        </div>

      </div>

      {/* Wave Divider (Opcional para suavizar el corte) */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg className="relative block w-full h-[40px] md:h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-slate-50"></path>
        </svg>
      </div>
    </section>
  );
};