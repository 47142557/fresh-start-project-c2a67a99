import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { isVendor as checkIsVendor, getUserRoles, AppRole } from '@/services/roles.service';
import { getVendorProfile, VendorProfile } from '@/services/vendor.service';

interface UseVendorAuthReturn {
  user: User | null;
  session: Session | null;
  isVendor: boolean;
  isAdmin: boolean;
  roles: AppRole[];
  vendorProfile: VendorProfile | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

export const useVendorAuth = (): UseVendorAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isVendor, setIsVendor] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [vendorProfile, setVendorProfile] = useState<VendorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        // Defer role/profile fetching to avoid deadlocks
        if (session?.user) {
          setTimeout(() => {
            loadUserRolesAndProfile(session.user.id);
          }, 0);
        } else {
          setIsVendor(false);
          setIsAdmin(false);
          setRoles([]);
          setVendorProfile(null);
          setIsLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        loadUserRolesAndProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserRolesAndProfile = async (userId: string) => {
    try {
      // Get user roles
      const { roles: userRoles } = await getUserRoles(userId);
      setRoles(userRoles);
      
      const vendorRole = userRoles.includes('vendor');
      const adminRole = userRoles.includes('admin');
      
      setIsVendor(vendorRole);
      setIsAdmin(adminRole);

      // If vendor, load vendor profile
      if (vendorRole) {
        const { profile } = await getVendorProfile(userId);
        setVendorProfile(profile);
      }
    } catch (error) {
      console.error('Error loading user roles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsVendor(false);
    setIsAdmin(false);
    setRoles([]);
    setVendorProfile(null);
  };

  return {
    user,
    session,
    isVendor,
    isAdmin,
    roles,
    vendorProfile,
    isLoading,
    signOut,
  };
};

export default useVendorAuth;
