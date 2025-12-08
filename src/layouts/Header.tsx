import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserCheck, LayoutDashboard } from "lucide-react";
import { useVendorAuth } from "@/modules/vendor/hooks/useVendorAuth";

const Header = () => {
  const navigate = useNavigate();
  const { user, isVendor, isLoading } = useVendorAuth();

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center">
          <img 
            src="/assets/images/logos/logo-header-tr.png" 
            alt="Mejor Plan - Consultores en Salud" 
            className="h-10 hidden md:block"
          />
          <img 
            src="/assets/images/logos/logo-header-tr-mobile.png" 
            alt="Mejor Plan - Consultores en Salud" 
            className="h-10 md:hidden"
          />
        </a>
        <div className="flex items-center gap-2">
          {!isLoading && (
            user && isVendor ? (
              <Button 
                variant="outline" 
                onClick={() => navigate('/vendedor/dashboard')} 
                className="shadow-sm"
              >
                <LayoutDashboard className="h-4 w-4 mr-1.5" />
                <span className="hidden sm:inline">Mi Dashboard</span>
                <span className="sm:hidden">Dashboard</span>
              </Button>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => navigate('/vendedor/registro')} 
                className="shadow-sm"
              >
                <UserCheck className="h-4 w-4 mr-1.5" />
                <span className="hidden sm:inline">Soy Asesor</span>
                <span className="sm:hidden">Asesor</span>
              </Button>
            )
          )}
          <Button onClick={() => navigate('/resultados')} className="shadow-sm">
            Ver Planes
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
