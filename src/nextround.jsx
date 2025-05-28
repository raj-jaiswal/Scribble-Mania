import React from 'react';
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { ref, set } from 'firebase/database';
import { realtimeDb } from './firebase';

const Nextbutton = (props) => {
  const resetWordCounts = async () => {
    // First, generate and set new word in database
    const newWord = props.getRandomWord();  // We'll pass this from App.jsx
    const currentWordRef = ref(realtimeDb, 'currentWord');
    
    // Update the word in database
    await set(currentWordRef, {
      word: newWord,
      timestamp: new Date().toISOString()
    });

    // Then clear word counts as before
    const wordCountsRef = collection(props.db, "wordCounts");
    const snapshot = await getDocs(wordCountsRef);
    const batchDeletes = snapshot.docs.map(docSnap => 
      deleteDoc(doc(props.db, "wordCounts", docSnap.id))
    );
    await Promise.all(batchDeletes);
    
    if (props.onNextRound) {
      props.onNextRound();
    }
  };

  return (
    <button 
      className="min-w-30 font-semibold bg-[#05608E] border-4 border-white h-14 rounded-xl cursor-pointer transform transition hover:-translate-y-1 hover:scale-105"
      onClick={resetWordCounts}
    >
      Next round
    </button>
  );
};

export default Nextbutton;