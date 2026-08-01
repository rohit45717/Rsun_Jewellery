import { createFileRoute } from "@tanstack/react-router";
import { PageSeo } from "@/components/site/PageSeo";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Rsun Jewellery — Our Story" },
      {
        name: "description",
        content:
          "Rsun Jewellery crafts luxury anti-tarnish, water-resistant jewellery designed to be worn every day. Discover our story.",
      },
      { property: "og:title", content: "About Rsun Jewellery" },
      { property: "og:description", content: "Luxury anti-tarnish jewellery, built to last." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <PageSeo path="/about" />
      <section className="mx-auto max-w-4xl px-5 py-20 text-center md:px-10 md:py-28">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--gold-dark)]">
          Our Story
        </p>
        <h1 className="mt-4 font-display text-4xl leading-tight md:text-6xl">
          Luxury shouldn't be <span className="text-gradient-gold">occasional</span>.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Rsun Jewellery was born from a simple belief — beautiful jewellery deserves to be worn every day, not saved for special occasions. We craft anti-tarnish, water-resistant, skin-friendly pieces that stay radiant through your morning coffee, your evening plans, and every moment in between.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-5 md:px-10">
        <img
          src="/lifestyle.jpg"
          alt="Rsun jewellery lifestyle"
          width={1400}
          height={1000}
          loading="lazy"
          className="h-80 w-full rounded-[2rem] object-cover md:h-[520px]"
        />
      </section>

      <section className="mx-auto grid max-w-5xl gap-14 px-5 py-24 md:grid-cols-2 md:px-10">
        {[
          {
            h: "Premium Craftsmanship",
            p: "Every piece is crafted with premium anti-tarnish finishing, designed to resist tarnishing, discolouration, and everyday wear.",
          },
          {
            h: "Skin Friendly",
            p: "Hypoallergenic base metals and food-grade finishing mean no rashes, no greening, no compromise.",
          },
          {
            h: "Water Resistant",
            p: "Shower, swim, dance in the rain. Our finishing is engineered to stay luminous through everyday life.",
          },
          {
            h: "Direct-to-you Ordering",
            p: "No cart, no checkout maze. Chat with us on WhatsApp, and we'll guide you from pick to delivery.",
          },
        ].map((b) => (
          <div key={b.h}>
            <h3 className="font-display text-2xl text-foreground">{b.h}</h3>
            <p className="mt-3 text-muted-foreground">{b.p}</p>
          </div>
        ))}
      </section>
    </>
  );
}
