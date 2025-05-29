import React, { useEffect, useRef } from 'react';

const Video = ({ stream }) => {
  const vid = useRef(null);

  useEffect(() => {
    if (vid.current && stream) {
      vid.current.srcObject = stream;
    } else if (vid.current) {
      vid.current.srcObject = null;
    }
  }, [stream]);

  return (
    <video
      ref={vid}
      muted
      autoPlay
      playsInline
      className="relative top-8 border-8 border-white aspect-video
                 w-full max-w-3xl rounded-4xl bg-black"
    />
  );
};

export default Video;