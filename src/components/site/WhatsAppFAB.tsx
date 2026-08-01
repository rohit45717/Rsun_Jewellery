import { MessageCircle } from "lucide-react";
import { useSettings } from "@/lib/api";

export function WhatsAppFAB() {
  const { whatsapp } = useSettings();
  return (
    <a
      href={whatsapp("Hello Rsun Jewellery, I'd like to know more about your collection.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Order on WhatsApp"
      className="group fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[var(--whatsapp)] px-4 py-3 text-sm font-semibold text-white shadow-2xl transition-transform hover:scale-105 md:bottom-8 md:right-8"
    >
      <span className="relative flex h-6 w-6 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-white/40" />
        <MessageCircle className="relative h-5 w-5" />
      </span>
      <span className="hidden md:inline">Chat to Order</span>
    </a>
  );
}
