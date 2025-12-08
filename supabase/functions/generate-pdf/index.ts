import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const VPS_PUPPETEER_URL = Deno.env.get('VPS_PUPPETEER_URL'); 

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!VPS_PUPPETEER_URL) {
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

    const pdfResponse = await fetch(VPS_PUPPETEER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ htmlContent }),
    });

    if (!pdfResponse.ok) {
      const errorText = await pdfResponse.text();
      console.error('Contabo PDF generation failed:', errorText);
      return new Response(
        JSON.stringify({ error: `Error en servidor PDF: ${errorText}` }),
        { status: pdfResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Proxy: PDF recibido de Contabo. Reenviando al cliente.');

    // Get the PDF as array buffer
    const pdfBuffer = await pdfResponse.arrayBuffer();

    // Return the PDF directly as binary
    return new Response(pdfBuffer, { 
      status: 200, 
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="comparacion-planes.pdf"',
      }
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al procesar la solicitud';
    console.error('Error in generate-pdf function:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
