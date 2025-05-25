import React from 'react';
import Viewbutton from "./leaderboard.jsx";
import Leavebutton from "./leavebutton.jsx";
import Nextbutton from "./nextround.jsx";
import ShareScreen from "./shareScreen.jsx";

const Content = ()=>{
  return (
      <div className="h-screen mx-10">
        <div className="relative top-4 flex justify-between w-full">
          <h1 className="relative top-3 font-extrabold">SCRIBBLE-MANIA</h1>
          <Nextbutton/>
          <div>
            <p>Current player:</p>
            <p>Current word:</p>
          </div>
        </div>

        <div className="relative top-8 bg-red-50 aspect-video w-full max-w-4xl">Video</div>
        <div className="relative top-12 flex justify-between w-full max-w-4xl">
          <Viewbutton/>
          <Leavebutton/>
          <ShareScreen/>
        </div>
      </div>
  )
}

export default Content;