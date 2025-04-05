import { useState } from 'react'
import { Routes,Route, Navigate } from 'react-router'
import './App.css'
import { Signup } from './modules/Form/signup'
import { Login } from './modules/login'
import { Dashboard } from './modules/Dashboard/dashboard'

function App() {

  const ProtectedRoutes = ({children}) => {
    const isAuthenticated = localStorage.getItem('token') !== null || false
    if(!isAuthenticated) {
      return <Navigate to='/login' />
    }
    else if (isAuthenticated && window.location.pathname === '/login') {
      return <Navigate to="/" />;
    }
    return children
  }

  return (
    <>
    <Routes>
      <Route path='/signup' element = {
          <Signup/>
      } />
      <Route path='/login' element = {
          <Login/>
      } />
      <Route path='/' element = {
    
          <Dashboard/>
        
      } />
    </Routes>
      
    </>
  )
}

export default App
