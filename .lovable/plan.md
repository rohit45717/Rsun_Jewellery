
## What I'll build

### 1. Enable Lovable Cloud (backend)
Required for: secure admin login, database-backed products, image uploads (storage), editable site content.

### 2. Secure admin access
- Sign up your admin account **rsunjewellery@gmail.com** via a hidden `/admin/login` page (I will NOT hardcode the password — you'll set it once on first login through the secure form; the password you pasted in chat should be considered compromised, please choose a new one).
- Roles stored in a separate `user_roles` table with `has_role()` security-definer function (industry standard — prevents privilege escalation).
- All admin routes gated by role check on both client and server; RLS policies enforce that only admins can write.
- Public site continues to work without login.

### 3. Admin dashboard (`/admin`)
Tabs:
- **Products** — list, create, edit, delete. Fields: name, category, price, MRP, badge (Best Seller / New Arrival / none), rating, description. Image upload with drag-and-drop → stored in Cloud storage bucket `product-images`, replaces existing image.
- **Site content** — edit key text blocks: hero headline/subhead, About page copy, "Why choose Rsun" bullets, homepage tagline.
- **Settings** — WhatsApp number, Instagram handle, email, shipping charges (Maharashtra / outside Maharashtra), UPI ID for payments.

### 4. Database schema
- `products` (id, name, category, price, mrp, badge, rating, description, image_url, sort_order, created_at)
- `site_content` (key, value) — flexible key/value for editable copy
- `site_settings` (single row: whatsapp, instagram, email, shipping_maharashtra, shipping_other, upi_id)
- `user_roles` (user_id, role) + `app_role` enum + `has_role()` function
- Storage bucket `product-images` (public read, admin-only write)

Public pages read from these tables via server functions (public read policies). No secrets exposed.

### 5. PDF-driven site updates
- Replace all 30 old pendant/necklace products with the new items from `Pendent_And_Necklaces_3.pdf` + `Pendent_And_Necklaces_4.pdf` (I'll extract, name, price, and seed them into the database).
- Update contact: WhatsApp **+91 9867648677**, email **rsunjewellery@gmail.com**, Instagram **@rsun_jewellery**.
- Remove "Premium Craftsmanship" → rename to "Premium Quality".
- Remove "18k gold-plated luxury" line under Premium Finish.
- Add "Delivery through India Post" and "Loved by 500+ customers" to Why Choose Rsun.
- Shipping policy page: tracking via India Post portal, ₹100 Maharashtra / ₹150 outside (editable in admin), No COD / No Refund / No Exchange.

### 6. WhatsApp order flow
- Pre-filled order message on WhatsApp (already works) — will enhance format per your PDF: Product, Image link, Qty, Price, Details.
- **Important limitation:** true *automatic* WhatsApp replies (thank-you message, UPI QR auto-send, tracking updates) require the paid **WhatsApp Business API** — a static/website link cannot auto-reply on your behalf. I'll set up your WhatsApp Business app with **Quick Reply templates** you can tap once to send: (a) thank-you + ask for address, (b) order confirmation + UPI ID + QR image, (c) dispatched, (d) tracking ID. I'll add a `/admin/whatsapp-templates` page where you can edit those template texts and upload your UPI QR image. If you later want true automation, we'd integrate WhatsApp Cloud API (separate paid setup).

## Technical notes
- Auth: Lovable Cloud email/password. No public signup — admin created once via a seed migration inviting your email, then you set the password on first visit.
- RLS: public tables readable by anon; writes restricted to `admin` role via `has_role(auth.uid(), 'admin')`.
- Image uploads: max 5MB, jpg/png/webp, uploaded to storage, URL saved on product row. Old image deleted on replace.
- Existing 22 bracelets stay; only the 30 pendants/necklaces get replaced with the new PDFs.

## What I need from you to proceed
1. **Confirm** I should enable Lovable Cloud.
2. **Confirm** the WhatsApp Quick-Reply approach for auto-messages (or say you want full WhatsApp Cloud API automation — larger scope).
3. **UPI ID** to display in payment messages (you can also add later via admin).

Once you approve, I'll ship it in one pass.
