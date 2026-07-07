"use client";

import { forwardRef } from "react";

type StoryVideoProps = {
  src: string;
  poster: string;
};

const StoryVideo = forwardRef<HTMLVideoElement, StoryVideoProps>(
  function StoryVideo({ src, poster }, ref) {
    return (
      <video
        ref={ref}
        className="story-video absolute inset-0 h-full w-full object-cover opacity-0"
        src={src}
        poster={poster}
        muted
        playsInline
        preload="none"
        disablePictureInPicture
        aria-hidden
        tabIndex={-1}
      />
    );
  }
);

export default StoryVideo;
