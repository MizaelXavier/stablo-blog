import React from 'react';

export default function YouTubeVideo({ url }) {
  if (!url) return null;

  // Função para extrair o ID do vídeo de diferentes formatos de URL do YouTube
  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeId(url);
  if (!videoId) return null;

  return (
    <div className="relative aspect-video">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        className="absolute top-0 left-0 w-full h-full"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
} 