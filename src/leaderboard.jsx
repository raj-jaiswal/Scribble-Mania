import React from 'react';
import cancelIcon from './assets/cancel-icon.svg';

const Leaderboard = (props) => {
  return (
    <div className="bg-white h-screen min-w-100 flex flex-col">
        <h1 className="px-5 py-5 text-left text-2xl font-extrabold border-b border-gray-200">
          Leaderboard
        </h1>
        <button className="absolute top-3 right-5 transform transition hover:-translate-y-1 hover:scale-105" onClick={ ()=>{props.setLeader(false)} }><img className="h-12 w-12" src={ cancelIcon }/></button>
    </div>
  )
}

export default Leaderboard