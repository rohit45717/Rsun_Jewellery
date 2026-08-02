import { Link } from "@tanstack/react-router";
import { Instagram, Mail, MapPin, MessageCircle } from "lucide-react";
import logo from "/logo.png";
import { useSettings } from "@/lib/api";
import { useEffect, useState } from "react";

export function Footer() {
  const { settings, whatsapp } = useSettings();
  const [instagramSettings, setInstagramSettings] = useState({
    username: settings.instagram_handle,
    profileUrl: `https://www.instagram.com/${settings.instagram_handle}`,
    title: "Follow us on Instagram",
    description: "Stay connected with us for our newest collections, styling inspiration, exclusive launches, customer stories, and special offers.",
    showSection: true,
  });

  const instagramUrl = instagramSettings.profileUrl;

  return (
    <footer className="mt-24 border-t border-border bg-[var(--gold-soft)]/40">
      {/* Instagram Section */}
      {instagramSettings.showSection && (
        <div className="border-b border-border/50 bg-gradient-to-b from-background to-[var(--gold-soft)]/20">
          <div className="mx-auto max-w-7xl px-5 py-8 md:px-10 md:py-12">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex items-center gap-3 md:mb-6 md:gap-4">
                <img src={logo} alt="Rsun Jewellery" width={60} height={60} className="h-12 w-12 rounded-full ring-2 ring-[var(--gold)]/30 transition-transform hover:scale-105 md:h-16 md:w-16" />
                <Instagram className="h-8 w-8 text-[var(--gold-dark)] transition-transform hover:scale-110 md:h-12 md:w-12" />
              </div>
              
              <h3 className="font-display text-xl text-[var(--gold-dark)] md:text-2xl">{instagramSettings.title}</h3>
              
              <a 
                href={instagramUrl} 
                target="_blank" 
                rel="noreferrer"
                className="mt-3 text-base font-semibold text-foreground transition-colors hover:text-[var(--gold-dark)] md:mt-4 md:text-lg"
              >
                @{instagramSettings.username}
              </a>
              
              <p className="mt-3 max-w-lg text-xs text-muted-foreground md:mt-4 md:text-sm">
                {instagramSettings.description}
              </p>
              
              <a
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-gold px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-[var(--ivory)] transition-all hover:shadow-lg hover:scale-105 md:mt-6 md:px-8 md:py-3 md:text-sm"
              >
                <Instagram className="h-3.5 w-3.5 md:h-4 md:w-4" />
                Follow @{instagramSettings.username}
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-5 py-10 md:px-10 md:py-16">
        <div className="grid gap-10 md:grid-cols-4 md:gap-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3">
              <img src={logo} alt="" width={40} height={40} className="h-10 w-10 rounded-full ring-1 ring-[var(--gold)]/40" />
              <div className="leading-tight">
                <div className="font-display text-lg">Rsun</div>
                <div className="text-[10px] uppercase tracking-[0.28em] text-[var(--gold-dark)]">Jewellery</div>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Premium anti-tarnish jewellery designed for everyday elegance. Made to shine, made to last.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-[var(--gold-dark)]">Shop</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/shop" className="hover:text-[var(--gold-dark)]">All Jewellery</Link></li>
              <li><Link to="/shop" search={{ c: "Necklaces" }} className="hover:text-[var(--gold-dark)]">Necklaces</Link></li>
              <li><Link to="/shop" search={{ c: "Pendants" }} className="hover:text-[var(--gold-dark)]">Pendants</Link></li>
              <li><Link to="/shop" search={{ c: "Bracelets" }} className="hover:text-[var(--gold-dark)]">Bracelets</Link></li>
              <li><Link to="/shop" search={{ c: "Rings" }} className="hover:text-[var(--gold-dark)]">Rings</Link></li>
              <li><Link to="/shop" search={{ c: "Earrings" }} className="hover:text-[var(--gold-dark)]">Earrings</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-[var(--gold-dark)]">Help</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/care" className="hover:text-[var(--gold-dark)]">Jewellery Care</Link></li>
              <li><Link to="/faq" className="hover:text-[var(--gold-dark)]">FAQ</Link></li>
              <li><Link to="/shipping" className="hover:text-[var(--gold-dark)]">Shipping Policy</Link></li>
              <li><Link to="/refund" className="hover:text-[var(--gold-dark)]">Refund Policy</Link></li>
              <li><Link to="/privacy" className="hover:text-[var(--gold-dark)]">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-[var(--gold-dark)]">Terms</Link></li>
              <li><Link to="/admin" className="hover:text-[var(--gold-dark)]">Admin</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-[var(--gold-dark)]">Get in Touch</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a href={whatsapp("Hello Rsun Jewellery!")} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[var(--gold-dark)]">
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
              </li>
              <li>
                <a href={instagramUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[var(--gold-dark)]">
                  <Instagram className="h-4 w-4" /> @{settings.instagram_handle}
                </a>
              </li>
              <li>
                <a href={`mailto:${settings.email}`} className="flex items-center gap-2 hover:text-[var(--gold-dark)]">
                  <Mail className="h-4 w-4" /> {settings.email}
                </a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" /> Mumbai, India
              </li>
            </ul>
          </div>
        </div>

        <div className="divider-gold my-8 md:my-10" />
        <div className="flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} Rsun Jewellery. All rights reserved.</p>
          <p>Crafted with care in India · Delivered via India Post.</p>
        </div>
      </div>
    </footer>
  );
}
