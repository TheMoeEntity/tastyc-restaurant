import apiFetch from "@/lib/api";
import {
  MenuCategory,
  MenuItem,
  GetMenuItemsResponse,
  GetCategoriesResponse,
  GetFeaturedResponse,
  GetMenuItemResponse,
} from "@/types/menu.types";

export async function getMenuItems(params?: {
  categoryId?: string;
  search?: string;
  isAvailable?: boolean;
  page?: number;
  limit?: number;
}): Promise<GetMenuItemsResponse> {
  const query = new URLSearchParams();
  if (params?.categoryId) query.set("categoryId", params.categoryId);
  if (params?.search) query.set("search", params.search);
  if (params?.isAvailable !== undefined)
    query.set("isAvailable", String(params.isAvailable));
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));

  const qs = query.toString();
  return apiFetch(`/api/menu${qs ? `?${qs}` : ""}`);
}

export async function getCategories(): Promise<{
  success: boolean;
  data: { categories: MenuCategory[] };
}> {
  return apiFetch("/api/menu/categories");
}

export async function getFeaturedItems(): Promise<{
  success: boolean;
  data: { items: MenuItem[] };
}> {
  return apiFetch("/api/menu/featured");
}

export async function getMenuItemById(id: string): Promise<{
  success: boolean;
  data: { item: MenuItem };
}> {
  return apiFetch(`/api/menu/${id}`);
}
