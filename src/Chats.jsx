import React, { useState, useEffect } from "react";

const Chats = () => {
  const [msgs, setMsgs] = useState([
    { sender: 'PeakUser', text: '', points: 0 },
    { sender: 'FlowMat', text: '', points: 0 },
    { sender: 'Mr. Admin', text: '', points: 0 },
    { sender: 'PeakUser', text: '', points: 0 },
    { sender: 'PeakUser', text: '', points: 0 },
    { sender: 'PeakUser', text: '', points: 0 },
    { sender: 'PeakUser', text: '', points: 0 },
  ]);

  const randomWords = [
    "echo", "blaze", "quartz", "frost", "lunar",
    "pixel", "drift", "ember", "vault", "crisp",
    "gale", "thrive", "mirth", "glint", "whirl",
    "brisk", "hollow", "knack", "sprout", "plume"
  ];

  const [newMsg, setNewMsg] = useState('');
  const [currentWord, setCurrentWord] = useState('');

  useEffect(() => {
    setCurrentWord(randomWords[0]);
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (newMsg.trim()) {
      const points = newMsg.toLowerCase() === currentWord.toLowerCase() ? 50 : 0;
      setMsgs(prev => [
        ...prev,
        {
          text: newMsg,
          sender: 'You',
          points: points,
        }
      ]);
      setNewMsg('');
    }
  };

  return (
      <div className="bg-white h-screen min-w-100 flex flex-col">
        <h1 className="px-5 py-3 text-left text-2xl font-extrabold border-b border-gray-200">
          Chats
        </h1>

        <div className="px-5 py-2 bg-blue-50 text-blue-800 font-semibold">
          Current Word: {currentWord}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {msgs
              .filter(msg => msg.text.trim() !== '')
              .map((msg, index) => (
                  <div key={index} className="flex flex-col items-start">
                    <div className="font-bold">{msg.sender}</div>
                    <div className="flex justify-between w-full items-center">
                      <p className="text-gray-800 text-sm">{msg.text}</p>
                      {msg.points > 0 && (
                          <span className="text-blue-600 text-sm font-semibold ml-2">
                    +{msg.points} pts
                  </span>
                      )}
                    </div>
                  </div>
              ))}
        </div>

        <form onSubmit={handleSend} className="p-4 border-t border-gray-200">
          <div className="flex space-x-2 items-center border border-gray-300 rounded-full px-4 py-2">
            <input
                type="text"
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                placeholder="Enter Your Answer"
                className="flex-1 focus:outline-none"
            />
            <button type="submit" className="text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg"
                   viewBox="0 0 24 24"
                   fill="currentColor"
                   className="w-6 h-6">
                <path d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 109.816 109.816 0 0 0 14.209-8.672c.44-.404.478-1.005.084-1.402A109.816 109.816 0 0 0 3.478 2.405Z" />
              </svg>
            </button>
          </div>
        </form>
      </div>
  );
};

export default Chats;
