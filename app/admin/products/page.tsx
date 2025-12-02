"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { resizeImage } from "@/lib/image";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  image_url?: string | null;
  image_thumb_url?: string | null;
  stock: number;
  created_at?: string;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      if (res.ok) {
        const j = await res.json();
        setProducts(j.data || []);
      } else {
        console.error("fetch products failed", await res.text());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleCreate() {
    const name = prompt("Nome do produto:");
    if (!name) return;

    const slugCandidate = name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9\\-]/g, "");
    const slug = prompt("Slug (ex: produto-exemplo):", slugCandidate) || slugCandidate;
    if (!slug) return;

    setCreating(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug, price: 0, stock: 0 }),
      });

      if (res.ok) {
        await load();
        alert("Produto criado!");
      } else {
        const j = await res.json().catch(() => ({}));
        alert("Erro: " + (j.error || "unknown"));
      }
    } catch (e) {
      alert("Erro de rede");
      console.error(e);
    } finally {
      setCreating(false);
    }
  }

  // função que faz upload (gera thumbnail + medium) e atualiza produto
  async function handleImageUpload(productId: string, file: File) {
    if (!file) return;
    setUploading(true);
    try {
      const bucket = "product-images"; // se seu bucket tiver outro nome, ajuste aqui

      // redimensiona para medium (max 1200) e thumbnail (300)
      const mediumBlob = await resizeImage(file, 1200, 0.8);
      const thumbBlob = await resizeImage(file, 300, 0.75);

      const ext = "jpg";
      const baseName = `${productId}-${Date.now()}`;

      // cria File objects para upload
      const mediumFile = new File([mediumBlob], `${baseName}.${ext}`, { type: "image/jpeg" });
      const thumbFile = new File([thumbBlob], `${baseName}-thumb.${ext}`, { type: "image/jpeg" });

      // upload medium
      const up1 = await supabase.storage.from(bucket).upload(mediumFile.name, mediumFile, {
        cacheControl: "public, max-age=2592000",
        upsert: false,
      });
      if (up1.error) throw up1.error;

      // upload thumb
      const up2 = await supabase.storage.from(bucket).upload(thumbFile.name, thumbFile, {
        cacheControl: "public, max-age=2592000",
        upsert: false,
      });
      if (up2.error) throw up2.error;

      // get public urls
      const mediumURL = supabase.storage.from(bucket).getPublicUrl(up1.data.path).data.publicUrl;
      const thumbURL = supabase.storage.from(bucket).getPublicUrl(up2.data.path).data.publicUrl;

      // update product via API (server will update products table)
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          update_image_for_id: productId,
          image_url: mediumURL,
          image_thumb_url: thumbURL
        }),
      });

      if (!res.ok) {
        const j = await res.json().catch(()=>({}));
        throw new Error(j.error || "Failed updating product image");
      }

      await load();
      alert("Imagem enviada e atualizada.");
    } catch (err: any) {
      console.error(err);
      alert("Erro no upload: " + (err.message || err));
    } finally {
      setUploading(false);
    }
  }

  function triggerFileInput(productId: string) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      if (input.files && input.files[0]) handleImageUpload(productId, input.files[0]);
    };
    input.click();
  }

  return (
    <main className="min-h-screen p-6 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Produtos (Admin)</h1>
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              disabled={creating}
              className="bg-teal-600 text-white px-4 py-2 rounded"
            >
              {creating ? "Criando..." : "Novo produto"}
            </button>
            <button onClick={load} className="bg-slate-200 px-4 py-2 rounded">Atualizar</button>
          </div>
        </header>

        <section className="bg-white rounded shadow p-4">
          {loading ? (
            <div>Carregando...</div>
          ) : products.length === 0 ? (
            <div>Nenhum produto cadastrado.</div>
          ) : (
            <ul className="space-y-4">
              {products.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between border p-3 rounded"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-100 rounded overflow-hidden flex items-center justify-center">
                      {p.image_thumb_url ? (
                        <img src={p.image_thumb_url} alt={p.name} className="object-cover w-full h-full" />
                      ) : p.image_url ? (
                        <img src={p.image_url} alt={p.name} className="object-cover w-full h-full" />
                      ) : (
                        <span className="text-sm text-slate-400">sem imagem</span>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold">{p.name}</div>
                      <div className="text-sm text-slate-500">{p.slug}</div>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <div>R$ {Number(p.price || 0).toFixed(2)}</div>
                    <div className="text-sm text-slate-500">Estoque: {p.stock}</div>
                    <div className="flex gap-2">
                      <button onClick={() => triggerFileInput(p.id)} disabled={uploading} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
                        {uploading ? "Enviando..." : "Upload imagem"}
                      </button>
                      <a href={`/store/product/${p.id}`} className="text-sm text-slate-600 hover:underline px-3 py-1">Ver</a>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
