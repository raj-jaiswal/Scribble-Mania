import React, { useState, useEffect } from 'react';
import Viewbutton from "./leaderboardButton.jsx";
import Leavebutton from "./leavebutton.jsx";
import Nextbutton from "./nextround.jsx";
import ShareScreen from "./shareScreen.jsx";
import { realtimeDb, auth } from './firebase';
import { ref, onValue, set, remove, onDisconnect } from 'firebase/database';

import logo from "./assets/logo.png"
import Video from './video.jsx';
import ShareAudio from './shareAudio.jsx';
import { useScreenBroadcast } from './useScreenBroadcast';

const Content = (props) => {
   const roomId = 'globalRoom';
   const { remoteStream, startBroadcast } = useScreenBroadcast({
     roomId,
     isAdmin: props.admin,
   });
   
   const [sharing, setSharing] = useState(false);
   const beginSharing = async () => {
     if (sharing) return;
     await startBroadcast();
     setSharing(true);
   };

  const [randomUser, setRandomUser] = useState('');
  const [randomUserEmail, setRandomUserEmail] = useState('');
  const [activeUsers, setActiveUsers] = useState([]);

  const updateCurrentPlayer = () => {
    if (activeUsers.length > 0) {
      const randomIndex = Math.floor(Math.random() * activeUsers.length);
      const chosen = activeUsers[randomIndex];
      
      // Update local state
      setRandomUser(chosen.displayName);
      setRandomUserEmail(chosen.email);
      
      // Update in Realtime Database
      const currentPlayerRef = ref(realtimeDb, 'currentPlayer');
      set(currentPlayerRef, {
        displayName: chosen.displayName,
        email: chosen.email,
        timestamp: new Date().toISOString()
      });
      
      props.onPlayerChange?.(chosen.email);
    }
  };

  useEffect(() => {
    const activeUsersRef = ref(realtimeDb, 'activeUsers');
    const currentPlayerRef = ref(realtimeDb, 'currentPlayer');

    // Listen for active users changes
    const unsubscribeUsers = onValue(activeUsersRef, (snapshot) => {
      const users = snapshot.val() || {};
      const usersArray = Object.values(users);
      setActiveUsers(usersArray);

      // Only select initial player if no current player is set
      if (usersArray.length > 0 && !randomUser) {
        const randomIndex = Math.floor(Math.random() * usersArray.length);
        const chosen = usersArray[randomIndex];
        setRandomUser(chosen.displayName);
        setRandomUserEmail(chosen.email);
        props.onPlayerChange?.(chosen.email);
      }

      // Check if current player has left
      if (randomUserEmail && !usersArray.find(user => user.email === randomUserEmail)) {
        updateCurrentPlayer();
      }
    });

    // Listen for current player changes
    const unsubscribeCurrentPlayer = onValue(currentPlayerRef, (snapshot) => {
      const currentPlayer = snapshot.val();
      if (currentPlayer) {
        setRandomUser(currentPlayer.displayName);
        setRandomUserEmail(currentPlayer.email);
        props.onPlayerChange?.(currentPlayer.email);
      }
    });

    return () => {
      unsubscribeUsers();
      unsubscribeCurrentPlayer();
    };
  }, [randomUser, randomUserEmail]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const userRef = ref(realtimeDb, `activeUsers/${user.uid}`);

        set(userRef, {
          displayName: user.displayName,
          email: user.email,
          lastActive: new Date().toISOString()
        });

        onDisconnect(userRef).remove();

        return () => {
          remove(userRef);
        };
      }
    });

    return () => unsubscribe();
  }, []);

  return (
      <div className="h-screen w-full flex items-center flex-col">
        <div className="relative top-4 flex w-full max-w-3xl items-center">
          <h1 className="relative top-3 font-extrabold"><img src={logo} className='h-24 w-auto'></img></h1>
          {props.admin && <>
            <Nextbutton db={props.db} onNextRound={updateCurrentPlayer} getRandomWord={props.getRandomWord} />
            <div className='ml-32 font-bold text-left h-full flex items-center align-left'>
              Current player: {randomUser}<br/>({randomUserEmail})
            </div>
          </>
          }
        </div>

      <Video stream={remoteStream} />

      <div className="relative top-12 flex align-center w-full max-w-3xl">
        <Viewbutton setLeader={props.setLeader} />
        <Leavebutton />
          {props.admin && (
            <>
              <ShareScreen onClick={beginSharing} sharing={sharing} />
              <ShareAudio stream={remoteStream} />
            </>
          )}
      </div>
    </div>
  )
}

export default Content;