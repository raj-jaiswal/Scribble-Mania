import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import React from 'react'
import { auth } from './firebase';
import logo from "./assets/logo.png";
import backdrop from "./assets/backdrop-pattern.PNG";

function login() {
  function googleLogin() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then(async (result) => {
      if (result){
        console.log(`Thank You for Joining US. Enjoy ${result.user.displayName}!`);
      }
    });
  }

  return (
  <div className='w-screen h-screen flex flex-col items-center justify-center'>
    <img src={ backdrop } className='w-full h-full absolute top-0 left-0 '></img>

    <h1 className="relative m-15 top-3 font-extrabold"><img src={logo} className='h-70 w-auto'></img></h1>
    <div className="px-6 sm:px-0 max-w-sm scale-150" onClick={googleLogin}>
        <button type="button" className="bg-white w-full  text-[#4285F4] hover:bg-[#4285F4] hover:text-white
         focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg transition-colors transition-duration-0.1s
         text-sm px-5 py-2.5 text-center inline-flex items-center justify-between mr-2 mb-2">
          <svg className="mr-2 -ml-1 w-4 h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
          </svg>
          Sign up with Google
          <div>
          </div>
        </button>
      </div>
    </div>
  )
}

export default login