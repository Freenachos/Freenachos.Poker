import { getPostBySlug, getAllPostSlugs } from "@/lib/beehiiv";
import { notFound } from "next/navigation";
import NewsletterPost from "./NewsletterPost";

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: "Post Not Found" };

  const description =
    post.subtitle ||
    (post.content?.free?.web?.replace(/<[^>]*>/g, "").slice(0, 155) + "...") ||
    "Read this edition of the Nachos Exploits Newsletter.";

  return {
    title: `${post.title} | Freenachos Poker Newsletter`,
    description,
    openGraph: {
      title: post.title,
      description,
      type: "article",
      url: `https://freenachos.poker/newsletters/${post.slug}`,
      images: post.thumbnail_url ? [{ url: post.thumbnail_url }] : [],
      publishedTime: post.publish_date
        ? new Date(post.publish_date * 1000).toISOString()
        : undefined,
      authors: ["Patrick Gerritsen"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: post.thumbnail_url ? [post.thumbnail_url] : [],
    },
    alternates: {
      canonical: `https://freenachos.poker/newsletters/${post.slug}`,
    },
  };
}

export default async function NewsletterPostPage({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const publishDate = post.publish_date
    ? new Date(post.publish_date * 1000).toISOString()
    : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.subtitle || "",
    url: `https://freenachos.poker/newsletters/${post.slug}`,
    datePublished: publishDate,
    author: {
      "@type": "Person",
      name: "Patrick Gerritsen",
      alternateName: "Freenachos",
      url: "https://freenachos.poker",
    },
    publisher: {
      "@type": "Organization",
      name: "Freenachos Poker",
      url: "https://freenachos.poker",
    },
    image: post.thumbnail_url || undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://freenachos.poker/newsletters/${post.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NewsletterPost post={post} />
    </>
  );
}
