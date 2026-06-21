const BEEHIIV_API_KEY = process.env.BEEHIIV_API_KEY;
const BEEHIIV_PUBLICATION_ID = process.env.BEEHIIV_PUBLICATION_ID;
const BASE_URL = "https://api.beehiiv.com/v2";

async function beehiivFetch(endpoint, params = {}) {
  const url = new URL(`${BASE_URL}/publications/${BEEHIIV_PUBLICATION_ID}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(v => url.searchParams.append(`${key}[]`, v));
      } else {
        url.searchParams.set(key, value);
      }
    }
  });

  const res = await fetch(url.toString(), {
    headers: {
      "Authorization": `Bearer ${BEEHIIV_API_KEY}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    console.error(`Beehiiv API error: ${res.status}`);
    return null;
  }

  return res.json();
}

export async function getPosts({ page = 1, limit = 20 } = {}) {
  const data = await beehiivFetch("/posts", {
    status: "confirmed",
    direction: "desc",
    order_by: "publish_date",
    page,
    limit,
    expand: ["free_web_content"],
    platform: "all",
  });

  if (!data) return { posts: [], totalPages: 0, totalResults: 0 };

  return {
    posts: data.data || [],
    totalPages: data.total_pages || 0,
    totalResults: data.total_results || 0,
  };
}

export async function getPostBySlug(slug) {
  const data = await beehiivFetch("/posts", {
    status: "confirmed",
    "slugs[]": slug,
    expand: ["free_web_content"],
    limit: 1,
  });

  if (!data || !data.data || data.data.length === 0) return null;
  return data.data[0];
}

export async function getAllPostSlugs() {
  const allSlugs = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const data = await beehiivFetch("/posts", {
      status: "confirmed",
      direction: "desc",
      order_by: "publish_date",
      page,
      limit: 100,
    });

    if (!data || !data.data) break;

    data.data.forEach(post => {
      if (post.slug) allSlugs.push(post.slug);
    });

    totalPages = data.total_pages || 1;
    page++;
  }

  return allSlugs;
}
