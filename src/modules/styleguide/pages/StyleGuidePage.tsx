import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, Check, AlertCircle, Info, Zap, 
  ShieldCheck, Search, User, Phone, MessageSquare 
} from "lucide-react";
import { Link } from "react-router-dom";

const StyleGuidePage = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* Header Vitalia Style */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-teal-600"></div>
                Vitalia Design System
              </h1>
              <p className="text-xs text-slate-500">Guía de estilos oficial</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 space-y-16 max-w-5xl">
        
        {/* 1. Brand Identity */}
        <section>
          <SectionTitle number="01">Identidad de Marca</SectionTitle>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
              <div className="h-2 bg-teal-600 w-full"></div>
              <CardContent className="pt-6">
                <h3 className="font-bold text-lg text-slate-900 mb-2">Filosofía Visual</h3>
                <p className="text-slate-500 leading-relaxed">
                  Vitalia transmite <strong>confianza médica</strong> y <strong>agilidad tecnológica</strong>. 
                  Usamos fondos limpios (Slate-50), tarjetas blancas con sombras suaves y bordes muy redondeados (`rounded-3xl`) para una sensación amigable y moderna.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
              <div className="h-2 bg-orange-500 w-full"></div>
              <CardContent className="pt-6">
                <h3 className="font-bold text-lg text-slate-900 mb-2">Tipografía</h3>
                <div className="space-y-2">
                  <p className="text-4xl font-bold text-slate-900">Aa</p>
                  <p className="text-slate-500 font-medium">Plus Jakarta Sans / Inter</p>
                  <p className="text-xs text-slate-400">Usada para títulos y cuerpo. Priorizamos legibilidad y pesos `font-bold` para jerarquía.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 2. Colores */}
        <section>
          <SectionTitle number="02">Paleta de Colores</SectionTitle>
          
          {/* Brand Colors */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Colores Principales</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ColorSwatch 
                name="Brand Teal" 
                hex="#0d9488" 
                className="bg-teal-600" 
                textClass="text-white"
                usage="Logos, Iconos, Bordes activos"
              />
              <ColorSwatch 
                name="Action Orange" 
                hex="#f97316" 
                className="bg-orange-500" 
                textClass="text-white"
                usage="Botones CTA, Conversión"
              />
              <ColorSwatch 
                name="Dark Slate" 
                hex="#0f172a" 
                className="bg-slate-900" 
                textClass="text-white"
                usage="Textos principales, Botones secundarios"
              />
              <ColorSwatch 
                name="Background" 
                hex="#f8fafc" 
                className="bg-slate-50 border border-slate-200" 
                textClass="text-slate-900"
                usage="Fondo de página general"
              />
            </div>
          </div>

          {/* Functional Colors */}
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Colores Funcionales (Chips & Estados)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ColorSwatch 
                name="Success Light" 
                hex="bg-green-50" 
                className="bg-green-50 border border-green-100" 
                textClass="text-green-700"
                usage="Chips de descuento, Checks"
              />
              <ColorSwatch 
                name="Info Light" 
                hex="bg-blue-50" 
                className="bg-blue-50 border border-blue-100" 
                textClass="text-blue-700"
                usage="Chips de Sanatorios"
              />
              <ColorSwatch 
                name="Accent Light" 
                hex="bg-purple-50" 
                className="bg-purple-50 border border-purple-100" 
                textClass="text-purple-700"
                usage="Chips de Viajero"
              />
              <ColorSwatch 
                name="Error Light" 
                hex="bg-red-50" 
                className="bg-red-50 border border-red-100" 
                textClass="text-red-700"
                usage="Alertas, Precios tachados"
              />
            </div>
          </div>
        </section>

        {/* 3. Botones */}
        <section>
          <SectionTitle number="03">Botones & CTAs</SectionTitle>
          <Card className="border-0 shadow-sm rounded-3xl">
            <CardContent className="pt-8 pb-8">
              <div className="flex flex-wrap gap-6 items-center">
                
                {/* Action Button */}
                <div className="space-y-2 text-center">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-100 px-8 h-12 text-base transition-all active:scale-95">
                    Solicitar Cotización
                  </Button>
                  <p className="text-xs text-slate-400">Action (Conversión)</p>
                </div>

                {/* Primary Button */}
                <div className="space-y-2 text-center">
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl px-6 h-11">
                    Ver Resultados
                  </Button>
                  <p className="text-xs text-slate-400">Primary (Navegación)</p>
                </div>

                {/* Secondary Button */}
                <div className="space-y-2 text-center">
                  <Button className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl px-6 h-11">
                    Ver Detalle
                  </Button>
                  <p className="text-xs text-slate-400">Secondary (Info)</p>
                </div>

                {/* Outline Button */}
                <div className="space-y-2 text-center">
                  <Button variant="outline" className="border-slate-200 text-slate-600 hover:text-teal-600 hover:border-teal-200 hover:bg-teal-50 rounded-xl px-6 h-11 font-bold">
                    Comparar
                  </Button>
                  <p className="text-xs text-slate-400">Outline (Acciones secundarias)</p>
                </div>

                 {/* Ghost Button */}
                 <div className="space-y-2 text-center">
                  <Button variant="ghost" className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl px-4">
                    Cancelar
                  </Button>
                  <p className="text-xs text-slate-400">Ghost</p>
                </div>

              </div>
            </CardContent>
          </Card>
        </section>

        {/* 4. Componentes UI Vitalia */}
        <section>
          <SectionTitle number="04">Componentes UI Vitalia</SectionTitle>
          
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Chips & Badges */}
            <div className="space-y-4">
              <h3 className="font-bold text-slate-700">Chips & Etiquetas</h3>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-wrap gap-3">
                
                <span className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100 flex items-center gap-1.5">
                  <ShieldCheck size={14} /> Sanatorios Top
                </span>

                <span className="px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-bold border border-green-100 flex items-center gap-1.5">
                  <Zap size={14} /> Odontología
                </span>

                <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
                  Copagos Bajos
                </span>

                <span className="px-2 py-1 rounded text-[10px] font-bold bg-green-100 text-green-700 uppercase">
                  -15% OFF
                </span>

              </div>
            </div>

            {/* Inputs Modernos */}
            <div className="space-y-4">
              <h3 className="font-bold text-slate-700">Inputs (Floating Label)</h3>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                
                {/* Input con Icono */}
                <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors">
                        <User size={18} />
                    </div>
                    <input 
                        type="text" 
                        className="peer w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 pt-5 pb-2 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder-shown:pt-3.5" 
                        placeholder=" " 
                    />
                    <label className="absolute left-12 top-3.5 text-xs font-bold text-slate-400 uppercase transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-focus:-translate-y-2.5 peer-focus:text-[10px] peer-focus:text-teal-600">
                        Nombre Completo
                    </label>
                </div>

                {/* Input Simple */}
                <div className="relative group">
                    <input 
                        type="text" 
                        className="peer w-full bg-slate-50 border border-slate-200 rounded-xl px-4 pt-5 pb-2 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder-shown:pt-3.5" 
                        placeholder=" " 
                    />
                    <label className="absolute left-4 top-3.5 text-xs font-bold text-slate-400 uppercase transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-focus:-translate-y-2.5 peer-focus:text-[10px] peer-focus:text-teal-600">
                        Email
                    </label>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* 5. Cards */}
        <section>
          <SectionTitle number="05">Tarjetas (Cards)</SectionTitle>
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Plan Card Mini */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all p-6 w-full max-w-sm mx-auto">
                <div className="flex justify-between items-start mb-4">
                    <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-bold text-slate-400">LOGO</div>
                    <div className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded">RECOMENDADO</div>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Plan Premium 360</h3>
                <p className="text-xs text-slate-400 mb-4">Cobertura Nacional</p>
                
                <div className="flex gap-2 mb-6 flex-wrap">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md">Sanatorios</span>
                    <span className="px-2 py-1 bg-purple-50 text-purple-700 text-[10px] font-bold rounded-md">Viajero</span>
                </div>

                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-xs text-red-400 line-through font-bold">$ 120.000</p>
                        <p className="text-2xl font-black text-slate-900">$ 95.000</p>
                    </div>
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg shadow-md">
                        Ver Detalle
                    </Button>
                </div>
            </div>

            {/* Feature Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col items-center text-center justify-center">
                <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-4 text-teal-600">
                    <Search size={32} />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">Búsqueda Inteligente</h3>
                <p className="text-sm text-slate-500">
                    Filtra por precio, clínica o cobertura específica en segundos.
                </p>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
};

// Helper Components
const SectionTitle = ({ number, children }: { number: string, children: React.ReactNode }) => (
  <div className="flex items-center gap-4 mb-8 pb-4 border-b border-slate-200">
    <span className="text-4xl font-black text-slate-200">{number}</span>
    <h2 className="text-2xl font-bold text-slate-800">{children}</h2>
  </div>
);

interface ColorSwatchProps {
  name: string;
  hex: string;
  className: string;
  textClass: string;
  usage: string;
}

const ColorSwatch = ({ name, hex, className, textClass, usage }: ColorSwatchProps) => (
  <div className={`rounded-2xl p-5 ${className} shadow-sm flex flex-col justify-between h-32 transition-transform hover:scale-105`}>
    <div>
        <p className={`font-bold text-sm ${textClass}`}>{name}</p>
        <p className={`text-xs opacity-80 ${textClass}`}>{hex}</p>
    </div>
    <p className={`text-[10px] font-medium opacity-70 ${textClass} mt-2`}>{usage}</p>
  </div>
);

export default StyleGuidePage;