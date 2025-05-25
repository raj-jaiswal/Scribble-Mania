import React from 'react';
import Chats from './Chats.jsx';
import Content from "./Content.jsx"; 

const App = () => {
  return (
    <div className="flex w-full h-screen overflow-hidden">
      <div className="flex-1 pr-4"><Content /></div>
      <div className="w-80"><Chats /></div>
    </div>
  );
};

export default App;
