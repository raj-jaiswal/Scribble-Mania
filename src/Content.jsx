import React, { useState, useEffect } from 'react';
import Viewbutton from "./leaderboardButton.jsx";
import Leavebutton from "./leavebutton.jsx";
import Nextbutton from "./nextround.jsx";
import ShareScreen from "./shareScreen.jsx";
import { realtimeDb, auth } from './firebase';
import { ref, onValue, set, remove, onDisconnect } from 'firebase/database';

import logo from "./assets/logo.png"

const Content = (props) => {
  const [randomUser, setRandomUser] = useState('');
  const [randomUserEmail, setRandomUserEmail] = useState('');
  const [activeUsers, setActiveUsers] = useState([]);

  const updateCurrentPlayer = () => {
    if (activeUsers.length > 0) {
      const randomIndex = Math.floor(Math.random() * activeUsers.length);
      const chosen = activeUsers[randomIndex];
      setRandomUser(chosen.displayName);
      setRandomUserEmail(chosen.email);
      props.onPlayerChange?.(chosen.email);
    }
  };

  useEffect(() => {
    const activeUsersRef = ref(realtimeDb, 'activeUsers');

    const unsubscribe = onValue(activeUsersRef, (snapshot) => {
      const users = snapshot.val() || {};
      const usersArray = Object.values(users);
      setActiveUsers(usersArray);

      if (usersArray.length > 0) {
        const randomIndex = Math.floor(Math.random() * usersArray.length);
        const chosen = usersArray[randomIndex];
        setRandomUser(chosen.displayName);
        setRandomUserEmail(chosen.email);
        props.onPlayerChange?.(chosen.email);
      }
    });

    return () => unsubscribe();
  }, []);

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
            <Nextbutton db={props.db} onNextRound={updateCurrentPlayer} onNextWord={props.onNextWord} />
            <div className='ml-32 font-bold text-left h-full flex items-center align-left'>
              Current player: {randomUser}<br/>({randomUserEmail})
            </div>
          </>
          }
        </div>

        <div className="relative top-8 border-8 border-white aspect-video w-full max-w-3xl rounded-4xl bg-black"></div>
        <div className="relative top-12 flex align-center w-full max-w-3xl">
          <Viewbutton setLeader={props.setLeader} />
          <Leavebutton />
          {props.admin && <ShareScreen />}
        </div>
      </div>
  )
}

export default Content;