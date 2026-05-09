"use client";

import { useEffect, useState, useRef } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  AlertCircle,
  RefreshCw,
  X,
  Upload,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";

const API = process.env.NEXT_PUBLIC_API_URL;
const fmt = (n: number) => `₦${Number(n).toLocaleString("en-NG")}`;

interface Category {
  id: string;
  name: string;
  description?: string;
  sortOrder?: number;
  _count?: { menuItems: number };
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  category?: { id: string; name: string };
  preparationTime?: number;
  tags?: string[];
  image?: string;
  isAvailable: boolean;
}

const emptyForm = {
  name: "",
  description: "",
  price: "",
  categoryId: "",
  preparationTime: "",
  tags: "",
  image: "",
};

export default function AdminMenuPage() {
  const [tab, setTab] = useState<"items" | "categories">("items");

  // --- Menu Items ---
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [itemsError, setItemsError] = useState("");
  const [modal, setModal] = useState<{ open: boolean; item: MenuItem | null }>({
    open: false,
    item: null,
  });
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // --- Categories ---
  const [loadingCats, setLoadingCats] = useState(true);
  const [catsError, setCatsError] = useState("");
  const [catForm, setCatForm] = useState({ name: "", description: "", sortOrder: "" });
  const [savingCat, setSavingCat] = useState(false);
  const [deletingCatId, setDeletingCatId] = useState<string | null>(null);

  const fetchItems = () => {
    setLoadingItems(true);
    setItemsError("");
    fetch(`${API}/api/menu`, { credentials: "include" })
      .then(async (r) => {
        const json = await r.json();
        if (!json.success) throw new Error(json.message);
        const raw = json.data;
        const flat: MenuItem[] = Array.isArray(raw)
          ? raw.flatMap((c: { menuItems?: MenuItem[] } | MenuItem) =>
              "menuItems" in c && c.menuItems ? c.menuItems : [c as MenuItem]
            )
          : [];
        setItems(flat);
      })
      .catch((err: unknown) => setItemsError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoadingItems(false));
  };

  const fetchCategories = () => {
    setLoadingCats(true);
    setCatsError("");
    fetch(`${API}/api/menu/categories`, { credentials: "include" })
      .then(async (r) => {
        const json = await r.json();
        if (!json.success) throw new Error(json.message);
        setCategories(json.data ?? []);
      })
      .catch((err: unknown) => setCatsError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoadingCats(false));
  };

  useEffect(() => { fetchItems(); fetchCategories(); }, []);

  const openAdd = () => {
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview("");
    setModal({ open: true, item: null });
  };

  const openEdit = (item: MenuItem) => {
    setForm({
      name: item.name,
      description: item.description,
      price: String(item.price),
      categoryId: item.categoryId,
      preparationTime: String(item.preparationTime ?? ""),
      tags: item.tags?.join(", ") ?? "",
      image: item.image ?? "",
    });
    setImageFile(null);
    setImagePreview(item.image ?? "");
    setModal({ open: true, item });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.categoryId) return;
    setSaving(true);
    try {
      let imageUrl = form.image;

      if (imageFile) {
        setUploading(true);
        const fd = new FormData();
        fd.append("image", imageFile);
        const up = await fetch(`${API}/api/upload/menu`, {
          method: "POST",
          credentials: "include",
          body: fd,
        });
        const upJson = await up.json();
        if (!upJson.success) throw new Error(upJson.message ?? "Upload failed");
        imageUrl = upJson.data.url;
        setUploading(false);
      }

      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        categoryId: form.categoryId,
        preparationTime: form.preparationTime ? Number(form.preparationTime) : undefined,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        image: imageUrl || undefined,
      };

      const url = modal.item ? `${API}/api/menu/${modal.item.id}` : `${API}/api/menu`;
      const method = modal.item ? "PATCH" : "POST";
      const r = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const json = await r.json();
      if (!json.success) throw new Error(json.message);
      setModal({ open: false, item: null });
      fetchItems();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this menu item?")) return;
    setDeleteId(id);
    try {
      const r = await fetch(`${API}/api/menu/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const json = await r.json();
      if (!json.success) throw new Error(json.message);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleteId(null);
    }
  };

  const toggleAvailability = async (item: MenuItem) => {
    setTogglingId(item.id);
    try {
      const r = await fetch(`${API}/api/menu/${item.id}/availability`, {
        method: "PATCH",
        credentials: "include",
      });
      const json = await r.json();
      if (!json.success) throw new Error(json.message);
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, isAvailable: !i.isAvailable } : i))
      );
    } finally {
      setTogglingId(null);
    }
  };

  const handleAddCategory = async () => {
    if (!catForm.name) return;
    setSavingCat(true);
    try {
      const r = await fetch(`${API}/api/menu/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: catForm.name,
          description: catForm.description || undefined,
          sortOrder: catForm.sortOrder ? Number(catForm.sortOrder) : undefined,
        }),
      });
      const json = await r.json();
      if (!json.success) throw new Error(json.message);
      setCatForm({ name: "", description: "", sortOrder: "" });
      fetchCategories();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to add category");
    } finally {
      setSavingCat(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    setDeletingCatId(id);
    try {
      const r = await fetch(`${API}/api/menu/categories/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const json = await r.json();
      if (!json.success) throw new Error(json.message);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } finally {
      setDeletingCatId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white font-bold text-xl mb-1">Menu Management</h1>
          <p className="text-white/40 text-sm">Manage your menu items and categories</p>
        </div>
        {tab === "items" && (
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm rounded-xl transition"
          >
            <Plus size={16} /> Add Item
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1 w-fit">
        {(["items", "categories"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition ${
              tab === t ? "bg-yellow-500 text-black" : "text-white/40 hover:text-white"
            }`}
          >
            {t === "items" ? "Menu Items" : "Categories"}
          </button>
        ))}
      </div>

      {/* Items Tab */}
      {tab === "items" && (
        <>
          {loadingItems ? (
            <div className="flex justify-center py-16">
              <Loader2 size={24} className="text-yellow-400 animate-spin" />
            </div>
          ) : itemsError ? (
            <div className="flex items-center gap-3 text-red-400 text-sm py-8">
              <AlertCircle size={16} />
              {itemsError}
              <button onClick={fetchItems} className="text-yellow-400 hover:text-yellow-300 transition">
                <RefreshCw size={14} />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-white/5 overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                >
                  <div className="relative h-36 bg-white/5">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/10 text-xs">
                        No image
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() => toggleAvailability(item)}
                        disabled={togglingId === item.id}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition ${
                          item.isAvailable
                            ? "bg-green-500/20 border-green-500/30 text-green-400"
                            : "bg-red-500/20 border-red-500/30 text-red-400"
                        }`}
                      >
                        {togglingId === item.id ? (
                          <Loader2 size={10} className="animate-spin" />
                        ) : item.isAvailable ? (
                          "Available"
                        ) : (
                          "Unavailable"
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="p-3 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-white text-sm font-semibold">{item.name}</p>
                        <p className="text-white/30 text-[10px]">
                          {item.category?.name ?? categories.find((c) => c.id === item.categoryId)?.name ?? ""}
                        </p>
                      </div>
                      <span className="text-yellow-400 font-bold text-sm shrink-0">
                        {fmt(item.price)}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(item)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition"
                      >
                        <Pencil size={12} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deleteId === item.id}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-red-400/70 hover:text-red-400 bg-red-500/5 hover:bg-red-500/10 rounded-lg transition disabled:opacity-50"
                      >
                        {deleteId === item.id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <Trash2 size={12} />
                        )}{" "}
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Categories Tab */}
      {tab === "categories" && (
        <div className="space-y-4">
          {/* Add category form */}
          <div
            className="rounded-2xl border border-white/5 p-4 space-y-3"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <p className="text-white/60 text-sm font-semibold">Add Category</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                placeholder="Name *"
                value={catForm.name}
                onChange={(e) => setCatForm((p) => ({ ...p, name: e.target.value }))}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-yellow-400/50"
              />
              <input
                placeholder="Description"
                value={catForm.description}
                onChange={(e) => setCatForm((p) => ({ ...p, description: e.target.value }))}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-yellow-400/50"
              />
              <input
                placeholder="Sort order"
                type="number"
                value={catForm.sortOrder}
                onChange={(e) => setCatForm((p) => ({ ...p, sortOrder: e.target.value }))}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-yellow-400/50"
              />
            </div>
            <button
              onClick={handleAddCategory}
              disabled={savingCat || !catForm.name}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm rounded-xl transition disabled:opacity-50"
            >
              {savingCat ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Add Category
            </button>
          </div>

          {/* List */}
          {loadingCats ? (
            <div className="flex justify-center py-8">
              <Loader2 size={24} className="text-yellow-400 animate-spin" />
            </div>
          ) : catsError ? (
            <div className="flex items-center gap-3 text-red-400 text-sm">
              <AlertCircle size={16} /> {catsError}
            </div>
          ) : (
            <div className="space-y-2">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-white/5"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                >
                  <div>
                    <p className="text-white text-sm font-semibold">{cat.name}</p>
                    {cat.description && (
                      <p className="text-white/30 text-xs">{cat.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-white/30 text-xs">
                      {cat._count?.menuItems ?? 0} items
                    </span>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      disabled={deletingCatId === cat.id}
                      className="text-red-400/60 hover:text-red-400 transition disabled:opacity-50"
                    >
                      {deletingCatId === cat.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setModal({ open: false, item: null })} />
          <div
            className="relative w-full max-w-lg rounded-2xl border border-white/10 p-6 space-y-4 overflow-y-auto max-h-[90vh]"
            style={{ background: "#111" }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-white font-bold text-lg">
                {modal.item ? "Edit Item" : "Add Item"}
              </h2>
              <button
                onClick={() => setModal({ open: false, item: null })}
                className="text-white/40 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <input
                placeholder="Name *"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-yellow-400/50"
              />
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-yellow-400/50 resize-none"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="Price (₦) *"
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-yellow-400/50"
                />
                <input
                  placeholder="Prep time (min)"
                  type="number"
                  value={form.preparationTime}
                  onChange={(e) => setForm((p) => ({ ...p, preparationTime: e.target.value }))}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-yellow-400/50"
                />
              </div>
              <select
                value={form.categoryId}
                onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white/60 outline-none focus:border-yellow-400/50"
              >
                <option value="" className="bg-[#1a1a1a]">Select category *</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id} className="bg-[#1a1a1a]">
                    {c.name}
                  </option>
                ))}
              </select>
              <input
                placeholder="Tags (comma separated)"
                value={form.tags}
                onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-yellow-400/50"
              />

              {/* Image */}
              <div>
                <p className="text-white/40 text-xs mb-2">Image</p>
                {imagePreview && (
                  <div className="relative w-full h-32 rounded-xl overflow-hidden mb-2">
                    <Image src={imagePreview} alt="preview" fill className="object-cover" />
                  </div>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:text-white text-xs transition"
                >
                  <Upload size={14} />
                  {imagePreview ? "Change image" : "Upload image"}
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setModal({ open: false, item: null })}
                className="flex-1 py-2.5 border border-white/10 rounded-xl text-white/60 hover:text-white text-sm transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.name || !form.price || !form.categoryId}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm rounded-xl transition disabled:opacity-50"
              >
                {uploading ? (
                  <><Loader2 size={14} className="animate-spin" /> Uploading…</>
                ) : saving ? (
                  <><Loader2 size={14} className="animate-spin" /> Saving…</>
                ) : (
                  <><CheckCircle size={14} /> Save</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
