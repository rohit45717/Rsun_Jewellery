import type { ReactNode } from "react";

export function PolicyPage({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-3xl px-5 py-20 md:px-10 md:py-28">
      <div className="text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--gold-dark)]">
          {eyebrow}
        </p>
        <h1 className="mt-4 font-display text-4xl md:text-5xl">{title}</h1>
      </div>
      <div className="prose prose-neutral mx-auto mt-12 max-w-none text-foreground/85 [&_h3]:font-display [&_h3]:text-xl [&_h3]:mt-8 [&_h3]:mb-3 [&_p]:leading-relaxed [&_p]:my-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-3 [&_li]:my-1">
        {children}
      </div>
    </section>
  );
}
