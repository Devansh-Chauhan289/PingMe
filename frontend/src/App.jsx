import { useState } from 'react'
import { Routes,Route, Navigate } from 'react-router'
import './App.css'
import { Signup } from './modules/Form/signup'
import { Login } from './modules/login'
import { Dashboard } from './modules/Dashboard/dashboard'

function App() {

  const ProtectedRoutes = ({children}) => {
    const isAuthenticated = localStorage.getItem('token') !== null || true
    if(!isAuthenticated) {
      return <Navigate to='/login' />
    }
    else if(isAuthenticated && [ `/login`,`/signup`].includes(window.location.pathname)){
        return <Navigate to='/' />
    }
    return children
  }

  return (
    <>
    <Routes>
      <Route path='/signup' element = {
        <ProtectedRoutes>
          <Signup/>
        </ProtectedRoutes>
      } />
      <Route path='/login' element = {
        <ProtectedRoutes>
          <Login/>
        </ProtectedRoutes>
      } />
      <Route path='/' element = {
        <ProtectedRoutes>
          <Dashboard/>
        </ProtectedRoutes>
      } />
    </Routes>
      
    </>
  )
}

export default App
