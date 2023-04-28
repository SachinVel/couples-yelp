import React, { useState } from 'react';
import { Button, TextField, Link } from '@mui/material';
import '../styles/Layout.css';
import Header from '../components/Header';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { backendCall } from "../utils/network";



const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export default function Login() {

  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMesage, setErrorMessage] = useState('');
  const [isSucSnackbarOpen, setIsSucSnackbarOpen] = useState(false);
  const [isErrSnackbarOpen, setIsErrSnackbarOpen] = useState(false);

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
    }).catch((err) => {
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
      <Header />
      <div style={{ marginTop: '150px' }}>
        <div>
          <h2>Register</h2>
        </div>

        <div>
          <TextField
            id="standard-basic"
            type="text"
            autoComplete="off"
            name="username"
            value={username}
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
            required
          />
          <br /><br />
          <TextField
            id="standard-basic"
            type="password"
            autoComplete="off"
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
          >
            Register
          </Button> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Link href="/">
            Login
          </Link>
        </div>
      </div>
      <Snackbar open={isSucSnackbarOpen} autoHideDuration={4000} onClose={handleSucSnackbarClose}>
        <Alert severity="success" onClose={handleSucSnackbarClose}>User is registered successfully. Go to login page.</Alert>

      </Snackbar>
      <Snackbar open={isErrSnackbarOpen} autoHideDuration={4000} onClose={hanldeErrSnackbarClose}>
        <Alert severity="error" onClose={hanldeErrSnackbarClose}>{errorMesage}</Alert>
      </Snackbar>
    </>

  );
}
