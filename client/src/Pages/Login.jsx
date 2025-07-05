import React from 'react'
import { useNavigate } from 'react-router-dom'
import SplashCursor from '../Components/SplashCursor'

const Login = () => {
  const Navigate = useNavigate()
  return (
    <div className='w-[100vw] h-[100vh] bg-[#e0e0e0] flex z-50'>
      <SplashCursor />
      <div className='w-[55%] h-full bg--400 rounded-l-[140px] neu-box-l font-[poppins] flex flex-col items-center justify-center '>
        <h1 className='text-[4vw] font-black text-zinc-700'>Glad to see you again!</h1>
        <h2 className='text-lg -mt-2'>Don't have an account? SignUp instead ..</h2>
        <button className='neu-button-log font-semibold mt-2' onClick={() => Navigate('/register')}>Signup</button>
      </div>
      <div className='w-[45%] h-full bg--400'></div>
    </div>
  )
}

export default Login