// Static brand fallbacks — live values come from `site_settings` in Lovable Cloud
// and are exposed by the hooks in src/lib/api.ts.

export const SITE = {
  name: "Rsun Jewellery",
  tagline: "Luxury Anti-Tarnish Jewellery",
  whatsappNumber: "919158720876",
  instagramUrl: "https://www.instagram.com/rsun_jewellery",
  instagramHandle: "@rsun_jewellery",
  email: "rsunjewellery@gmail.com",
  city: "Mumbai, India",
};

export function whatsappLink(message: string, number: string = SITE.whatsappNumber) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function orderMessage(product: { name: string; price: number; image?: string }) {
  const image = product.image ? `\nImage: ${imageAbsoluteUrl(product.image)}` : "";
  return `Hello Rsun Jewellery,\n\nI would like to order:\n\nProduct: ${product.name}${image}\nQty: 1\nPrice: \u20B9${product.price}\n\nAdditional details:\n(size / colour / delivery address)\n\nThank you.`;
}

function imageAbsoluteUrl(url: string) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (typeof window !== "undefined") return `${window.location.origin}${url}`;
  return url;
}

export type Category =
  | "Necklaces"
  | "Pendants"
  | "Bracelets"
  | "Rings"
  | "Earrings"
  | "Gold Cuffs"
  | "Gift Sets";

export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  mrp?: number | null;
  category: Category | string;
  image: string;
  badge?: string | null;
  rating: number;
  description: string;
  sold_out?: boolean;
  seo_title?: string | null;
  seo_description?: string | null;
  og_image_url?: string | null;
};

export const CATEGORIES: { name: Category; icon: string }[] = [
  { name: "Necklaces", icon: "\u2727" },
  { name: "Pendants", icon: "\u2764" },
  { name: "Bracelets", icon: "\u221E" },
  { name: "Rings", icon: "\u25EF" },
  { name: "Earrings", icon: "\u2740" },
  { name: "Gold Cuffs", icon: "\u265B" },
  { name: "Gift Sets", icon: "\u2766" },
];
