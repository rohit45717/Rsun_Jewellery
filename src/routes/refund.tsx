import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/site/PolicyPage";

export const Route = createFileRoute("/refund")({
  head: () => ({
    meta: [
      { title: "Refund Policy — Rsun Jewellery" },
      { name: "description", content: "Refund policy for Rsun Jewellery orders. No COD, no refund once confirmed." },
    ],
  }),
  component: () => (
    <PolicyPage title="Refund Policy" eyebrow="Policies">
      <p>Please review your order carefully before placing it. Our policy is designed to keep pricing fair for every customer.</p>

      <h3>No Cash on Delivery (COD)</h3>
      <p>We do not offer Cash on Delivery for any orders. All orders must be prepaid before processing.</p>

      <h3>No Refund Policy</h3>
      <p>Once an order has been confirmed, processed, or completed, it cannot be cancelled or refunded. Please review your selection, size and delivery address carefully before making payment.</p>

      <h3>Damaged or Wrong Item</h3>
      <p>If you receive a damaged or incorrect item, please share unboxing photos or a video within 48 hours of delivery on WhatsApp. We will review and, at our discretion, arrange a replacement of the same piece.</p>

      <h3>Need Help?</h3>
      <p>Message us on WhatsApp with your order details before placing your order — we're happy to answer any questions about a piece, its finish or fit.</p>
    </PolicyPage>
  ),
});
