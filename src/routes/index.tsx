import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Droplets, ShieldCheck, Gem, Truck, Heart, Star } from "lucide-react";
import { CATEGORIES } from "@/lib/site";
import { useProducts, useSettings, useContent, useProductSections, useHomepageLayout, useSectionProducts } from "@/lib/api";
import { ProductCard } from "@/components/site/ProductCard";
import { PageSeo } from "@/components/site/PageSeo";

export const Route = createFileRoute("/")({
  component: Home,
});

const features = [
  { icon: ShieldCheck, title: "Anti-Tarnish", desc: "Won't fade or discolour" },
  { icon: Droplets, title: "Water Resistant", desc: "Shower, swim, live in it" },
  { icon: Heart, title: "Skin Friendly", desc: "Hypoallergenic finish" },
  { icon: Gem, title: "Premium Quality", desc: "Long-lasting luxury finish" },
  { icon: Truck, title: "India Post Delivery", desc: "Tracked pan-India shipping" },
  { icon: Sparkles, title: "Luxury Packaging", desc: "Gift-ready every time" },
];

function DynamicProductSection({ section, products, whatsapp }: { section: any; products: any[]; whatsapp: (msg: string) => string }) {
  const assignedProducts = useSectionProducts(section.id);
  
  // Use assigned products if available, otherwise fall back to automatic filtering
  let sectionProducts = assignedProducts.length > 0 
    ? assignedProducts.map((a: any) => a.products).filter(Boolean).map((p: any) => ({
        ...p,
        image: p.image_url // Map image_url to image for ProductCard compatibility
      }))
    : products;
  
  // If no assignments, use automatic filtering as fallback
  if (assignedProducts.length === 0) {
    if (section.slug === 'new-arrivals') {
      sectionProducts = products.filter((p) => p.badge === 'New').slice(0, section.products_to_show);
    } else if (section.slug === 'best-sellers') {
      sectionProducts = products.filter((p) => p.badge === 'Best Seller').slice(0, section.products_to_show);
    } else if (section.slug === 'under-499') {
      sectionProducts = products.filter((p) => p.price < 499).slice(0, section.products_to_show);
    } else if (section.slug === 'under-999') {
      sectionProducts = products.filter((p) => p.price < 999).slice(0, section.products_to_show);
    } else {
      sectionProducts = products.slice(0, section.products_to_show);
    }
  } else {
    // Limit to products_to_show if using assignments
    sectionProducts = sectionProducts.slice(0, section.products_to_show);
  }

  if (sectionProducts.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-10">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--gold-dark)]">
            {section.name}
          </p>
          <h2 className="mt-2 font-display text-3xl md:text-4xl">{section.heading}</h2>
          {section.description && (
            <p className="mt-2 text-sm text-muted-foreground">{section.description}</p>
          )}
        </div>
        {section.show_view_all_button && (
          <Link to="/shop" className="hidden text-sm font-medium text-[var(--gold-dark)] hover:underline md:inline">
            Shop all →
          </Link>
        )}
      </div>
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
        {sectionProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

function Home() {
  const { data: products = [] } = useProducts();
  const { whatsapp } = useSettings();
  const { content } = useContent();
  const sections = useProductSections();
  const layout = useHomepageLayout();

  const bestSellers = products.filter((p) => p.badge === "Best Seller").slice(0, 6);

  // Helper to check if a section should be shown
  const showSection = (key: string) => layout[key] !== "false";

  return (
    <>
      <PageSeo path="/" />
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--gold-soft)]/60 via-background to-background" />
        <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-10 md:grid-cols-2 md:gap-16 md:px-10 md:pb-32 md:pt-16">
          <div className="flex flex-col justify-center">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--gold)]/50 bg-background/60 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--gold-dark)] backdrop-blur">
              <Sparkles className="h-3 w-3" /> {content.hero_eyebrow}
            </span>
            <h1 className="mt-6 font-display text-5xl leading-[1.05] tracking-tight text-foreground md:text-7xl">
              {content.hero_title}
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
              {content.hero_subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-7 py-3.5 text-xs font-semibold uppercase tracking-widest text-[var(--ivory)] shadow-luxe transition hover:opacity-95"
              >
                Shop Collection <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={whatsapp("Hi Rsun Jewellery! I'd love to see your latest collection.")}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-background/60 px-7 py-3.5 text-xs font-semibold uppercase tracking-widest text-foreground backdrop-blur transition hover:border-[var(--gold-dark)] hover:text-[var(--gold-dark)]"
              >
                Order on WhatsApp
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="flex text-[var(--gold-dark)]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-muted-foreground">Loved by 500+ customers</span>
              </div>
              <span className="text-muted-foreground">✨ Anti-Tarnish · Water Resistant · Skin Friendly</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-gold opacity-20 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] shadow-luxe ring-1 ring-[var(--gold)]/30">
              <img
                src={content.home_hero_image}
                alt="Rsun anti-tarnish jewellery hero"
                width={1600}
                height={1200}
                className="h-[520px] w-full object-cover md:h-[640px]"
              />
            </div>
            <div className="absolute -bottom-6 -left-4 hidden rounded-2xl bg-card p-4 shadow-luxe ring-1 ring-border md:block">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-gold text-[var(--ivory)]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">1-Year Anti-Tarnish</p>
                  <p className="text-xs text-muted-foreground">Guarantee on every piece</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-10">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--gold-dark)]">
              Explore
            </p>
            <h2 className="mt-2 font-display text-3xl md:text-4xl">Shop by Category</h2>
          </div>
          <Link
            to="/shop"
            className="hidden text-sm font-medium text-[var(--gold-dark)] hover:underline md:inline"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-4 md:grid-cols-7">
          {CATEGORIES.map((c) => (
            <Link
              key={c.name}
              to="/shop"
              search={{ c: c.name }}
              className="group flex flex-col items-center gap-3 rounded-2xl bg-card p-5 ring-1 ring-border transition-all hover:-translate-y-1 hover:ring-[var(--gold)]/60"
            >
              <div className="grid h-16 w-16 place-items-center rounded-full bg-[var(--gold-soft)] text-2xl text-[var(--gold-dark)] transition-transform group-hover:scale-110">
                {c.icon}
              </div>
              <span className="text-center text-xs font-medium">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* DYNAMIC PRODUCT SECTIONS */}
      {sections.map((section) => (
        <DynamicProductSection
          key={section.id}
          section={section}
          products={products}
          whatsapp={whatsapp}
        />
      ))}

      {/* BEST SELLERS - Legacy fallback */}
      {bestSellers.length > 0 && sections.length === 0 && (
        <section className="mx-auto max-w-7xl px-5 py-16 md:px-10">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--gold-dark)]">
                Loved by 500+
              </p>
              <h2 className="mt-2 font-display text-3xl md:text-4xl">Best Sellers</h2>
            </div>
            <Link to="/shop" className="hidden text-sm font-medium text-[var(--gold-dark)] hover:underline md:inline">
              Shop all →
            </Link>
          </div>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3">
            {bestSellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* LIFESTYLE BANNER */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-10">
        <div className="relative overflow-hidden rounded-[2rem] bg-[var(--gold-soft)]">
          <div className="grid md:grid-cols-2">
            <img
              src={content.home_lifestyle_image}
              alt="Rsun anti-tarnish jewellery lifestyle"
              width={1400}
              height={1000}
              loading="lazy"
              className="h-72 w-full object-cover md:h-full"
            />
            <div className="flex flex-col justify-center gap-5 p-8 md:p-14">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--gold-dark)]">
                Made for Every Day
              </p>
              <h3 className="font-display text-3xl leading-tight md:text-5xl">
                Everyday elegance,<br />built to last a lifetime.
              </h3>
              <p className="max-w-md text-muted-foreground">
                {content.about_body}
              </p>
              <Link
                to="/shop"
                className="inline-flex w-fit items-center gap-2 rounded-full bg-foreground px-6 py-3 text-xs font-semibold uppercase tracking-widest text-[var(--ivory)] hover:bg-[var(--gold-dark)]"
              >
                Discover the Edit <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-10">
        <div className="mb-12 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--gold-dark)]">
            The Rsun Promise
          </p>
          <h2 className="mt-2 font-display text-3xl md:text-4xl">Why Choose Rsun</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl bg-card p-7 ring-1 ring-border transition-all hover:-translate-y-1 hover:ring-[var(--gold)]/50"
            >
              <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-gold text-[var(--ivory)]">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-xl">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-5 py-24 text-center md:px-10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--gold-dark)]">
          Chat directly with us
        </p>
        <h2 className="mt-3 font-display text-4xl leading-tight md:text-5xl">
          Ready to find your <span className="text-gradient-gold">forever piece</span>?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
          Reply-in-minutes ordering on WhatsApp.&nbsp;
        </p>
        <a
          href={whatsapp("Hello Rsun Jewellery! I'd like to see your collection.")}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-gold px-8 py-4 text-xs font-semibold uppercase tracking-widest text-[var(--ivory)] shadow-luxe"
        >
          Order on WhatsApp <ArrowRight className="h-4 w-4" />
        </a>
      </section>
    </>
  );
}
