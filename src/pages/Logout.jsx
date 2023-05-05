import React, { useEffect, useState } from 'react';
import { Button, TextField, Link, Box } from '@mui/material';
import '../styles/Layout.css';
import Header from '../components/Header';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { backendCall } from "../utils/network";
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';



const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export default function Logout({ setLoggedIn }) {

    const navigate = useNavigate();
    useEffect(() => {
        window.localStorage.removeItem('token');
        setLoggedIn(false);
        navigate('/login',{state:{isLogOut:true}});
    }, []);

    return (
        <>
            <Box></Box>
        </>

    );
}
