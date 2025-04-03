import { useState } from 'react'
import { Routes,Route } from 'react-router'
import './App.css'
import { Signup } from './modules/Form/signup'
import { Login } from './modules/login'
import { Dashboard } from './modules/Dashboard/dashboard'

function App() {

  return (
    <>
    <Routes>
      <Route path='/signup' element = <Signup/> />
      <Route path='/login' element = <Login/> />
      <Route path='/dashboard' element = <Dashboard/> />
    </Routes>
      
    </>
  )
}

export default App
