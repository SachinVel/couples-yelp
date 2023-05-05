import React, { useState } from 'react';
import { Button, TextField, Link, Typography, Box } from '@mui/material';
import '../styles/Layout.css';
import Header from '../components/Header';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { backendCall } from "../utils/network";
import { yellow } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { position } from '@xstyled/styled-components';



const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export default function Register({ setLoggedIn }) {

  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMesage, setErrorMessage] = useState('');
  const [isSucSnackbarOpen, setIsSucSnackbarOpen] = useState(false);
  const [isErrSnackbarOpen, setIsErrSnackbarOpen] = useState(false);

  const navigate = useNavigate();

  const onUsernameChange = (event) => {
    setUserName(event.target.value);
  }

  const onPasswordChange = (event) => {
    setPassword(event.target.value);
  }

  const onConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  }

  const register = async () => {

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      setIsErrSnackbarOpen(true);
      return;
    }

    await backendCall.post('/user/register', {
      username: username,
      password: password,
    }).then((res) => {
      setIsSucSnackbarOpen(true);
      window.localStorage.removeItem('token');
      setLoggedIn(false);
      navigate('/login', {
        state: { isRegisterSuccess: true }
      });
    }).catch((err) => {
      console.log('err : ', err);
      setErrorMessage(err.response.data.error);
      setIsErrSnackbarOpen(true);
    });

  }

  const hanldeErrSnackbarClose = () => {
    setIsErrSnackbarOpen(false);
  }

  const handleSucSnackbarClose = () => {
    setIsSucSnackbarOpen(false);
  }

  return (
    <>
      <Box sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)"
      }}>
        {/* <Header /> */}
        <div>
          <Typography variant="h4" sx={{
            color: "#555",
            margin: "20px"
          }}>Register</Typography>
        </div>

        <div>
          <TextField
            id="standard-basic"
            type="text"
            autoComplete="off"
            name="username"
            sx={{ width: "250px" }}
            value={username}
            onChange={onUsernameChange}
            placeholder="User Name"
            required
            className=''
          />
          <br /><br />
          <TextField
            id="standard-basic"
            type="password"
            autoComplete="off"
            sx={{ width: "250px" }}
            name="password"
            value={password}
            onChange={onPasswordChange}
            placeholder="Password"
            required
          />
          <br /><br />
          <TextField
            id="standard-basic"
            type="password"
            autoComplete="off"
            sx={{ width: "250px" }}
            name="confirm_password"
            value={confirmPassword}
            onChange={onConfirmPasswordChange}
            placeholder="Confirm Password"
            required
          />
          <br /><br />
          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
            disabled={username === '' || password === ''}
            onClick={register}
            sx={{ padding: "10px 20px" }}
          >
            Register
          </Button>
        </div>

      </Box>
      <Snackbar open={isErrSnackbarOpen} autoHideDuration={4000} onClose={hanldeErrSnackbarClose}>
        <Alert severity="error" onClose={hanldeErrSnackbarClose}>{errorMesage}</Alert>
      </Snackbar>
    </>


  );
}
