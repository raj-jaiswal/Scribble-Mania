// useScreenBroadcast.js
import { useEffect, useRef, useState } from 'react';
import { ref, onValue, set, push, remove, update } from 'firebase/database';
import { realtimeDb } from './firebase';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
  ],
};

export function useScreenBroadcast({ roomId, isAdmin }) {
  const [remoteStream, setRemoteStream] = useState(null);
  const peerConnections = useRef({});
  const localStream = useRef(null);

  useEffect(() => {
    const roomRef = ref(realtimeDb, `rooms/${roomId}`);

    if (!isAdmin) {
      const clientId = crypto.randomUUID();
      const signalsRef = ref(realtimeDb, `rooms/${roomId}/signals/${clientId}`);

      // Request an offer from admin
      set(signalsRef, { type: 'request-offer' });

      // Listen for signaling responses from admin
      onValue(signalsRef, async (snapshot) => {
        const data = snapshot.val();
        if (!data || !data.offer) return;

        let pc = peerConnections.current[clientId];
        if (!pc) {
          pc = new RTCPeerConnection(ICE_SERVERS);
          peerConnections.current[clientId] = pc;

          pc.ontrack = (event) => {
            setRemoteStream(event.streams[0]);
          };

          pc.onicecandidate = (event) => {
            if (event.candidate) {
              update(signalsRef, {
                candidate: event.candidate.toJSON(),
              });
            }
          };
        }

        if (!pc.currentRemoteDescription) {
          await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          update(signalsRef, { answer });
        }

        if (data.candidate) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
          } catch (e) {
            console.error("Error adding ICE candidate (viewer):", e);
          }
        }
      });
    }
  }, [roomId, isAdmin]);

  const startBroadcast = async () => {
    if (!isAdmin) return;

    localStream.current = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });

    setRemoteStream(localStream.current); // Show stream to admin too

    const signalsRef = ref(realtimeDb, `rooms/${roomId}/signals`);

    onValue(signalsRef, async (snapshot) => {
      const clients = snapshot.val();
      if (!clients) return;

      for (const [clientId, signal] of Object.entries(clients)) {
        if (peerConnections.current[clientId]) continue;

        if (signal.type === 'request-offer') {
          const pc = new RTCPeerConnection(ICE_SERVERS);
          peerConnections.current[clientId] = pc;

          // Add local stream tracks
          localStream.current.getTracks().forEach((track) =>
            pc.addTrack(track, localStream.current)
          );

          // Handle ICE candidates
          pc.onicecandidate = (event) => {
            if (event.candidate) {
              const clientSignalRef = ref(realtimeDb, `rooms/${roomId}/signals/${clientId}`);
              update(clientSignalRef, {
                candidate: event.candidate.toJSON(),
              });
            }
          };

          // Create and send offer
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);

          const clientSignalRef = ref(realtimeDb, `rooms/${roomId}/signals/${clientId}`);
          set(clientSignalRef, {
            offer,
            type: 'offer',
          });

          // Listen for answer and remote ICE
          onValue(clientSignalRef, async (snapshot) => {
            const data = snapshot.val();
            if (!data) return;

            try {
              if (data.answer && !pc.currentRemoteDescription) {
                await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
              }
              if (data.candidate) {
                await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
              }
            } catch (e) {
              console.error("Error processing answer/ICE (admin):", e);
            }
          });
        }
      }
    });
  };

  return { remoteStream, startBroadcast };
}
