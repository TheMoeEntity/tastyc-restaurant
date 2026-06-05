export interface AnalyticsOverview {
  today: { revenue: number; orders: number };
  thisMonth: {
    revenue: number;
    orders: number;
    newCustomers: number;
    averageOrderValue: number;
  };
  changes: { revenue: number; orders: number };
  totals: { customers: number; pendingOrders: number };
}

export interface SalesTrendPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface OrderByType {
  type: string;
  count: number;
}

export interface BestSeller {
  menuItem: { name: string; image?: string };
  totalQuantitySold: number;
  totalOrders: number;
}

export interface TopRated {
  menuItem: { name: string };
  averageRating: number;
  totalReviews: number;
}

export interface TopCustomer {
  name: string;
  email: string;
  totalOrders: number;
  loyaltyPoints: number;
}

export interface AnalyticsRecentOrder {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  user: { name: string };
  items: { quantity: number; menuItem: { name: string } }[];
  payment: { status: string };
}

export interface AnalyticsRecentReservation {
  id: string;
  date: string;
  time: string;
  partySize: number;
  status: string;
  user: { name: string };
}

export interface Analytics {
  overview: AnalyticsOverview;
  salesTrend: { trend: SalesTrendPoint[]; ordersByType: OrderByType[] };
  menuPerformance: { bestSellers: BestSeller[]; topRated: TopRated[] };
  customerInsights: {
    topCustomers: TopCustomer[];
    activeCustomersThisMonth: number;
  };
  reservationInsights: {
    thisMonth: {
      total: number;
      noShowRate: number;
      byStatus: { status: string; count: number }[];
    };
    todayReservations: AnalyticsRecentReservation[];
  };
  recentActivity: {
    recentOrders: AnalyticsRecentOrder[];
    recentReservations: AnalyticsRecentReservation[];
  };
}
