import React, { useEffect, useState } from 'react';
import { auth, db } from './firebase.js';
import Chats from './Chats.jsx';
import Content from "./Content.jsx"; 
import Login from "./login.jsx";
import Leaderboard from './leaderboard.jsx';
 
import backdrop from "./assets/backdrop.png";
import PlayerScreen from './playerScreen.jsx';

const App = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [isMobile]);

  const [user, setUser] = useState(null);
  const [isPlayer, setIsPlayer] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [showLeader, setShowLeader] = useState(false);

  const fetchUserData = async () => {
    auth.onAuthStateChanged(async(user)=>{
      console.log(user);
      setUser(user);
      if (user){
        const admins = import.meta.env.VITE_ADMINS.split(',');
        if (admins.includes(user.email)){ setAdmin(true); }
        else { setAdmin(false); }
      }
    });
  }

  const handlePlayerChange = (playerEmail) => {
    if (user && playerEmail === user.email) {
      setIsPlayer(true);
    } else {
      setIsPlayer(false);
    }
  };

  useEffect(() =>{
    fetchUserData();
  }, []);

  return (
    ( !isMobile ?
      ( user ?
      <div className='flex w-full h-screen overflow-hidden text-white font-["Poppins"]'>
        <img src={ backdrop } className='w-full h-full absolute top-0 left-0 bg-cover'></img>
        <div className="flex-1 pr-4"><Content admin={ admin } setLeader={ setShowLeader }  db={ db } onPlayerChange={handlePlayerChange}/></div>
        { showLeader ?
          <div className="w-full max-w-[28rem] z-10 text-black"><Leaderboard setLeader={ setShowLeader }  db={ db }/></div> :
          (!isPlayer ?
            <div className="w-full max-w-[28rem] z-10 text-black"><Chats admin={ admin } user={ user.displayName } db={ db } userEmail={user.email}/></div> :
            <div className="w-full max-w-[28rem] z-10 text-black"><PlayerScreen /></div>
          )
        }
      </div>
      : <Login />
      ) :
      <div className="h-screen flex items-center justify-center p-6 text-center">
        <div className="text-xl font-bold text-black">
          Please use a desktop or laptop to access this application.
        </div>
      </div>
    )
  )
};

export default App;