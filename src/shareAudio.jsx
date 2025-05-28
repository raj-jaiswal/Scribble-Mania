import React, { useState } from 'react';

const ShareAudio = ({ stream }) => {
  const [muted, setMuted] = useState(false);

  const toggle = () => {
    stream?.getAudioTracks().forEach(t => (t.enabled = !t.enabled));
    setMuted(v => !v);
  };

  return (
    <button
      onClick={toggle}
      className="m-3 px-6 py-3 rounded-lg bg-white text-black font-bold
                 transition hover:-translate-y-1 hover:scale-105"
    >
      {muted ? 'Un-mute' : 'Mute'}
    </button>
  );
};

export default ShareAudio;
