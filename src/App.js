
import './App.css';
import { Box, CircularProgress } from "@mui/material";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React, { lazy, Suspense, useEffect } from "react";


const Game = lazy(() => import("./pages/Game"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));




function App() {

  const checkLogin = () => {
    let userToken = localStorage.getItem('token');
    if (userToken != null && userToken != '') {
      return true
    } else {
      return false;
    }
  }
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <Box className="display-center">
            <CircularProgress sx={{ margin: "auto" }} />
          </Box>
        }
      >
        <Routes>
          <Route exact path="/" element={checkLogin() ? <Navigate to='/task' /> : <Navigate to='/login' />}>
          </Route>
          <Route path="/login" element={checkLogin() ? <Navigate to='/game' /> : <Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/game" element={checkLogin() ? <Game /> : <Navigate to='/login' />} />
        </Routes>
      </Suspense>
    </BrowserRouter>

  );
}

export default App;
