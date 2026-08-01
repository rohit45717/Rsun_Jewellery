import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/site/PolicyPage";

export const Route = createFileRoute("/shipping")({
  head: () => ({
    meta: [
      { title: "Shipping Policy — Rsun Jewellery" },
      { name: "description", content: "Shipping, payment and order policy for Rsun Jewellery orders across India." },
    ],
  }),
  component: () => (
    <PolicyPage title="Shipping Policy" eyebrow="Policies">
      <h3>Payment</h3>
      <p>We do not offer Cash on Delivery (COD). All orders must be prepaid before processing.</p>

      <h3>Order Confirmation</h3>
      <p>Orders are processed only after successful payment verification. Once verified, orders are dispatched within 24–48 hours.</p>

      <h3>Delivery</h3>
      <ul>
        <li>Delivered pan-India via India Post with tracking.</li>
        <li>Metro cities: 3–5 business days</li>
        <li>Rest of India: 5–7 business days</li>
        <li>Remote pincodes: up to 10 business days</li>
      </ul>

      <h3>Shipping Charges</h3>
      <p>₹100 within Maharashtra · ₹150 across the rest of India.</p>

      <h3>Order Tracking</h3>
      <p>Once dispatched, we share the India Post tracking ID directly on WhatsApp. You can track your parcel on the India Post portal.</p>

      <h3>Cancellation &amp; Refund</h3>
      <p>Once an order has been placed and processing has begun, it cannot be cancelled. No refunds will be provided once an order has been completed or shipped.</p>
    </PolicyPage>
  ),
});
