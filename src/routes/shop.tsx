import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { useMemo, useState } from "react";
import { CATEGORIES, type Category } from "@/lib/site";
import { useProducts } from "@/lib/api";
import { ProductCard } from "@/components/site/ProductCard";
import { PageSeo } from "@/components/site/PageSeo";
import { BreadcrumbSchema } from "@/components/site/BreadcrumbSchema";

const searchSchema = z.object({
  c: z.string().optional(),
});

export const Route = createFileRoute("/shop")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Shop Anti-Tarnish Jewellery | Necklaces, Pendants, Bracelets | Rsun Jewellery" },
      {
        name: "description",
        content:
          "Discover premium anti-tarnish jewellery at Rsun Jewellery. Shop necklaces, pendants, bracelets & more. Water-resistant, hypoallergenic, luxury finish. Order on WhatsApp with pan-India delivery.",
      },
      { property: "og:title", content: "Shop Anti-Tarnish Jewellery | Rsun Jewellery" },
      { property: "og:description", content: "Premium anti-tarnish jewellery designed for everyday elegance. Water-resistant, hypoallergenic, luxury finish. Order on WhatsApp." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { c } = Route.useSearch();
  const activeCategory = (c as Category | undefined) ?? "All";
  const [sort, setSort] = useState<"featured" | "low" | "high">("featured");
  const { data: allProducts = [], isLoading } = useProducts();

  const products = useMemo(() => {
    let list = activeCategory === "All"
      ? allProducts
      : allProducts.filter((p) => p.category === activeCategory);
    if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [activeCategory, sort, allProducts]);

  return (
    <>
      <PageSeo path="/shop" />
      <BreadcrumbSchema 
        items={[
          { name: "Home", url: "/" },
          { name: activeCategory === "All" ? "Shop" : activeCategory, url: "/shop" }
        ]}
      />
      <section className="border-b border-border bg-[var(--gold-soft)]/40">
        <div className="mx-auto max-w-7xl px-5 py-14 text-center md:px-10 md:py-20">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--gold-dark)]">
            The Collection
          </p>
          <h1 className="mt-3 font-display text-4xl leading-tight md:text-6xl">
            {activeCategory === "All" ? (
              <>Every piece, <span className="text-gradient-gold">timeless</span>.</>
            ) : (
              activeCategory
            )}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Hand-picked, anti-tarnish and ready to ship. Tap any piece to order on WhatsApp.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 md:px-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            <FilterChip to="/shop" active={activeCategory === "All"} label="All" />
            {CATEGORIES.map((cat) => (
              <FilterChip
                key={cat.name}
                to="/shop"
                search={{ c: cat.name }}
                active={activeCategory === cat.name}
                label={cat.name}
              />
            ))}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="rounded-full border border-border bg-background px-4 py-2 text-sm"
          >
            <option value="featured">Featured</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </div>

        {isLoading ? (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-16 text-center text-muted-foreground">
            No pieces here yet — check back soon.
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function FilterChip({
  to,
  search,
  active,
  label,
}: {
  to: "/shop";
  search?: { c: string };
  active: boolean;
  label: string;
}) {
  return (
    <Link
      to={to}
      search={search ?? {}}
      className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest transition ${
        active
          ? "bg-gradient-gold text-[var(--ivory)] shadow-luxe"
          : "border border-border bg-background text-foreground/70 hover:border-[var(--gold)]"
      }`}
    >
      {label}
    </Link>
  );
}
