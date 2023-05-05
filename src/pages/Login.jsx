import React, { useEffect, useState } from 'react';
import { Button, TextField, Link, Box, Typography } from '@mui/material';
import '../styles/Layout.css';
import Header from '../components/Header';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { backendCall } from "../utils/network";
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';



const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export default function Login({ setLoggedIn }) {

  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const [message, setMessage] = useState('');
  const [snackType, setSnackType] = useState('success');
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();


  const onUsernameChange = (event) => {
    setUserName(event.target.value);
  }

  const onPasswordChange = (event) => {
    setPassword(event.target.value);
  }

  const login = async (event) => {
    event.preventDefault();
    await backendCall.post('/user/login', {
      username: username,
      password: password,
    }).then((res) => {
      console.log('login response : ', res);
      // window.localStorage.setItem('token', res.data.token);
      window.localStorage.setItem('token', res.data.token);
      setLoggedIn(true);
      navigate('/outing', {
        state: {
          isLoginSuccessful: true
        }
      });
      // window.location = '/outing';
    }).catch((err) => {
      console.log('login error : ', err);
      if (err.response && err.response.data && err.response.data.error) {
        setMessage(err.response.data.error);
        setSnackType('error');
        setIsSnackbarOpen(true);
      }
    });
  }

  const hanldeSnackbarClose = () => {
    setIsSnackbarOpen(false)
  }

  const handleLogoutMessage = () => {
    // window.localStorage.removeItem('token');
    setSnackType('success');
    setMessage('You logged out successfully.');
    setIsSnackbarOpen(true);
  }

  const handleLoginNecessaryMessage = () => {
    setSnackType('warning');
    setMessage('You must login to access the application.');
    setIsSnackbarOpen(true);
  }

  const showRegistrationSuccessMessage = () => {
    setSnackType('success');
    setMessage('User is registered successfully.');
    setIsSnackbarOpen(true);
  }

  useEffect(() => {
    let userToken = localStorage.getItem('token');
    let state = location.state;
    if (state !== null && state.isLogOut) {
      window.localStorage.removeItem('token');
      setLoggedIn(false);
      handleLogoutMessage();
    } else if (state !== null && state.showLoginNecessary) {
      handleLoginNecessaryMessage();
    } else if (state !== null && state.isRegisterSuccess) {
      showRegistrationSuccessMessage();
    } else if (userToken != null && userToken != '') {
      window.location = '/outing';
    }
    navigate(location.pathname, {});
  }, [])

  return (

    <>
      <Box sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)"
      }}>
        <Typography variant="h4" sx={{
          color: "#555",
          margin: "20px"
        }}>Login</Typography>

        <div>
          <TextField
            id="standard-basic"
            type="text"
            autoComplete="off"
            name="username"
            value={username}
            sx={{ width: "250px" }}
            onChange={onUsernameChange}
            placeholder="User Name"
            required
          />
          <br /><br />
          <TextField
            id="standard-basic"
            type="password"
            autoComplete="off"
            name="password"
            value={password}
            onChange={onPasswordChange}
            placeholder="Password"
            sx={{ width: "250px" }}
            required
          />
          <br /><br />
          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
            disabled={username === '' || password === ''}
            onClick={login}
            sx={{ padding: "10px 20px" }}
          >
            Login
          </Button>
        </div>

      </Box>
      <Snackbar open={isSnackbarOpen} autoHideDuration={4000} onClose={hanldeSnackbarClose}>
        <Alert severity={snackType} onClose={hanldeSnackbarClose}>{message}</Alert>
      </Snackbar>
    </>

  );
}
