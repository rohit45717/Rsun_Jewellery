-- Product sections management for homepage

-- Product sections table
CREATE TABLE IF NOT EXISTS public.product_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  heading TEXT NOT NULL,
  description TEXT,
  banner_image_url TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  products_to_show INTEGER NOT NULL DEFAULT 8,
  show_view_all_button BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Product section assignments (many-to-many relationship)
CREATE TABLE IF NOT EXISTS public.product_section_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES public.product_sections(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (section_id, product_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_product_sections_active ON public.product_sections(active, display_order);
CREATE INDEX IF NOT EXISTS idx_product_section_assignments_section ON public.product_section_assignments(section_id, display_order);
CREATE INDEX IF NOT EXISTS idx_product_section_assignments_product ON public.product_section_assignments(product_id);

-- RLS policies
ALTER TABLE public.product_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active sections" ON public.product_sections FOR SELECT TO anon, authenticated USING (active = true);
CREATE POLICY "Admins can manage sections" ON public.product_sections FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

ALTER TABLE public.product_section_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read section assignments" ON public.product_section_assignments FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage assignments" ON public.product_section_assignments FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Grant permissions
GRANT SELECT ON public.product_sections TO anon, authenticated;
GRANT ALL ON public.product_sections TO service_role;
GRANT SELECT ON public.product_section_assignments TO anon, authenticated;
GRANT ALL ON public.product_section_assignments TO service_role;

-- Updated at trigger
CREATE TRIGGER product_sections_touch BEFORE UPDATE ON public.product_sections FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Insert default sections
INSERT INTO public.product_sections (slug, name, heading, description, active, display_order, products_to_show, show_view_all_button) VALUES
('new-arrivals', 'New Arrivals', 'New Arrivals', 'Fresh from our workshop', true, 1, 8, true),
('best-sellers', 'Best Sellers', 'Best Sellers', 'Most loved by our customers', true, 2, 8, true),
('featured', 'Featured Products', 'Featured Collection', 'Handpicked favorites', true, 3, 8, true),
('trending', 'Trending Products', 'Trending Now', 'What everyone is wearing', true, 4, 8, true),
('everyday', 'Everyday Collection', 'Everyday Elegance', 'Perfect for daily wear', true, 5, 8, true),
('office', 'Office Wear', 'Office Collection', 'Professional yet stylish', true, 6, 8, true),
('party', 'Party Collection', 'Party Ready', 'Stand out at every celebration', true, 7, 8, true),
('wedding', 'Wedding Collection', 'Bridal Collection', 'For your special day', true, 8, 8, true),
('under-499', 'Under ₹499', 'Under ₹499', 'Affordable elegance', true, 9, 8, true),
('under-999', 'Under ₹999', 'Under ₹999', 'Premium within budget', true, 10, 8, true)
ON CONFLICT (slug) DO NOTHING;
