import { useEffect, useRef, useState } from 'react';
import { ref, onValue, set, remove, update } from 'firebase/database';
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
  const adminListenerUnsubscribe = useRef(null);
  const clientIdRef = useRef(null);

  // Cleanup function
  const cleanup = async () => {
    if (isAdmin) {
      // Admin cleanup
      const signalsRef = ref(realtimeDb, `rooms/${roomId}/signals`);
      await remove(signalsRef).catch(console.error);
      
      Object.values(peerConnections.current).forEach(pc => pc.close());
      peerConnections.current = {};
      
      if (localStream.current) {
        localStream.current.getTracks().forEach(track => track.stop());
        localStream.current = null;
      }
      
      if (adminListenerUnsubscribe.current) {
        adminListenerUnsubscribe.current();
        adminListenerUnsubscribe.current = null;
      }
    } else if (clientIdRef.current) {
      // Non-admin cleanup
      const signalsRef = ref(realtimeDb, `rooms/${roomId}/signals/${clientIdRef.current}`);
      await remove(signalsRef).catch(console.error);
      
      if (peerConnections.current[clientIdRef.current]) {
        peerConnections.current[clientIdRef.current].close();
        delete peerConnections.current[clientIdRef.current];
      }
    }
    setRemoteStream(null);
  };

  const stopBroadcast = async () => {
    await cleanup();
  };

  useEffect(() => {
    if (!isAdmin) {
      clientIdRef.current = crypto.randomUUID();
      const signalsRef = ref(realtimeDb, `rooms/${roomId}/signals/${clientIdRef.current}`);
      
      // Request an offer from admin
      set(signalsRef, { type: 'request-offer' });
      
      const unsubscribe = onValue(signalsRef, async (snapshot) => {
        const data = snapshot.val();
        
        // Handle admin stop
        if (data === null) {
          if (peerConnections.current[clientIdRef.current]) {
            peerConnections.current[clientIdRef.current].close();
            delete peerConnections.current[clientIdRef.current];
          }
          setRemoteStream(null);
          // Re-request offer if admin restarts
          set(signalsRef, { type: 'request-offer' });
          return;
        }
        
        if (!data || !data.offer) return;

        let pc = peerConnections.current[clientIdRef.current];
        if (!pc) {
          pc = new RTCPeerConnection(ICE_SERVERS);
          peerConnections.current[clientIdRef.current] = pc;

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

        try {
          if (!pc.currentRemoteDescription && data.offer) {
            await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            update(signalsRef, { answer });
          }

          if (data.candidate && pc.remoteDescription) {
            await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
          }
        } catch (e) {
          console.error("Error processing signaling data:", e);
        }
      });

      return () => {
        unsubscribe();
        cleanup();
      };
    }
  }, [roomId, isAdmin]);

  const startBroadcast = async () => {
    if (!isAdmin) return;

    try {
      localStream.current = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      // Mute audio tracks initially
      localStream.current.getAudioTracks().forEach(track => {
        track.enabled = false;
      });

      setRemoteStream(localStream.current);

      const signalsRef = ref(realtimeDb, `rooms/${roomId}/signals`);
      adminListenerUnsubscribe.current = onValue(signalsRef, async (snapshot) => {
        const clients = snapshot.val() || {};
        
        for (const [clientId, signal] of Object.entries(clients)) {
          if (peerConnections.current[clientId]) continue;

          if (signal.type === 'request-offer') {
            const pc = new RTCPeerConnection(ICE_SERVERS);
            peerConnections.current[clientId] = pc;

            // Add tracks
            localStream.current.getTracks().forEach(track => {
              pc.addTrack(track, localStream.current);
            });

            // ICE handling
            pc.onicecandidate = (event) => {
              if (event.candidate) {
                const clientSignalRef = ref(realtimeDb, `rooms/${roomId}/signals/${clientId}`);
                update(clientSignalRef, {
                  candidate: event.candidate.toJSON(),
                });
              }
            };

            // Create offer
            try {
              const offer = await pc.createOffer();
              await pc.setLocalDescription(offer);

              const clientSignalRef = ref(realtimeDb, `rooms/${roomId}/signals/${clientId}`);
              set(clientSignalRef, {
                offer,
                type: 'offer',
              });

              // Listen for answers
              onValue(clientSignalRef, async (clientSnapshot) => {
                const data = clientSnapshot.val();
                if (!data) return;

                try {
                  if (data.answer && !pc.currentRemoteDescription) {
                    await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
                  }
                  if (data.candidate) {
                    await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
                  }
                } catch (e) {
                  console.error("Error processing answer:", e);
                }
              });
            } catch (e) {
              console.error("Error creating offer:", e);
            }
          }
        }
      });
    } catch (error) {
      console.error("Error starting broadcast:", error);
    }
  };

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  return { remoteStream, startBroadcast, stopBroadcast };
}