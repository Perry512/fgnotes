import { useState } from 'react'
import Signup from './components/Signup'
import { UserAuth } from "./context/AuthContext";

function App() {
  const { user } = UserAuth();

  return (
    <> <Signup/> </>
  )
}

export default App