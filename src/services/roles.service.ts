import { supabase } from '@/integrations/supabase/client';

export type AppRole = 'user' | 'vendor' | 'admin';

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

/**
 * Get all roles for a user
 */
export const getUserRoles = async (userId: string): Promise<{ roles: AppRole[]; error: Error | null }> => {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId);

  if (error) {
    return { roles: [], error: error as Error };
  }

  const roles = (data || []).map((r: { role: string }) => r.role as AppRole);
  return { roles, error: null };
};

/**
 * Check if user has a specific role
 */
export const hasRole = async (userId: string, role: AppRole): Promise<boolean> => {
  const { roles } = await getUserRoles(userId);
  return roles.includes(role);
};

/**
 * Check if user is a vendor
 */
export const isVendor = async (userId: string): Promise<boolean> => {
  return hasRole(userId, 'vendor');
};

/**
 * Assign a role to a user
 */
export const assignRole = async (
  userId: string,
  role: AppRole
): Promise<{ success: boolean; error: Error | null }> => {
  const { error } = await supabase
    .from('user_roles')
    .insert({ user_id: userId, role });

  return {
    success: !error,
    error: error as Error | null,
  };
};

/**
 * Remove a role from a user
 */
export const removeRole = async (
  userId: string,
  role: AppRole
): Promise<{ success: boolean; error: Error | null }> => {
  const { error } = await supabase
    .from('user_roles')
    .delete()
    .eq('user_id', userId)
    .eq('role', role);

  return {
    success: !error,
    error: error as Error | null,
  };
};

const RolesService = {
  getUserRoles,
  hasRole,
  isVendor,
  assignRole,
  removeRole,
};

export default RolesService;
