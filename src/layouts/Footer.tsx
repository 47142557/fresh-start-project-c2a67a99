const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <img 
              src="/assets/images/logos/logo-footer.gif" 
              alt="Comparador de Planes de Salud" 
              className="h-10 mb-4"
            />
            <p className="text-sm opacity-80">
              Tu comparador de confianza para encontrar el mejor plan de salud.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Empresa</h3>
            <ul className="space-y-2 text-sm opacity-80">
              <li><a href="#" className="hover:opacity-100">Sobre nosotros</a></li>
              <li><a href="#" className="hover:opacity-100">Contacto</a></li>
              <li><a href="#" className="hover:opacity-100">Trabaja con nosotros</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm opacity-80">
              <li><a href="#" className="hover:opacity-100">Términos y condiciones</a></li>
              <li><a href="#" className="hover:opacity-100">Política de privacidad</a></li>
              <li><a href="#" className="hover:opacity-100">Cookies</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Ayuda</h3>
            <ul className="space-y-2 text-sm opacity-80">
              <li><a href="#" className="hover:opacity-100">Centro de ayuda</a></li>
              <li><a href="#" className="hover:opacity-100">Preguntas frecuentes</a></li>
              <li><a href="#" className="hover:opacity-100">Soporte</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-background/20 pt-8 text-center text-sm opacity-80">
          <p>© {new Date().getFullYear()} Comparador de Planes de Salud. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
