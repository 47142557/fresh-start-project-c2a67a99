import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Check, AlertCircle, Info, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const StyleGuidePage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Style Guide</h1>
            <p className="text-sm text-muted-foreground">Mejor Plan Design System</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Brand Identity */}
        <section>
          <SectionTitle>Brand Identity</SectionTitle>
          <Card>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Philosophy</h3>
                  <p className="text-muted-foreground">Professional + Friendly healthcare comparison platform</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Font Family</h3>
                  <p className="text-muted-foreground font-sans">Plus Jakarta Sans (Bold & Catchy)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Colors */}
        <section>
          <SectionTitle>Color Palette</SectionTitle>
          
          {/* Primary Colors */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">Primary Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ColorSwatch 
                name="Primary (Trust Blue)" 
                variable="--primary" 
                value="200 85% 48%"
                className="bg-primary"
                textClass="text-primary-foreground"
              />
              <ColorSwatch 
                name="Primary Light" 
                variable="--primary-light" 
                value="200 85% 95%"
                className="bg-primary-light"
                textClass="text-primary"
              />
              <ColorSwatch 
                name="Secondary (Health Green)" 
                variable="--secondary" 
                value="160 55% 42%"
                className="bg-secondary"
                textClass="text-secondary-foreground"
              />
              <ColorSwatch 
                name="Secondary Light" 
                variable="--secondary-light" 
                value="160 55% 94%"
                className="bg-secondary-light"
                textClass="text-secondary"
              />
            </div>
          </div>

          {/* Accent & State Colors */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">Accent & State Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ColorSwatch 
                name="Accent (CTA Orange)" 
                variable="--accent" 
                value="25 95% 52%"
                className="bg-accent"
                textClass="text-accent-foreground"
              />
              <ColorSwatch 
                name="Success" 
                variable="--success" 
                value="160 55% 42%"
                className="bg-success"
                textClass="text-success-foreground"
              />
              <ColorSwatch 
                name="Warning" 
                variable="--warning" 
                value="45 93% 47%"
                className="bg-warning"
                textClass="text-warning-foreground"
              />
              <ColorSwatch 
                name="Destructive" 
                variable="--destructive" 
                value="0 84% 60%"
                className="bg-destructive"
                textClass="text-destructive-foreground"
              />
            </div>
          </div>

          {/* Neutral Colors */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Neutral Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ColorSwatch 
                name="Background" 
                variable="--background" 
                value="200 30% 98%"
                className="bg-background border border-border"
                textClass="text-foreground"
              />
              <ColorSwatch 
                name="Foreground" 
                variable="--foreground" 
                value="215 25% 15%"
                className="bg-foreground"
                textClass="text-background"
              />
              <ColorSwatch 
                name="Muted" 
                variable="--muted" 
                value="200 20% 96%"
                className="bg-muted"
                textClass="text-muted-foreground"
              />
              <ColorSwatch 
                name="Card" 
                variable="--card" 
                value="0 0% 100%"
                className="bg-card border border-border"
                textClass="text-card-foreground"
              />
            </div>
          </div>
        </section>

        {/* Gradients */}
        <section>
          <SectionTitle>Gradients</SectionTitle>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-lg p-6 bg-gradient-primary">
              <p className="text-white font-semibold">Gradient Primary</p>
              <code className="text-white/80 text-sm">bg-gradient-primary</code>
            </div>
            <div className="rounded-lg p-6 bg-gradient-hero border border-border">
              <p className="text-foreground font-semibold">Gradient Hero</p>
              <code className="text-muted-foreground text-sm">bg-gradient-hero</code>
            </div>
            <div className="rounded-lg p-6 bg-gradient-accent">
              <p className="text-white font-semibold">Gradient Accent</p>
              <code className="text-white/80 text-sm">bg-gradient-accent</code>
            </div>
            <div className="rounded-lg p-6 bg-gradient-bg border border-border">
              <p className="text-foreground font-semibold">Gradient Background</p>
              <code className="text-muted-foreground text-sm">bg-gradient-bg</code>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section>
          <SectionTitle>Typography</SectionTitle>
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2">H1 - Page Title</p>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">Encuentra tu plan ideal</h1>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-2">H2 - Section Title</p>
                <h2 className="text-3xl font-bold text-foreground">Compara prepagas</h2>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-2">H3 - Card Title</p>
                <h3 className="text-xl font-semibold text-foreground">Plan Premium 3000</h3>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-2">Body Text</p>
                <p className="text-foreground">Comparamos los mejores planes de salud para encontrar el que mejor se adapta a tus necesidades.</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-2">Muted Text</p>
                <p className="text-muted-foreground">Información adicional y descripciones secundarias.</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-2">Text Gradient</p>
                <p className="text-2xl font-bold text-gradient">Texto con gradiente</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Buttons */}
        <section>
          <SectionTitle>Buttons</SectionTitle>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-3">Variants</p>
                  <div className="flex flex-wrap gap-3">
                    <Button>Default</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="link">Link</Button>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-3">Sizes</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button size="sm">Small</Button>
                    <Button size="default">Default</Button>
                    <Button size="lg">Large</Button>
                    <Button size="icon"><Zap className="h-4 w-4" /></Button>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-3">With Icons</p>
                  <div className="flex flex-wrap gap-3">
                    <Button><Check className="mr-2 h-4 w-4" /> Confirmar</Button>
                    <Button variant="outline"><Info className="mr-2 h-4 w-4" /> Ver detalles</Button>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-3">States</p>
                  <div className="flex flex-wrap gap-3">
                    <Button disabled>Disabled</Button>
                    <Button className="opacity-50 cursor-wait">Loading...</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Badges */}
        <section>
          <SectionTitle>Badges</SectionTitle>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-3">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge className="bg-success text-success-foreground">Success</Badge>
                <Badge className="bg-warning text-warning-foreground">Warning</Badge>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Cards */}
        <section>
          <SectionTitle>Cards</SectionTitle>
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Card Default</CardTitle>
                <CardDescription>Basic card with shadow-card</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Content goes here</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-card-hover">
              <CardHeader>
                <CardTitle>Card Hover Shadow</CardTitle>
                <CardDescription>Using shadow-card-hover</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Enhanced shadow</p>
              </CardContent>
            </Card>
            
            <Card className="border-primary/20 bg-primary-light">
              <CardHeader>
                <CardTitle className="text-primary">Featured Card</CardTitle>
                <CardDescription>Highlighted with primary color</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Special promotion</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Form Elements */}
        <section>
          <SectionTitle>Form Elements</SectionTitle>
          <Card>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="input-example">Input Label</Label>
                    <Input id="input-example" placeholder="Placeholder text" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="input-disabled">Disabled Input</Label>
                    <Input id="input-disabled" placeholder="Disabled" disabled />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="checkbox" />
                    <Label htmlFor="checkbox">Checkbox option</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="switch" />
                    <Label htmlFor="switch">Toggle switch</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Shadows */}
        <section>
          <SectionTitle>Shadows</SectionTitle>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card rounded-lg p-6 shadow-card">
              <p className="font-semibold text-foreground">shadow-card</p>
              <code className="text-sm text-muted-foreground">--shadow-card</code>
            </div>
            <div className="bg-card rounded-lg p-6 shadow-card-hover">
              <p className="font-semibold text-foreground">shadow-card-hover</p>
              <code className="text-sm text-muted-foreground">--shadow-hover</code>
            </div>
            <div className="bg-card rounded-lg p-6 shadow-colorful">
              <p className="font-semibold text-foreground">shadow-colorful</p>
              <code className="text-sm text-muted-foreground">--shadow-colorful</code>
            </div>
          </div>
        </section>

        {/* Border Radius */}
        <section>
          <SectionTitle>Border Radius</SectionTitle>
          <div className="flex flex-wrap gap-6">
            <div className="bg-primary h-20 w-20 rounded-sm flex items-center justify-center">
              <span className="text-primary-foreground text-xs">sm</span>
            </div>
            <div className="bg-primary h-20 w-20 rounded-md flex items-center justify-center">
              <span className="text-primary-foreground text-xs">md</span>
            </div>
            <div className="bg-primary h-20 w-20 rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground text-xs">lg</span>
            </div>
            <div className="bg-primary h-20 w-20 rounded-full flex items-center justify-center">
              <span className="text-primary-foreground text-xs">full</span>
            </div>
          </div>
        </section>

        {/* Spacing Reference */}
        <section>
          <SectionTitle>Spacing Scale</SectionTitle>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                {[1, 2, 3, 4, 6, 8, 12, 16].map((size) => (
                  <div key={size} className="flex items-center gap-4">
                    <code className="text-sm text-muted-foreground w-12">p-{size}</code>
                    <div className={`bg-primary h-4 rounded`} style={{ width: `${size * 4}px` }} />
                    <span className="text-sm text-muted-foreground">{size * 4}px</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Alerts/States */}
        <section>
          <SectionTitle>Alert States</SectionTitle>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-primary-light border border-primary/20">
              <Info className="h-5 w-5 text-primary" />
              <p className="text-foreground">Info: This is an informational message.</p>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-success/10 border border-success/20">
              <Check className="h-5 w-5 text-success" />
              <p className="text-foreground">Success: Operation completed successfully.</p>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-warning/10 border border-warning/20">
              <AlertCircle className="h-5 w-5 text-warning" />
              <p className="text-foreground">Warning: Please review before continuing.</p>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="text-foreground">Error: Something went wrong.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

// Helper Components
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-2xl font-bold text-foreground mb-6 pb-2 border-b border-border">
    {children}
  </h2>
);

interface ColorSwatchProps {
  name: string;
  variable: string;
  value: string;
  className: string;
  textClass: string;
}

const ColorSwatch = ({ name, variable, value, className, textClass }: ColorSwatchProps) => (
  <div className={`rounded-lg p-4 ${className}`}>
    <p className={`font-semibold text-sm ${textClass}`}>{name}</p>
    <code className={`text-xs ${textClass} opacity-80`}>{variable}</code>
    <p className={`text-xs mt-1 ${textClass} opacity-60`}>{value}</p>
  </div>
);

export default StyleGuidePage;
