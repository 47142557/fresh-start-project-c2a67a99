-- ===========================================
-- Fase 1: Expandir tabla saved_quotes para persistencia completa
-- ===========================================

-- Agregar columnas para nombre/cliente y datos de solicitud
ALTER TABLE public.saved_quotes
ADD COLUMN IF NOT EXISTS quote_name TEXT,
ADD COLUMN IF NOT EXISTS client_name TEXT,
ADD COLUMN IF NOT EXISTS client_email TEXT,
ADD COLUMN IF NOT EXISTS client_phone TEXT,
ADD COLUMN IF NOT EXISTS family_group TEXT DEFAULT 'individual',
ADD COLUMN IF NOT EXISTS request_type TEXT DEFAULT 'particular',
ADD COLUMN IF NOT EXISTS residence_zone TEXT DEFAULT 'AMBA',
ADD COLUMN IF NOT EXISTS custom_message TEXT,
ADD COLUMN IF NOT EXISTS edited_prices JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS pdf_html TEXT;

-- ===========================================
-- Fase 2: Sistema de links públicos con código de acceso
-- ===========================================

-- Agregar columnas para link público y tracking
ALTER TABLE public.saved_quotes
ADD COLUMN IF NOT EXISTS public_token UUID DEFAULT gen_random_uuid(),
ADD COLUMN IF NOT EXISTS access_code TEXT,
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_viewed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS first_viewed_at TIMESTAMP WITH TIME ZONE;

-- ===========================================
-- Fase 3: Tracking de aperturas detallado
-- ===========================================

-- Crear tabla separada para tracking de vistas
CREATE TABLE IF NOT EXISTS public.quote_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_id UUID NOT NULL REFERENCES public.saved_quotes(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  time_on_page INTEGER,
  downloaded_pdf BOOLEAN DEFAULT false
);

-- Enable RLS on quote_views
ALTER TABLE public.quote_views ENABLE ROW LEVEL SECURITY;

-- RLS policy for quote_views - vendors can see views of their quotes
CREATE POLICY "Vendors can view their quote analytics"
ON public.quote_views
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.saved_quotes sq
    WHERE sq.id = quote_views.quote_id
    AND sq.user_id = auth.uid()
  )
);

-- Public insert for anonymous view tracking
CREATE POLICY "Anyone can record a view"
ON public.quote_views
FOR INSERT
WITH CHECK (true);

-- ===========================================
-- Fase 4: RLS para links públicos
-- ===========================================

-- Allow public access to quotes via public token
CREATE POLICY "Public quotes accessible via token"
ON public.saved_quotes
FOR SELECT
USING (is_public = true);

-- Index for fast token lookup
CREATE INDEX IF NOT EXISTS idx_saved_quotes_public_token ON public.saved_quotes(public_token) WHERE is_public = true;

-- ===========================================
-- Fase 5: Función para registrar vista e incrementar contador
-- ===========================================

CREATE OR REPLACE FUNCTION public.record_quote_view(
  p_quote_id UUID,
  p_access_code TEXT DEFAULT NULL,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_referrer TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_quote_exists BOOLEAN;
  v_stored_code TEXT;
BEGIN
  -- Check if quote exists and is public
  SELECT true, access_code INTO v_quote_exists, v_stored_code
  FROM saved_quotes
  WHERE id = p_quote_id AND is_public = true;
  
  IF NOT v_quote_exists THEN
    RETURN false;
  END IF;
  
  -- Verify access code if set
  IF v_stored_code IS NOT NULL AND v_stored_code != '' THEN
    IF p_access_code IS NULL OR p_access_code != v_stored_code THEN
      RETURN false;
    END IF;
  END IF;
  
  -- Record the view
  INSERT INTO quote_views (quote_id, ip_address, user_agent, referrer)
  VALUES (p_quote_id, p_ip_address, p_user_agent, p_referrer);
  
  -- Update quote counters
  UPDATE saved_quotes
  SET 
    view_count = view_count + 1,
    last_viewed_at = now(),
    first_viewed_at = COALESCE(first_viewed_at, now())
  WHERE id = p_quote_id;
  
  RETURN true;
END;
$$;