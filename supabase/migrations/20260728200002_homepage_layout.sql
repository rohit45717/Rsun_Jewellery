-- Homepage layout builder

CREATE TABLE IF NOT EXISTS public.homepage_layout (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS policies
ALTER TABLE public.homepage_layout ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read homepage layout" ON public.homepage_layout FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can write homepage layout" ON public.homepage_layout FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Grant permissions
GRANT SELECT ON public.homepage_layout TO anon, authenticated;
GRANT ALL ON public.homepage_layout TO service_role;

-- Updated at trigger
CREATE TRIGGER homepage_layout_touch BEFORE UPDATE ON public.homepage_layout FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Insert default homepage layout settings
INSERT INTO public.homepage_layout (key, value) VALUES
('show_hero_banner', 'true'),
('show_collections', 'true'),
('show_featured', 'true'),
('show_best_sellers', 'true'),
('show_testimonials', 'true'),
('show_instagram_feed', 'true'),
('show_faq', 'true'),
('show_newsletter', 'true'),
('sections_order', '["new-arrivals","best-sellers","featured","trending","everyday","office","party","wedding","under-499","under-999"]')
ON CONFLICT (key) DO NOTHING;
