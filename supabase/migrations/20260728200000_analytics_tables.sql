-- Analytics tracking tables for Rsun Jewellery

-- Product views tracking
CREATE TABLE IF NOT EXISTS public.product_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  session_id TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- WhatsApp clicks tracking
CREATE TABLE IF NOT EXISTS public.whatsapp_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  clicked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  session_id TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  page_path TEXT
);

-- Search queries tracking
CREATE TABLE IF NOT EXISTS public.search_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT NOT NULL,
  searched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  results_count INTEGER DEFAULT 0,
  session_id TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_product_views_product_id ON public.product_views(product_id);
CREATE INDEX IF NOT EXISTS idx_product_views_viewed_at ON public.product_views(viewed_at);
CREATE INDEX IF NOT EXISTS idx_whatsapp_clicks_product_id ON public.whatsapp_clicks(product_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_clicks_clicked_at ON public.whatsapp_clicks(clicked_at);
CREATE INDEX IF NOT EXISTS idx_search_queries_query ON public.search_queries(query);
CREATE INDEX IF NOT EXISTS idx_search_queries_searched_at ON public.search_queries(searched_at);

-- RLS policies
ALTER TABLE public.product_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert product views" ON public.product_views FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can read product views" ON public.product_views FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

ALTER TABLE public.whatsapp_clicks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert whatsapp clicks" ON public.whatsapp_clicks FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can read whatsapp clicks" ON public.whatsapp_clicks FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

ALTER TABLE public.search_queries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert search queries" ON public.search_queries FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can read search queries" ON public.search_queries FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Grant permissions
GRANT SELECT, INSERT ON public.product_views TO anon, authenticated;
GRANT SELECT, INSERT ON public.whatsapp_clicks TO anon, authenticated;
GRANT SELECT, INSERT ON public.search_queries TO anon, authenticated;
GRANT ALL ON public.product_views TO service_role;
GRANT ALL ON public.whatsapp_clicks TO service_role;
GRANT ALL ON public.search_queries TO service_role;
