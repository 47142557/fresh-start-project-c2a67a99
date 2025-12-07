import { supabase } from '@/integrations/supabase/client';
import { QuoteFormData, QuoteResponse } from '@/core/interfaces/plan/quoteFormData';



// --- API Service Functions ---

/**
 * Fetches all available health plans from the API
 */
// export const getHealthPlans = async (): Promise<HealthPlan[]> => {
//   const response = await fetch(`${environment.healthApiBaseUrl}/planes`);
  
//   if (!response.ok) {
//     throw new Error(`Error fetching health plans: ${response.statusText}`);
//   }
  
//   return response.json();
// };

/**
 * Submits a quote request through the Supabase edge function
 */
// Asegúrate de definir las interfaces QuoteResponse y QuoteFormData
const API_MODE = import.meta.env.VITE_API_MODE;
const LOCAL_API_URL = import.meta.env.VITE_LOCAL_API_URL;
export const submitQuote = async (formData: QuoteFormData): Promise<QuoteResponse> => {  // En src/services/health.service.ts
 if (API_MODE === 'local') {
        try {
            const response = await fetch(LOCAL_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                // Manejar errores HTTP (4xx, 5xx) del backend local
                const errorData = await response.json();
                throw new Error(errorData.message || `Error HTTP ${response.status}`);
            }

            const data = await response.json();

            // 🔥 CONSOLE.LOG PARA EL MODO LOCAL
            console.log('✅ Resultado de la API Local:', data);

            return {
                success: true,
                data: data // Asume que la respuesta del backend local coincide con el tipo Planes
            };

        } catch (error) {
            console.error('Error calling local backend:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error desconocido al llamar al backend local'
            };
        }
    }
// --- Lógica para Entorno de Producción (Supabase Edge Function) ---
    const { data, error } = await supabase.functions.invoke('submit-quote', {
        body: formData
    });

    if (error) {
        console.error('Error submitting quote to Supabase:', error);
        return {
            success: false,
            error: error.message || 'Error al enviar la cotización a Supabase'
        };
    }
    
    // 🔥 CONSOLE.LOG PARA SUPABASE (PRODUCCIÓN)
    console.log('✅ Resultado de Supabase:', data);
    // Asume que si no hay error, data es la respuesta exitosa
    return {
        success: true,
        data: data
    };
};

// --- Health Service Object (Angular-like pattern) ---
export const HealthService = {
  // getPlans: getHealthPlans,
  submitQuote: submitQuote
};

export default HealthService;
