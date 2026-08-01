import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "../components/site/Header";
import { Footer } from "../components/site/Footer";
import { WhatsAppFAB } from "../components/site/WhatsAppFAB";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl text-[var(--gold-dark)]">404</h1>
        <h2 className="mt-4 font-display text-2xl text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-gradient-gold px-6 py-3 text-xs font-semibold uppercase tracking-widest text-[var(--ivory)]"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl text-foreground">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. Please try again.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-gradient-gold px-6 py-3 text-xs font-semibold uppercase tracking-widest text-[var(--ivory)]"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-xs font-semibold uppercase tracking-widest"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Rsun Jewellery | Premium Anti-Tarnish Jewellery | Necklaces, Pendants, Bracelets" },
      {
        name: "description",
        content:
          "Shop premium anti-tarnish jewellery at Rsun Jewellery. Water-resistant, hypoallergenic necklaces, pendants, bracelets & more. Luxury finish, 1-year guarantee. Order on WhatsApp with pan-India delivery. Made to shine, made to last.",
      },
      { name: "keywords", content: "anti-tarnish jewellery, water-resistant jewellery, hypoallergenic jewellery, necklaces, pendants, bracelets, gold jewellery, luxury jewellery, Indian jewellery, WhatsApp jewellery shopping" },
      { name: "theme-color", content: "#C7A64B" },
      { property: "og:title", content: "Rsun Jewellery | Premium Anti-Tarnish Jewellery" },
      {
        property: "og:description",
        content:
          "Discover premium anti-tarnish jewellery at Rsun Jewellery. Water-resistant, hypoallergenic, luxury finish. 1-year guarantee. Order on WhatsApp with pan-India delivery.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://rsunjewellery.com" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Rsun Jewellery | Premium Anti-Tarnish Jewellery" },
      { name: "twitter:description", content: "Premium anti-tarnish jewellery designed for everyday elegance. Water-resistant, hypoallergenic, luxury finish." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "canonical", href: "https://rsunjewellery.com" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <WhatsAppFAB />
      </div>
    </QueryClientProvider>
  );
}
