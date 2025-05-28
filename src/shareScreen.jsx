import React from 'react';

const ShareScreen = ({ onClick, sharing }) => (
  <button
    onClick={onClick}
    className="m-3 px-6 py-3 rounded-lg bg-white text-black font-bold
               transition hover:-translate-y-1 hover:scale-105"
  >
    {sharing ? 'Sharing…' : 'Share Screen'}
  </button>
);

export default ShareScreen;
