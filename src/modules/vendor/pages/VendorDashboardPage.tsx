import { useEffect, useState } from 'react';
import { FileText, TrendingUp, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { VendorLayout } from '../layouts/VendorLayout';
import { VendorStatsCard } from '../components/organisms/VendorStatsCard';
import { useVendorAuth } from '../hooks/useVendorAuth';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface QuoteSummary {
  total: number;
  thisMonth: number;
  lastActivity: string | null;
}

export const VendorDashboardPage = () => {
  const { user, vendorProfile } = useVendorAuth();
  const [quoteSummary, setQuoteSummary] = useState<QuoteSummary>({
    total: 0,
    thisMonth: 0,
    lastActivity: null,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    if (user) {
      loadQuoteSummary();
    }
  }, [user]);

  const loadQuoteSummary = async () => {
    try {
      // Get total quotes
      const { count: total } = await supabase
        .from('saved_quotes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id);

      // Get this month's quotes
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count: thisMonth } = await supabase
        .from('saved_quotes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id)
        .gte('created_at', startOfMonth.toISOString());

      // Get last activity
      const { data: lastQuote } = await supabase
        .from('saved_quotes')
        .select('created_at')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      setQuoteSummary({
        total: total || 0,
        thisMonth: thisMonth || 0,
        lastActivity: lastQuote?.created_at || null,
      });
    } catch (error) {
      console.error('Error loading quote summary:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const formatLastActivity = (date: string | null) => {
    if (!date) return 'Sin actividad';
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return d.toLocaleDateString('es-AR');
  };

  return (
    <VendorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            ¡Hola, {vendorProfile?.business_name || 'Vendedor'}!
          </h1>
          <p className="text-muted-foreground">
            Aquí tienes un resumen de tu actividad
          </p>
        </div>

        {/* Stats Grid */}
        {isLoadingStats ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <VendorStatsCard
              title="Total Cotizaciones"
              value={quoteSummary.total}
              icon={FileText}
              description="Cotizaciones guardadas"
            />
            <VendorStatsCard
              title="Este Mes"
              value={quoteSummary.thisMonth}
              icon={TrendingUp}
              trend={quoteSummary.thisMonth > 0 ? 'up' : 'neutral'}
              trendValue={quoteSummary.thisMonth > 0 ? 'Activo' : 'Sin actividad'}
            />
            <VendorStatsCard
              title="Última Actividad"
              value={formatLastActivity(quoteSummary.lastActivity)}
              icon={Clock}
            />
            <VendorStatsCard
              title="Estado"
              value="Verificado"
              icon={Users}
              description="Cuenta activa"
            />
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Crear Cotización</CardTitle>
              <CardDescription>
                Genera una nueva cotización para tu cliente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a
                href="/"
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Ir al Cotizador
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Completar Perfil</CardTitle>
              <CardDescription>
                Agrega tu logo y personaliza tus cotizaciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a
                href="/vendedor/perfil"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Editar Perfil
              </a>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>
              Tus últimas cotizaciones y acciones
            </CardDescription>
          </CardHeader>
          <CardContent>
            {quoteSummary.total === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>Aún no tienes cotizaciones</p>
                <p className="text-sm">Crea tu primera cotización para verla aquí</p>
              </div>
            ) : (
              <p className="text-muted-foreground">
                Tienes {quoteSummary.total} cotizaciones guardadas
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </VendorLayout>
  );
};

export default VendorDashboardPage;
