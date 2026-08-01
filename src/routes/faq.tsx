import { createFileRoute } from "@tanstack/react-router";
import { PageSeo } from "@/components/site/PageSeo";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Rsun Jewellery" },
      {
        name: "description",
        content:
          "Answers about anti-tarnish jewellery, WhatsApp orders, shipping, and returns at Rsun Jewellery.",
      },
      { property: "og:title", content: "FAQ — Rsun Jewellery" },
      { property: "og:description", content: "Common questions, answered." },
    ],
  }),
  component: FAQ,
});

const faqs = [
  { q: "What does 'anti-tarnish' actually mean?", a: "Our pieces are crafted with a premium anti-tarnish finish that resists oxidation, fading and discolouration under everyday conditions — for long-lasting shine." },
  { q: "Can I shower or swim with my jewellery?", a: "Yes, our pieces are water-resistant. We recommend drying them after prolonged exposure to chlorinated water or saltwater to keep the finish at its best." },
  { q: "How do I place an order?", a: "Tap any 'Order on WhatsApp' button. It opens WhatsApp with a pre-filled message including the product and price. Reply, and we'll take it from there." },
  { q: "How long does shipping take?", a: "Orders are typically shipped within 24–48 hours. Delivery takes 3–7 business days across India depending on location." },
  { q: "Do you offer returns or exchanges?", a: "Yes, within 7 days of delivery for unused pieces in original packaging. See our Refund Policy for full details." },
  { q: "Is the jewellery skin friendly?", a: "Absolutely. All Rsun pieces are hypoallergenic and nickel-safe, designed for sensitive skin." },
];

function FAQ() {
  return (
    <>
      <PageSeo path="/faq" />
      <section className="mx-auto max-w-3xl px-5 py-20 md:px-10 md:py-28">
      <div className="text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--gold-dark)]">Help</p>
        <h1 className="mt-4 font-display text-4xl md:text-6xl">Frequently Asked</h1>
      </div>
      <div className="mt-12 divide-y divide-border rounded-2xl bg-card ring-1 ring-border">
        {faqs.map((f) => (
          <details key={f.q} className="group p-6">
            <summary className="flex cursor-pointer items-center justify-between gap-4 font-display text-lg">
              {f.q}
              <span className="text-2xl text-[var(--gold-dark)] transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
    </>
  );
}
