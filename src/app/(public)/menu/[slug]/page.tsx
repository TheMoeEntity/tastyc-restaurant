import MenuItemClient from "./MenuItemClient";


export default async function MenuItemPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    return <MenuItemClient slug={slug} />;
}