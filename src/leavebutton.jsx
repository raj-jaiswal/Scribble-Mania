import React from 'react';

const LeaveButton = ()=>{
  return (
      <button 
        className="m-3 px-6 py-2 bg-[#D74F4F] rounded-lg font-bold cursor-pointer transform transition hover:-translate-y-1 hover:scale-105"
        onClick={ window.close }
      >
        Leave meet
      </button>
  )
}

export default LeaveButton;