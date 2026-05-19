// API-aligned menu types
// These match exactly what the Express backend returns

export interface MenuVariant {
  id: string;
  name: string;
  priceDelta: number;
  isAvailable: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
  _count?: { menuItems: number };
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  isAvailable: boolean;
  isFeatured: boolean;
  preparationTime?: number;
  calories?: number;
  tags: string[];
  sortOrder: number;
  categoryId: string;
  category?: { id: string; name: string };
  variants?: MenuVariant[];
  _count?: { reviews: number };
  createdAt: string;
  updatedAt: string;
}

export interface MenuPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

export interface GetMenuItemsResponse {
  success: boolean;
  data: {
    items: MenuItem[];
    pagination: MenuPagination;
  };
}

export interface GetCategoriesResponse {
  success: boolean;
  data: {
    categories: MenuCategory[];
  };
}

export interface GetFeaturedResponse {
  success: boolean;
  data: {
    items: MenuItem[];
  };
}

export interface GetMenuItemResponse {
  success: boolean;
  data: {
    item: MenuItem;
  };
}
