import { createFileRoute } from "@tanstack/react-router";
import { Instagram, Mail, MessageCircle, MapPin } from "lucide-react";
import { SITE, whatsappLink } from "@/lib/site";
import { PageSeo } from "@/components/site/PageSeo";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Rsun Jewellery" },
      {
        name: "description",
        content:
          "Chat with Rsun Jewellery on WhatsApp or Instagram. We reply fast and help you find your perfect piece.",
      },
      { property: "og:title", content: "Contact — Rsun Jewellery" },
      { property: "og:description", content: "Reach us on WhatsApp or Instagram." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <>
      <PageSeo path="/contact" />
      <section className="mx-auto max-w-4xl px-5 py-20 md:px-10 md:py-28">
      <div className="text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--gold-dark)]">
          Get in Touch
        </p>
        <h1 className="mt-4 font-display text-4xl leading-tight md:text-6xl">
          We're here to <span className="text-gradient-gold">help</span>.
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
          Have a question about a piece, need styling advice, or want to place an order? Reach us on WhatsApp — we usually reply within minutes.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        <a
          href={whatsappLink("Hello Rsun Jewellery!")}
          target="_blank"
          rel="noreferrer"
          className="group rounded-2xl bg-card p-8 ring-1 ring-border transition-all hover:-translate-y-1 hover:ring-[var(--gold)]/50"
        >
          <div className="grid h-12 w-12 place-items-center rounded-full bg-[var(--whatsapp)] text-white">
            <MessageCircle className="h-5 w-5" />
          </div>
          <h3 className="mt-5 font-display text-xl">WhatsApp</h3>
          <p className="mt-1 text-sm text-muted-foreground">Order & enquiries · Fastest reply</p>
          <p className="mt-4 text-sm font-semibold text-[var(--gold-dark)]">Chat with us on WhatsApp →</p>
        </a>

        <a
          href={SITE.instagramUrl}
          target="_blank"
          rel="noreferrer"
          className="group rounded-2xl bg-card p-8 ring-1 ring-border transition-all hover:-translate-y-1 hover:ring-[var(--gold)]/50"
        >
          <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-gold text-[var(--ivory)]">
            <Instagram className="h-5 w-5" />
          </div>
          <h3 className="mt-5 font-display text-xl">Instagram</h3>
          <p className="mt-1 text-sm text-muted-foreground">Latest drops & styling</p>
          <p className="mt-4 text-sm font-semibold text-[var(--gold-dark)]">{SITE.instagramHandle} →</p>
        </a>

        <a
          href={`mailto:${SITE.email}`}
          className="group rounded-2xl bg-card p-8 ring-1 ring-border transition-all hover:-translate-y-1 hover:ring-[var(--gold)]/50"
        >
          <div className="grid h-12 w-12 place-items-center rounded-full bg-foreground text-[var(--ivory)]">
            <Mail className="h-5 w-5" />
          </div>
          <h3 className="mt-5 font-display text-xl">Email</h3>
          <p className="mt-1 text-sm text-muted-foreground">For collaborations & bulk orders</p>
          <p className="mt-4 text-sm font-semibold text-[var(--gold-dark)]">{SITE.email} →</p>
        </a>

        <div className="rounded-2xl bg-card p-8 ring-1 ring-border">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-[var(--gold-soft)] text-[var(--gold-dark)]">
            <MapPin className="h-5 w-5" />
          </div>
          <h3 className="mt-5 font-display text-xl">Based in</h3>
          <p className="mt-1 text-sm text-muted-foreground">{SITE.city}</p>
          <p className="mt-4 text-sm">Business hours · Mon–Sat · 10am – 8pm IST</p>
        </div>
      </div>
    </section>
    </>
  );
}
