import React from 'react';
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const Nextbutton = (props) => {
  const resetWordCounts = async () => {
    const wordCountsRef = collection(props.db, "wordCounts");
    const snapshot = await getDocs(wordCountsRef);

    const batchDeletes = snapshot.docs.map(docSnap => deleteDoc(doc(props.db, "wordCounts", docSnap.id)));

    await Promise.all(batchDeletes);
    
    // Call the updateCurrentPlayer function if it exists
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
  )
}

export default Nextbutton;