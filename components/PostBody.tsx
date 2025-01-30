import { PortableText } from "@portabletext/react";
import YouTubeVideo from "./YouTubeVideo";
import React from "react";

const components = {
  types: {
    block: (props: any) => {
      const {style = 'normal'} = props.node;
      if (/^h\d/.test(style)) {
        const level = style.replace(/[^\d]/g, '');
        return React.createElement(`h${level}`, {className: style}, props.children);
      }
      return style === 'blockquote' 
        ? <blockquote>{props.children}</blockquote>
        : <p className={style}>{props.children}</p>;
    },
    youtube: ({value}: any) => {
      if (!value?.url) return null;
      return (
        <div className="relative aspect-video my-8">
          <YouTubeVideo url={value.url} />
        </div>
      );
    }
  }
};

export default function PostBody({content}: {content: any}) {
  return (
    <div className="max-w-3xl mx-auto prose prose-lg dark:prose-invert">
      <PortableText value={content} components={components} />
    </div>
  );
} 