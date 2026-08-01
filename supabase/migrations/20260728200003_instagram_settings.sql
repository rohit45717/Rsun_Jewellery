-- Instagram footer settings

-- Add Instagram settings to site_settings
INSERT INTO public.site_settings (key, value) VALUES
('instagram_username', 'rsun_jewellery'),
('instagram_profile_url', 'https://www.instagram.com/rsun_jewellery'),
('instagram_section_title', 'Follow us on Instagram'),
('instagram_section_description', 'Stay connected with us for our newest collections, styling inspiration, exclusive launches, customer stories, and special offers.'),
('show_instagram_footer', 'true')
ON CONFLICT (key) DO NOTHING;
