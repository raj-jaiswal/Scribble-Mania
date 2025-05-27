import React from 'react';
import cancelIcon from './assets/cancel-icon.svg';

const Leaderboard = (props) => {
  const players = [
    {name: 'Raj Jaiswal', points: 320},
    {name: 'Raj Jaiswal', points: 220},
    {name: 'Raj Jaiswal', points: 120},
    {name: 'Raj Jaiswal', points: 20},
    {name: 'Raj Jaiswal', points: 40},
    {name: 'Raj Jaiswal', points: 20},
    {name: 'Raj Jaiswal', points: 30},
    {name: 'Raj Jaiswal', points: 30},
    {name: 'Raj Jaiswal', points: 20},
    {name: 'Raj Jaiswal', points: 10},
  ];
  return (
    <div className="bg-white h-screen min-w-100 flex flex-col">
        <h1 className="px-5 py-5 text-left text-2xl font-extrabold border-b border-gray-200">
          Leaderboard
        </h1>
        <button className="absolute top-3 right-5 transform transition hover:-translate-y-1 hover:scale-105" onClick={ ()=>{props.setLeader(false)} }><img className="h-12 w-12" src={ cancelIcon }/></button>
        <div className='w-full h-full p-5 overflow-y-scroll text-md [&>*:nth-child(1)]:bg-[#2C99CF] [&>*:nth-child(2)]:bg-[#247FAC] [&>*:nth-child(3)]:bg-[#066290]'>
          { players.sort((a, b) => (a.points > b.points)).map((player, idx) => (
              <div className='w-full h-18 text-white bg-[#022A3E] mb-2 rounded-xl flex items-center justify-between px-8'>
                <div className='flex'>
                  { (idx < 3) ? 
                      <span className='font-bold mr-6 w-6 block'>{
                          (idx == 0) ? '1st' : 
                          (idx == 1) ? '2nd':
                          '3rd'
                      }</span>
                  : <></>}
                  { player.name }
                </div>
                <div className='align-left font-semibold'>{ player.points } pts</div>
              </div>
          ))}
        </div>
    </div>
  )
}

export default Leaderboard