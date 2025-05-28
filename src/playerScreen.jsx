import React from "react";
import copyIcon from "./assets/copy-icon.svg"

const PlayerScreen = (props) => {
    return (
        <div className="bg-white h-screen min-w-100 flex flex-col justify-center items-center">
            <div className="text-3xl font-bold">Your Turn!</div>
            <div className="text-lg font-semibold">Current word to Draw: { props.currentWord }</div>
            <div className="font-semibold text-[#247FAC] cursor-pointer flex">
                <a target="_blank" href={ import.meta.env.VITE_FIGMA_URL }>Draw in Figma</a>
                <img src={copyIcon} className="h-6 w-6 ml-2 transition transform hover:-translate-y-0.5 hover:scale-105" onClick={ ()=>{navigator.clipboard.writeText(import.meta.env.VITE_FIGMA_URL);} }></img>
            </div>
        </div>
    )
}

export default PlayerScreen;