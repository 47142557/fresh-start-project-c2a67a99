import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { htmlContent } = await req.json();

    if (!htmlContent) {
      console.error('No HTML content provided');
      return new Response(
        JSON.stringify({ error: 'No se proporcionó contenido HTML' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating PDF from HTML content, length:', htmlContent.length);

    // Call external PDF conversion API (using a public service)
    // You can replace this with your own /api/convert endpoint
    const pdfResponse = await fetch('https://api.html2pdf.app/v1/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        html: htmlContent,
        apiKey: Deno.env.get('HTML2PDF_API_KEY') || 'demo', // Use demo for testing
        options: {
          format: 'A4',
          margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
          printBackground: true,
        }
      }),
    });

    if (!pdfResponse.ok) {
      const errorText = await pdfResponse.text();
      console.error('PDF generation failed:', errorText);
      
      // Fallback: return HTML as downloadable file for now
      const base64Html = btoa(unescape(encodeURIComponent(htmlContent)));
      return new Response(
        JSON.stringify({ 
          pdfBase64: base64Html,
          warning: 'PDF generation service unavailable, returning HTML',
          contentType: 'text/html'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const pdfBuffer = await pdfResponse.arrayBuffer();
    const pdfBase64 = btoa(String.fromCharCode(...new Uint8Array(pdfBuffer)));

    console.log('PDF generated successfully, size:', pdfBuffer.byteLength);

    return new Response(
      JSON.stringify({ pdfBase64 }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al generar el PDF';
    console.error('Error in generate-pdf function:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
