import React, { useState, useEffect, useRef } from "react";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { addDoc, serverTimestamp } from "firebase/firestore";
import sendIcon from "./assets/send-icon.svg";
import deleteIcon from "./assets/delete-icon.svg";

const Chats = (props) => {
  const chatBox = useRef(null);

  const [msgs, setMsgs] = useState([]);

  useEffect(() => {
    const q = query(collection(props.db, "messages"), orderBy("createdAt"));

    const unsub = onSnapshot(q, snap => {
      const loaded = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      console.log(loaded);
      setMsgs(loaded);
    });

    return unsub;
  }, [props.db]);

  const randomWords = [
    "echo", "blaze", "quartz", "frost", "lunar",
    "pixel", "drift", "ember", "vault", "crisp",
    "gale", "thrive", "mirth", "glint", "whirl",
    "brisk", "hollow", "knack", "sprout", "plume"
  ];

  useEffect(() => {
    if (chatBox.current) {
      chatBox.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [msgs]);

  const [newMsg, setNewMsg] = useState('');
  const [currentWord, setCurrentWord] = useState('');

  useEffect(() => {
    setCurrentWord(randomWords[0]);
  }, []);

  const handleSend = async e => {
    e.preventDefault();
    if (!newMsg.trim()) return;

    const isCorrect = newMsg.toLowerCase() === currentWord.toLowerCase();

    if (isCorrect) {
      // Only add the success message for correct guesses
      await addDoc(collection(props.db, "messages"), {
        text: `${props.user} guessed it!`,
        sender: "System",
        points: 50,
        isCorrectGuess: true,
        createdAt: serverTimestamp(),
      });
    } else {
      // Add the user's guess message only if incorrect
      await addDoc(collection(props.db, "messages"), {
        text: newMsg,
        sender: props.user,
        points: 0,
        createdAt: serverTimestamp(),
      });
    }

    setNewMsg("");
  };

  const handleDelete = async (messageId) => {
    try {
      await deleteDoc(doc(props.db, "messages", messageId));
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleClearChat = async () => {
    try {
      const batch = [];
      msgs.forEach(msg => {
        batch.push(deleteDoc(doc(props.db, "messages", msg.id)));
      });
      await Promise.all(batch);
    } catch (error) {
      console.error("Error clearing chat:", error);
    }
  };

  return (
      <div className="bg-white h-screen min-w-100 flex flex-col">
        <h1 className="px-5 py-3 text-left text-2xl font-extrabold border-b border-gray-200">
          Chats
        </h1>

        {props.admin && <div className="px-5 py-2 bg-blue-50 text-blue-800 font-semibold flex justify-between">
          <div> Current Word: {currentWord}</div>

          <button
              type="button"
              onClick={handleClearChat}
              className="text-blue-600 text-sm font-semibold hover:text-blue-800 ml-2"
          >
            Clear Chat
          </button>
        </div>

        }

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {msgs
              .filter(msg => msg.text.trim() !== '')
              .map((msg) => (
                  <div key={msg.id} className="flex flex-col items-start">
                    <div className={`font-bold ${msg.isCorrectGuess ? 'text-green-600' : ''}`}>
                      {msg.sender}
                    </div>
                    <div className="flex justify-between w-full items-center">
                      <p className={`text-sm ${
                          msg.isCorrectGuess
                              ? 'text-green-600 font-semibold'
                              : 'text-gray-800'
                      }`}>
                        {msg.text}
                      </p>
                      <div className="flex items-center">
                        {msg.points > 0 && (
                            <span className="text-blue-600 text-sm font-semibold ml-2">
                              +{msg.points} pts
                            </span>
                        )}
                        {props.admin && (
                            <button
                                onClick={() => handleDelete(msg.id)}
                                className="ml-2 hover:opacity-80"
                            >
                              <img src={deleteIcon} alt="delete" className="w-4 h-4" />
                            </button>
                        )}
                      </div>
                    </div>
                  </div>
              ))}

          <div className="dummy" ref={chatBox}></div>
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
              <img src={sendIcon} className="w-8 h-8" alt="send" />
            </button>

          </div>
        </form>
      </div>
  );
};

export default Chats;