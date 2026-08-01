import { createFileRoute } from "@tanstack/react-router";
import { PageSeo } from "@/components/site/PageSeo";

export const Route = createFileRoute("/care")({
  head: () => ({
    meta: [
      { title: "Jewellery Care Guide — Rsun Jewellery" },
      {
        name: "description",
        content:
          "Keep your Rsun jewellery radiant for years. Simple care tips for anti-tarnish plated pieces.",
      },
      { property: "og:title", content: "Jewellery Care Guide — Rsun Jewellery" },
      { property: "og:description", content: "How to care for your anti-tarnish jewellery." },
    ],
  }),
  component: Care,
});

const tips = [
  { h: "Last on, first off", p: "Put your jewellery on after perfume, lotion & make-up. Take it off before bed." },
  { h: "Store separately", p: "Keep each piece in its pouch or a lined box to prevent scratches from other jewellery." },
  { h: "Clean gently", p: "Wipe with the soft cloth we ship with. For a deeper clean, use lukewarm water and mild soap, then pat dry." },
  { h: "Avoid harsh chemicals", p: "Skip chlorine, bleach, and strong perfumes. Anti-tarnish is durable — not indestructible." },
  { h: "Dry after water", p: "Always dry pieces fully after showering or swimming to preserve the finish longer." },
  { h: "Wear it often", p: "Believe it or not — regular wear helps the plating stay lustrous. Enjoy your pieces." },
];

function Care() {
  return (
    <>
      <PageSeo path="/care" />
      <section className="mx-auto max-w-4xl px-5 py-20 md:px-10 md:py-28">
      <div className="text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--gold-dark)]">Care Guide</p>
        <h1 className="mt-4 font-display text-4xl md:text-6xl">Care for your <span className="text-gradient-gold">Rsun</span></h1>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">Simple habits to keep every piece shining beautifully for years.</p>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {tips.map((t, i) => (
          <div key={t.h} className="rounded-2xl bg-card p-7 ring-1 ring-border">
            <span className="font-display text-3xl text-[var(--gold-dark)]">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="mt-2 font-display text-xl">{t.h}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t.p}</p>
          </div>
        ))}
      </div>
    </section>
    </>
  );
}
