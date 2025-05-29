import React from 'react';

const Video = () => {
  return (
    <div
      className="relative top-8 border-8 border-white aspect-video
                 w-full max-w-3xl rounded-4xl bg-black overflow-hidden"
    >
      <iframe className='h-full w-full' src="https://embed.figma.com/design/DAKzGzwuPzkKdc0j38RngD/Untitled?node-id=0-1&embed-host=share" allowfullscreen></iframe>
    </div>
  );
};

export default Video;