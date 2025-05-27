import React from 'react';
import Viewbutton from "./leaderboardButton.jsx";
import Leavebutton from "./leavebutton.jsx";
import Nextbutton from "./nextround.jsx";
import ShareScreen from "./shareScreen.jsx";

import logo from "./assets/logo.png"

const Content = (props)=>{
  return (
      <div className="h-screen w-full flex items-center flex-col">
        <div className="relative top-4 flex w-full max-w-3xl items-center">
          <h1 className="relative top-3 font-extrabold"><img src={ logo } className='h-24 w-auto'></img></h1>
          { props.admin && <>
              <Nextbutton db={ props.db }/>
              <div className='ml-32 font-bold text-left h-full flex items-center'>Current player :</div>
            </>
          }
        </div>

        <div className="relative top-8 border-8 border-white aspect-video w-full max-w-3xl rounded-4xl bg-black"></div>
        <div className="relative top-12 flex align-center w-full max-w-3xl">
          <Viewbutton setLeader={ props.setLeader }/>
          <Leavebutton/>
          { props.admin && <ShareScreen/> }
        </div>
      </div>
  )
}

export default Content;