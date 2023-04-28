import React, { useEffect, useState } from 'react';
import '../styles/Layout.css';
import Header from '../components/Header';
import { useLocation } from 'react-router-dom';


import MuiAlert from '@mui/material/Alert';
import { backendCall } from "../utils/network";



const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export default function ShareGame() {

  
    const location = useLocation();

  useEffect(()=>{
    let params = new URLSearchParams(location.search);
    console.log('params : ',params.get('id'));
    let shareId = params.get('id');
    if( shareId==null || shareId=='' ){
        window.location = 'login';
    }
    window.sessionStorage.setItem('shareId',shareId);
    let token = window.localStorage.getItem('token');
    if (token != null && token != '') {
        window.location = 'game';
    }else{
        window.location = 'login';
    }
  },[])

  return (
    <>
      <Header />

    </>

  );
}
