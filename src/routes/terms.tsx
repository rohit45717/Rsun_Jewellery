import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/site/PolicyPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Rsun Jewellery" },
      { name: "description", content: "Terms and conditions for Rsun Jewellery." },
    ],
  }),
  component: () => (
    <PolicyPage title="Terms & Conditions" eyebrow="Policies">
      <p>By using this website and placing an order with Rsun Jewellery, you agree to the following terms.</p>
      <h3>Product Information</h3>
      <p>We do our best to represent every piece accurately in imagery and description. Slight variations in colour or finish may occur due to screens or handmade elements.</p>
      <h3>Pricing</h3>
      <p>All prices are in INR and inclusive of applicable taxes. We reserve the right to update prices at any time.</p>
      <h3>Orders</h3>
      <p>Orders are confirmed only after a WhatsApp confirmation from our team. We reserve the right to decline any order at our discretion.</p>
      <h3>Intellectual Property</h3>
      <p>All images, designs, and content on this site are owned by Rsun Jewellery and may not be reproduced without permission.</p>
    </PolicyPage>
  ),
});
