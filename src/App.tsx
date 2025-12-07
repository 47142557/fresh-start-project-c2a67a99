import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./modules/home/pages/Index";
import ResultadosPage from "./modules/salud/pages/ResultadosPage";
import { ComparisonPage } from "./modules/salud/pages/ComparisonPage";
import NotFound from "./modules/salud/pages/NotFound";
import { LoginPage, RegisterPage, ForgotPasswordPage } from "./modules/auth/pages";
import { StyleGuidePage } from "./modules/styleguide/pages";
import {
  VendorRegistrationPage,
  VendorDashboardPage,
  VendorProfilePage,
  VendorQuotesPage,
} from "./modules/vendor/pages";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/resultados" element={<ResultadosPage />} />
            <Route path="/comparar" element={<ComparisonPage />} />
            {/* Auth routes */}
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
            {/* Vendor routes */}
            <Route path="/vendedor/registro" element={<VendorRegistrationPage />} />
            <Route path="/vendedor/dashboard" element={<VendorDashboardPage />} />
            <Route path="/vendedor/perfil" element={<VendorProfilePage />} />
            <Route path="/vendedor/cotizaciones" element={<VendorQuotesPage />} />
            {/* Styleguide */}
            <Route path="/styleguide" element={<StyleGuidePage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
