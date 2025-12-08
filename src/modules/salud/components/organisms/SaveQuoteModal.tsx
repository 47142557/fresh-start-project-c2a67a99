import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save, Link, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { saveQuote, CreateQuoteData } from "@/services/quotes.service";
import { HealthPlan } from "@/core/interfaces/plan/planes";

interface SaveQuoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plans: HealthPlan[];
  editedPrices: Record<string, number>;
  pdfHtml?: string;
  userId: string;
  onSaved?: () => void;
}

export const SaveQuoteModal = ({
  open,
  onOpenChange,
  plans,
  editedPrices,
  pdfHtml,
  userId,
  onSaved,
}: SaveQuoteModalProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [quoteName, setQuoteName] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [familyGroup, setFamilyGroup] = useState("individual");
  const [requestType, setRequestType] = useState("particular");
  const [residenceZone, setResidenceZone] = useState("AMBA");
  const [customMessage, setCustomMessage] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [accessCode, setAccessCode] = useState("");

  const handleSave = async () => {
    if (!quoteName.trim()) {
      toast({
        title: "Nombre requerido",
        description: "Por favor ingresa un nombre para identificar esta cotización.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const quoteData: CreateQuoteData = {
        plan_ids: plans.map((p) => p._id),
        form_data: {
          plans: plans.map((p) => ({
            id: p._id,
            name: p.name,
            empresa: p.empresa,
            precio: editedPrices[p._id] ?? p.precio,
          })),
        },
        quote_name: quoteName,
        client_name: clientName || undefined,
        client_email: clientEmail || undefined,
        client_phone: clientPhone || undefined,
        family_group: familyGroup,
        request_type: requestType,
        residence_zone: residenceZone,
        custom_message: customMessage || undefined,
        edited_prices: editedPrices,
        pdf_html: pdfHtml || undefined,
        is_public: isPublic,
        access_code: isPublic && accessCode ? accessCode : undefined,
      };

      const { quote, error } = await saveQuote(userId, quoteData);

      if (error) throw error;

      toast({
        title: "Cotización guardada",
        description: isPublic
          ? "La cotización se guardó y se generó un link para compartir."
          : "La cotización se guardó correctamente.",
      });

      // Reset form
      setQuoteName("");
      setClientName("");
      setClientEmail("");
      setClientPhone("");
      setFamilyGroup("individual");
      setRequestType("particular");
      setResidenceZone("AMBA");
      setCustomMessage("");
      setIsPublic(false);
      setAccessCode("");

      onOpenChange(false);
      onSaved?.();
    } catch (error) {
      console.error("Error saving quote:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar la cotización. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateRandomCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setAccessCode(code);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="h-5 w-5 text-primary" />
            Guardar Cotización
          </DialogTitle>
          <DialogDescription>
            Guarda esta comparación para acceder después o compartirla con tu cliente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Quote Name */}
          <div className="space-y-2">
            <Label htmlFor="quoteName">Nombre de la cotización *</Label>
            <Input
              id="quoteName"
              placeholder="Ej: Cotización Familia Pérez"
              value={quoteName}
              onChange={(e) => setQuoteName(e.target.value)}
            />
          </div>

          {/* Client Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Nombre del cliente</Label>
              <Input
                id="clientName"
                placeholder="Nombre completo"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientPhone">Teléfono</Label>
              <Input
                id="clientPhone"
                placeholder="+54 11..."
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientEmail">Email del cliente</Label>
            <Input
              id="clientEmail"
              type="email"
              placeholder="cliente@email.com"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
            />
          </div>

          {/* Request Data */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Grupo Familiar</Label>
              <Select value={familyGroup} onValueChange={setFamilyGroup}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="matrimonio">Matrimonio</SelectItem>
                  <SelectItem value="familia">Familia</SelectItem>
                  <SelectItem value="monoparental">Monoparental</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tipo de Solicitud</Label>
              <Select value={requestType} onValueChange={setRequestType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="particular">Particular</SelectItem>
                  <SelectItem value="cambio_os">Cambio de O.S.</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Zona</Label>
              <Select value={residenceZone} onValueChange={setResidenceZone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AMBA">AMBA</SelectItem>
                  <SelectItem value="CABA">CABA</SelectItem>
                  <SelectItem value="GBA_Norte">GBA Norte</SelectItem>
                  <SelectItem value="GBA_Sur">GBA Sur</SelectItem>
                  <SelectItem value="GBA_Oeste">GBA Oeste</SelectItem>
                  <SelectItem value="Interior">Interior</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Custom Message */}
          <div className="space-y-2">
            <Label htmlFor="customMessage">Mensaje personalizado</Label>
            <Textarea
              id="customMessage"
              placeholder="Agrega un mensaje para tu cliente..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={3}
            />
          </div>

          {/* Public Link Settings */}
          <div className="border-t pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="isPublic" className="flex items-center gap-2">
                  <Link className="h-4 w-4" />
                  Generar link para compartir
                </Label>
                <p className="text-xs text-muted-foreground">
                  Permite que el cliente vea la cotización online
                </p>
              </div>
              <Switch
                id="isPublic"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
            </div>

            {isPublic && (
              <div className="space-y-2 animate-in slide-in-from-top-2">
                <Label htmlFor="accessCode" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Código de acceso
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="accessCode"
                    placeholder="Opcional: código para ver"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateRandomCode}
                  >
                    Generar
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {accessCode
                    ? "El cliente necesitará este código para ver la cotización"
                    : "Sin código, cualquiera con el link puede ver la cotización"}
                </p>
              </div>
            )}
          </div>

          {/* Plans Summary */}
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-sm font-medium mb-2">
              Planes incluidos ({plans.length}):
            </p>
            <div className="flex flex-wrap gap-1">
              {plans.map((plan) => (
                <span
                  key={plan._id}
                  className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                >
                  {plan.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Guardar Cotización
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveQuoteModal;
