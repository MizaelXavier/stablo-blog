import createImageUrlBuilder from "@sanity/image-url";
import { dataset, projectId } from "@/lib/sanity/config";

const imageBuilder = createImageUrlBuilder({ projectId, dataset });

export const urlForImage = source => {
  if (!source || !source.asset) return null;
  
  try {
    const imageUrl = imageBuilder.image(source).auto('format').fit('max');
    
    return {
      src: imageUrl.url(),
      width: source?.asset?.metadata?.dimensions?.width || 800,
      height: source?.asset?.metadata?.dimensions?.height || 600,
      blurDataURL: source?.asset?.metadata?.lqip,
      alt: source?.alt || ''
    };
  } catch (error) {
    console.error('Error generating image URL:', error);
    return null;
  }
};
