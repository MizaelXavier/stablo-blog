import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-02-27",
  useCdn: false, // desabilitado para sempre pegar dados frescos
  token: process.env.SANITY_API_WRITE_TOKEN, // token com permissão de escrita
  perspective: "published"
});

// Cliente para uso no frontend (sem token)
export const clientConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-02-27",
  useCdn: true
}; 