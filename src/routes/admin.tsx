import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORIES } from "@/lib/site";
import { Loader2, LogOut, Plus, Trash2, Upload, Shield, BarChart3, TrendingUp, Eye, MousePointerClick, Search, Package, Users, ShoppingCart, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({ meta: [{ title: "Admin — Rsun Jewellery" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminPage,
});

type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  mrp: number | null;
  badge: string | null;
  rating: number;
  image_url: string;
  description: string;
  sort_order: number;
  active: boolean;
  sold_out: boolean;
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
};

function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const check = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setUserEmail(null); setIsAdmin(false); setLoading(false); return;
    }
    setUserEmail(user.email ?? null);
    const { data } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
    setIsAdmin(!!data);
    setLoading(false);
  };

  useEffect(() => {
    check();
    const { data: sub } = supabase.auth.onAuthStateChange(() => check());
    return () => sub.subscription.unsubscribe();
  }, []);

  if (loading) return <FullScreen><Loader2 className="h-6 w-6 animate-spin text-[var(--gold-dark)]" /></FullScreen>;
  if (!userEmail) return <><Toaster richColors /><LoginForm /></>;
  if (!isAdmin) return (
    <FullScreen>
      <div className="max-w-md text-center">
        <Shield className="mx-auto h-10 w-10 text-red-500" />
        <h1 className="mt-4 font-display text-2xl">Access denied</h1>
        <p className="mt-2 text-sm text-muted-foreground">Signed in as {userEmail}. This account is not an admin.</p>
        <button onClick={() => supabase.auth.signOut()} className="mt-6 rounded-full bg-foreground px-6 py-3 text-xs font-semibold uppercase tracking-widest text-[var(--ivory)]">Sign out</button>
      </div>
    </FullScreen>
  );

  return <><Toaster richColors position="top-right" /><Dashboard email={userEmail} /></>;
}

function FullScreen({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen items-center justify-center bg-background p-6">{children}</div>;
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) toast.error(error.message);
    else toast.success("Signed in");
  };

  const signup = async () => {
    if (!email || !password) return toast.error("Enter email and password");
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: `${window.location.origin}/admin` },
    });
    setBusy(false);
    if (error) toast.error(error.message);
    else toast.success("Account created — you can sign in now");
  };

  return (
    <FullScreen>
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl bg-card p-8 ring-1 ring-border shadow-luxe">
        <div className="mb-6 text-center">
          <Shield className="mx-auto h-8 w-8 text-[var(--gold-dark)]" />
          <h1 className="mt-3 font-display text-2xl">Rsun Admin</h1>
          <p className="mt-1 text-xs text-muted-foreground">Sign in to manage your catalog</p>
        </div>
        <label className="mb-3 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Email
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:border-[var(--gold)] outline-none" />
        </label>
        <label className="mb-4 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Password
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:border-[var(--gold)] outline-none" />
        </label>
        <button disabled={busy} type="submit" className="w-full rounded-full bg-gradient-gold px-6 py-3 text-xs font-semibold uppercase tracking-widest text-[var(--ivory)] disabled:opacity-50">
          {busy ? "Please wait…" : "Sign in"}
        </button>
        <button type="button" onClick={signup} disabled={busy} className="mt-3 w-full text-center text-xs text-muted-foreground hover:text-[var(--gold-dark)] underline">
          First time? Create admin account
        </button>
        <p className="mt-4 text-center text-[10px] text-muted-foreground">
          Only <b>rsunjewellery@gmail.com</b> is granted admin.
        </p>
        <div className="mt-4 text-center"><Link to="/" className="text-xs text-muted-foreground hover:underline">← Back to site</Link></div>
      </form>
    </FullScreen>
  );
}

function Dashboard({ email }: { email: string }) {
  const [tab, setTab] = useState<"dashboard" | "products" | "sections" | "homepage" | "home-images" | "settings" | "content" | "seo">("dashboard");

  return (
    <div className="min-h-screen bg-[var(--gold-soft)]/30">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div>
            <h1 className="font-display text-xl">Rsun Admin</h1>
            <p className="text-xs text-muted-foreground">{email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="text-xs text-muted-foreground hover:text-[var(--gold-dark)]">View site →</Link>
            <button onClick={() => supabase.auth.signOut()} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold hover:border-[var(--gold)]">
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </div>
        <div className="mx-auto flex max-w-6xl flex-wrap gap-1 px-5 pb-2">
          {(["dashboard", "products", "sections", "homepage", "home-images", "settings", "content", "seo"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest transition ${
                tab === t ? "bg-foreground text-[var(--ivory)]" : "text-muted-foreground hover:text-foreground"
              }`}>{t === "dashboard" ? "Dashboard" : t === "seo" ? "Page SEO" : t === "home-images" ? "Home Images" : t === "sections" ? "Sections" : t === "homepage" ? "Homepage" : t}</button>
          ))}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8">
        {tab === "dashboard" && <AnalyticsDashboard />}
        {tab === "products" && <ProductsTab />}
        {tab === "sections" && <SectionsTab />}
        {tab === "homepage" && <HomepageBuilderTab />}
        {tab === "home-images" && <HomeImagesTab />}
        {tab === "settings" && <KVTab table="site_settings" title="Site Settings" hint="WhatsApp number, Instagram handle, shipping charges, UPI." />}
        {tab === "content" && <KVTab table="site_content" title="Website Content" hint="Hero headline, subtitle and other homepage copy." multiline />}
        {tab === "seo" && <PageSeoTab />}
      </main>
    </div>
  );
}

/* ------------- Products Tab ------------- */

function ProductsTab() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("products").select("*").order("sort_order");
    if (error) toast.error(error.message);
    setItems((data as Product[]) ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const remove = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  const newProduct = (): Product => ({
    id: "", slug: `product-${Date.now()}`, name: "", category: "Necklaces",
    price: 0, mrp: null, badge: null, rating: 5, image_url: "",
    description: "", sort_order: items.length, active: true,
    sold_out: false, seo_title: null, seo_description: null, og_image_url: null,
  });

  const [refreshingImages, setRefreshingImages] = useState(false);

  const refreshAllImageUrls = async () => {
    setRefreshingImages(true);
    try {
      const { data: products, error } = await supabase.from("products").select("id, image_url");
      if (error) throw error;

      let successCount = 0;
      for (const product of products || []) {
        if (product.image_url && product.image_url.includes('supabase')) {
          try {
            const url = new URL(product.image_url);
            const pathParts = url.pathname.split('/product-images/');
            if (pathParts.length > 1) {
              const path = `product-images/${pathParts[1].split('?')[0]}`;
              const { data: signed, error: signError } = await supabase
                .storage
                .from("product-images")
                .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
              
              if (!signError && signed) {
                await supabase.from("products").update({ image_url: signed.signedUrl }).eq("id", product.id);
                successCount++;
              }
            }
          } catch (e) {
            console.error('Failed to refresh image for product:', product.id);
          }
        }
      }
      
      toast.success(`Refreshed ${successCount} image URLs`);
      load();
    } catch (e: any) {
      toast.error(e.message || "Failed to refresh image URLs");
    } finally {
      setRefreshingImages(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl">Products ({items.length})</h2>
          <p className="text-xs text-muted-foreground">Add, edit or remove any piece in your catalog.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={refreshAllImageUrls}
            disabled={refreshingImages}
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-xs font-semibold uppercase tracking-widest hover:border-[var(--gold)] disabled:opacity-50"
          >
            {refreshingImages ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh Image URLs
          </button>
          <button onClick={() => setEditing(newProduct())}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-[var(--ivory)] shadow-luxe">
            <Plus className="h-4 w-4" /> Add Product
          </button>
        </div>
      </div>

      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <div key={p.id} className="flex gap-3 rounded-xl bg-background p-3 ring-1 ring-border">
              <img src={p.image_url} alt="" className="h-24 w-20 shrink-0 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.category} · ₹{p.price}{p.mrp ? ` (MRP ₹${p.mrp})` : ""}</p>
                    {p.badge && <span className="mt-1 inline-block rounded-full bg-[var(--gold-soft)] px-2 py-0.5 text-[10px] font-semibold text-[var(--gold-dark)]">{p.badge}</span>}
                    {!p.active && <span className="ml-1 inline-block rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">Hidden</span>}
                    {p.sold_out && <span className="ml-1 inline-block rounded-full bg-foreground px-2 py-0.5 text-[10px] font-semibold text-[var(--ivory)]">Sold Out</span>}
                  </div>
                </div>
                <div className="mt-2 flex gap-1">
                  <button onClick={() => setEditing(p)} className="rounded-lg border border-border px-2 py-1 text-[11px] font-semibold hover:border-[var(--gold)]">Edit</button>
                  <button onClick={() => remove(p.id, p.name)} className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-[11px] font-semibold text-red-600 hover:border-red-500">
                    <Trash2 className="h-3 w-3" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && <ProductEditor product={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </div>
  );
}

function ProductEditor({ product, onClose, onSaved }: { product: Product; onClose: () => void; onSaved: () => void }) {
  const [p, setP] = useState<Product>(product);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const isNew = !p.id;

  // Load all categories from database
  useEffect(() => {
    const loadCategories = async () => {
      const { data } = await supabase.from("products").select("category");
      const categories = new Set(data?.map(p => p.category).filter(Boolean) || []);
      setAllCategories(Array.from(categories));
    };
    loadCategories();
  }, []);

  const set = <K extends keyof Product>(k: K, v: Product[K]) => setP((prev) => ({ ...prev, [k]: v }));

  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `products/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from("product-images").upload(path, file, { contentType: file.type, upsert: false });
      if (error) throw error;
      const { data: signed, error: sErr } = await supabase.storage.from("product-images").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
      if (sErr || !signed) throw sErr ?? new Error("signed url");
      set("image_url", signed.signedUrl);
      toast.success("Image uploaded");
    } catch (e: any) {
      toast.error(e.message || "Upload failed");
    } finally { setUploading(false); }
  };

  const save = async () => {
    if (!p.name || !p.image_url || !p.price) return toast.error("Name, image and price are required");
    setBusy(true);
    const payload = {
      slug: p.slug, name: p.name, category: p.category, price: p.price, mrp: p.mrp,
      badge: p.badge, rating: p.rating, image_url: p.image_url, description: p.description,
      sort_order: p.sort_order, active: p.active, sold_out: p.sold_out,
      seo_title: p.seo_title, seo_description: p.seo_description, og_image_url: p.og_image_url,
    };
    
    let productId = p.id;
    const { error } = isNew
      ? await supabase.from("products").insert(payload).select().single()
      : await supabase.from("products").update(payload).eq("id", p.id);
    
    if (error) {
      setBusy(false);
      return toast.error(error.message);
    }
    
    if (isNew) {
      // Get the inserted product ID
      const { data: newProduct } = await supabase.from("products").select("id").eq("slug", p.slug).single();
      if (newProduct) productId = newProduct.id;
    }
    
    // Auto-assign to matching sections
    await autoAssignToSections(productId, p);
    
    setBusy(false);
    toast.success(isNew ? "Product added" : "Saved");
    onSaved();
  };

  const autoAssignToSections = async (productId: string, product: Product) => {
    try {
      // Get all active sections
      const { data: sections, error } = await supabase
        .from("product_sections" as any)
        .select("*")
        .eq("active", true);
      
      if (error || !sections) return;
      
      // Find matching sections
      const matchingSections = sections.filter((section: any) => {
        switch (section.slug) {
          case 'new-arrivals':
            return product.badge === 'New';
          case 'best-sellers':
            return product.badge === 'Best Seller';
          case 'under-499':
            return product.price < 499;
          case 'under-999':
            return product.price < 999;
          default:
            // Match by category or name for custom sections
            const sectionNameLower = section.name.toLowerCase();
            return product.category.toLowerCase().includes(sectionNameLower) ||
                   product.name.toLowerCase().includes(sectionNameLower);
        }
      });
      
      // Assign to matching sections
      for (const section of matchingSections) {
        // Check if already assigned
        const { data: existing } = await supabase
          .from("product_section_assignments" as any)
          .select("*")
          .eq("section_id", section.id)
          .eq("product_id", productId);
        
        if (!existing || existing.length === 0) {
          // Get current max display order for this section
          const { data: maxOrder } = await supabase
            .from("product_section_assignments" as any)
            .select("display_order")
            .eq("section_id", section.id)
            .order("display_order", { ascending: false })
            .limit(1);
          
          const nextOrder = maxOrder && maxOrder.length > 0 ? maxOrder[0].display_order + 1 : 0;
          
          await supabase.from("product_section_assignments" as any).insert({
            section_id: section.id,
            product_id: productId,
            display_order: nextOrder,
          });
        }
      }
      
      if (matchingSections.length > 0) {
        console.log(`Auto-assigned product to ${matchingSections.length} sections`);
      }
    } catch (e) {
      // Silently fail auto-assignment errors
      console.error("Auto-assignment error:", e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-background p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-xl">{isNew ? "Add product" : "Edit product"}</h3>
          <button onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground">✕</button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label>Image</Label>
            <div className="mt-1 flex items-start gap-3">
              {p.image_url && <img src={p.image_url} alt="" className="h-32 w-28 rounded-lg object-cover ring-1 ring-border" />}
              <label className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border px-4 py-3 text-xs font-semibold hover:border-[var(--gold)] ${uploading ? "opacity-50" : ""}`}>
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {uploading ? "Uploading…" : "Upload / replace image"}
                <input type="file" accept="image/*" className="hidden" disabled={uploading}
                  onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} />
              </label>
            </div>
          </div>

          <Field label="Name"><input value={p.name} onChange={(e) => set("name", e.target.value)} className={input} /></Field>
          <Field label="Category">
            {isNewCategory ? (
              <div className="flex gap-2">
                <input 
                  value={newCategoryName} 
                  onChange={(e) => setNewCategoryName(e.target.value)} 
                  placeholder="Enter new category name" 
                  className={input} 
                  autoFocus
                />
                <button 
                  onClick={() => {
                    if (newCategoryName.trim()) {
                      set("category", newCategoryName.trim());
                      setIsNewCategory(false);
                      setNewCategoryName("");
                    }
                  }}
                  className="rounded-lg bg-[var(--gold)] px-3 text-xs font-semibold text-[var(--ivory)]"
                >
                  Add
                </button>
                <button 
                  onClick={() => {
                    setIsNewCategory(false);
                    setNewCategoryName("");
                  }}
                  className="rounded-lg border border-border px-3 text-xs font-semibold"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <select value={p.category} onChange={(e) => set("category", e.target.value)} className={input}>
                  {CATEGORIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
                  {allCategories.filter(cat => !CATEGORIES.find(c => c.name === cat)).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="">-- Custom Category --</option>
                </select>
                <button
                  onClick={() => setIsNewCategory(true)}
                  className="rounded-full border border-border px-3 py-2 text-xs font-semibold hover:border-[var(--gold)]"
                  title="Add new category"
                >
                  <Plus className="h-4 w-4" />
                </button>
                {p.category && !CATEGORIES.find(c => c.name === p.category) && (
                  <button
                    onClick={() => {
                      set("category", "");
                      toast.success("Custom category removed");
                    }}
                    className="rounded-full border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:border-red-400 hover:bg-red-50"
                    title="Remove custom category"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          </Field>
          <Field label="Badge">
            <select value={p.badge ?? ""} onChange={(e) => set("badge", e.target.value || null)} className={input}>
              <option value="">None</option>
              <option value="Best Seller">Best Seller</option>
              <option value="New">New</option>
              <option value="Limited">Limited</option>
            </select>
          </Field>
          <Field label="Price (₹)">
            <input type="number" value={p.price} onChange={(e) => set("price", Number(e.target.value))} className={input} />
          </Field>
          <Field label="MRP (₹, optional)">
            <div className="flex gap-2">
              <input type="number" value={p.mrp ?? ""} onChange={(e) => set("mrp", e.target.value ? Number(e.target.value) : null)} className={input} />
              <button 
                onClick={() => set("mrp", null)}
                className="rounded-lg border border-border px-3 text-xs font-semibold hover:border-red-400 hover:bg-red-50"
                title="Clear MRP"
              >
                ✕
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {[299, 499, 799, 999].map((price) => (
                <button
                  key={price}
                  onClick={() => set("mrp", price)}
                  className="rounded-full border border-border px-3 py-1 text-xs font-semibold hover:border-[var(--gold)] hover:bg-[var(--gold-soft)]"
                >
                  ₹{price}
                </button>
              ))}
            </div>
            {p.mrp && p.price && p.mrp > p.price && (
              <p className="mt-2 text-xs font-semibold text-green-600">
                Discount: {Math.round(((p.mrp - p.price) / p.mrp) * 100)}% off
              </p>
            )}
          </Field>
          <Field label="Rating (1-5)"><input type="number" min={1} max={5} value={p.rating} onChange={(e) => set("rating", Number(e.target.value))} className={input} /></Field>
          <Field label="Sort order"><input type="number" value={p.sort_order} onChange={(e) => set("sort_order", Number(e.target.value))} className={input} /></Field>
          <div className="sm:col-span-2">
            <Label>Description</Label>
            <textarea value={p.description} onChange={(e) => set("description", e.target.value)} rows={3} className={`${input} min-h-[80px]`} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={p.active} onChange={(e) => set("active", e.target.checked)} />
            Visible on public site
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={p.sold_out} onChange={(e) => set("sold_out", e.target.checked)} />
            Mark as Sold Out
          </label>

          <div className="sm:col-span-2 mt-2 border-t border-border pt-4">
            <h4 className="font-display text-sm uppercase tracking-widest text-muted-foreground">SEO</h4>
            <p className="mt-1 text-[11px] text-muted-foreground">These help this product rank better on Google and look great when shared on WhatsApp / Instagram.</p>
          </div>
          <Field label="SEO title (≤ 60 chars)">
            <input value={p.seo_title ?? ""} maxLength={70} onChange={(e) => set("seo_title", e.target.value || null)} className={input} placeholder={p.name} />
          </Field>
          <Field label="URL slug">
            <input value={p.slug} onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} className={input} />
          </Field>
          <div className="sm:col-span-2">
            <Label>SEO description (≤ 160 chars)</Label>
            <textarea value={p.seo_description ?? ""} maxLength={200} onChange={(e) => set("seo_description", e.target.value || null)} rows={2} className={`${input} min-h-[60px]`} placeholder={p.description.slice(0, 160)} />
          </div>
          <div className="sm:col-span-2">
            <Label>OpenGraph image URL (share preview — leave empty to use main image)</Label>
            <input value={p.og_image_url ?? ""} onChange={(e) => set("og_image_url", e.target.value || null)} className={input} placeholder={p.image_url} />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-full border border-border px-5 py-2.5 text-xs font-semibold">Cancel</button>
          <button onClick={save} disabled={busy} className="rounded-full bg-gradient-gold px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-[var(--ivory)] disabled:opacity-50">
            {busy ? "Saving…" : isNew ? "Add product" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------- Key/Value Editor for settings + content ------------- */

function KVTab({ table, title, hint, multiline }: { table: "site_settings" | "site_content"; title: string; hint: string; multiline?: boolean }) {
  const [rows, setRows] = useState<{ key: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [newKey, setNewKey] = useState("");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from(table).select("key,value").order("key");
    if (error) toast.error(error.message);
    setRows(data ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, [table]);

  const update = (i: number, v: string) => setRows((r) => r.map((row, idx) => idx === i ? { ...row, value: v } : row));

  const saveAll = async () => {
    setBusy(true);
    const { error } = await supabase.from(table).upsert(rows, { onConflict: "key" });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Saved");
  };

  const addKey = () => {
    const k = newKey.trim();
    if (!k) return;
    if (rows.some((r) => r.key === k)) return toast.error("Key already exists");
    setRows([...rows, { key: k, value: "" }]);
    setNewKey("");
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-2xl">{title}</h2>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
        <div className="space-y-3 rounded-2xl bg-background p-5 ring-1 ring-border">
          {rows.map((r, i) => (
            <div key={r.key} className="grid gap-2 sm:grid-cols-[220px_1fr]">
              <Label>{r.key}</Label>
              {multiline ? (
                <textarea value={r.value} onChange={(e) => update(i, e.target.value)} rows={3} className={input} />
              ) : (
                <input value={r.value} onChange={(e) => update(i, e.target.value)} className={input} />
              )}
            </div>
          ))}
          <div className="flex gap-2 border-t border-border pt-4">
            <input value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="new_key_name" className={input} />
            <button onClick={addKey} className="rounded-full border border-border px-4 py-2 text-xs font-semibold hover:border-[var(--gold)]">Add field</button>
          </div>
          <div className="flex justify-end pt-2">
            <button onClick={saveAll} disabled={busy} className="rounded-full bg-gradient-gold px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-[var(--ivory)] disabled:opacity-50">
              {busy ? "Saving…" : "Save all"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const input = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-[var(--gold)]";
function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">{children}</label>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><Label>{label}</Label><div className="mt-1">{children}</div></div>;
}

/* ------------- Page SEO Tab ------------- */

type PageSeoRow = { path: string; title: string; description: string; og_image_url: string | null };

const DEFAULT_PAGES: PageSeoRow[] = [
  { path: "/", title: "", description: "", og_image_url: null },
  { path: "/shop", title: "", description: "", og_image_url: null },
  { path: "/about", title: "", description: "", og_image_url: null },
  { path: "/contact", title: "", description: "", og_image_url: null },
  { path: "/care", title: "", description: "", og_image_url: null },
  { path: "/faq", title: "", description: "", og_image_url: null },
];

function PageSeoTab() {
  const [rows, setRows] = useState<PageSeoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [newPath, setNewPath] = useState("");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("page_seo" as any).select("*").order("path");
    if (error) toast.error(error.message);
    const existing = ((data as any) ?? []) as PageSeoRow[];
    const paths = new Set(existing.map((r) => r.path));
    const merged = [...existing, ...DEFAULT_PAGES.filter((d) => !paths.has(d.path))].sort((a, b) => a.path.localeCompare(b.path));
    setRows(merged);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const update = (i: number, patch: Partial<PageSeoRow>) =>
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));

  const saveAll = async () => {
    setBusy(true);
    const payload = rows.map((r) => ({
      path: r.path,
      title: r.title ?? "",
      description: r.description ?? "",
      og_image_url: r.og_image_url ?? null,
    }));
    const { error } = await supabase.from("page_seo" as any).upsert(payload, { onConflict: "path" });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("SEO saved");
  };

  const addPath = () => {
    let p = newPath.trim();
    if (!p) return;
    if (!p.startsWith("/")) p = "/" + p;
    if (rows.some((r) => r.path === p)) return toast.error("Path already exists");
    setRows([...rows, { path: p, title: "", description: "", og_image_url: null }]);
    setNewPath("");
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-2xl">Page SEO</h2>
        <p className="text-xs text-muted-foreground">Set the title, description, URL and share image for every page. Titles under 60 characters and descriptions under 160 rank best.</p>
      </div>
      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
        <div className="space-y-4">
          {rows.map((r, i) => (
            <div key={r.path} className="rounded-2xl bg-background p-5 ring-1 ring-border">
              <div className="mb-3 flex items-center justify-between">
                <code className="rounded bg-[var(--gold-soft)] px-2 py-1 text-xs font-semibold text-[var(--gold-dark)]">{r.path}</code>
                <span className="text-[11px] text-muted-foreground">{r.title.length}/60 · {r.description.length}/160</span>
              </div>
              <div className="grid gap-3">
                <Field label="Page title"><input value={r.title} maxLength={70} onChange={(e) => update(i, { title: e.target.value })} className={input} /></Field>
                <div>
                  <Label>Meta description</Label>
                  <textarea value={r.description} maxLength={200} onChange={(e) => update(i, { description: e.target.value })} rows={2} className={`${input} min-h-[60px]`} />
                </div>
                <Field label="OpenGraph image URL (share preview)"><input value={r.og_image_url ?? ""} onChange={(e) => update(i, { og_image_url: e.target.value || null })} className={input} placeholder="https://…" /></Field>
              </div>
            </div>
          ))}

          <div className="flex gap-2 rounded-2xl bg-background p-5 ring-1 ring-border">
            <input value={newPath} onChange={(e) => setNewPath(e.target.value)} placeholder="/new-page" className={input} />
            <button onClick={addPath} className="rounded-full border border-border px-4 py-2 text-xs font-semibold hover:border-[var(--gold)] whitespace-nowrap">Add page</button>
          </div>

          <div className="flex justify-end">
            <button onClick={saveAll} disabled={busy} className="rounded-full bg-gradient-gold px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-[var(--ivory)] disabled:opacity-50">
              {busy ? "Saving…" : "Save all SEO"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------- Home Images Tab ------------- */

const HOME_IMAGE_FIELDS: { key: string; label: string; hint: string }[] = [
  { key: "home_hero_image", label: "Hero image", hint: "Large image at the top of the homepage (right side)." },
  { key: "home_lifestyle_image", label: "Lifestyle banner image", hint: "Mid-page banner next to the 'Everyday elegance' section." },
];

function HomeImagesTab() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("site_content").select("key,value").in("key", HOME_IMAGE_FIELDS.map((f) => f.key));
    if (error) toast.error(error.message);
    const map: Record<string, string> = {};
    (data ?? []).forEach((r: any) => (map[r.key] = r.value));
    setValues(map);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const persist = async (key: string, value: string) => {
    setSavingKey(key);
    const { error } = await supabase.from("site_content").upsert({ key, value }, { onConflict: "key" });
    setSavingKey(null);
    if (error) return toast.error(error.message);
    toast.success("Homepage image updated");
    setValues((v) => ({ ...v, [key]: value }));
  };

  const uploadFor = async (key: string, file: File) => {
    setUploadingKey(key);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `home/${key}-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("product-images").upload(path, file, { contentType: file.type, upsert: false });
      if (error) throw error;
      const { data: signed, error: sErr } = await supabase.storage.from("product-images").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
      if (sErr || !signed) throw sErr ?? new Error("signed url");
      await persist(key, signed.signedUrl);
    } catch (e: any) {
      toast.error(e.message || "Upload failed");
    } finally { setUploadingKey(null); }
  };

  if (loading) return <div className="grid place-items-center py-16"><Loader2 className="h-6 w-6 animate-spin text-[var(--gold-dark)]" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl">Home Page Images</h2>
        <p className="mt-1 text-sm text-muted-foreground">Upload a new image or paste an image URL. Changes appear on the homepage instantly.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {HOME_IMAGE_FIELDS.map((f) => {
          const val = values[f.key] || "";
          const isUploading = uploadingKey === f.key;
          const isSaving = savingKey === f.key;
          return (
            <div key={f.key} className="rounded-2xl bg-card p-5 ring-1 ring-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg">{f.label}</h3>
                  <p className="text-xs text-muted-foreground">{f.hint}</p>
                </div>
              </div>
              <div className="mt-4 overflow-hidden rounded-xl bg-[var(--gold-soft)] ring-1 ring-border">
                {val ? (
                  <img src={val} alt={f.label} className="h-56 w-full object-cover" />
                ) : (
                  <div className="grid h-56 place-items-center text-xs text-muted-foreground">No image set</div>
                )}
              </div>
              <label className={`mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border px-4 py-3 text-xs font-semibold hover:border-[var(--gold)] ${isUploading ? "opacity-50" : ""}`}>
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {isUploading ? "Uploading…" : "Upload / replace image"}
                <input type="file" accept="image/*" className="hidden" disabled={isUploading}
                  onChange={(e) => e.target.files?.[0] && uploadFor(f.key, e.target.files[0])} />
              </label>
              <div className="mt-4 space-y-2">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Image URL</label>
                <input
                  value={val}
                  onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  placeholder="https://…"
                />
                <button
                  onClick={() => persist(f.key, val)}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[var(--ivory)] disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null} Save URL
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------- Analytics Dashboard ------------- */

function AnalyticsDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    hiddenProducts: 0,
    soldOutProducts: 0,
    categories: 0,
    totalViews: 0,
    totalClicks: 0,
    totalSearches: 0,
  });
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    setLoading(true);
    try {
      const [productsRes, viewsRes, clicksRes, searchesRes] = await Promise.all([
        supabase.from("products").select("id, active, sold_out, category"),
        supabase.from("product_views").select("id", { head: true, count: "exact" }),
        supabase.from("whatsapp_clicks").select("id", { head: true, count: "exact" }),
        supabase.from("search_queries").select("id", { head: true, count: "exact" }),
      ]);

      const products = productsRes.data || [];
      const categories = new Set(products.map(p => p.category)).size;

      setStats({
        totalProducts: products.length,
        activeProducts: products.filter(p => p.active).length,
        hiddenProducts: products.filter(p => !p.active).length,
        soldOutProducts: products.filter(p => p.sold_out).length,
        categories,
        totalViews: viewsRes.count || 0,
        totalClicks: clicksRes.count || 0,
        totalSearches: searchesRes.count || 0,
      });
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadStats(); }, []);

  const StatCard = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) => (
    <div className="rounded-2xl bg-background p-5 ring-1 ring-border">
      <div className="flex items-center gap-3">
        <div className={`rounded-full p-2.5 ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold">{value.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-2xl">Analytics Dashboard</h2>
        <p className="text-xs text-muted-foreground">Overview of your store performance</p>
      </div>

      {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Package} label="Total Products" value={stats.totalProducts} color="bg-blue-100 text-blue-600" />
            <StatCard icon={Eye} label="Active Products" value={stats.activeProducts} color="bg-green-100 text-green-600" />
            <StatCard icon={Users} label="Hidden Products" value={stats.hiddenProducts} color="bg-gray-100 text-gray-600" />
            <StatCard icon={ShoppingCart} label="Sold Out" value={stats.soldOutProducts} color="bg-red-100 text-red-600" />
            <StatCard icon={BarChart3} label="Categories" value={stats.categories} color="bg-purple-100 text-purple-600" />
            <StatCard icon={Eye} label="Total Views" value={stats.totalViews} color="bg-cyan-100 text-cyan-600" />
            <StatCard icon={MousePointerClick} label="WhatsApp Clicks" value={stats.totalClicks} color="bg-orange-100 text-orange-600" />
            <StatCard icon={Search} label="Total Searches" value={stats.totalSearches} color="bg-pink-100 text-pink-600" />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl bg-background p-6 ring-1 ring-border">
              <h3 className="font-display text-lg">Recent Activity</h3>
              <p className="mt-2 text-sm text-muted-foreground">Detailed analytics coming soon</p>
            </div>
            <div className="rounded-2xl bg-background p-6 ring-1 ring-border">
              <h3 className="font-display text-lg">Top Products</h3>
              <p className="mt-2 text-sm text-muted-foreground">Product performance data coming soon</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ------------- Product Sections Tab ------------- */

function SectionsTab() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("product_sections").select("*").order("display_order");
    if (error) toast.error(error.message);
    setSections(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const remove = async (id: string, name: string) => {
    if (!confirm(`Delete section "${name}"? Products will not be deleted.`)) return;
    const { error } = await supabase.from("product_sections").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Section deleted");
    load();
  };

  const newSection = () => ({
    id: "", slug: `section-${Date.now()}`, name: "", heading: "",
    description: "", banner_image_url: "", active: true,
    display_order: sections.length, products_to_show: 8, show_view_all_button: true,
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl">Homepage Sections ({sections.length})</h2>
          <p className="text-xs text-muted-foreground">Manage product sections displayed on homepage</p>
        </div>
        <button onClick={() => setEditing(newSection())}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-[var(--ivory)] shadow-luxe">
          <Plus className="h-4 w-4" /> Create Section
        </button>
      </div>

      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((s) => (
            <div key={s.id} className="flex gap-3 rounded-xl bg-background p-4 ring-1 ring-border">
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{s.heading}</p>
                    <p className="text-xs text-muted-foreground">{s.name} · {s.products_to_show} products</p>
                    {!s.active && <span className="mt-1 inline-block rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">Hidden</span>}
                  </div>
                </div>
                <div className="mt-2 flex gap-1">
                  <button onClick={() => setEditing(s)} className="rounded-lg border border-border px-2 py-1 text-[11px] font-semibold hover:border-[var(--gold)]">Edit</button>
                  <button onClick={() => remove(s.id, s.name)} className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-[11px] font-semibold text-red-600 hover:border-red-500">
                    <Trash2 className="h-3 w-3" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && <SectionEditor section={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </div>
  );
}

function SectionEditor({ section, onClose, onSaved }: { section: any; onClose: () => void; onSaved: () => void }) {
  const [s, setS] = useState(section);
  const [busy, setBusy] = useState(false);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());
  const [loadingProducts, setLoadingProducts] = useState(false);
  const isNew = !s.id;

  const set = <K extends keyof any>(k: K, v: any[K]) => setS((prev: any) => ({ ...prev, [k]: v }));

  // Load all products and current assignments
  useEffect(() => {
    const loadData = async () => {
      setLoadingProducts(true);
      try {
        const [productsRes, assignmentsRes] = await Promise.all([
          supabase.from("products").select("id, name, category, badge, image_url").order("name"),
          s.id ? supabase.from("product_section_assignments" as any).select("product_id").eq("section_id", s.id) : { data: [], error: null }
        ]);
        
        if (productsRes.error) throw productsRes.error;
        if (assignmentsRes.error) throw assignmentsRes.error;
        
        // Just use the products as-is for now
        setAllProducts(productsRes.data || []);
        const assignedIds = new Set((assignmentsRes.data || []).map((a: any) => a.product_id));
        setSelectedProductIds(assignedIds);
      } catch (e: any) {
        toast.error(e.message);
      } finally {
        setLoadingProducts(false);
      }
    };
    loadData();
  }, [s.id]);

  const save = async () => {
    if (!s.name || !s.heading) return toast.error("Name and heading are required");
    setBusy(true);
    
    // Save section details
    const payload = {
      slug: s.slug, name: s.name, heading: s.heading, description: s.description,
      banner_image_url: s.banner_image_url, active: s.active,
      display_order: s.display_order, products_to_show: s.products_to_show,
      show_view_all_button: s.show_view_all_button,
    };
    
    const { data: sectionData, error: sectionError } = isNew
      ? await supabase.from("product_sections").insert(payload).select().single()
      : await supabase.from("product_sections").update(payload).eq("id", s.id).select().single();
    
    if (sectionError) {
      setBusy(false);
      return toast.error(sectionError.message);
    }
    
    const sectionId = sectionData.id;
    
    // Delete existing assignments
    await supabase.from("product_section_assignments" as any).delete().eq("section_id", sectionId);
    
    // Insert new assignments
    const assignments = Array.from(selectedProductIds).map((productId, index) => ({
      section_id: sectionId,
      product_id: productId,
      display_order: index,
    }));
    
    if (assignments.length > 0) {
      const { error: assignError } = await supabase.from("product_section_assignments" as any).insert(assignments);
      if (assignError) {
        setBusy(false);
        return toast.error(assignError.message);
      }
    }
    
    setBusy(false);
    toast.success(isNew ? "Section created" : "Saved");
    onSaved();
  };

  const toggleProduct = (productId: string) => {
    setSelectedProductIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  // Auto-select products based on section name
  const autoSelectBySectionName = () => {
    let matchingProducts: any[] = [];
    
    switch (s.slug) {
      case 'new-arrivals':
        matchingProducts = allProducts.filter(p => p.badge === 'New');
        break;
      case 'best-sellers':
        matchingProducts = allProducts.filter(p => p.badge === 'Best Seller');
        break;
      case 'under-499':
        matchingProducts = allProducts.filter(p => p.price < 499);
        break;
      case 'under-999':
        matchingProducts = allProducts.filter(p => p.price < 999);
        break;
      default:
        // For custom sections, try to match by category or name
        const sectionNameLower = s.name.toLowerCase();
        matchingProducts = allProducts.filter(p => 
          p.category.toLowerCase().includes(sectionNameLower) ||
          p.name.toLowerCase().includes(sectionNameLower)
        );
    }
    
    setSelectedProductIds(new Set(matchingProducts.map(p => p.id)));
    toast.success(`Auto-selected ${matchingProducts.length} products`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-background p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-xl">{isNew ? "Create Section" : "Edit Section"}</h3>
          <button onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground">✕</button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Section Name"><input value={s.name} onChange={(e) => set("name", e.target.value)} className={input} placeholder="e.g., New Arrivals" /></Field>
          <Field label="Heading"><input value={s.heading} onChange={(e) => set("heading", e.target.value)} className={input} placeholder="e.g., New Arrivals" /></Field>
          <div className="sm:col-span-2">
            <Label>Description</Label>
            <textarea value={s.description} onChange={(e) => set("description", e.target.value)} rows={2} className={`${input} min-h-[60px]`} placeholder="Section description" />
          </div>
          <Field label="Display Order"><input type="number" value={s.display_order} onChange={(e) => set("display_order", Number(e.target.value))} className={input} /></Field>
          <Field label="Products to Show"><input type="number" value={s.products_to_show} onChange={(e) => set("products_to_show", Number(e.target.value))} className={input} /></Field>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={s.active} onChange={(e) => set("active", e.target.checked)} />
            Active (visible on homepage)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={s.show_view_all_button} onChange={(e) => set("show_view_all_button", e.target.checked)} />
            Show "View All" button
          </label>
        </div>

        {/* Product Selection */}
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <Label>Select Products ({selectedProductIds.size} selected)</Label>
            <button 
              onClick={autoSelectBySectionName}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:border-[var(--gold)]"
            >
              Auto-select by Section Name
            </button>
          </div>
          
          {loadingProducts ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <div className="max-h-64 overflow-y-auto rounded-lg border border-border p-2">
              {allProducts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No products available</p>
              ) : (
                <div className="space-y-1">
                  {allProducts.map((product) => (
                    <label 
                      key={product.id} 
                      className={`flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-muted ${selectedProductIds.has(product.id) ? 'bg-[var(--gold-soft)]' : ''}`}
                    >
                      <input 
                        type="checkbox" 
                        checked={selectedProductIds.has(product.id)}
                        onChange={() => toggleProduct(product.id)}
                        className="h-4 w-4"
                      />
                      <div className="h-10 w-10 rounded bg-muted flex items-center justify-center text-muted-foreground text-xs overflow-hidden">
                        {product.image_url ? (
                          <img 
                            src={product.image_url} 
                            alt="" 
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              console.error('Image failed to load:', product.image_url);
                              const img = e.target as HTMLImageElement;
                              img.style.display = 'none';
                            }}
                            onLoad={() => {
                              console.log('Image loaded successfully:', product.image_url);
                            }}
                          />
                        ) : (
                          <span>📷</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.category} · ₹{product.price}</p>
                      </div>
                      {product.badge && (
                        <span className="rounded-full bg-[var(--gold-soft)] px-2 py-0.5 text-[10px] font-semibold text-[var(--gold-dark)]">
                          {product.badge}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-full border border-border px-5 py-2.5 text-xs font-semibold">Cancel</button>
          <button onClick={save} disabled={busy} className="rounded-full bg-gradient-gold px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-[var(--ivory)] disabled:opacity-50">
            {busy ? "Saving…" : isNew ? "Create Section" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------- Homepage Builder Tab ------------- */

function HomepageBuilderTab() {
  const [layout, setLayout] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("homepage_layout").select("*");
    if (error) toast.error(error.message);
    const map: Record<string, string> = {};
    (data || []).forEach((r: any) => (map[r.key] = r.value));
    setLayout(map);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggle = (key: string) => {
    setLayout((prev) => ({ ...prev, [key]: prev[key] === "true" ? "false" : "true" }));
  };

  const saveAll = async () => {
    setBusy(true);
    const { error } = await supabase.from("homepage_layout").upsert(
      Object.entries(layout).map(([key, value]) => ({ key, value })),
      { onConflict: "key" }
    );
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Homepage layout saved");
  };

  const toggles = [
    { key: "show_hero_banner", label: "Hero Banner" },
    { key: "show_collections", label: "Collections" },
    { key: "show_featured", label: "Featured Products" },
    { key: "show_best_sellers", label: "Best Sellers" },
    { key: "show_testimonials", label: "Testimonials" },
    { key: "show_instagram_feed", label: "Instagram Feed" },
    { key: "show_faq", label: "FAQ Section" },
    { key: "show_newsletter", label: "Newsletter" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-2xl">Homepage Builder</h2>
        <p className="text-xs text-muted-foreground">Control which sections appear on your homepage</p>
      </div>

      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
        <div className="space-y-3 rounded-2xl bg-background p-5 ring-1 ring-border">
          {toggles.map((t) => (
            <div key={t.key} className="flex items-center justify-between">
              <span className="text-sm font-medium">{t.label}</span>
              <button
                onClick={() => toggle(t.key)}
                className={`relative h-6 w-11 rounded-full transition-colors ${layout[t.key] === "true" ? "bg-[var(--gold)]" : "bg-muted"}`}
              >
                <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${layout[t.key] === "true" ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
          ))}

          <div className="mt-6 flex justify-end">
            <button onClick={saveAll} disabled={busy} className="rounded-full bg-gradient-gold px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-[var(--ivory)] disabled:opacity-50">
              {busy ? "Saving…" : "Save Layout"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
