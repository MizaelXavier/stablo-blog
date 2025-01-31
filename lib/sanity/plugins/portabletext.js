import Image from "next/image";
import Link from "next/link";
import { PortableText as PortableTextComponent } from "@portabletext/react";
import { urlForImage } from "@/lib/sanity/image";
import Iframe from "react-iframe";
import getVideoId from "get-video-id";
import { cx } from "@/utils/all";
import YouTubeVideo from "@/components/YouTubeVideo";

import Refractor from "react-refractor";
import js from "refractor/lang/javascript";
import jsx from "refractor/lang/jsx";
import html from "refractor/lang/markup";
import css from "refractor/lang/css";
import bash from "refractor/lang/bash";

Refractor.registerLanguage(js);
Refractor.registerLanguage(jsx);
Refractor.registerLanguage(html);
Refractor.registerLanguage(css);
Refractor.registerLanguage(bash);

const components = {
  block: {
    normal: ({children}) => <p className="mb-4">{children}</p>,
    h1: ({children}) => <h1 className="text-4xl font-bold mb-4">{children}</h1>,
    h2: ({children}) => <h2 className="text-3xl font-bold mb-4">{children}</h2>,
    h3: ({children}) => <h3 className="text-2xl font-bold mb-4">{children}</h3>,
    h4: ({children}) => <h4 className="text-xl font-bold mb-4">{children}</h4>,
    blockquote: ({children}) => <blockquote className="border-l-4 border-gray-200 pl-4 my-4">{children}</blockquote>,
  },
  types: {
    image: ({value}) => {
      if (!value?.asset?._ref) {
        return null;
      }
      return (
        <div className="my-8">
          <Image
            src={urlForImage(value)}
            alt={value.alt || "Image"}
            loading="lazy"
            className="object-cover rounded-lg"
            sizes="(max-width: 800px) 100vw, 800px"
          />
        </div>
      );
    },
    code: ({value}) => {
      if (!value?.code) {
        return null;
      }
      return (
        <Refractor
          language={value.language || "bash"}
          value={value.code}
          markers={value.highlightedLines}
        />
      );
    },
    youtube: ({value}) => {
      if (!value?.url) {
        return null;
      }
      return (
        <div className="relative aspect-video my-8">
          <YouTubeVideo url={value.url} />
        </div>
      );
    }
  },
  marks: {
    strong: ({children}) => <strong className="font-bold">{children}</strong>,
    em: ({children}) => <em className="italic">{children}</em>,
    code: ({children}) => (
      <code className="bg-gray-100 dark:bg-gray-800 rounded px-1">{children}</code>
    ),
    link: ({value, children}) => {
      const target = (value?.href || '').startsWith('http') ? '_blank' : undefined;
      return (
        <a 
          href={value?.href} 
          target={target} 
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
          className="text-blue-600 hover:underline"
        >
          {children}
        </a>
      );
    }
  },
  list: {
    bullet: ({children}) => <ul className="list-disc ml-4 mb-4">{children}</ul>,
    number: ({children}) => <ol className="list-decimal ml-4 mb-4">{children}</ol>,
  },
  listItem: {
    bullet: ({children}) => <li>{children}</li>,
    number: ({children}) => <li>{children}</li>,
  }
};

export const PortableText = ({value, ...props}) => {
  if (!value) {
    return null;
  }

  // Garantir que cada bloco tenha markDefs
  const blocksWithMarkDefs = Array.isArray(value) ? value.map(block => {
    if (block._type === 'block' && !block.markDefs) {
      return {
        ...block,
        markDefs: []
      };
    }
    return block;
  }) : value;

  return (
    <PortableTextComponent
      value={blocksWithMarkDefs}
      components={components}
      onMissingComponent={(message) => {
        console.warn('Missing component:', message);
        return null;
      }}
      {...props}
    />
  );
};
