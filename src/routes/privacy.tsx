import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/site/PolicyPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Rsun Jewellery" },
      { name: "description", content: "How Rsun Jewellery handles your data and privacy." },
    ],
  }),
  component: () => (
    <PolicyPage title="Privacy Policy" eyebrow="Policies">
      <p>Rsun Jewellery respects your privacy. This policy explains what information we collect and how we use it.</p>
      <h3>Information We Collect</h3>
      <ul>
        <li>Name, phone number, delivery address — shared voluntarily on WhatsApp for order fulfilment.</li>
        <li>Basic analytics from website visits (aggregate, non-identifiable).</li>
      </ul>
      <h3>How We Use It</h3>
      <p>To process orders, provide customer support, and occasionally share updates about new drops. We never sell your information.</p>
      <h3>Third Parties</h3>
      <p>We share limited data only with logistics partners for delivery. Payment details are handled by your bank/UPI provider — we do not store them.</p>
      <h3>Contact</h3>
      <p>Questions about privacy? Message us on WhatsApp or email hello@rsunjewellery.in.</p>
    </PolicyPage>
  ),
});
