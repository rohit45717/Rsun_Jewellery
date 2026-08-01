
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS sold_out boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS seo_title text,
  ADD COLUMN IF NOT EXISTS seo_description text,
  ADD COLUMN IF NOT EXISTS og_image_url text;

CREATE TABLE IF NOT EXISTS public.page_seo (
  path text PRIMARY KEY,
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  og_image_url text,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.page_seo TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.page_seo TO authenticated;
GRANT ALL ON public.page_seo TO service_role;

ALTER TABLE public.page_seo ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read page_seo" ON public.page_seo FOR SELECT USING (true);
CREATE POLICY "Admins write page_seo" ON public.page_seo FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

INSERT INTO public.page_seo (path, title, description) VALUES
  ('/',        'Rsun Jewellery — Premium Antitarnish Jewellery', 'Shop premium antitarnish pendants, necklaces and bracelets. Loved by 500+ customers. Delivered across India via India Post.'),
  ('/shop',    'Shop Antitarnish Jewellery — Rsun',              'Browse our full collection of antitarnish pendants, necklaces and bracelets. Order easily on WhatsApp.'),
  ('/about',   'About Rsun Jewellery',                            'Learn about Rsun Jewellery — premium quality antitarnish jewellery loved by 500+ customers across India.'),
  ('/contact', 'Contact Rsun Jewellery',                          'Reach Rsun Jewellery on WhatsApp or email. We reply fast and ship pan-India.'),
  ('/care',    'Jewellery Care — Rsun',                           'How to care for your antitarnish jewellery so it stays radiant for years.'),
  ('/faq',     'FAQ — Rsun Jewellery',                            'Answers to common questions about ordering, shipping, and jewellery care.')
ON CONFLICT (path) DO NOTHING;
