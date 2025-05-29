import React, { useState, useEffect } from 'react';

const ShareAudio = ({ stream }) => {
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    if (stream) {
      stream.getAudioTracks().forEach(t => (t.enabled = false));
    }
  }, [stream]);

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
      {muted ? 'Unmute Audio' : 'Mute Audio'}
    </button>
  );
};

export default ShareAudio;