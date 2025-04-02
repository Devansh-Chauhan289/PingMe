import { useState } from 'react'
import { Routes,Route } from 'react-router'
import './App.css'
import { Signup } from './modules/Form/signup'
import { Login } from './modules/login'

function App() {

  return (
    <>
    <Routes>
      <Route path='/signup' element = <Signup/> />
      <Route path='/login' element = <Login/> />
      
    </Routes>
      
    </>
  )
}

export default App
