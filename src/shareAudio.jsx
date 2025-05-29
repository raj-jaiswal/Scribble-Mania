// ShareAudio.jsx
import React, { useEffect, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";

const APP_ID      = import.meta.env.VITE_AGORA_APP_ID;
const CHANNEL     = import.meta.env.VITE_AGORA_CHANNEL;
const TOKEN       = import.meta.env.VITE_AGORA_TOKEN || null; // dev: null

let client;           // single client instance per tab
let localTrack = null;

const ShareAudio = ({ isAdmin }) => {
  const [joined, setJoined] = useState(false);

  // create the client once
  useEffect(() => {
    client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
    return () => { client && client.leave(); };
  }, []);

  const startPublishing = async () => {
    await client.join(APP_ID, CHANNEL, TOKEN, null);      // uid null = let Agora pick
    await client.setClientRole("host");                   // host == publisher
    localTrack = await AgoraRTC.createMicrophoneAudioTrack();
    await client.publish([localTrack]);                   // can publish multiple admins :contentReference[oaicite:0]{index=0}
    setJoined(true);
  };

  const stopPublishing = async () => {
    if (localTrack) {
      await client.unpublish([localTrack]);
      localTrack.stop();
      localTrack.close();
      localTrack = null;
    }
    await client.leave();
    setJoined(false);
  };

  if (!isAdmin) return null;            // button visible only for admins

  return (
    <button
      onClick={joined ? stopPublishing : startPublishing}
      className="m-3 px-6 py-3 rounded-lg bg-white font-bold transition text-black
                 hover:-translate-y-1 hover:scale-105"
    >
      {joined ? "Stop Sharing Audio" : "Share Mic Audio"}
    </button>
  );
};

export default ShareAudio;
