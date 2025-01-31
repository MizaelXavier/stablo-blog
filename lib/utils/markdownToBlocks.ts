import { PortableTextBlock } from "@portabletext/types";

interface MarkdownToBlocksOptions {
  mainImage?: string;
  youtubeUrl?: string;
}

export function markdownToBlocks(markdown: string, options?: MarkdownToBlocksOptions): { body: PortableTextBlock[]; mainImage?: any } {
  const blocks: PortableTextBlock[] = [{
    _type: 'block',
    style: 'normal',
    children: [{
      _type: 'span',
      text: markdown
    }]
  }];

  const result: { body: PortableTextBlock[]; mainImage?: any } = {
    body: blocks
  };

  if (options?.mainImage) {
    result.mainImage = {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: options.mainImage
      }
    };
  }

  if (options?.youtubeUrl) {
    blocks.push({
      _type: 'youtube',
      url: options.youtubeUrl
    } as PortableTextBlock);
  }

  return result;
} 