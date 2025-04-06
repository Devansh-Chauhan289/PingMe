import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router'
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
    return children
  }

  const PublicRoutes = ({children}) => {
    const isAuthenticated = localStorage.getItem('token') !== null || false
    if(isAuthenticated) {
      return <Navigate to="/dash" />
    }
    return children
  }

  return (
    <>
    <Routes>
      <Route path='/' element={
        <PublicRoutes>
          <Signup/>
        </PublicRoutes>
      } />
      <Route path='/login' element={
        <PublicRoutes>
          <Login/>
        </PublicRoutes>
      } />
      <Route path='/dash' element={
        <PublicRoutes>
          <Dashboard/>
        </PublicRoutes>
      } />
    </Routes>
      
    </>
  )
}

export default App
