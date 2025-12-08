import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

export interface SavedQuote {
  id: string;
  user_id: string;
  plan_ids: string[];
  form_data: Json;
  status: 'pending' | 'contacted' | 'completed' | 'cancelled';
  notes: string | null;
  created_at: string;
  updated_at: string;
  // New fields for enhanced persistence
  quote_name: string | null;
  client_name: string | null;
  client_email: string | null;
  client_phone: string | null;
  family_group: string;
  request_type: string;
  residence_zone: string;
  custom_message: string | null;
  edited_prices: Record<string, number>;
  pdf_html: string | null;
  // Public sharing fields
  public_token: string;
  access_code: string | null;
  is_public: boolean;
  view_count: number;
  last_viewed_at: string | null;
  first_viewed_at: string | null;
}

export interface CreateQuoteData {
  plan_ids: string[];
  form_data: Json;
  notes?: string;
  quote_name?: string;
  client_name?: string;
  client_email?: string;
  client_phone?: string;
  family_group?: string;
  request_type?: string;
  residence_zone?: string;
  custom_message?: string;
  edited_prices?: Record<string, number>;
  pdf_html?: string;
  is_public?: boolean;
  access_code?: string;
}

export interface UpdateQuoteData {
  quote_name?: string;
  client_name?: string;
  client_email?: string;
  client_phone?: string;
  family_group?: string;
  request_type?: string;
  residence_zone?: string;
  custom_message?: string;
  edited_prices?: Record<string, number>;
  pdf_html?: string;
  notes?: string;
  status?: QuoteStatus;
  is_public?: boolean;
  access_code?: string;
}

export type QuoteStatus = 'pending' | 'contacted' | 'completed' | 'cancelled';

export interface QuoteView {
  id: string;
  quote_id: string;
  viewed_at: string;
  ip_address: string | null;
  user_agent: string | null;
  referrer: string | null;
  time_on_page: number | null;
  downloaded_pdf: boolean;
}

/**
 * Get all quotes for the current user
 */
export const getUserQuotes = async (
  userId: string
): Promise<{ quotes: SavedQuote[]; error: Error | null }> => {
  const { data, error } = await supabase
    .from('saved_quotes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return {
    quotes: (data as SavedQuote[]) || [],
    error: error as Error | null,
  };
};

/**
 * Get a single quote by ID
 */
export const getQuoteById = async (
  quoteId: string
): Promise<{ quote: SavedQuote | null; error: Error | null }> => {
  const { data, error } = await supabase
    .from('saved_quotes')
    .select('*')
    .eq('id', quoteId)
    .maybeSingle();

  return {
    quote: data as SavedQuote | null,
    error: error as Error | null,
  };
};

/**
 * Get a public quote by token
 */
export const getQuoteByToken = async (
  token: string
): Promise<{ quote: SavedQuote | null; error: Error | null }> => {
  const { data, error } = await supabase
    .from('saved_quotes')
    .select('*')
    .eq('public_token', token)
    .eq('is_public', true)
    .maybeSingle();

  return {
    quote: data as SavedQuote | null,
    error: error as Error | null,
  };
};

/**
 * Save a new quote
 */
export const saveQuote = async (
  userId: string,
  quoteData: CreateQuoteData
): Promise<{ quote: SavedQuote | null; error: Error | null }> => {
  const { data, error } = await supabase
    .from('saved_quotes')
    .insert([
      {
        user_id: userId,
        plan_ids: quoteData.plan_ids,
        form_data: quoteData.form_data,
        notes: quoteData.notes || null,
        quote_name: quoteData.quote_name || null,
        client_name: quoteData.client_name || null,
        client_email: quoteData.client_email || null,
        client_phone: quoteData.client_phone || null,
        family_group: quoteData.family_group || 'individual',
        request_type: quoteData.request_type || 'particular',
        residence_zone: quoteData.residence_zone || 'AMBA',
        custom_message: quoteData.custom_message || null,
        edited_prices: quoteData.edited_prices || {},
        pdf_html: quoteData.pdf_html || null,
        is_public: quoteData.is_public || false,
        access_code: quoteData.access_code || null,
      },
    ])
    .select()
    .single();

  return {
    quote: data as SavedQuote | null,
    error: error as Error | null,
  };
};

/**
 * Update an existing quote
 */
export const updateQuote = async (
  quoteId: string,
  quoteData: UpdateQuoteData
): Promise<{ quote: SavedQuote | null; error: Error | null }> => {
  const { data, error } = await supabase
    .from('saved_quotes')
    .update(quoteData)
    .eq('id', quoteId)
    .select()
    .single();

  return {
    quote: data as SavedQuote | null,
    error: error as Error | null,
  };
};

/**
 * Update quote status
 */
export const updateQuoteStatus = async (
  quoteId: string,
  status: QuoteStatus
): Promise<{ quote: SavedQuote | null; error: Error | null }> => {
  const { data, error } = await supabase
    .from('saved_quotes')
    .update({ status })
    .eq('id', quoteId)
    .select()
    .single();

  return {
    quote: data as SavedQuote | null,
    error: error as Error | null,
  };
};

/**
 * Update quote notes
 */
export const updateQuoteNotes = async (
  quoteId: string,
  notes: string
): Promise<{ quote: SavedQuote | null; error: Error | null }> => {
  const { data, error } = await supabase
    .from('saved_quotes')
    .update({ notes })
    .eq('id', quoteId)
    .select()
    .single();

  return {
    quote: data as SavedQuote | null,
    error: error as Error | null,
  };
};

/**
 * Delete a quote
 */
export const deleteQuote = async (
  quoteId: string
): Promise<{ error: Error | null }> => {
  const { error } = await supabase
    .from('saved_quotes')
    .delete()
    .eq('id', quoteId);

  return { error: error as Error | null };
};

/**
 * Record a quote view (for public quotes)
 */
export const recordQuoteView = async (
  quoteId: string,
  accessCode?: string,
  userAgent?: string,
  referrer?: string
): Promise<{ success: boolean; error: Error | null }> => {
  const { data, error } = await supabase
    .rpc('record_quote_view', {
      p_quote_id: quoteId,
      p_access_code: accessCode || null,
      p_ip_address: null,
      p_user_agent: userAgent || null,
      p_referrer: referrer || null,
    });

  return {
    success: data as boolean,
    error: error as Error | null,
  };
};

/**
 * Get quote views analytics
 */
export const getQuoteViews = async (
  quoteId: string
): Promise<{ views: QuoteView[]; error: Error | null }> => {
  const { data, error } = await supabase
    .from('quote_views')
    .select('*')
    .eq('quote_id', quoteId)
    .order('viewed_at', { ascending: false });

  return {
    views: (data as QuoteView[]) || [],
    error: error as Error | null,
  };
};

/**
 * Generate a public link for a quote
 */
export const makeQuotePublic = async (
  quoteId: string,
  accessCode?: string
): Promise<{ quote: SavedQuote | null; error: Error | null }> => {
  const { data, error } = await supabase
    .from('saved_quotes')
    .update({
      is_public: true,
      access_code: accessCode || null,
    })
    .eq('id', quoteId)
    .select()
    .single();

  return {
    quote: data as SavedQuote | null,
    error: error as Error | null,
  };
};

/**
 * Make a quote private (revoke public access)
 */
export const makeQuotePrivate = async (
  quoteId: string
): Promise<{ quote: SavedQuote | null; error: Error | null }> => {
  const { data, error } = await supabase
    .from('saved_quotes')
    .update({
      is_public: false,
    })
    .eq('id', quoteId)
    .select()
    .single();

  return {
    quote: data as SavedQuote | null,
    error: error as Error | null,
  };
};

const QuotesService = {
  getUserQuotes,
  getQuoteById,
  getQuoteByToken,
  saveQuote,
  updateQuote,
  updateQuoteStatus,
  updateQuoteNotes,
  deleteQuote,
  recordQuoteView,
  getQuoteViews,
  makeQuotePublic,
  makeQuotePrivate,
};

export default QuotesService;
