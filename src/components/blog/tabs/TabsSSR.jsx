import TabsCSR from "./TabsCSR";

const API = process.env.API_BLOG_BASE_URL || 'https://datacenter.randomstrangerchats.com';
const WEBSITE = process.env.WEBSITE_ID || '8';

export default async function TabsSSR({ slug, pathname }) {
  let tabs = [];

  try {
    const res = await fetch(
      `${API}/api/get-post-navigation-tabs?slug=${slug}&website=${WEBSITE}`,
      { cache: "no-store" }
    );

    const data = await res.json();

    if (data.statusCode === 200 && data.tabs) {
      tabs = data.tabs
        .map((tab, index) => ({
          id: index,
          label: tab.tab_name,
          url: tab.tab_url,
          relativePath: getRelativePath(tab.tab_url),
          order: tab.tab_order,
        }))
        .sort((a, b) => a.order - b.order);
    }
  } catch (e) {
    console.error("SSR Tabs Error:", e);
  }

  return (
    <TabsCSR tabs={tabs} pathname={pathname} />
  );
}

function getRelativePath(url) {
  if (!url) return "";
  try {
    if (url.startsWith("/")) return url;
    if (url.startsWith("http")) return new URL(url).pathname;
    return url;
  } catch {
    return url;
  }
}
