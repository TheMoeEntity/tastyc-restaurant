export interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  isApproved: boolean;
  user: { id: string; name: string; avatar?: string };
  menuItem: { id: string; name: string; image?: string };
}

export interface MenuItemReview {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  user: { id: string; name: string; avatar?: string };
}

export interface ReviewAggregates {
  averageRating: number;
  totalReviews: number;
  distribution: Record<number, number>;
}
