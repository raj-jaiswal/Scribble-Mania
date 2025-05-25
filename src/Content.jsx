import React from 'react';
import Viewbutton from "./leaderboard.jsx";
import Leavebutton from "./leavebutton.jsx";
import Nextbutton from "./nextround.jsx";
import ShareScreen from "./shareScreen.jsx";

import logo from "./assets/logo.png"

const Content = ()=>{
  return (
      <div className="h-screen w-full flex items-center flex-col">
        <div className="relative top-4 flex w-full max-w-3xl align-center">
          <h1 className="relative top-3 font-extrabold"><img src={ logo } className='h-24 w-auto'></img></h1>
          <Nextbutton/>
          <div>
            <p>Current player:</p>
            <p>Current word:</p>
          </div>
        </div>

        <div className="relative top-8 border-8 border-white aspect-video w-full max-w-3xl rounded-4xl bg-black"></div>
        <div className="relative top-12 flex align-center w-full max-w-3xl">
          <Viewbutton/>
          <Leavebutton/>
          <ShareScreen/>
        </div>
      </div>
  )
}

export default Content;