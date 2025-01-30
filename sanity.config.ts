import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";
import settings from "./lib/sanity/schemas/settings";
import {
  pageStructure,
  singletonPlugin
} from "./lib/sanity/plugins/settings";
import { unsplashImageAsset } from "sanity-plugin-asset-source-unsplash";
import { table } from "@sanity/table";
import { codeInput } from "@sanity/code-input";
import { youtubeInput } from "sanity-plugin-youtube-input";
import { PreviewPane } from "./components/PreviewPane";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'scq7np6b';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

export const PREVIEWABLE_DOCUMENT_TYPES: string[] = ["post"];
console.log(projectId);

export default defineConfig({
  name: "default",
  title: "Closer Brasil",
  projectId: 'scq7np6b',
  dataset: 'production',
  basePath: "/studio",

  plugins: [
    deskTool({
      structure: pageStructure([settings]),
      defaultDocumentNode: PreviewPane
    }),
    singletonPlugin(['settings']),
    visionTool(),
    unsplashImageAsset(),
    table(),
    codeInput(),
    youtubeInput({
      apiKey: process.env.SANITY_STUDIO_YOUTUBE_API_KEY || ''
    })
  ],

  schema: {
    types: schemaTypes
  }
});
