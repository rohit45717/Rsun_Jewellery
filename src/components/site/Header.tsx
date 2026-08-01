import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Instagram } from "lucide-react";
import logo from "/logo.png";
import { useSettings } from "@/lib/api";

const nav = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/care", label: "Care" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const { settings, whatsapp } = useSettings();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const instagramUrl = `https://www.instagram.com/${settings.instagram_handle}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-500 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/60"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-10 md:py-4">
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img
            src={logo}
            alt="Rsun Jewellery"
            width={44}
            height={44}
            className="h-11 w-11 rounded-full ring-1 ring-[var(--gold)]/40"
          />
          <div className="flex flex-col leading-none">
            <span className="font-display text-xl tracking-wide text-foreground">
              Rsun
            </span>
            <span className="text-[10px] uppercase tracking-[0.28em] text-[var(--gold-dark)]">
              Jewellery
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-[var(--gold-dark)]"
              activeProps={{ className: "text-[var(--gold-dark)]" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="hidden h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/70 transition hover:border-[var(--gold)] hover:text-[var(--gold-dark)] md:inline-flex"
          >
            <Instagram className="h-4 w-4" />
          </a>
          <a
            href={whatsapp("Hello Rsun Jewellery, I'd like to know more.")}
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-full bg-gradient-gold px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-[var(--ivory)] shadow-luxe transition hover:opacity-95 md:inline-block"
          >
            Order on WhatsApp
          </a>
          <button
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-foreground/80 hover:bg-secondary"
                activeProps={{ className: "text-[var(--gold-dark)] bg-secondary" }}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={whatsapp("Hello Rsun Jewellery, I'd like to know more.")}
              target="_blank"
              rel="noreferrer"
              className="mt-2 rounded-full bg-gradient-gold px-5 py-3 text-center text-sm font-semibold uppercase tracking-widest text-[var(--ivory)]"
            >
              Order on WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
