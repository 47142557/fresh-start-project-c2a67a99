export const HowItWorks = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Tu plan ideal en 3 pasos</h2>
          <p className="text-lg text-slate-500">
            Olvidate de llamar a 10 lugares distintos. Nosotros hacemos el trabajo duro por vos.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Línea conectora (solo desktop) */}
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-slate-100 -z-10"></div>

          {/* Paso 1 */}
          <div className="text-center group">
            <div className="w-24 h-24 bg-teal-50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-teal-100 group-hover:scale-110 transition-transform duration-300">
              <span className="text-4xl font-black text-teal-600">1</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Completá tus datos</h3>
            <p className="text-slate-500 leading-relaxed px-4">
              Ingresá tu edad y zona de residencia para que busquemos las mejores opciones disponibles.
            </p>
          </div>

          {/* Paso 2 */}
          <div className="text-center group">
            <div className="w-24 h-24 bg-orange-50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-orange-100 group-hover:scale-110 transition-transform duration-300">
              <span className="text-4xl font-black text-orange-500">2</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Compará opciones</h3>
            <p className="text-slate-500 leading-relaxed px-4">
              Analizá precios, cartillas y beneficios lado a lado en nuestra tabla comparativa inteligente.
            </p>
          </div>

          {/* Paso 3 */}
          <div className="text-center group">
            <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-100 group-hover:scale-110 transition-transform duration-300">
              <span className="text-4xl font-black text-blue-600">3</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Elegí y Ahorrá</h3>
            <p className="text-slate-500 leading-relaxed px-4">
              Seleccioná el plan que más te guste y un asesor te ayudará con el alta 100% digital.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};