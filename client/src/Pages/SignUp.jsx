import React from 'react'
import { useNavigate } from 'react-router-dom'
import SplashCursor from '../Components/SplashCursor'

const SignUp = () => {
  const Navigate = useNavigate()
  return (
    <div className='w-[100vw] h-[100vh] bg-[#e0e0e0] flex z-50'>
      <SplashCursor />
      <div className='w-[45%] h-full bg--400'></div>
      <div className='w-[55%] h-full bg--400 rounded-l-[140px] neu-box-s font-[poppins] flex flex-col items-center justify-center '>
        <h1 className='text-[4vw] font-black text-zinc-700'>Join Rentellect Today!</h1>
        <h2 className='text-lg -mt-2'>Already have an account? LogIn instead ..</h2>
        <button className='neu-button-log font-semibold mt-2' onClick={() => Navigate('/login')}>Login</button>
      </div>
    </div>
  )
}

export default SignUp