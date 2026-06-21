import { getAllPostSlugs } from "@/lib/beehiiv";

export default async function sitemap() {
  const slugs = await getAllPostSlugs();

  const newsletterPages = slugs.map((slug) => ({
    url: `https://freenachos.poker/newsletters/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const staticPages = [
    { url: "https://freenachos.poker", lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: "https://freenachos.poker/coaching", lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: "https://freenachos.poker/newsletters", lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: "https://freenachos.poker/newsletter", lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: "https://freenachos.poker/variance", lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: "https://freenachos.poker/winrate", lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: "https://freenachos.poker/seat", lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: "https://freenachos.poker/profits", lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  return [...staticPages, ...newsletterPages];
}
