import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HeroSlideContent, HeroSlide } from "../molecules/HeroSlideContent";
import Autoplay from "embla-carousel-autoplay";

interface ResultsHeroBannerProps {
  slides: HeroSlide[];
  plansCount: number;
  providersCount: number;
  onWhatsAppClick: () => void;
}

export const ResultsHeroBanner = ({
  slides,
  plansCount,
  providersCount,
  onWhatsAppClick,
}: ResultsHeroBannerProps) => (
  <div className="relative bg-gradient-header overflow-hidden">
    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
    <div className="container mx-auto px-4 py-8 lg:py-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <Carousel
          opts={{ align: "start", loop: true }}
          plugins={[Autoplay({ delay: 4000, stopOnInteraction: false })]}
          className="flex-1 text-center md:text-left"
        >
          <CarouselContent>
            {slides.map((slide, index) => (
              <CarouselItem key={index}>
                <HeroSlideContent slide={slide} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
          <div className="flex gap-2">
            <Badge className="bg-cta-highlight text-cta-highlight-foreground border-0 font-bold text-sm px-4 py-1.5 shadow-lg">
              🔥 {plansCount} planes disponibles
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 font-semibold">
              {providersCount} prepagas
            </Badge>
          </div>
          
          <Button 
            className="bg-gradient-cta text-cta-highlight-foreground font-bold rounded-full px-6 py-2 shadow-lg hover:opacity-90 transition-opacity"
            onClick={onWhatsAppClick}
          >
            📱 Consultar por WhatsApp
          </Button>
        </div>
      </div>
    </div>
  </div>
);
