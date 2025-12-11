import { useEffect } from "react";

const BASE_URL = "https://chatwootv4.avalianonline.com.ar"; // Corregí el https:/ que te faltaba una barra
const WEBSITE_TOKEN = "XE9iAZnHApuzRPhaxpt3mySD";

export const ChatwootWidget = () => {
  useEffect(() => {
    // 1. Evitar cargar el script dos veces
    if ((window as any).chatwootSDK) {
      return;
    }

    // 2. Crear el script dinámicamente
    const script = document.createElement("script");
    script.src = `${BASE_URL}/packs/js/sdk.js`;
    script.async = true;
    script.defer = true;

    // 3. Inicializar cuando cargue
    script.onload = () => {
      (window as any).chatwootSDK.run({
        websiteToken: WEBSITE_TOKEN,
        baseUrl: BASE_URL,
      });
    };

    // 4. Insertar en el documento
    document.body.appendChild(script);

 
    return () => {
      // Cleanup si fuera necesario (raro en chatwoot)
    };
  }, []);

  return null; // No renderiza nada visual, el script inyecta el widget
};


