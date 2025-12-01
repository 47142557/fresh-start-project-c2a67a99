import { Helmet } from "react-helmet-async";
import Layout from "@/layouts/Layout";
import { HeroSection, HowItWorks, LogosGrid, Testimonials, FAQ } from "../components/organisms";

const Index = () => {
  return (
    <Layout>
      <Helmet>
        <title>Comparador de Planes de Salud Argentina | Encontrá la Mejor Prepaga</title>
        <meta name="description" content="Compará planes de salud de OSDE, Swiss Medical, Galeno, Medifé y más. Encontrá la mejor prepaga para vos y tu familia con precios actualizados y cobertura completa." />
        <meta name="keywords" content="planes de salud, prepagas argentina, OSDE, Swiss Medical, Galeno, Medifé, comparador prepaga, cobertura médica" />
        <link rel="canonical" href="https://tudominio.com/" />
        <meta property="og:title" content="Comparador de Planes de Salud Argentina" />
        <meta property="og:description" content="Compará las mejores prepagas de Argentina y elegí el plan ideal para vos." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tudominio.com/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Comparador de Planes de Salud Argentina" />
        <meta name="twitter:description" content="Encontrá y compará los mejores planes de salud de Argentina." />
      </Helmet>
      
      <HeroSection />
      <HowItWorks />
      <LogosGrid />
      <Testimonials />
      <FAQ />
    </Layout>
  );
};

export default Index;
