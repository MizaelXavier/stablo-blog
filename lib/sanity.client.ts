import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-02-27",
  useCdn: true,
  token: process.env.SANITY_API_WRITE_TOKEN,
  perspective: "published",
  resultSourceMap: false,
  withCredentials: false,
  stega: false
});

// Cliente para uso no frontend (sem token)
export const clientConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-02-27",
  useCdn: true,
  perspective: "published"
}; 