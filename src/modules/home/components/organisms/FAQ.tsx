import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "¿Cómo funciona el comparador de planes?",
    answer: "Nuestro comparador te permite ver todos los planes de salud disponibles, filtrarlos por precio, cobertura y clínicas, y compararlos lado a lado para tomar la mejor decisión."
  },
  {
    question: "¿Es gratis usar el servicio?",
    answer: "Sí, nuestro servicio de comparación es completamente gratuito. No hay cargos ocultos ni comisiones."
  },
  {
    question: "¿Qué prepagas puedo comparar?",
    answer: "Trabajamos con las principales prepagas de Argentina: OSDE, Swiss Medical, Galeno, Medifé, Omint, Sancor Salud, y muchas más."
  },
  {
    question: "¿Puedo cambiar de prepaga en cualquier momento?",
    answer: "Sí, podés cambiar de prepaga cuando lo desees, aunque algunos planes pueden tener períodos de carencia para ciertas prestaciones."
  },
  {
    question: "¿Cómo sé qué plan me conviene?",
    answer: "Podés usar nuestros filtros para comparar precios, coberturas, y clínicas disponibles. También podés ver los beneficios detallados de cada plan."
  },
  {
    question: "¿Los precios están actualizados?",
    answer: "Sí, actualizamos los precios regularmente para asegurarnos de que tengas la información más reciente."
  }
];

const FAQ = () => {
  return (
    <section className="py-20 px-4 bg-secondary/30">
      <div className="container mx-auto max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
          Preguntas frecuentes
        </h2>
        <p className="text-center text-muted-foreground mb-12">
          Respondemos tus dudas sobre planes de salud
        </p>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
