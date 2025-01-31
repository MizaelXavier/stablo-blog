import { PortableText } from "@portabletext/react";
import YouTubeVideo from "./YouTubeVideo";
import React from "react";
import { PortableTextBlock } from "@portabletext/types";

const components = {
  types: {
    block: (props: any) => {
      const {style = 'normal'} = props.node;
      
      // Validação básica da estrutura do bloco
      if (!props.children) return null;
      
      if (/^h\d/.test(style)) {
        const level = style.replace(/[^\d]/g, '');
        return React.createElement(
          `h${level}`, 
          {className: `heading-${level} mb-4 font-bold`}, 
          props.children
        );
      }

      if (style === 'blockquote') {
        return (
          <blockquote className="border-l-4 border-gray-200 pl-4 my-4">
            {props.children}
          </blockquote>
        );
      }

      return <p className="mb-4">{props.children}</p>;
    },
    youtube: ({value}: any) => {
      if (!value?.url) return null;
      return (
        <div className="relative aspect-video my-8">
          <YouTubeVideo url={value.url} />
        </div>
      );
    }
  },
  marks: {
    strong: ({children}: any) => <strong className="font-bold">{children}</strong>,
    em: ({children}: any) => <em className="italic">{children}</em>,
    code: ({children}: any) => (
      <code className="bg-gray-100 dark:bg-gray-800 rounded px-1">{children}</code>
    ),
    link: ({value, children}: any) => {
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
  }
};

interface PostBodyProps {
  content: PortableTextBlock[] | null;
}

export default function PostBody({content}: PostBodyProps) {
  if (!content) return null;

  return (
    <div className="max-w-3xl mx-auto prose prose-lg dark:prose-invert">
      <PortableText 
        value={content} 
        components={components}
        onMissingComponent={(message: string) => {
          console.warn('Missing component:', message);
          return null;
        }}
      />
    </div>
  );
} 