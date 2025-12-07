import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Buffer } from "node:buffer";
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// 🛑 Obtener el endpoint de Contabo de una variable de entorno de Supabase
const VPS_PUPPETEER_URL = Deno.env.get('VPS_PUPPETEER_URL'); 

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!VPS_PUPPETEER_URL) {
    // Fallo rápido si no está configurada la URL de destino
    return new Response(
      JSON.stringify({ error: 'Falta configurar la variable VPS_PUPPETEER_URL' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { htmlContent } = await req.json();

    if (!htmlContent) {
      return new Response(
        JSON.stringify({ error: 'No se proporcionó contenido HTML' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } 

    console.log('Proxy: Enviando contenido HTML a Contabo/Puppeteer...');

    // 🛑 1. ENVIAR LA SOLICITUD A TU ENDPOINT DE CONTAGO
    const pdfResponse = await fetch(VPS_PUPPETEER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Opcional: Podrías añadir una clave secreta aquí para que Contabo valide la llamada
      },
      body: JSON.stringify({
        // Tu endpoint espera 'htmlContent', no 'html'
        htmlContent: htmlContent, 
      }),
    });

    // 1. Leer el cuerpo de la respuesta de Contabo como ArrayBuffer (binario)
    const pdfBuffer = await pdfResponse.arrayBuffer();

    // 2. Convertir el ArrayBuffer a Base64 usando Buffer
    const pdfBase64 = Buffer.from(pdfBuffer).toString("base64");
    
    if (!pdfResponse.ok) {
      const errorText = await pdfResponse.text();
      console.error('Contabo PDF generation failed:', errorText);
      
 // 3. Devolver el objeto JSON al cliente
return new Response(
    JSON.stringify({ pdfBase64: pdfBase64 }),
    {
        status: 200,
        headers: { 
            "Content-Type": "application/json", 
            "Access-Control-Allow-Origin": "*"
        },
    }
);
    }

    console.log('Proxy: PDF recibido de Contabo. Reenviando al cliente.');
    
    // 🛑 2. REENVÍO DIRECTO DEL BUFFER BINARIO (PDF)
    // Devolvemos el body directamente sin parsear a Base64.
    return new Response(
      pdfResponse.body,
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/pdf', // El frontend espera el PDF
          'Content-Disposition': 'attachment; filename="comparacion-planes.pdf"',
        }
      }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al procesar la solicitud';
    console.error('Error in generate-pdf function:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});