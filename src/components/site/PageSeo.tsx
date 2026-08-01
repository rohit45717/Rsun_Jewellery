import { useEffect } from "react";
import { usePageSeo } from "@/lib/api";

function setMeta(attr: "name" | "property", key: string, content: string) {
  if (typeof document === "undefined") return;
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string) {
  if (typeof document === "undefined") return;
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function PageSeo({ path }: { path: string }) {
  const seo = usePageSeo(path);

  useEffect(() => {
    if (!seo) return;
    if (seo.title) document.title = seo.title;
    if (seo.description) setMeta("name", "description", seo.description);
    if (seo.title) setMeta("property", "og:title", seo.title);
    if (seo.description) setMeta("property", "og:description", seo.description);
    if (seo.og_image_url) {
      setMeta("property", "og:image", seo.og_image_url);
      setMeta("name", "twitter:image", seo.og_image_url);
    }
    if (typeof window !== "undefined") {
      setMeta("property", "og:url", `${window.location.origin}${path}`);
      setCanonical(`${window.location.origin}${path}`);
    }
  }, [seo, path]);

  return null;
}
