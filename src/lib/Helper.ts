export class Helper {
  static getCategoryLink(categorySlug: string): string {
    switch (categorySlug) {
      case "recipes":
        return "/blog/recipes";
      case "chef-corner":
        return "/blog/chef-corner";
      case "events":
        return "/blog/events";
      default:
        return `/blog/category/${categorySlug}`;
    }
  }
}

export const getRoleDefaultPath = (role: string) => {
  if (role === "KITCHEN") return "/dashboard/kitchen";
  if (role === "CUSTOMER") return "/dashboard/user";
  if (role === "STAFF") return "/dashboard/admin/orders";
  return "/dashboard/admin";
};

export function isIosSafari(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const isIos = /iphone|ipad|ipod/i.test(ua);
  const isStandalone = (navigator as { standalone?: boolean }).standalone === true;
  return isIos && !isStandalone;
}

export const fmt = (n: number) => `₦${Math.round(n).toLocaleString("en-NG")}`;

export function getCookieToken(): string {
  if (typeof document === "undefined") return "";
  return (
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("tastyc_access_token="))
      ?.split("=")[1] ?? ""
  );
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short" });
}

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function getMonthDays(year: number, month: number): Date[] {
  const days: Date[] = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

export function playNotification(): void {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch {
    // Web Audio API may not be available
  }
}