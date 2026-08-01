import { Star, X, ZoomIn } from "lucide-react";
import type { Product } from "@/lib/site";
import { orderMessage } from "@/lib/site";
import { useSettings, trackProductView, trackWhatsAppClick } from "@/lib/api";
import { useEffect, useState } from "react";
import { ProductSchema } from "./ProductSchema";

export function ProductCard({ product }: { product: Product }) {
  const { whatsapp } = useSettings();
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const off =
    product.mrp && product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : null;
  const soldOut = !!product.sold_out;

  // Track product view when card is visible
  useEffect(() => {
    if (product.id) {
      trackProductView(product.id);
    }
  }, [product.id]);

  // Handle keyboard events for zoom modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isZoomed && (e.key === 'Escape' || e.key === 'Esc')) {
        setIsZoomed(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZoomed]);

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  return (
    <>
      <ProductSchema product={product} />
      <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-border transition-all duration-500 hover:-translate-y-1 hover:shadow-luxe hover:ring-[var(--gold)]/50">
        <div className="relative aspect-[4/5] overflow-hidden bg-[var(--gold-soft)] cursor-zoom-in" onClick={() => setIsZoomed(true)}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className={`h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105 ${
              soldOut ? "grayscale opacity-80" : ""
            }`}
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'%3E%3Crect width='400' height='500' fill='%23e5e5e5'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-size='24' fill='%23999'%3E📷%3C/text%3E%3C/svg%3E";
            }}
          />
          <div className="absolute bottom-3 right-3 rounded-full bg-background/80 p-2 opacity-0 transition-opacity group-hover:opacity-100 backdrop-blur">
            <ZoomIn className="h-4 w-4 text-foreground" />
          </div>
          {product.badge && !soldOut && (
            <span className="absolute left-2 top-2 rounded-full bg-background/90 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-widest text-[var(--gold-dark)] backdrop-blur sm:left-3 sm:top-3 sm:px-3 sm:py-1 sm:text-[10px]">
              {product.badge}
            </span>
          )}
          {soldOut && (
            <span className="absolute left-2 top-2 rounded-full bg-foreground/90 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-widest text-[var(--ivory)] backdrop-blur sm:left-3 sm:top-3 sm:px-3 sm:py-1 sm:text-[10px]">
              Sold Out
            </span>
          )}
          {off && !soldOut && (
            <span className="absolute right-2 top-2 rounded-full bg-gradient-gold px-2 py-0.5 text-[8px] font-semibold uppercase tracking-widest text-[var(--ivory)] sm:right-3 sm:top-3 sm:px-3 sm:py-1 sm:text-[10px]">
              {off}% Off
            </span>
          )}
        </div>

      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <div className="flex items-center gap-1 text-[var(--gold-dark)]">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${i < product.rating ? "fill-current" : "opacity-30"}`}
            />
          ))}
        </div>
        <h3 className="mt-2 font-display text-sm leading-tight text-foreground line-clamp-2">
          {product.name}
        </h3>
        <p className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">
          {product.category}
        </p>
        {product.description && (
          <p className="mt-2 line-clamp-1 text-xs text-muted-foreground hidden sm:block">
            {product.description}
          </p>
        )}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-base font-semibold text-foreground">₹{product.price}</span>
          {product.mrp && (
            <span className="text-xs text-muted-foreground line-through">₹{product.mrp}</span>
          )}
        </div>

        {soldOut ? (
          <button
            disabled
            className="mt-4 inline-flex h-11 w-full cursor-not-allowed items-center justify-center rounded-full bg-muted px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground sm:mt-5 sm:h-auto sm:w-auto sm:px-5 sm:text-xs"
          >
            Sold Out
          </button>
        ) : (
          <a
            href={whatsapp(orderMessage(product))}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackWhatsAppClick(product.id)}
            className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-full bg-foreground px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--ivory)] transition-all hover:bg-[var(--gold-dark)] sm:mt-5 sm:h-auto sm:w-auto sm:px-5 sm:text-xs"
          >
            Order on WhatsApp
          </a>
        )}
      </div>
    </article>

      {/* Zoom Modal */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setIsZoomed(false)}
        >
          <button 
            className="absolute top-4 right-4 rounded-full bg-background/80 p-2 backdrop-blur hover:bg-background"
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(false);
            }}
          >
            <X className="h-6 w-6" />
          </button>
          <div className="relative max-h-[90vh] max-w-[90vw]">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-[90vh] max-w-[90vw] object-contain"
              onMouseMove={handleMouseMove}
              style={{
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                transform: 'scale(2)',
              }}
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-background/80 px-4 py-2 text-sm backdrop-blur">
              <p className="font-semibold">{product.name}</p>
              <p className="text-muted-foreground">₹{product.price}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
