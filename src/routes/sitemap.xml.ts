import { createFileRoute } from "@tanstack/react-router";
import { useProducts } from "@/lib/api";

export const Route = createFileRoute("/sitemap/xml")({
  component: Sitemap,
});

function Sitemap() {
  const { data: products = [] } = useProducts();
  
  const baseUrl = "https://rsunjewellery.com"; // Replace with actual domain
  
  const staticPages = [
    { url: baseUrl, lastmod: new Date().toISOString(), changefreq: "daily", priority: "1.0" },
    { url: `${baseUrl}/shop`, lastmod: new Date().toISOString(), changefreq: "daily", priority: "0.9" },
    { url: `${baseUrl}/about`, lastmod: new Date().toISOString(), changefreq: "monthly", priority: "0.7" },
    { url: `${baseUrl}/care`, lastmod: new Date().toISOString(), changefreq: "monthly", priority: "0.6" },
    { url: `${baseUrl}/contact`, lastmod: new Date().toISOString(), changefreq: "monthly", priority: "0.6" },
    { url: `${baseUrl}/faq`, lastmod: new Date().toISOString(), changefreq: "monthly", priority: "0.6" },
    { url: `${baseUrl}/shipping`, lastmod: new Date().toISOString(), changefreq: "monthly", priority: "0.5" },
    { url: `${baseUrl}/refund`, lastmod: new Date().toISOString(), changefreq: "monthly", priority: "0.5" },
    { url: `${baseUrl}/privacy`, lastmod: new Date().toISOString(), changefreq: "monthly", priority: "0.5" },
    { url: `${baseUrl}/terms`, lastmod: new Date().toISOString(), changefreq: "monthly", priority: "0.5" },
  ];

  const productPages = products.map((product) => ({
    url: `${baseUrl}/shop?c=${encodeURIComponent(product.category)}`,
    lastmod: new Date().toISOString(),
    changefreq: "weekly" as const,
    priority: "0.8",
  }));

  const allPages = [...staticPages, ...productPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
