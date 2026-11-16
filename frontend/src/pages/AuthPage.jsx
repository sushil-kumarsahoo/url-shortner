import { useState } from 'react'
import LoginForm from '../components/LoginForm'
import RegisterForm from '../components/RegisterForm'

const AuthPage = () => {
  const [login, setLogin] = useState(true)

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-slate-50 flex flex-col items-center justify-center p-4 overflow-hidden scroll-smooth">
      {/* Ambient gradient blobs with smooth float animation */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[60rem] h-[30rem] bg-gradient-to-tr from-purple-300/30 via-purple-200/20 to-purple-400/20 blur-3xl opacity-60 animate-float"
      />
      <div className="relative w-full max-w-md">
        {login ? <LoginForm state={setLogin} /> : <RegisterForm state={setLogin} />}
      </div>
    </div>
  )
}

export default AuthPage
