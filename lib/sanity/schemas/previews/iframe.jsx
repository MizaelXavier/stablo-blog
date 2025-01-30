import React from "react";
import Iframe from "react-iframe";

const IframePreview = ({ url, height }) => {
  if (!url) {
    return <p>Missing Embed URL</p>;
  }

  const { id, service } = getVideoId(url);
  const isVimeoVideo = id && service === "vimeo";
  const finalURL = isVimeoVideo
    ? `https://player.vimeo.com/video/${id}`
    : url;

  return (
    <Iframe
      url={finalURL}
      width="100%"
      height={height || "350"}
      styles={{
        ...(!height && { aspectRatio: "16 / 9" })
      }}
      display="block"
      position="relative"
      frameBorder="0"
      allowfullscreen
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture"
    />
  );
};

export default IframePreview;
