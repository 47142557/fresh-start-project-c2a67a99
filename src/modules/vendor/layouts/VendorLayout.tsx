import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { VendorSidebar } from '../components/organisms/VendorSidebar';
import { useVendorAuth } from '../hooks/useVendorAuth';
import { Skeleton } from '@/components/ui/skeleton';

interface VendorLayoutProps {
  children: ReactNode;
}

export const VendorLayout = ({ children }: VendorLayoutProps) => {
  const { user, isVendor, vendorProfile, isLoading, signOut } = useVendorAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate('/vendedor/registro');
      } else if (!isVendor) {
        // User is logged in but not a vendor
        navigate('/');
      }
    }
  }, [user, isVendor, isLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen">
        <div className="w-64 border-r bg-card">
          <Skeleton className="h-16 w-full" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <div className="flex-1 p-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!user || !isVendor) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <VendorSidebar 
        onSignOut={handleSignOut} 
        businessName={vendorProfile?.business_name} 
      />
      <main className="flex-1 ml-16 lg:ml-64 transition-all duration-300">
        <div className="container mx-auto p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default VendorLayout;
