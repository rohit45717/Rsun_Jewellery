INSERT INTO public.site_content (key, value) VALUES
('home_hero_image', '/__l5e/assets-v1/4fbf40c9-2414-4f68-bbae-743023b1cf00/home-hero.png'),
('home_lifestyle_image', '/__l5e/assets-v1/6a3952e2-4416-4d06-ba51-ee0e8968d81f/home-lifestyle.png')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;