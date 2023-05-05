
import './App.css';
import { Alert, Box, CircularProgress, Snackbar } from "@mui/material";
import { BrowserRouter, Routes, Route, Navigate, Router } from "react-router-dom";
import React, { lazy, Suspense, useEffect, useState } from "react";
import AppLayout from './components/AppLayout';
import Sidebar from './components/Sidebar';




const Outing = lazy(() => import("./pages/Outing"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Logout = lazy(() => import("./pages/Logout"));
const Friends = lazy(() => import("./pages/Friends"));




function App() {

  const [loggedIn, setLoggedIn] = useState(true);

  useEffect(() => {
    let userToken = localStorage.getItem('token');
    console.log('userToken : ', userToken);
    if (userToken != null && userToken != '') {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, []);


  return (

    <>
      <BrowserRouter>
        <Suspense
          fallback={
            <Box className="display-center">
              <CircularProgress sx={{ margin: "auto" }} />
            </Box>
          }>
          <Sidebar />
          <Box className="body-container">
            <Routes>
              <Route path="/login" exact element={loggedIn ? <Navigate to='/outing' state={{ isLoggedIn: true }} /> : <Login setLoggedIn={setLoggedIn} />} />
              <Route path="/outing" element={loggedIn ? <Outing /> : <Navigate to='/login' state={{ showLoginNecessary: true }} />} />
              <Route path="/friends" element={loggedIn ? <Friends /> : <Navigate to='/login' state={{ showLoginNecessary: true }} /> }/>
              <Route path="/register" element={<Register setLoggedIn={setLoggedIn}/>} />
              <Route path="/logout" element={<Logout setLoggedIn={setLoggedIn}/>} />
            </Routes>
          </Box>
        </Suspense>
      </BrowserRouter>
    </>





  );
}

export default App;
