import React, { useEffect, useState } from 'react';
import { auth, db } from './firebase.js';
import Chats from './Chats.jsx';
import Content from "./Content.jsx"; 
import Login from "./login.jsx";

import backdrop from "./assets/backdrop.png";

const App = () => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(false);

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

  useEffect(() =>{
    fetchUserData();
  }, []);

  return (
    ( user ?
    <div className='flex w-full h-screen overflow-hidden text-white font-["Poppins"]'>
      <img src={ backdrop } className='w-full h-full absolute top-0 left-0 bg-cover'></img>
      <div className="flex-1 pr-4"><Content admin={ admin }/></div>
      <div className="w-full max-w-[28rem] z-10 text-black"><Chats admin={ admin } user={ user.displayName } db={ db }/></div>
    </div>
     : <Login />
    )
  )
};

export default App;