import React, { useEffect, useState } from 'react';
import { auth, db } from './firebase.js';
import Chats from './Chats.jsx';
import Content from "./Content.jsx";
import Login from "./login.jsx";
import Leaderboard from './leaderboard.jsx';
import backdrop from "./assets/backdrop.png";
import PlayerScreen from './playerScreen.jsx';

const App = () => {
  const [isMobile, setIsMobile] = useState(false);
  const randomWords = [
    "echo", "blaze", "quartz", "frost", "lunar",
    "pixel", "drift", "ember", "vault", "crisp",
    "gale", "thrive", "mirth", "glint", "whirl",
    "brisk", "hollow", "knack", "sprout", "plume"
  ];
  const [currentWord, setCurrentWord] = useState('');
  const [usedWords, setUsedWords] = useState([]);
  const [user, setUser] = useState(null);
  const [isPlayer, setIsPlayer] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [showLeader, setShowLeader] = useState(false);

  useEffect(() => {
    const initialWord = getRandomWord();
    setCurrentWord(initialWord);
    setUsedWords([initialWord]);
  }, []);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [isMobile]);

  const fetchUserData = async () => {
    auth.onAuthStateChanged(async(user)=>{
      console.log(user);
      setUser(user);
      if (user){
        const admins = import.meta.env.VITE_ADMINS.split(',');
        if (admins.includes(user.email)){ setAdmin(true); }
        else { setAdmin(false); }
      }
    });
  }

  const handlePlayerChange = (playerEmail) => {
    setIsPlayer(user && playerEmail === user.email);
  };

  useEffect(() =>{
    fetchUserData();
  }, []);

  const getRandomWord = () => {
    const availableWords = randomWords.filter(word => !usedWords.includes(word));
    if (availableWords.length === 0) {
      setUsedWords([]);
      return randomWords[Math.floor(Math.random() * randomWords.length)];
    }
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    return availableWords[randomIndex];
  };

  const handleNextWord = () => {
    const newWord = getRandomWord();
    setCurrentWord(newWord);
    setUsedWords(prev => [...prev, newWord]);
  };

  return (
      ( !isMobile ?
              ( user ?
                      <div className='flex w-full h-screen overflow-hidden text-white font-["Poppins"]'>
                        <img src={ backdrop } className='w-full h-full absolute top-0 left-0 bg-cover'></img>
                        <div className="flex-1 pr-4"><Content admin={ admin } setLeader={ setShowLeader }  db={ db } onPlayerChange={handlePlayerChange} currentWord={currentWord} onNextWord={handleNextWord}/></div>
                        { showLeader ?
                            <div className="w-full max-w-[28rem] z-10 text-black"><Leaderboard setLeader={ setShowLeader }  db={ db }/></div> :
                            (!isPlayer ?
                                    <div className="w-full max-w-[28rem] z-10 text-black"><Chats admin={ admin } user={ user.displayName } db={ db } userEmail={user.email} currentWord={currentWord}/></div> :
                                    <div className="w-full max-w-[28rem] z-10 text-black"><PlayerScreen currentWord={currentWord} /></div>
                            )
                        }
                      </div>
                      : <Login />
              ) :
              <div className="h-screen flex items-center justify-center p-6 text-center">
                <div className="text-xl font-bold text-black">
                  Please use a desktop or laptop to access this application.
                </div>
              </div>
      )
  )
};

export default App;