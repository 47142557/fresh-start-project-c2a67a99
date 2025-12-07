import { supabase } from '@/integrations/supabase/client';

export interface VendorProfile {
  id: string;
  user_id: string;
  business_name: string | null;
  slug: string | null;
  logo_url: string | null;
  phone: string | null;
  whatsapp: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
  primary_color: string;
  secondary_color: string;
  is_public: boolean;
  nickname: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateVendorProfileData {
  business_name?: string;
  phone?: string;
  whatsapp?: string;
}

export interface UpdateVendorProfileData {
  business_name?: string;
  slug?: string;
  logo_url?: string;
  phone?: string;
  whatsapp?: string;
  linkedin_url?: string;
  instagram_url?: string;
  primary_color?: string;
  secondary_color?: string;
  is_public?: boolean;
  nickname?: string;
}

/**
 * Get vendor profile by user ID
 */
export const getVendorProfile = async (
  userId: string
): Promise<{ profile: VendorProfile | null; error: Error | null }> => {
  const { data, error } = await supabase
    .from('vendor_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  return {
    profile: data as VendorProfile | null,
    error: error as Error | null,
  };
};

/**
 * Create vendor profile
 */
export const createVendorProfile = async (
  userId: string,
  profileData: CreateVendorProfileData
): Promise<{ profile: VendorProfile | null; error: Error | null }> => {
  // Generate a unique slug from business name or user id
  const baseSlug = profileData.business_name
    ? profileData.business_name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    : `vendedor-${userId.slice(0, 8)}`;
  
  const slug = `${baseSlug}-${Date.now().toString(36)}`;

  const { data, error } = await supabase
    .from('vendor_profiles')
    .insert({
      user_id: userId,
      business_name: profileData.business_name,
      phone: profileData.phone,
      whatsapp: profileData.whatsapp,
      slug,
    })
    .select()
    .single();

  return {
    profile: data as VendorProfile | null,
    error: error as Error | null,
  };
};

/**
 * Update vendor profile
 */
export const updateVendorProfile = async (
  userId: string,
  profileData: UpdateVendorProfileData
): Promise<{ profile: VendorProfile | null; error: Error | null }> => {
  const { data, error } = await supabase
    .from('vendor_profiles')
    .update(profileData)
    .eq('user_id', userId)
    .select()
    .single();

  return {
    profile: data as VendorProfile | null,
    error: error as Error | null,
  };
};

/**
 * Get vendor profile by slug (for public profiles)
 */
export const getVendorBySlug = async (
  slug: string
): Promise<{ profile: VendorProfile | null; error: Error | null }> => {
  const { data, error } = await supabase
    .from('vendor_profiles')
    .select('*')
    .eq('slug', slug)
    .eq('is_public', true)
    .maybeSingle();

  return {
    profile: data as VendorProfile | null,
    error: error as Error | null,
  };
};

/**
 * Upload vendor logo
 */
export const uploadVendorLogo = async (
  userId: string,
  file: File
): Promise<{ logoUrl: string | null; error: Error | null }> => {
  const fileExt = file.name.split('.').pop();
  const filePath = `vendor-logos/${userId}/logo.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    return { logoUrl: null, error: uploadError as Error };
  }

  const { data: urlData } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  const logoUrl = urlData.publicUrl;

  // Update vendor profile with new logo URL
  await supabase
    .from('vendor_profiles')
    .update({ logo_url: logoUrl })
    .eq('user_id', userId);

  return { logoUrl, error: null };
};

const VendorService = {
  getVendorProfile,
  createVendorProfile,
  updateVendorProfile,
  getVendorBySlug,
  uploadVendorLogo,
};

export default VendorService;
