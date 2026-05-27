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
  const isStandalone = (navigator as any).standalone === true;
  return isIos && !isStandalone;
}