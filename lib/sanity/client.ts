import { apiVersion, dataset, projectId, useCdn } from "./config";
import {
  postquery,
  limitquery,
  paginatedquery,
  configQuery,
  singlequery,
  pathquery,
  allauthorsquery,
  authorsquery,
  postsbyauthorquery,
  postsbycatquery,
  catpathquery,
  catquery,
  getAll,
  searchquery
} from "./groq";
import { createClient } from "next-sanity";

if (!projectId) {
  console.error(
    "The Sanity Project ID is not set. Check your environment variables."
  );
}

/**
 * Checks if it's safe to create a client instance, as `@sanity/client` will throw an error if `projectId` is false
 */
const sanityClient = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn,
      token: process.env.SANITY_API_READ_TOKEN
    })
  : null;

export const fetcher = async ([query, params]) => {
  return sanityClient ? sanityClient.fetch(query, params) : [];
};

(async () => {
  if (sanityClient) {
    const data = await sanityClient.fetch(getAll);
    if (!data || !data.length) {
      console.error(
        "Sanity returns empty array. Are you sure the dataset is public?"
      );
    }
  }
})();

export async function getAllPosts() {
  if (sanityClient) {
    return (await sanityClient.fetch(postquery)) || [];
  }
  return [];
}

export async function getSettings() {
  if (sanityClient) {
    return (await sanityClient.fetch(configQuery)) || [];
  }
  return [];
}

export async function getPostBySlug(slug: string) {
  if (!sanityClient) return null;
  const query = `*[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    excerpt,
    body,
    mainImage,
    publishedAt,
    "author": author->{
      _id,
      name,
      slug,
      image,
      bio
    },
    "categories": categories[]->{
      _id,
      title,
      slug
    }
  }`;
  const post = await sanityClient.fetch(query, { slug });
  return post;
}

export async function getAllPostsSlugs() {
  if (!sanityClient) return [];
  const query = `*[_type == "post"]{ "slug": slug.current }`;
  const slugs = await sanityClient.fetch(query);
  return slugs;
}

// Author
export async function getAllAuthorsSlugs() {
  if (sanityClient) {
    const slugs = (await sanityClient.fetch(authorsquery)) || [];
    return slugs.map(slug => ({ author: slug }));
  }
  return [];
}

export async function getAuthorPostsBySlug(slug) {
  if (sanityClient) {
    return (await sanityClient.fetch(postsbyauthorquery, { slug })) || {};
  }
  return {};
}

export async function getAllAuthors() {
  if (sanityClient) {
    return (await sanityClient.fetch(allauthorsquery)) || [];
  }
  return [];
}

// Category

export async function getAllCategories() {
  if (sanityClient) {
    const slugs = (await sanityClient.fetch(catpathquery)) || [];
    return slugs.map(slug => ({ category: slug }));
  }
  return [];
}

export async function getPostsByCategory(slug) {
  if (sanityClient) {
    return (await sanityClient.fetch(postsbycatquery, { slug })) || {};
  }
  return {};
}

export async function getTopCategories() {
  if (sanityClient) {
    return (await sanityClient.fetch(catquery)) || [];
  }
  return [];
}

export async function getPaginatedPosts({ limit, pageIndex = 0 }) {
  if (sanityClient) {
    return (
      (await sanityClient.fetch(paginatedquery, {
        pageIndex: pageIndex,
        limit: limit
      })) || []
    );
  }
  return [];
}
