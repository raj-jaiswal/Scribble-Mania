import React, { useState, useEffect, useRef } from "react";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, Timestamp, where, runTransaction, increment } from "firebase/firestore";
import { addDoc, serverTimestamp, getDocs } from "firebase/firestore";
import { Filter } from 'bad-words'
const filter = new Filter();

import sendIcon from "./assets/send-icon.svg";
import deleteIcon from "./assets/delete-icon.svg";

const Chats = (props) => {
  const chatBox = useRef(null);
  const [msgs, setMsgs] = useState([]);
  const [userJoinTime] = useState(() => Timestamp.now());

  useEffect(() => {
    const q = query(
        collection(props.db, "messages"),
        where("createdAt", ">=", userJoinTime),
        orderBy("createdAt")
    );
    const unsub = onSnapshot(q, snap => {
      const loaded = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setMsgs(loaded);
    });
    return unsub;
  }, [props.db, userJoinTime]);

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

  const [alreadyGuessed, setAlreadyGuessed] = useState(false);
  
  useEffect(() => {
    if (!alreadyGuessed || !currentWord) return;

    const counterRef = doc(props.db, "wordCounts", currentWord);
    let isFirstSnapshot = true;

    const unsub = onSnapshot(counterRef, snap => {
      const count = snap.exists() ? snap.data().count ?? 0 : 0;

      if (isFirstSnapshot) {
        isFirstSnapshot = false;
        return;
      }

      if (count === 0) {
        setAlreadyGuessed(false);
      }
    });

    return unsub;
  }, [props.db, currentWord, alreadyGuessed]);

  const handleSend = async (e) => {
    e.preventDefault();

    if (alreadyGuessed) {
      alert("You have already guessed correctly for this word!");
      return;
    }

    if (!newMsg.trim()) return;

    if (filter.isProfane(newMsg)) {
      alert("Please avoid using inappropriate language.");
      return;
    }

    const isCorrect = newMsg.toLowerCase() === currentWord.toLowerCase();

    if (isCorrect) {
      try {
        await runTransaction(props.db, async (tx) => {
          const counterRef = doc(props.db, "wordCounts", currentWord);
          const snap = await tx.get(counterRef);
          const current = snap.exists() ? snap.data().count || 0 : 0;

          if (current >= 3) {
            const msgRef = doc(collection(props.db, "messages"));
            tx.set(msgRef, {
              text: newMsg,
              sender: props.user,
              points: 0,
              word: currentWord,
              createdAt: serverTimestamp(),
            });
            return;
          }

          const position = current + 1;
          const points =
            position === 1 ? 300 :
            position === 2 ? 200 :
            100;

          tx.set(counterRef, { count: position }, { merge: true });

          const msgRef = doc(collection(props.db, "messages"));
          tx.set(msgRef, {
            text: `${props.user} guessed it!`,
            sender: "System",
            points,
            isCorrectGuess: true,
            word: currentWord,
            createdAt: serverTimestamp(),
          });

          if (points > 0) {
            const lbRef = doc(props.db, "leaderboard", props.userEmail);
            tx.set(
              lbRef,
              {
                name: props.user,
                email: props.userEmail,
                points: increment(points),
              },
              { merge: true }
            );
          }
        });

        setAlreadyGuessed(true);
      } catch (err) {
        console.error("Transaction failed:", err);
      }
    } else {
      await addDoc(collection(props.db, "messages"), {
        text: newMsg,
        sender: props.user,
        points: 0,
        word: currentWord,
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
      const querySnapshot = await getDocs(collection(props.db, "messages"));
      const deletions = querySnapshot.docs.map((msgDoc) => {
        return deleteDoc(doc(props.db, "messages", msgDoc.id));
      });
      await Promise.all(deletions);
      console.log("All messages deleted.");
    } catch (error) {
      console.error("Error clearing chat:", error);
    }
  };

  return (
      <div className="bg-white h-screen min-w-100 flex flex-col">
        <h1 className="px-5 py-3 text-left text-2xl font-extrabold border-b border-gray-200">
          Chats
        </h1>

        {props.admin && (
            <div className="px-5 py-2 bg-blue-50 text-blue-800 font-semibold flex justify-between">
              <div> Current Word: {currentWord}</div>
              <button
                  type="button"
                  onClick={handleClearChat}
                  className="text-blue-600 text-sm font-semibold hover:text-blue-800 ml-2"
              >
                Clear Chat
              </button>
            </div>
        )}

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
                placeholder={alreadyGuessed ? "You already guessed!" : "Enter Your Answer"}
                className="flex-1 focus:outline-none"
                disabled={alreadyGuessed}
            />
            <button type="submit" className="text-blue-600" disabled={alreadyGuessed}>
              <img src={sendIcon} className="w-8 h-8" alt="send" />
            </button>
          </div>
        </form>
      </div>
  );
};

export default Chats;
