import { createClient } from "next-sanity";
import { groq } from "next-sanity";
import { config } from "./config";

export const client = createClient(config);

// Funções de busca
export async function getAllPosts() {
  return await client.fetch(
    groq`*[_type == "post"] | order(publishedAt desc, _createdAt desc) {
      _id,
      _createdAt,
      title,
      publishedAt,
      excerpt,
      featured,
      body,
      "slug": slug.current,
      "mainImage": mainImage {
        ...,
        "blurDataURL": asset->metadata.lqip,
        "ImageColor": asset->metadata.palette.dominant.background,
        asset->
      },
      "author": author->{
        _id,
        name,
        "slug": slug.current,
        "image": image.asset->url,
        bio,
        occupation
      },
      "categories": categories[]->{
        _id,
        title,
        "slug": slug.current,
        color
      },
      "estReadingTime": round(length(pt::text(body)) / 5 / 180)
    }`
  );
}

export async function getSettings() {
  return await client.fetch(
    groq`*[_type == "settings"][0] {
      ...,
      "logo": logo.asset->url,
      "ogImage": ogImage.asset->url
    }`
  );
}

export async function getAuthorBySlug(slug) {
  return await client.fetch(
    groq`*[_type == "author" && slug.current == $slug][0] {
      _id,
      name,
      "slug": slug.current,
      "image": image.asset->,
      bio,
      occupation,
      "social": {
        "twitter": social.twitter,
        "linkedin": social.linkedin,
        "github": social.github
      }
    }`,
    { slug }
  );
}

export async function getPostsByAuthor(authorSlug) {
  return await client.fetch(
    groq`*[_type == "post" && references(*[_type == "author" && slug.current == $authorSlug]._id)] | order(publishedAt desc) {
      _id,
      _createdAt,
      title,
      publishedAt,
      excerpt,
      featured,
      body,
      "slug": slug.current,
      "mainImage": mainImage {
        ...,
        "blurDataURL": asset->metadata.lqip,
        "ImageColor": asset->metadata.palette.dominant.background,
        asset->
      },
      "author": author->{
        _id,
        name,
        "slug": slug.current,
        "image": image.asset->url,
        bio,
        occupation
      },
      "categories": categories[]->{
        _id,
        title,
        "slug": slug.current,
        color
      },
      "estReadingTime": round(length(pt::text(body)) / 5 / 180)
    }`,
    { authorSlug }
  );
}

export async function getAllPostsSlugs() {
  const slugs = await client.fetch(
    groq`*[_type == "post"] {
      "slug": slug.current
    }`
  );
  return slugs;
}

export async function getPostBySlug(slug) {
  return await client.fetch(
    groq`*[_type == "post" && slug.current == $slug][0] {
      _id,
      _createdAt,
      title,
      publishedAt,
      excerpt,
      body,
      "slug": slug.current,
      "mainImage": mainImage {
        ...,
        "blurDataURL": asset->metadata.lqip,
        "ImageColor": asset->metadata.palette.dominant.background,
        asset->
      },
      "author": author->{
        _id,
        name,
        "slug": slug.current,
        "image": image.asset->,
        bio,
        occupation
      },
      "categories": categories[]->{
        _id,
        title,
        "slug": slug.current,
        color
      },
      "estReadingTime": round(length(pt::text(body)) / 5 / 180)
    }`,
    { slug }
  );
} 