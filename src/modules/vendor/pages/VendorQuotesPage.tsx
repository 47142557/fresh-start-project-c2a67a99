import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { VendorLayout } from '../layouts/VendorLayout';
import { useVendorAuth } from '../hooks/useVendorAuth';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Calendar, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SavedQuote {
  id: string;
  form_data: unknown;
  plan_ids: string[];
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export const VendorQuotesPage = () => {
  const { user } = useVendorAuth();
  const [quotes, setQuotes] = useState<SavedQuote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadQuotes();
    }
  }, [user]);

  const loadQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_quotes')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotes(data || []);
    } catch (error) {
      console.error('Error loading quotes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
      pending: 'secondary',
      sent: 'default',
      accepted: 'default',
      rejected: 'destructive',
    };

    const labels: Record<string, string> = {
      pending: 'Pendiente',
      sent: 'Enviada',
      accepted: 'Aceptada',
      rejected: 'Rechazada',
    };

    return (
      <Badge variant={variants[status] || 'secondary'}>
        {labels[status] || status}
      </Badge>
    );
  };

  return (
    <VendorLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mis Cotizaciones</h1>
          <p className="text-muted-foreground">
            Historial de cotizaciones guardadas
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : quotes.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p className="font-medium">No tienes cotizaciones guardadas</p>
                <p className="text-sm mt-1">
                  Las cotizaciones que guardes aparecerán aquí
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {quotes.map((quote) => (
              <Card key={quote.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <span className="font-medium">
                          Cotización #{quote.id.slice(0, 8)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(quote.created_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {quote.plan_ids?.length || 0} planes
                        </span>
                      </div>

                      {quote.notes && (
                        <p className="text-sm text-muted-foreground">
                          {quote.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {getStatusBadge(quote.status)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </VendorLayout>
  );
};

export default VendorQuotesPage;
