import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, User, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface VendorSidebarProps {
  onSignOut: () => void;
  businessName?: string | null;
}

const navItems = [
  { to: '/vendedor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/vendedor/cotizaciones', icon: FileText, label: 'Cotizaciones' },
  { to: '/vendedor/perfil', icon: User, label: 'Mi Perfil' },
];

export const VendorSidebar = ({ onSignOut, businessName }: VendorSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        {!isCollapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-primary">Mejor Plan</span>
            <span className="text-xs text-muted-foreground truncate max-w-[160px]">
              {businessName || 'Vendedor'}
            </span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-border p-2">
        <Button
          variant="ghost"
          onClick={onSignOut}
          className={cn(
            'w-full justify-start gap-3 text-muted-foreground hover:text-destructive',
            isCollapsed && 'justify-center'
          )}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span>Cerrar Sesión</span>}
        </Button>
      </div>
    </aside>
  );
};

export default VendorSidebar;
