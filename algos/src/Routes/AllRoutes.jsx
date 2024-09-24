import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Dashboard from '../Pages/Dashbaord'
import Login from '../Pages/Login'
import BasketDetails from '../Pages/BasketDetails'
import PrivateRoute from './PrivateRoute'

export default function AllRoutes() {
  return (
    <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/dashboard' element={<PrivateRoute>
        <Dashboard/>
      </PrivateRoute>
     
      } />
      <Route path='/basket-details/:id' element={<PrivateRoute>
        <BasketDetails/>  </PrivateRoute>}/>
    </Routes>
  )
}
