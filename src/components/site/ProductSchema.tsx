import { useEffect } from "react";
import type { Product } from "@/lib/site";

interface ProductSchemaProps {
  product: Product;
}

export function ProductSchema({ product }: ProductSchemaProps) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const schema = {
      "@context": "https://schema.org/",
      "@type": "Product",
      name: product.name,
      description: product.description || `Beautiful ${product.category} from Rsun Jewellery`,
      image: product.image,
      brand: {
        "@type": "Brand",
        name: "Rsun Jewellery"
      },
      category: product.category,
      offers: {
        "@type": "Offer",
        price: product.price,
        priceCurrency: "INR",
        availability: product.sold_out ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
        url: typeof window !== "undefined" ? `${window.location.origin}/shop` : "https://rsunjewellery.com/shop"
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: "5",
        bestRating: "5",
        worstRating: "1"
      }
    };

    // Remove existing schema if any
    const existingScript = document.getElementById(`product-schema-${product.id}`);
    if (existingScript) {
      existingScript.remove();
    }

    // Add new schema
    const script = document.createElement("script");
    script.id = `product-schema-${product.id}`;
    script.type = "application/ld+json";
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById(`product-schema-${product.id}`);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [product]);

  return null;
}
