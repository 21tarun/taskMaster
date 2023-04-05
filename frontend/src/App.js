
import './App.css';
import React from 'react'
import { Routes, Route } from 'react-router-dom'
// import Nav from './Nav'
import Home from './Home'
import SignIn from './SignIn'
import Signup from './SignUp'
import Project from './Project'


function App() {



  return (
    <div className='App'>
      {/* <Nav /> */}
      <Routes> 
        <Route path="" element={<Home/>}/>
        
        <Route path="/login" element={<SignIn /> }/> 
        <Route path="/signup" element={<Signup /> }/> 

        {/* <Route path='*' element={<Error />}/> */}
        <Route path="/project/:projectId" element={<Project/>}/>

      </Routes>

    </div>
  )

}



export default App;