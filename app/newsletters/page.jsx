import { getPosts } from "@/lib/beehiiv";
import NewsletterArchive from "./NewsletterArchive";

export const metadata = {
  title: "Newsletter Archive | Freenachos Poker",
  description:
    "Read past editions of the Nachos Exploits Newsletter. Strategy breakdowns, population exploits, and data-driven insights to crush online poker.",
  openGraph: {
    title: "Newsletter Archive | Freenachos Poker",
    description:
      "Strategy breakdowns, population exploits, and data-driven insights from Patrick 'Freenachos' Gerritsen.",
    type: "website",
    url: "https://freenachos.poker/newsletters",
  },
  alternates: {
    canonical: "https://freenachos.poker/newsletters",
  },
};

export default async function NewslettersPage({ searchParams }) {
  const page = Number(searchParams?.page) || 1;
  const { posts, totalPages, totalResults } = await getPosts({ page, limit: 12 });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Nachos Exploits Newsletter Archive",
    description: metadata.description,
    url: "https://freenachos.poker/newsletters",
    publisher: {
      "@type": "Person",
      name: "Patrick Gerritsen",
      alternateName: "Freenachos",
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: totalResults,
      itemListElement: posts.map((post, i) => ({
        "@type": "ListItem",
        position: (page - 1) * 12 + i + 1,
        url: `https://freenachos.poker/newsletters/${post.slug}`,
        name: post.title,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NewsletterArchive
        posts={posts}
        currentPage={page}
        totalPages={totalPages}
        totalResults={totalResults}
      />
    </>
  );
}
