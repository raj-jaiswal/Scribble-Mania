import React from 'react';
import Chats from './Chats.jsx';
import Content from "./Content.jsx"; 

import backdrop from "./assets/backdrop.png";

const App = () => {
  return (
    <div className='flex w-full h-screen overflow-hidden text-white font-["Poppins"]'>
      <img src={ backdrop } className='w-full h-full absolute top-0 left-0 bg-cover'></img>
      <div className="flex-1 pr-4"><Content /></div>
      <div className="w-full max-w-[28rem] z-10 text-black"><Chats /></div>
    </div>
  );
};

export default App;
