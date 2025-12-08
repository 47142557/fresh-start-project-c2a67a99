import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { VendorLayout } from '../layouts/VendorLayout';
import { useVendorAuth } from '../hooks/useVendorAuth';
import { useToast } from '@/hooks/use-toast';
import {
  getUserQuotes,
  deleteQuote,
  makeQuotePublic,
  makeQuotePrivate,
  getQuoteViews,
  SavedQuote,
  QuoteView,
} from '@/services/quotes.service';
import {
  FileText,
  Calendar,
  Users,
  MapPin,
  MoreVertical,
  Download,
  Link,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  Search,
  BarChart3,
  ExternalLink,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export const VendorQuotesPage = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useVendorAuth();
  const { toast } = useToast();

  const [quotes, setQuotes] = useState<SavedQuote[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<SavedQuote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [quoteToDelete, setQuoteToDelete] = useState<SavedQuote | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Analytics dialog
  const [analyticsDialogOpen, setAnalyticsDialogOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<SavedQuote | null>(null);
  const [quoteViews, setQuoteViews] = useState<QuoteView[]>([]);
  const [loadingViews, setLoadingViews] = useState(false);

  useEffect(() => {
    if (user) {
      loadQuotes();
    }
  }, [user]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredQuotes(quotes);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredQuotes(
        quotes.filter(
          (q) =>
            q.quote_name?.toLowerCase().includes(term) ||
            q.client_name?.toLowerCase().includes(term) ||
            q.client_email?.toLowerCase().includes(term)
        )
      );
    }
  }, [quotes, searchTerm]);

  const loadQuotes = async () => {
    if (!user) return;
    
    try {
      const { quotes: fetchedQuotes, error } = await getUserQuotes(user.id);
      if (error) throw error;
      setQuotes(fetchedQuotes);
    } catch (error) {
      console.error('Error loading quotes:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las cotizaciones.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!quoteToDelete) return;

    setIsDeleting(true);
    try {
      const { error } = await deleteQuote(quoteToDelete.id);
      if (error) throw error;

      setQuotes((prev) => prev.filter((q) => q.id !== quoteToDelete.id));
      toast({
        title: 'Cotización eliminada',
        description: 'La cotización se eliminó correctamente.',
      });
    } catch (error) {
      console.error('Error deleting quote:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la cotización.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setQuoteToDelete(null);
    }
  };

  const handleTogglePublic = async (quote: SavedQuote) => {
    try {
      if (quote.is_public) {
        const { error } = await makeQuotePrivate(quote.id);
        if (error) throw error;
        
        setQuotes((prev) =>
          prev.map((q) => (q.id === quote.id ? { ...q, is_public: false } : q))
        );
        toast({
          title: 'Link desactivado',
          description: 'El link público ya no está disponible.',
        });
      } else {
        const { quote: updatedQuote, error } = await makeQuotePublic(quote.id);
        if (error) throw error;
        
        if (updatedQuote) {
          setQuotes((prev) =>
            prev.map((q) => (q.id === quote.id ? updatedQuote : q))
          );
        }
        toast({
          title: 'Link activado',
          description: 'El link público está listo para compartir.',
        });
      }
    } catch (error) {
      console.error('Error toggling public:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el estado.',
        variant: 'destructive',
      });
    }
  };

  const copyPublicLink = (quote: SavedQuote) => {
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/cotizacion/${quote.public_token}${
      quote.access_code ? `?code=${quote.access_code}` : ''
    }`;
    
    navigator.clipboard.writeText(link);
    toast({
      title: 'Link copiado',
      description: 'El link se copió al portapapeles.',
    });
  };

  const openAnalytics = async (quote: SavedQuote) => {
    setSelectedQuote(quote);
    setAnalyticsDialogOpen(true);
    setLoadingViews(true);

    try {
      const { views, error } = await getQuoteViews(quote.id);
      if (error) throw error;
      setQuoteViews(views);
    } catch (error) {
      console.error('Error loading views:', error);
    } finally {
      setLoadingViews(false);
    }
  };

  const handleDownloadPdf = async (quote: SavedQuote) => {
    if (!quote.pdf_html) {
      toast({
        title: 'PDF no disponible',
        description: 'Esta cotización no tiene un PDF guardado.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const functionUrl = `${SUPABASE_URL}/functions/v1/generate-pdf`;

      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/pdf',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ htmlContent: quote.pdf_html }),
      });

      if (!response.ok) throw new Error('Error generating PDF');

      const pdfData = await response.arrayBuffer();
      const blob = new Blob([pdfData], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cotizacion-${quote.quote_name || quote.id.slice(0, 8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: 'PDF descargado',
        description: 'El archivo se ha descargado correctamente.',
      });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast({
        title: 'Error',
        description: 'No se pudo descargar el PDF.',
        variant: 'destructive',
      });
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
      contacted: 'default',
      completed: 'default',
      cancelled: 'destructive',
    };

    const labels: Record<string, string> = {
      pending: 'Pendiente',
      contacted: 'Contactado',
      completed: 'Completada',
      cancelled: 'Cancelada',
    };

    return (
      <Badge variant={variants[status] || 'secondary'}>
        {labels[status] || status}
      </Badge>
    );
  };

  if (authLoading) {
    return (
      <VendorLayout>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Mis Cotizaciones</h1>
            <p className="text-muted-foreground">
              Gestiona y comparte tus cotizaciones guardadas
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar cotizaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-8 w-8" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredQuotes.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p className="font-medium">
                  {searchTerm ? 'No se encontraron cotizaciones' : 'No tienes cotizaciones guardadas'}
                </p>
                <p className="text-sm mt-1">
                  {searchTerm
                    ? 'Intenta con otro término de búsqueda'
                    : 'Las cotizaciones que guardes aparecerán aquí'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredQuotes.map((quote) => (
              <Card key={quote.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      {/* Title and client */}
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg truncate">
                            {quote.quote_name || `Cotización #${quote.id.slice(0, 8)}`}
                          </h3>
                          {quote.client_name && (
                            <p className="text-sm text-muted-foreground">
                              Cliente: {quote.client_name}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Meta info */}
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(quote.created_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {quote.plan_ids?.length || 0} planes
                        </span>
                        <span className="flex items-center gap-1 capitalize">
                          <MapPin className="h-4 w-4" />
                          {quote.residence_zone}
                        </span>
                        {quote.is_public && quote.view_count > 0 && (
                          <span className="flex items-center gap-1 text-primary">
                            <Eye className="h-4 w-4" />
                            {quote.view_count} vistas
                          </span>
                        )}
                      </div>

                      {/* Status badges */}
                      <div className="flex flex-wrap gap-2">
                        {getStatusBadge(quote.status)}
                        {quote.is_public && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <Link className="h-3 w-3 mr-1" />
                            Link activo
                          </Badge>
                        )}
                        {quote.access_code && (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                            Con código
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {quote.is_public && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => copyPublicLink(quote)}
                          title="Copiar link"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {quote.pdf_html && (
                            <DropdownMenuItem onClick={() => handleDownloadPdf(quote)}>
                              <Download className="h-4 w-4 mr-2" />
                              Descargar PDF
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleTogglePublic(quote)}>
                            {quote.is_public ? (
                              <>
                                <EyeOff className="h-4 w-4 mr-2" />
                                Desactivar link
                              </>
                            ) : (
                              <>
                                <Link className="h-4 w-4 mr-2" />
                                Activar link público
                              </>
                            )}
                          </DropdownMenuItem>
                          {quote.is_public && (
                            <>
                              <DropdownMenuItem onClick={() => copyPublicLink(quote)}>
                                <Copy className="h-4 w-4 mr-2" />
                                Copiar link
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  window.open(
                                    `/cotizacion/${quote.public_token}`,
                                    '_blank'
                                  )
                                }
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Ver como cliente
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem onClick={() => openAnalytics(quote)}>
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Ver estadísticas
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setQuoteToDelete(quote);
                              setDeleteDialogOpen(true);
                            }}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar cotización?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. Se eliminará la cotización
              {quoteToDelete?.quote_name && ` "${quoteToDelete.quote_name}"`} y
              todas sus estadísticas asociadas.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Analytics Dialog */}
      <Dialog open={analyticsDialogOpen} onOpenChange={setAnalyticsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Estadísticas
            </DialogTitle>
            <DialogDescription>
              {selectedQuote?.quote_name || 'Cotización'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-primary">
                  {selectedQuote?.view_count || 0}
                </div>
                <div className="text-sm text-muted-foreground">Vistas totales</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-primary">
                  {selectedQuote?.first_viewed_at
                    ? formatDate(selectedQuote.first_viewed_at)
                    : '-'}
                </div>
                <div className="text-sm text-muted-foreground">Primera vista</div>
              </div>
            </div>

            {/* Recent views */}
            <div>
              <h4 className="text-sm font-medium mb-2">Últimas visitas</h4>
              {loadingViews ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : quoteViews.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Aún no hay visitas registradas
                </p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {quoteViews.slice(0, 10).map((view) => (
                    <div
                      key={view.id}
                      className="flex items-center justify-between text-sm bg-muted/30 rounded px-3 py-2"
                    >
                      <span>
                        {new Date(view.viewed_at).toLocaleString('es-AR', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {view.downloaded_pdf && (
                        <Badge variant="outline" className="text-xs">
                          Descargó PDF
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAnalyticsDialogOpen(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </VendorLayout>
  );
};

export default VendorQuotesPage;
