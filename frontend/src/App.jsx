import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router'
import { jwtDecode } from 'jwt-decode'
import './App.css'
import { Signup } from './modules/Form/signup'
import { Login } from './modules/Form/login'
import { Dashboard } from './modules/Dashboard/dashboard'
import { ForgetPsw } from './modules/Form/forget'

function App() {
  
  const ProtectedRoutes = ({children}) => {
    const token = localStorage.getItem('token');
    
    // Check if token exists
    if (!token) {
      return <Navigate to='/login' />
    }
    
    // Decode and check token expiration
    try {
      const decodedToken = jwtDecode(token);
      
      // Check if token is expired
      if (decodedToken.exp * 1000 < Date.now()) {
        // Token is expired, remove it
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return <Navigate to='/login' />
      }
      
      return children;
    } catch (error) {
      // Token is invalid, remove it
      console.error('Invalid token:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return <Navigate to='/login' />
    }
  }

  const PublicRoutes = ({children}) => {
    const token = localStorage.getItem('token');
    
    // Check if token exists and is valid
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        
        // Check if token is not expired
        if (decodedToken.exp * 1000 > Date.now()) {
          // Token is valid, redirect to dashboard
          return <Navigate to="/" />
        } else {
          // Token is expired, remove it
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          <Navigate to={"/login"}/>
        }
      } catch (error) {
        // Token is invalid, remove it
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    return children
  }

  return (
    <>
    <Routes>
      <Route path='/signup' element={
        <PublicRoutes>
          <Signup/>
        </PublicRoutes>
      } />
      <Route path='/login' element={
        <PublicRoutes>
          <Login/>
        </PublicRoutes>
      } />
      <Route path='/' element={
        <ProtectedRoutes>
          <Dashboard/>
        </ProtectedRoutes>
      } />
      <Route path='/forgot' element={
        <PublicRoutes>
          <ForgetPsw/>
        </PublicRoutes>
      } />
    </Routes>
      
    </>
  )
}

export default App
