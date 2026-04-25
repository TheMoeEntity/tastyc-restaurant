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
