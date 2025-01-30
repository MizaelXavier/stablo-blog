export const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-02-27", // use a data atual
  useCdn: true,
  token: process.env.SANITY_API_READ_TOKEN,
  ignoreBrowserTokenWarning: true,
  perspective: "published"
} 