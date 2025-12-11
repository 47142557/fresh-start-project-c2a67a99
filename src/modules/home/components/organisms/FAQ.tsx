import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQ = () => {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Preguntas Frecuentes</h2>
          <p className="text-slate-500">Resolvemos tus dudas sobre la contratación de planes.</p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="item-1" className="bg-white border border-slate-200 rounded-2xl px-4 shadow-sm">
            <AccordionTrigger className="text-slate-800 font-bold hover:text-teal-600 hover:no-underline">
              ¿El servicio de Vitalia tiene costo?
            </AccordionTrigger>
            <AccordionContent className="text-slate-600">
              No, nuestro servicio es 100% gratuito para vos. Nosotros cobramos una comisión a las prepagas, pero vos pagás exactamente el mismo precio (o menos, gracias a nuestros convenios) que contratando directo.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="bg-white border border-slate-200 rounded-2xl px-4 shadow-sm">
            <AccordionTrigger className="text-slate-800 font-bold hover:text-teal-600 hover:no-underline">
              ¿Puedo derivar mis aportes?
            </AccordionTrigger>
            <AccordionContent className="text-slate-600">
              ¡Sí! Si trabajás en relación de dependencia o sos Monotributista, podés usar tus aportes de ley para pagar parte de la cuota de tu prepaga. Nosotros te ayudamos con el trámite.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="bg-white border border-slate-200 rounded-2xl px-4 shadow-sm">
            <AccordionTrigger className="text-slate-800 font-bold hover:text-teal-600 hover:no-underline">
              ¿Los precios están actualizados?
            </AccordionTrigger>
            <AccordionContent className="text-slate-600">
              Sí, actualizamos nuestra base de datos mensualmente con las listas oficiales de todas las prepagas para garantizarte la información más precisa.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};