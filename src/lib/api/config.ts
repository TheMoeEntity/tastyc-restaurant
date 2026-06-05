export interface RestaurantConfig {
  name: string;
  tagline: string | null;
  logo: string | null;
  coverImage: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  acceptingOrders: boolean;
  acceptingReservations: boolean;
  deliveryEnabled: boolean;
  pickupEnabled: boolean;
  dineInEnabled: boolean;
  deliveryFee: number;
}

export const DEFAULT_CONFIG: RestaurantConfig = {
  name: "Tastyc Restaurant",
  tagline: "Where every bite tells a story",
  logo: null,
  coverImage: null,
  address: null,
  phone: null,
  email: null,
  acceptingOrders: true,
  acceptingReservations: true,
  deliveryEnabled: true,
  pickupEnabled: true,
  dineInEnabled: true,
  deliveryFee: 1000,
};

export async function getRestaurantConfig(): Promise<RestaurantConfig> {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  try {
    const res = await fetch(`${BASE_URL}/api/config`, {
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    return data.success
      ? { ...DEFAULT_CONFIG, ...data.data.config }
      : DEFAULT_CONFIG;
  } catch {
    return DEFAULT_CONFIG;
  }
}
