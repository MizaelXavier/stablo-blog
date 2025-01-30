import React from 'react';
import ReactPlayer from 'react-player/youtube';

interface YouTubeVideoProps {
  url: string;
}

export default function YouTubeVideo({ url }: YouTubeVideoProps) {
  if (!url) return null;

  return (
    <div className="relative aspect-video">
      <ReactPlayer
        url={url}
        width="100%"
        height="100%"
        className="absolute top-0 left-0"
        controls
      />
    </div>
  );
} 