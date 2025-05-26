import React from 'react';

const Viewbutton = (props) =>{
  return (
      <button className="m-3 px-6 py-3 rounded-lg bg-white text-black font-bold cursor-pointer transform transition hover:-translate-y-1 hover:scale-105" onClick={ ()=>{props.setLeader(true) } }>
        View Leaderboard
      </button>
  )
}

export default Viewbutton;