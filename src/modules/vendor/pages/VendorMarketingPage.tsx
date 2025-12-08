import { useState } from 'react';
import { VendorLayout } from '../layouts/VendorLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Download, 
  Search, 
  Instagram, 
  Facebook, 
  MessageCircle,
  ZoomIn,
  X,
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

// Marketing kit images data - these would come from a CMS or storage in production
const marketingImages = [
  {
    id: '1',
    title: 'Compará planes de salud',
    description: 'Post informativo sobre comparación de planes',
    thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=400&fit=crop',
    fullUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1080&h=1080&fit=crop',
    networks: ['instagram', 'facebook'],
    theme: 'informativo',
    audience: 'familias'
  },
  {
    id: '2',
    title: 'Tu salud, nuestra prioridad',
    description: 'Story motivacional para engagement',
    thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop',
    fullUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1080&h=1920&fit=crop',
    networks: ['instagram', 'whatsapp'],
    theme: 'motivacional',
    audience: 'general'
  },
  {
    id: '3',
    title: 'Asesoramiento personalizado',
    description: 'Promoción de servicios de asesoría',
    thumbnail: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=400&h=400&fit=crop',
    fullUrl: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=1080&h=1080&fit=crop',
    networks: ['instagram', 'facebook'],
    theme: 'promocional',
    audience: 'empresas'
  },
  {
    id: '4',
    title: 'Beneficios exclusivos',
    description: 'Destacá los beneficios de tus planes',
    thumbnail: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=400&fit=crop',
    fullUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1080&h=1080&fit=crop',
    networks: ['facebook', 'whatsapp'],
    theme: 'informativo',
    audience: 'familias'
  },
  {
    id: '5',
    title: 'Consultá sin compromiso',
    description: 'CTA para generar leads',
    thumbnail: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400&h=400&fit=crop',
    fullUrl: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1080&h=1350&fit=crop',
    networks: ['instagram', 'facebook', 'whatsapp'],
    theme: 'promocional',
    audience: 'general'
  },
  {
    id: '6',
    title: 'Cobertura nacional',
    description: 'Mapa de cobertura para empresas',
    thumbnail: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&h=400&fit=crop',
    fullUrl: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1080&h=1080&fit=crop',
    networks: ['facebook'],
    theme: 'informativo',
    audience: 'empresas'
  },
];

const networkFilters = [
  { id: 'all', label: 'Todos', icon: null },
  { id: 'instagram', label: 'Instagram', icon: Instagram },
  { id: 'facebook', label: 'Facebook', icon: Facebook },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
];

const themeFilters = [
  { id: 'all', label: 'Todos' },
  { id: 'informativo', label: 'Informativo' },
  { id: 'motivacional', label: 'Motivacional' },
  { id: 'promocional', label: 'Promocional' },
];

const audienceFilters = [
  { id: 'all', label: 'Todos' },
  { id: 'familias', label: 'Familias' },
  { id: 'empresas', label: 'Empresas' },
  { id: 'general', label: 'General' },
];

const getNetworkIcon = (network: string) => {
  switch (network) {
    case 'instagram':
      return Instagram;
    case 'facebook':
      return Facebook;
    case 'whatsapp':
      return MessageCircle;
    default:
      return ImageIcon;
  }
};

export const VendorMarketingPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('all');
  const [selectedTheme, setSelectedTheme] = useState('all');
  const [selectedAudience, setSelectedAudience] = useState('all');
  const [previewImage, setPreviewImage] = useState<typeof marketingImages[0] | null>(null);

  const filteredImages = marketingImages.filter((image) => {
    const matchesSearch = 
      image.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      image.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesNetwork = 
      selectedNetwork === 'all' || image.networks.includes(selectedNetwork);
    
    const matchesTheme = 
      selectedTheme === 'all' || image.theme === selectedTheme;
    
    const matchesAudience = 
      selectedAudience === 'all' || image.audience === selectedAudience;

    return matchesSearch && matchesNetwork && matchesTheme && matchesAudience;
  });

  const handleDownload = async (image: typeof marketingImages[0]) => {
    try {
      const response = await fetch(image.fullUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${image.title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image');
    }
  };

  return (
    <VendorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              ¡Explorá nuestro Kit de Marketing!
            </h1>
            <p className="text-muted-foreground mt-1">
              Imágenes listas para compartir en tus redes sociales y aumentar tu presencia online
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar imágenes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-4">
              {/* Network filter */}
              <div className="space-y-2">
                <span className="text-xs font-medium text-muted-foreground">Red Social</span>
                <div className="flex flex-wrap gap-1">
                  {networkFilters.map((filter) => {
                    const Icon = filter.icon;
                    return (
                      <Button
                        key={filter.id}
                        variant={selectedNetwork === filter.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedNetwork(filter.id)}
                        className="gap-1.5"
                      >
                        {Icon && <Icon className="h-3.5 w-3.5" />}
                        {filter.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Theme filter */}
              <div className="space-y-2">
                <span className="text-xs font-medium text-muted-foreground">Tema</span>
                <div className="flex flex-wrap gap-1">
                  {themeFilters.map((filter) => (
                    <Button
                      key={filter.id}
                      variant={selectedTheme === filter.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedTheme(filter.id)}
                    >
                      {filter.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Audience filter */}
              <div className="space-y-2">
                <span className="text-xs font-medium text-muted-foreground">Audiencia</span>
                <div className="flex flex-wrap gap-1">
                  {audienceFilters.map((filter) => (
                    <Button
                      key={filter.id}
                      variant={selectedAudience === filter.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedAudience(filter.id)}
                    >
                      {filter.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          {filteredImages.length} {filteredImages.length === 1 ? 'imagen' : 'imágenes'} disponibles
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredImages.map((image) => (
            <Card
              key={image.id}
              className="group overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative aspect-square">
                <img
                  src={image.thumbnail}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => setPreviewImage(image)}
                    className="rounded-full"
                  >
                    <ZoomIn className="h-5 w-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => handleDownload(image)}
                    className="rounded-full"
                  >
                    <Download className="h-5 w-5" />
                  </Button>
                </div>

                {/* Download button always visible on mobile */}
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => handleDownload(image)}
                  className="absolute bottom-2 right-2 rounded-full opacity-90 lg:hidden"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>

              <CardContent className="p-3 space-y-2">
                <h3 className="font-medium text-sm truncate">{image.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {image.description}
                </p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {image.networks.map((network) => {
                    const Icon = getNetworkIcon(network);
                    return (
                      <Badge
                        key={network}
                        variant="secondary"
                        className="gap-1 text-xs px-1.5 py-0.5"
                      >
                        <Icon className="h-3 w-3" />
                        {network}
                      </Badge>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty state */}
        {filteredImages.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground">No se encontraron imágenes</h3>
            <p className="text-muted-foreground mt-1">
              Probá ajustando los filtros de búsqueda
            </p>
          </div>
        )}

        {/* Preview Dialog */}
        <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
          <DialogContent className="max-w-3xl p-0 overflow-hidden">
            {previewImage && (
              <div className="relative">
                <img
                  src={previewImage.fullUrl}
                  alt={previewImage.title}
                  className="w-full h-auto"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => handleDownload(previewImage)}
                    className="rounded-full"
                  >
                    <Download className="h-5 w-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => setPreviewImage(null)}
                    className="rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <h3 className="font-semibold text-white">{previewImage.title}</h3>
                  <p className="text-sm text-white/80">{previewImage.description}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </VendorLayout>
  );
};

export default VendorMarketingPage;
