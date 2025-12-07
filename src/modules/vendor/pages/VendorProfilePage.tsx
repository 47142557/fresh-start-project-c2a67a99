import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Building2, Phone, MessageCircle, Linkedin, Instagram, Palette, Globe } from 'lucide-react';
import { VendorLayout } from '../layouts/VendorLayout';
import { useVendorAuth } from '../hooks/useVendorAuth';
import { updateVendorProfile, UpdateVendorProfileData } from '@/services/vendor.service';

export const VendorProfilePage = () => {
  const { user, vendorProfile } = useVendorAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#0C8CE9');
  const [secondaryColor, setSecondaryColor] = useState('#2DB87B');
  const [isPublic, setIsPublic] = useState(false);
  const [nickname, setNickname] = useState('');

  // Load initial data from vendor profile
  useEffect(() => {
    if (vendorProfile) {
      setBusinessName(vendorProfile.business_name || '');
      setPhone(vendorProfile.phone || '');
      setWhatsapp(vendorProfile.whatsapp || '');
      setLinkedinUrl(vendorProfile.linkedin_url || '');
      setInstagramUrl(vendorProfile.instagram_url || '');
      setPrimaryColor(vendorProfile.primary_color || '#0C8CE9');
      setSecondaryColor(vendorProfile.secondary_color || '#2DB87B');
      setIsPublic(vendorProfile.is_public || false);
      setNickname(vendorProfile.nickname || '');
    }
  }, [vendorProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);

    try {
      const updateData: UpdateVendorProfileData = {
        business_name: businessName,
        phone,
        whatsapp,
        linkedin_url: linkedinUrl || undefined,
        instagram_url: instagramUrl || undefined,
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        is_public: isPublic,
        nickname: isPublic ? nickname : undefined,
      };

      const { error } = await updateVendorProfile(user.id, updateData);

      if (error) {
        toast({
          title: 'Error',
          description: 'No se pudo actualizar el perfil',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Perfil actualizado',
        description: 'Tus cambios han sido guardados',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Ocurrió un error inesperado',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VendorLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mi Perfil</h1>
          <p className="text-muted-foreground">
            Personaliza tu información comercial y branding
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información Básica</CardTitle>
              <CardDescription>
                Datos que aparecerán en tus cotizaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Nombre Comercial</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="businessName"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="pl-10"
                    placeholder="Tu nombre o empresa"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <div className="relative">
                    <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="whatsapp"
                      type="tel"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Redes Sociales</CardTitle>
              <CardDescription>
                Links a tus perfiles profesionales
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="linkedin"
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="pl-10"
                    placeholder="https://linkedin.com/in/tu-perfil"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <div className="relative">
                  <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="instagram"
                    type="url"
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                    className="pl-10"
                    placeholder="https://instagram.com/tu-cuenta"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Branding */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personalización</CardTitle>
              <CardDescription>
                Colores para tus cotizaciones en PDF
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Color Primario</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-12 h-10 p-1 cursor-pointer"
                      disabled={isLoading}
                    />
                    <Input
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="flex-1"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Color Secundario</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-12 h-10 p-1 cursor-pointer"
                      disabled={isLoading}
                    />
                    <Input
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="flex-1"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Color Preview */}
              <div className="flex gap-2 p-4 rounded-lg border">
                <div
                  className="h-10 w-10 rounded"
                  style={{ backgroundColor: primaryColor }}
                />
                <div
                  className="h-10 w-10 rounded"
                  style={{ backgroundColor: secondaryColor }}
                />
                <span className="text-sm text-muted-foreground self-center ml-2">
                  Vista previa de colores
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Public Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Perfil Público</CardTitle>
              <CardDescription>
                Decide si quieres tener un perfil visible para otros
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="isPublic">Perfil visible</Label>
                  <p className="text-sm text-muted-foreground">
                    Permite que otros vean tu perfil y estadísticas básicas
                  </p>
                </div>
                <Switch
                  id="isPublic"
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                  disabled={isLoading}
                />
              </div>

              {isPublic && (
                <div className="space-y-2">
                  <Label htmlFor="nickname">Apodo o Nick (para anonimato)</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="nickname"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className="pl-10"
                      placeholder="Ej: VendedorPro2024"
                      disabled={isLoading}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Se mostrará este nombre en lugar de tu nombre real
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              'Guardar Cambios'
            )}
          </Button>
        </form>
      </div>
    </VendorLayout>
  );
};

export default VendorProfilePage;
