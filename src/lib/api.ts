import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SITE, type Product } from "@/lib/site";

export type ProductSection = {
  id: string;
  slug: string;
  name: string;
  heading: string;
  description: string | null;
  banner_image_url: string | null;
  active: boolean;
  display_order: number;
  products_to_show: number;
  show_view_all_button: boolean;
};

export type HomepageLayout = Record<string, string>;

const defaultSettings: Record<string, string> = {
  whatsapp_number: SITE.whatsappNumber,
  instagram_handle: "rsun_jewellery",
  email: SITE.email,
  shipping_maharashtra: "100",
  shipping_outside: "150",
  upi_id: "",
};

const defaultContent: Record<string, string> = {
  hero_eyebrow: "Anti-Tarnish · Everyday Luxury",
  hero_title: "Timeless jewellery that never fades.",
  hero_subtitle:
    "Premium anti-tarnish jewellery — hypoallergenic, water-resistant and made for everyday wear. Loved by 500+ customers across India. Delivered through India Post.",
  about_title: "Rsun Jewellery — Premium Quality",
  about_body:
    "Rsun Jewellery crafts anti-tarnish, hypoallergenic pieces designed for everyday luxury.",
  shipping_note: "",
  home_hero_image: "/hero.jpg",
  home_lifestyle_image: "/lifestyle.jpg",
};

function rowsToMap(rows: { key: string; value: string }[] | null | undefined) {
  const map: Record<string, string> = {};
  (rows ?? []).forEach((r) => (map[r.key] = r.value));
  return map;
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      
      return (data ?? []).map((r: any) => ({
        id: r.id,
        slug: r.slug,
        name: r.name,
        price: r.price,
        mrp: r.mrp,
        category: r.category,
        image: r.image_url,
        badge: r.badge,
        rating: r.rating,
        description: r.description,
        sold_out: r.sold_out ?? false,
        seo_title: r.seo_title ?? null,
        seo_description: r.seo_description ?? null,
        og_image_url: r.og_image_url ?? null,
      }));
    },
  });
}

export type PageSeo = {
  path: string;
  title: string;
  description: string;
  og_image_url: string | null;
};

export function usePageSeo(path: string) {
  const q = useQuery({
    queryKey: ["page_seo", path],
    queryFn: async (): Promise<PageSeo | null> => {
      const { data, error } = await supabase
        .from("page_seo" as any)
        .select("*")
        .eq("path", path)
        .maybeSingle();
      if (error) throw error;
      return (data as any) ?? null;
    },
  });
  return q.data ?? null;
}

export function useSettings() {
  const q = useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("key,value");
      if (error) throw error;
      return { ...defaultSettings, ...rowsToMap(data) };
    },
  });
  const settings = q.data ?? defaultSettings;
  const whatsapp = (msg: string) =>
    `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(msg)}`;
  return { settings, whatsapp, ...q };
}

export function useContent() {
  const q = useQuery({
    queryKey: ["site_content"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_content").select("key,value");
      if (error) throw error;
      return { ...defaultContent, ...rowsToMap(data) };
    },
  });
  return { content: q.data ?? defaultContent, ...q };
}

export function useProductSections() {
  const q = useQuery({
    queryKey: ["product_sections"],
    queryFn: async (): Promise<ProductSection[]> => {
      const { data, error } = await supabase
        .from("product_sections" as any)
        .select("*")
        .eq("active", true)
        .order("display_order");
      if (error) throw error;
      return (data as ProductSection[]) || [];
    },
  });
  return q.data || [];
}

export function useSectionProducts(sectionId: string) {
  const q = useQuery({
    queryKey: ["section_products", sectionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_section_assignments" as any)
        .select("product_id, display_order, products(*)")
        .eq("section_id", sectionId)
        .order("display_order");
      if (error) throw error;
      
      const assignments = (data as any[]) || [];
      
      // Refresh signed URLs for products in assignments
      const assignmentsWithFreshUrls = await Promise.all(
        assignments.map(async (assignment) => {
          if (assignment.products && assignment.products.image_url && assignment.products.image_url.includes('supabase')) {
            try {
              const url = new URL(assignment.products.image_url);
              const pathParts = url.pathname.split('/product-images/');
              if (pathParts.length > 1) {
                const path = `product-images/${pathParts[1].split('?')[0]}`;
                const { data: signed, error: signError } = await supabase
                  .storage
                  .from("product-images")
                  .createSignedUrl(path, 60 * 60 * 24 * 7);
                
                if (!signError && signed) {
                  return {
                    ...assignment,
                    products: {
                      ...assignment.products,
                      image_url: signed.signedUrl
                    }
                  };
                }
              }
            } catch (e) {
              // If refresh fails, keep original URL
            }
          }
          return assignment;
        })
      );
      
      return assignmentsWithFreshUrls;
    },
  });
  return q.data || [];
}

export function useHomepageLayout() {
  const q = useQuery({
    queryKey: ["homepage_layout"],
    queryFn: async (): Promise<HomepageLayout> => {
      const { data, error } = await supabase
        .from("homepage_layout" as any)
        .select("*");
      if (error) throw error;
      const map: HomepageLayout = {};
      (data || []).forEach((r: any) => (map[r.key] = r.value));
      return map;
    },
  });
  return q.data || {};
}

// Analytics tracking functions
export async function trackProductView(productId: string) {
  try {
    await supabase.from("product_views" as any).insert({
      product_id: productId,
      session_id: getSessionId(),
    });
  } catch (e) {
    // Silently fail tracking errors
  }
}

export async function trackWhatsAppClick(productId?: string) {
  try {
    await supabase.from("whatsapp_clicks" as any).insert({
      product_id: productId || null,
      session_id: getSessionId(),
      page_path: window.location.pathname,
    });
  } catch (e) {
    // Silently fail tracking errors
  }
}

export async function trackSearchQuery(query: string, resultsCount: number) {
  try {
    await supabase.from("search_queries" as any).insert({
      query,
      results_count: resultsCount,
      session_id: getSessionId(),
    });
  } catch (e) {
    // Silently fail tracking errors
  }
}

// Generate a session ID for tracking
function getSessionId(): string {
  let sessionId = sessionStorage.getItem('rsun_session_id');
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('rsun_session_id', sessionId);
  }
  return sessionId;
}
