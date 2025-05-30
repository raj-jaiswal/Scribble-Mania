import React, { useEffect, useState } from 'react';
import useSound from 'use-sound';
import { auth, db, realtimeDb } from './firebase.js';
import { ref, onValue, set, get } from 'firebase/database';
import Chats from './Chats.jsx';
import Content from "./Content.jsx";
import Login from "./login.jsx";
import Leaderboard from './leaderboard.jsx';
import backdrop from "./assets/backdrop.png";
import PlayerScreen from './playerScreen.jsx';
import UrTurn from "./assets/UrTurn.mp3"
const App = () => {
  const [isMobile, setIsMobile] = useState(false);
  const randomWords = [
    "evil", "figma", "google", "pencil",
    "bed", "monkey", "laptop", "crazy", 
    "potato", "echo", "battle", "compass",
    "sword", "slap", "photo", "frame",
    "leaf", "charger", "whatsapp", "shoe",
    "stick", "key", "switch",
    "butter", "dragon", "fire", "colors",
    "rain", "rainbow", "bow", "tie", "rope",
    'Guitar','Aeroplane','Snowman','Peacock',
    'Tooth','Anchor','Camera','Clock','Teddybear',
    'Crayon','Bacteria','Email','Pizza','Lamp',
    'Flute','Bicycle','Chair','Candle','Drum',
    'Bird','Boat','Ladder','Rocket','Spoon',
    'Toothbrush','Volcano','Witch','Book',
    'Bridge','Butterfly',
    'Toothpaste','Scissors','Remote','Stockings',
    'Sunrise','Windmill','Clown','Keyboard','Dice',
  ];
  const [currentWord, setCurrentWord] = useState('');
  const [user, setUser] = useState(null);
  const [isPlayer, setIsPlayer] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [showLeader, setShowLeader] = useState(false);
  const [PlayerTurnSound] = useSound(UrTurn);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [isMobile]);

  // Add database listener for current word
  useEffect(() => {
    const currentWordRef = ref(realtimeDb, 'currentWord');
    
    const unsubscribe = onValue(currentWordRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCurrentWord(data.word);
      }
    });

    return () => unsubscribe();
  }, []);

  // Setup initial word if none exists
  const setupInitialWord = async () => {
    const currentWordRef = ref(realtimeDb, 'currentWord');
    const snapshot = await get(currentWordRef);
    
    if (!snapshot.exists()) {
      const initialWord = getRandomWord();
      await set(currentWordRef, {
        word: initialWord,
        timestamp: new Date().toISOString()
      });
    }
  };

  useEffect(() => {
    setupInitialWord();
  }, []);

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
    const isCurrPlayer = (user && playerEmail === user.email);
    setIsPlayer(isCurrPlayer);
    if (isCurrPlayer){
      PlayerTurnSound();
    }
  };

  useEffect(() =>{
    fetchUserData();
  }, []);

  const getRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * randomWords.length);
    return randomWords[randomIndex];
  };

  return (
      ( !isMobile ?
              ( user ?
                      <div className='flex w-full h-screen overflow-hidden text-white font-["Poppins"]'>
                        <img src={ backdrop } className='w-full h-full absolute top-0 left-0 bg-cover'></img>
                        <div className="flex-1 pr-4"><Content admin={ admin } setLeader={ setShowLeader }  db={ db } onPlayerChange={handlePlayerChange} currentWord={currentWord} getRandomWord={getRandomWord}/></div>
                        <div className={`w-full max-w-[28rem] z-10 text-black ${ (!showLeader && !isPlayer) ? 'block' : 'hidden' }`}><Chats admin={ admin } user={ user.displayName } db={ db } userEmail={user.email} currentWord={currentWord}/></div>
                        { showLeader ?
                            <div className="w-full max-w-[28rem] z-10 text-black"><Leaderboard setLeader={ setShowLeader }  db={ db }/></div> :
                            (isPlayer &&
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